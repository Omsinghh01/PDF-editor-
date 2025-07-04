const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const fontkit = require('fontkit');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const archiver = require('archiver');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  }
});

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  try {
    await fs.access('uploads');
  } catch {
    await fs.mkdir('uploads', { recursive: true });
  }
};

// Initialize uploads directory
ensureUploadsDir();

// PDF Editor Endpoints

// 1. Upload PDF
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = await fs.readFile(req.file.path);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pageCount = pdfDoc.getPageCount();

    res.json({
      fileId: req.file.filename,
      fileName: req.file.originalname,
      pageCount,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get PDF info
app.get('/api/pdf/:fileId/info', async (req, res) => {
  try {
    const filePath = path.join('uploads', req.params.fileId);
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    const info = {
      pageCount: pdfDoc.getPageCount(),
      title: pdfDoc.getTitle() || '',
      author: pdfDoc.getAuthor() || '',
      subject: pdfDoc.getSubject() || '',
      keywords: pdfDoc.getKeywords() || '',
      creator: pdfDoc.getCreator() || '',
      producer: pdfDoc.getProducer() || '',
      creationDate: pdfDoc.getCreationDate() || null,
      modificationDate: pdfDoc.getModificationDate() || null
    };

    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Add text to PDF
app.post('/api/pdf/:fileId/add-text', async (req, res) => {
  try {
    const { text, x, y, pageIndex, fontSize = 12, color = '#000000', fontFamily = 'Helvetica' } = req.body;
    
    const filePath = path.join('uploads', req.params.fileId);
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    const pages = pdfDoc.getPages();
    const page = pages[pageIndex];
    
    let font;
    switch (fontFamily.toLowerCase()) {
      case 'times':
        font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        break;
      case 'courier':
        font = await pdfDoc.embedFont(StandardFonts.Courier);
        break;
      default:
        font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }
    
    const [r, g, b] = hexToRgb(color);
    
    page.drawText(text, {
      x: parseFloat(x),
      y: parseFloat(y),
      size: parseInt(fontSize),
      font,
      color: rgb(r/255, g/255, b/255)
    });
    
    const newFileId = `${uuidv4()}-modified.pdf`;
    const newFilePath = path.join('uploads', newFileId);
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(newFilePath, pdfBytes);
    
    res.json({ fileId: newFileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Add image to PDF
app.post('/api/pdf/:fileId/add-image', upload.single('image'), async (req, res) => {
  try {
    const { x, y, pageIndex, width, height } = req.body;
    
    const filePath = path.join('uploads', req.params.fileId);
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    const pages = pdfDoc.getPages();
    const page = pages[pageIndex];
    
    const imageBuffer = await fs.readFile(req.file.path);
    let image;
    
    if (req.file.mimetype === 'image/png') {
      image = await pdfDoc.embedPng(imageBuffer);
    } else {
      image = await pdfDoc.embedJpg(imageBuffer);
    }
    
    page.drawImage(image, {
      x: parseFloat(x),
      y: parseFloat(y),
      width: parseFloat(width),
      height: parseFloat(height)
    });
    
    const newFileId = `${uuidv4()}-modified.pdf`;
    const newFilePath = path.join('uploads', newFileId);
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(newFilePath, pdfBytes);
    
    // Clean up uploaded image
    await fs.unlink(req.file.path);
    
    res.json({ fileId: newFileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Rotate pages
app.post('/api/pdf/:fileId/rotate', async (req, res) => {
  try {
    const { pageIndex, rotation } = req.body;
    
    const filePath = path.join('uploads', req.params.fileId);
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    const pages = pdfDoc.getPages();
    const page = pages[pageIndex];
    
    page.setRotation(degrees(parseInt(rotation)));
    
    const newFileId = `${uuidv4()}-modified.pdf`;
    const newFilePath = path.join('uploads', newFileId);
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(newFilePath, pdfBytes);
    
    res.json({ fileId: newFileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Delete pages
app.post('/api/pdf/:fileId/delete-pages', async (req, res) => {
  try {
    const { pageIndices } = req.body;
    
    const filePath = path.join('uploads', req.params.fileId);
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    // Sort in descending order to delete from end to start
    const sortedIndices = pageIndices.sort((a, b) => b - a);
    
    for (const index of sortedIndices) {
      pdfDoc.removePage(index);
    }
    
    const newFileId = `${uuidv4()}-modified.pdf`;
    const newFilePath = path.join('uploads', newFileId);
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(newFilePath, pdfBytes);
    
    res.json({ fileId: newFileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Split PDF
app.post('/api/pdf/:fileId/split', async (req, res) => {
  try {
    const { startPage, endPage } = req.body;
    
    const filePath = path.join('uploads', req.params.fileId);
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    const newPdfDoc = await PDFDocument.create();
    const pageIndices = Array.from(
      { length: endPage - startPage + 1 }, 
      (_, i) => startPage + i
    );
    
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach(page => newPdfDoc.addPage(page));
    
    const newFileId = `${uuidv4()}-split.pdf`;
    const newFilePath = path.join('uploads', newFileId);
    const pdfBytes = await newPdfDoc.save();
    await fs.writeFile(newFilePath, pdfBytes);
    
    res.json({ fileId: newFileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Merge PDFs
app.post('/api/pdf/merge', upload.array('pdfs'), async (req, res) => {
  try {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of req.files) {
      const fileBuffer = await fs.readFile(file.path);
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pageCount = pdfDoc.getPageCount();
      const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
      
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach(page => mergedPdf.addPage(page));
      
      // Clean up uploaded file
      await fs.unlink(file.path);
    }
    
    const newFileId = `${uuidv4()}-merged.pdf`;
    const newFilePath = path.join('uploads', newFileId);
    const pdfBytes = await mergedPdf.save();
    await fs.writeFile(newFilePath, pdfBytes);
    
    res.json({ fileId: newFileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Add watermark
app.post('/api/pdf/:fileId/watermark', async (req, res) => {
  try {
    const { text, opacity = 0.5, fontSize = 50, rotation = 45 } = req.body;
    
    const filePath = path.join('uploads', req.params.fileId);
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    
    pages.forEach(page => {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 2,
        y: height / 2,
        size: parseInt(fontSize),
        font,
        color: rgb(0.7, 0.7, 0.7),
        opacity: parseFloat(opacity),
        rotate: degrees(parseInt(rotation))
      });
    });
    
    const newFileId = `${uuidv4()}-watermarked.pdf`;
    const newFilePath = path.join('uploads', newFileId);
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(newFilePath, pdfBytes);
    
    res.json({ fileId: newFileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Password protect PDF
app.post('/api/pdf/:fileId/password', async (req, res) => {
  try {
    const { password } = req.body;
    
    const filePath = path.join('uploads', req.params.fileId);
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    const newFileId = `${uuidv4()}-protected.pdf`;
    const newFilePath = path.join('uploads', newFileId);
    const pdfBytes = await pdfDoc.save({
      userPassword: password,
      ownerPassword: password
    });
    await fs.writeFile(newFilePath, pdfBytes);
    
    res.json({ fileId: newFileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 11. Add rectangle/shape
app.post('/api/pdf/:fileId/add-shape', async (req, res) => {
  try {
    const { x, y, width, height, pageIndex, color = '#000000', fillColor = null } = req.body;
    
    const filePath = path.join('uploads', req.params.fileId);
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    const pages = pdfDoc.getPages();
    const page = pages[pageIndex];
    
    const [r, g, b] = hexToRgb(color);
    const borderColor = rgb(r/255, g/255, b/255);
    
    const options = {
      x: parseFloat(x),
      y: parseFloat(y),
      width: parseFloat(width),
      height: parseFloat(height),
      borderColor,
      borderWidth: 2
    };
    
    if (fillColor) {
      const [fr, fg, fb] = hexToRgb(fillColor);
      options.color = rgb(fr/255, fg/255, fb/255);
    }
    
    page.drawRectangle(options);
    
    const newFileId = `${uuidv4()}-modified.pdf`;
    const newFilePath = path.join('uploads', newFileId);
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(newFilePath, pdfBytes);
    
    res.json({ fileId: newFileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 12. Compress PDF
app.post('/api/pdf/:fileId/compress', async (req, res) => {
  try {
    const filePath = path.join('uploads', req.params.fileId);
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    const newFileId = `${uuidv4()}-compressed.pdf`;
    const newFilePath = path.join('uploads', newFileId);
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false
    });
    await fs.writeFile(newFilePath, pdfBytes);
    
    res.json({ fileId: newFileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 13. Download PDF
app.get('/api/pdf/:fileId/download', async (req, res) => {
  try {
    const filePath = path.join('uploads', req.params.fileId);
    const fileName = req.query.name || 'document.pdf';
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    const fileBuffer = await fs.readFile(filePath);
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 14. Get PDF as base64 for preview
app.get('/api/pdf/:fileId/preview', async (req, res) => {
  try {
    const filePath = path.join('uploads', req.params.fileId);
    const fileBuffer = await fs.readFile(filePath);
    const base64 = fileBuffer.toString('base64');
    
    res.json({ data: `data:application/pdf;base64,${base64}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Utility functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`PDF Editor Server running on port ${PORT}`);
});
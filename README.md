# PDF Editor Pro

A comprehensive, professional PDF editor built with React, Node.js, and PDF-lib. This application provides every major PDF editing function in a modern, user-friendly interface.

## ✨ Features

### Core Editing Functions
- **Text Editing**: Add, edit, and format text with multiple fonts, sizes, and colors
- **Image Insertion**: Add images (PNG, JPG, GIF, BMP, WebP) with resize and positioning controls
- **Shape Drawing**: Insert rectangles and shapes with customizable borders and fills
- **Annotations**: Highlight, underline, and annotate documents
- **Page Navigation**: Smooth page navigation with zoom controls

### Advanced PDF Operations
- **Page Management**: Rotate, delete, and rearrange pages
- **Document Splitting**: Split PDFs into multiple documents by page range
- **Document Merging**: Combine multiple PDFs into a single document
- **Watermarking**: Add custom watermarks with opacity and rotation controls
- **Password Protection**: Secure PDFs with password encryption
- **PDF Compression**: Optimize file sizes while maintaining quality

### Professional Features
- **High-Quality PDF Rendering**: Crystal-clear PDF display with zoom up to 300%
- **Drag & Drop Interface**: Easy file uploads and management
- **Real-time Preview**: See changes immediately as you edit
- **Document Properties**: View and edit PDF metadata
- **Export Options**: Download edited PDFs with custom naming
- **Professional UI**: Modern, intuitive interface built with React and Styled Components

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pdf-editor-pro
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Start the application**
```bash
npm run dev
```

4. **Access the application**
Open your browser and navigate to `http://localhost:3000`

## 🛠️ Development Setup

### Backend Server (Port 5000)
```bash
cd server
npm install
npm run dev
```

### Frontend Client (Port 3000)
```bash
cd client
npm install
npm start
```

### Manual Setup
If you prefer to run each part separately:

1. **Start the backend**:
```bash
cd server
npm install
npm run dev
```

2. **Start the frontend** (in a new terminal):
```bash
cd client
npm install
npm start
```

## 📁 Project Structure

```
pdf-editor-pro/
├── package.json                 # Root package with scripts
├── README.md                   # This file
├── server/                     # Backend Node.js server
│   ├── package.json           # Server dependencies
│   ├── index.js              # Main server file
│   └── uploads/              # File uploads directory
└── client/                    # React frontend
    ├── package.json          # Client dependencies
    ├── public/               # Static files
    ├── src/
    │   ├── App.js           # Main application component
    │   ├── services/
    │   │   └── api.js       # API communication layer
    │   └── components/      # React components
    │       ├── FileUpload.js     # File upload component
    │       ├── PDFViewer.js      # PDF display and editing
    │       ├── Toolbar.js        # Editing tools
    │       ├── PropertyPanel.js  # Document properties
    │       └── modals/          # Modal dialogs
    │           ├── TextModal.js     # Text editing modal
    │           ├── ImageModal.js    # Image insertion modal
    │           ├── ShapeModal.js    # Shape creation modal
    │           ├── WatermarkModal.js # Watermark modal
    │           ├── PasswordModal.js  # Password protection modal
    │           ├── SplitModal.js     # PDF splitting modal
    │           └── MergeModal.js     # PDF merging modal
    └── build/               # Production build (after npm run build)
```

## 🎯 Usage Guide

### 1. Upload a PDF
- Drag and drop a PDF file onto the upload area
- Or click to browse and select a PDF file
- Maximum file size: 100MB

### 2. Edit Your PDF
- **Add Text**: Click the Text tool, then click anywhere on the PDF to add text
- **Insert Images**: Use the Image tool to upload and position images
- **Draw Shapes**: Select the Shape tool to draw rectangles and custom shapes
- **Navigate Pages**: Use the page controls to move between pages
- **Zoom**: Adjust zoom level from 25% to 300% for precision editing

### 3. Advanced Operations
- **Rotate Pages**: Use the rotate tool to rotate pages 90 degrees
- **Delete Pages**: Select and delete unwanted pages
- **Split PDF**: Extract specific page ranges into new documents
- **Merge PDFs**: Combine multiple PDF files into one
- **Add Watermarks**: Apply text watermarks with custom opacity and rotation
- **Password Protection**: Secure your PDF with encryption

### 4. Save Your Work
- Click the Download button to save your edited PDF
- Use the Compress feature to reduce file size before downloading

## 🔧 API Endpoints

The backend provides a comprehensive REST API:

### File Operations
- `POST /api/upload` - Upload PDF file
- `GET /api/pdf/:fileId/download` - Download PDF
- `GET /api/pdf/:fileId/preview` - Get PDF as base64
- `GET /api/pdf/:fileId/info` - Get PDF metadata

### Editing Operations
- `POST /api/pdf/:fileId/add-text` - Add text to PDF
- `POST /api/pdf/:fileId/add-image` - Insert image
- `POST /api/pdf/:fileId/add-shape` - Add shapes
- `POST /api/pdf/:fileId/rotate` - Rotate pages
- `POST /api/pdf/:fileId/delete-pages` - Delete pages

### Advanced Operations
- `POST /api/pdf/:fileId/split` - Split PDF
- `POST /api/pdf/merge` - Merge multiple PDFs
- `POST /api/pdf/:fileId/watermark` - Add watermark
- `POST /api/pdf/:fileId/password` - Add password protection
- `POST /api/pdf/:fileId/compress` - Compress PDF

## 🛡️ Security Features

- **File Type Validation**: Only PDF and image files are accepted
- **File Size Limits**: 100MB maximum file size
- **Secure File Handling**: Files are stored securely with UUID naming
- **Password Protection**: Strong encryption for PDF security
- **Input Sanitization**: All user inputs are validated and sanitized

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with Inter font
- **Responsive Layout**: Works on desktop and tablet devices
- **Intuitive Controls**: Easy-to-use tools and clear visual feedback
- **Real-time Updates**: Immediate visual feedback for all operations
- **Accessibility**: Keyboard navigation and screen reader support
- **Dark Mode Ready**: Styled with CSS variables for easy theming

## 📋 Dependencies

### Backend
- **Express.js**: Web server framework
- **PDF-lib**: PDF manipulation library
- **Multer**: File upload handling
- **Sharp**: Image processing
- **CORS**: Cross-origin resource sharing
- **UUID**: Unique file naming

### Frontend
- **React 18**: Modern React with hooks
- **React PDF**: PDF rendering and display
- **Styled Components**: CSS-in-JS styling
- **Axios**: HTTP client for API calls
- **React Dropzone**: Drag and drop file uploads
- **React Icons**: Comprehensive icon library
- **React Toastify**: Toast notifications

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create a `.env` file in the server directory:
```
PORT=5000
NODE_ENV=production
```

### Deployment Options
- **Docker**: Container deployment ready
- **Heroku**: Platform-as-a-Service deployment
- **Vercel/Netlify**: Frontend deployment with serverless functions
- **Traditional Hosting**: VPS or dedicated server deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues & Troubleshooting

### Common Issues
1. **PDF not loading**: Ensure the file is a valid PDF and under 100MB
2. **Features not working**: Check that both backend and frontend are running
3. **Upload failures**: Verify network connection and file permissions

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance Notes
- Large PDF files (>50MB) may take longer to process
- Complex operations may require additional processing time
- For best performance, use modern browsers with hardware acceleration

## 📞 Support

For support, feature requests, or bug reports, please open an issue in the GitHub repository.

---

**PDF Editor Pro** - The complete solution for all your PDF editing needs! 🎉
import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileUpload from './components/FileUpload';
import PDFViewer from './components/PDFViewer';
import Toolbar from './components/Toolbar';
import PropertyPanel from './components/PropertyPanel';
import API from './services/api';
import './App.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  background: #f5f5f5;
`;

const Header = styled.header`
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  ${props => props.isElectron && `
    -webkit-app-region: drag;
  `}
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  -webkit-app-region: no-drag;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  width: 300px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

const CenterPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const RightPanel = styled.div`
  width: 320px;
  background: white;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  background: ${props => props.primary ? '#3498db' : '#95a5a6'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primary ? '#2980b9' : '#7f8c8d'};
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const StatusBar = styled.div`
  background: #34495e;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function App() {
  const [currentFile, setCurrentFile] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [selectedTool, setSelectedTool] = useState('select');
  const [isLoading, setIsLoading] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [isElectron, setIsElectron] = useState(false);
  const [appVersion, setAppVersion] = useState('1.0.0');
  
  const pdfViewerRef = useRef(null);

  // Electron integration
  useEffect(() => {
    // Check if running in Electron
    if (window.electronAPI) {
      setIsElectron(true);
      
      // Get app version
      window.electronAPI.getAppVersion().then(version => {
        setAppVersion(version);
      });

      // Set up menu event listeners
      const cleanup = window.electronAPI.onMenuAction((action, data) => {
        handleMenuAction(action, data);
      });

      return cleanup;
    }
  }, []);

  const handleMenuAction = useCallback((action, data) => {
    switch (action) {
      case 'new-file':
        handleNewFile();
        break;
      case 'open-file':
        handleOpenFileFromMenu(data);
        break;
      case 'save-file':
        handleDownload();
        break;
      case 'add-text':
        setSelectedTool('text');
        break;
      case 'add-image':
        setSelectedTool('image');
        break;
      case 'add-shape':
        setSelectedTool('shape');
        break;
      case 'merge-pdfs':
        setSelectedTool('merge');
        break;
      case 'split-pdf':
        setSelectedTool('split');
        break;
      default:
        break;
    }
  }, []);

  const handleNewFile = useCallback(() => {
    setCurrentFile(null);
    setDocumentInfo(null);
    setCurrentPage(0);
    setZoom(1);
    setAnnotations([]);
    setSelectedAnnotation(null);
    setSelectedTool('select');
    toast.info('Ready for new PDF file');
  }, []);

  const handleOpenFileFromMenu = useCallback(async (filePath) => {
    if (filePath) {
      // In a real implementation, you'd read the file from the file system
      toast.info(`Opening file: ${filePath}`);
      // For now, just notify the user
    }
  }, []);

  const showDesktopNotification = useCallback((title, message) => {
    if (window.electronAPI) {
      window.electronAPI.showNotification(title, message);
    } else {
      // Fallback for web version
      if (Notification.permission === 'granted') {
        new Notification(title, { body: message });
      }
    }
  }, []);

  const handleFileUpload = useCallback(async (file) => {
    setIsLoading(true);
    try {
      const response = await API.uploadPDF(file);
      setCurrentFile(response.data);
      
      // Get document info
      const infoResponse = await API.getPDFInfo(response.data.fileId);
      setDocumentInfo(infoResponse.data);
      
      toast.success('PDF uploaded successfully!');
      showDesktopNotification('PDF Editor Pro', `PDF "${file.name}" uploaded successfully!`);
    } catch (error) {
      toast.error('Failed to upload PDF: ' + error.message);
      showDesktopNotification('PDF Editor Pro', 'Failed to upload PDF');
    } finally {
      setIsLoading(false);
    }
  }, [showDesktopNotification]);

  const handleAddText = useCallback(async (textData) => {
    if (!currentFile) return;
    
    setIsLoading(true);
    try {
      const response = await API.addText(currentFile.fileId, {
        ...textData,
        pageIndex: currentPage
      });
      
      setCurrentFile(prev => ({ ...prev, fileId: response.data.fileId }));
      toast.success('Text added successfully!');
      showDesktopNotification('PDF Editor Pro', 'Text added to PDF');
    } catch (error) {
      toast.error('Failed to add text: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentFile, currentPage, showDesktopNotification]);

  const handleAddImage = useCallback(async (imageFile, position) => {
    if (!currentFile) return;
    
    setIsLoading(true);
    try {
      const response = await API.addImage(currentFile.fileId, imageFile, {
        ...position,
        pageIndex: currentPage
      });
      
      setCurrentFile(prev => ({ ...prev, fileId: response.data.fileId }));
      toast.success('Image added successfully!');
      showDesktopNotification('PDF Editor Pro', 'Image added to PDF');
    } catch (error) {
      toast.error('Failed to add image: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentFile, currentPage, showDesktopNotification]);

  const handleAddShape = useCallback(async (shapeData) => {
    if (!currentFile) return;
    
    setIsLoading(true);
    try {
      const response = await API.addShape(currentFile.fileId, {
        ...shapeData,
        pageIndex: currentPage
      });
      
      setCurrentFile(prev => ({ ...prev, fileId: response.data.fileId }));
      toast.success('Shape added successfully!');
      showDesktopNotification('PDF Editor Pro', 'Shape added to PDF');
    } catch (error) {
      toast.error('Failed to add shape: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentFile, currentPage, showDesktopNotification]);

  const handleRotatePage = useCallback(async (rotation) => {
    if (!currentFile) return;
    
    setIsLoading(true);
    try {
      const response = await API.rotatePage(currentFile.fileId, currentPage, rotation);
      setCurrentFile(prev => ({ ...prev, fileId: response.data.fileId }));
      toast.success('Page rotated successfully!');
    } catch (error) {
      toast.error('Failed to rotate page: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentFile, currentPage]);

  const handleDeletePages = useCallback(async (pageIndices) => {
    if (!currentFile) return;
    
    setIsLoading(true);
    try {
      const response = await API.deletePages(currentFile.fileId, pageIndices);
      setCurrentFile(prev => ({ ...prev, fileId: response.data.fileId }));
      
      // Update document info
      const infoResponse = await API.getPDFInfo(response.data.fileId);
      setDocumentInfo(infoResponse.data);
      
      toast.success('Pages deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete pages: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentFile]);

  const handleSplitPDF = useCallback(async (startPage, endPage) => {
    if (!currentFile) return;
    
    setIsLoading(true);
    try {
      const response = await API.splitPDF(currentFile.fileId, startPage, endPage);
      setCurrentFile(prev => ({ ...prev, fileId: response.data.fileId }));
      
      // Update document info
      const infoResponse = await API.getPDFInfo(response.data.fileId);
      setDocumentInfo(infoResponse.data);
      
      toast.success('PDF split successfully!');
      showDesktopNotification('PDF Editor Pro', 'PDF split completed');
    } catch (error) {
      toast.error('Failed to split PDF: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentFile, showDesktopNotification]);

  const handleMergePDFs = useCallback(async (files) => {
    setIsLoading(true);
    try {
      const response = await API.mergePDFs(files);
      setCurrentFile(prev => ({ ...prev, fileId: response.data.fileId }));
      
      // Update document info
      const infoResponse = await API.getPDFInfo(response.data.fileId);
      setDocumentInfo(infoResponse.data);
      
      toast.success('PDFs merged successfully!');
      showDesktopNotification('PDF Editor Pro', 'PDFs merged successfully');
    } catch (error) {
      toast.error('Failed to merge PDFs: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [showDesktopNotification]);

  const handleAddWatermark = useCallback(async (watermarkData) => {
    if (!currentFile) return;
    
    setIsLoading(true);
    try {
      const response = await API.addWatermark(currentFile.fileId, watermarkData);
      setCurrentFile(prev => ({ ...prev, fileId: response.data.fileId }));
      toast.success('Watermark added successfully!');
      showDesktopNotification('PDF Editor Pro', 'Watermark added to PDF');
    } catch (error) {
      toast.error('Failed to add watermark: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentFile, showDesktopNotification]);

  const handlePasswordProtect = useCallback(async (password) => {
    if (!currentFile) return;
    
    setIsLoading(true);
    try {
      const response = await API.passwordProtect(currentFile.fileId, password);
      setCurrentFile(prev => ({ ...prev, fileId: response.data.fileId }));
      toast.success('Password protection added successfully!');
      showDesktopNotification('PDF Editor Pro', 'Password protection added');
    } catch (error) {
      toast.error('Failed to add password protection: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentFile, showDesktopNotification]);

  const handleCompressPDF = useCallback(async () => {
    if (!currentFile) return;
    
    setIsLoading(true);
    try {
      const response = await API.compressPDF(currentFile.fileId);
      setCurrentFile(prev => ({ ...prev, fileId: response.data.fileId }));
      toast.success('PDF compressed successfully!');
      showDesktopNotification('PDF Editor Pro', 'PDF compression completed');
    } catch (error) {
      toast.error('Failed to compress PDF: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentFile, showDesktopNotification]);

  const handleDownload = useCallback(async () => {
    if (!currentFile) return;
    
    try {
      await API.downloadPDF(currentFile.fileId, currentFile.fileName);
      toast.success('PDF downloaded successfully!');
      showDesktopNotification('PDF Editor Pro', 'PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF: ' + error.message);
    }
  }, [currentFile, showDesktopNotification]);

  return (
    <AppContainer>
      <Header isElectron={isElectron}>
        <Title>
          📄 PDF Editor Pro
          {isElectron && <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Desktop</span>}
        </Title>
        <HeaderActions>
          {currentFile && (
            <>
              <Button onClick={handleDownload}>Download</Button>
              <Button primary onClick={handleCompressPDF}>Compress</Button>
            </>
          )}
        </HeaderActions>
      </Header>

      <MainContent>
        <LeftPanel>
          <FileUpload 
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
            currentFile={currentFile}
          />
          
          <Toolbar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
            onAddText={handleAddText}
            onAddImage={handleAddImage}
            onAddShape={handleAddShape}
            onRotatePage={handleRotatePage}
            onDeletePages={handleDeletePages}
            onSplitPDF={handleSplitPDF}
            onMergePDFs={handleMergePDFs}
            onAddWatermark={handleAddWatermark}
            onPasswordProtect={handlePasswordProtect}
            disabled={!currentFile || isLoading}
          />
        </LeftPanel>

        <CenterPanel>
          {currentFile ? (
            <PDFViewer
              ref={pdfViewerRef}
              fileId={currentFile.fileId}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              zoom={zoom}
              onZoomChange={setZoom}
              selectedTool={selectedTool}
              annotations={annotations}
              onAnnotationsChange={setAnnotations}
              selectedAnnotation={selectedAnnotation}
              onAnnotationSelect={setSelectedAnnotation}
              onAddText={handleAddText}
              onAddImage={handleAddImage}
              onAddShape={handleAddShape}
            />
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: '#7f8c8d',
              fontSize: '1.2rem',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div>📄</div>
              <div>Upload a PDF to start editing</div>
              {isElectron && (
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                  Use Ctrl+O (or Cmd+O) to open a file
                </div>
              )}
            </div>
          )}
        </CenterPanel>

        <RightPanel>
          <PropertyPanel
            selectedAnnotation={selectedAnnotation}
            documentInfo={documentInfo}
            currentPage={currentPage}
            totalPages={documentInfo?.pageCount || 0}
            zoom={zoom}
            onZoomChange={setZoom}
          />
        </RightPanel>
      </MainContent>

      {isElectron && (
        <StatusBar>
          <div>PDF Editor Pro v{appVersion} - Desktop Application</div>
          <div>
            {currentFile ? `File: ${currentFile.fileName}` : 'No file loaded'}
          </div>
        </StatusBar>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AppContainer>
  );
}

export default App;
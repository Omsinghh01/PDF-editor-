import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import { FiZoomIn, FiZoomOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import API from '../services/api';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f9fa;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
`;

const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Button = styled.button`
  background: white;
  border: 1px solid #e0e0e0;
  color: #2c3e50;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s;

  &:hover {
    background: #ecf0f1;
    border-color: #3498db;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const ZoomLevel = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
  min-width: 3rem;
  text-align: center;
`;

const ViewerContainer = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  position: relative;
`;

const PDFContainer = styled.div`
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

const OverlayCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: ${props => props.interactive ? 'auto' : 'none'};
  cursor: ${props => props.cursor || 'default'};
  z-index: 10;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #7f8c8d;
  font-size: 1.1rem;
`;

const PDFViewer = forwardRef(({ 
  fileId, 
  currentPage, 
  onPageChange, 
  zoom, 
  onZoomChange,
  selectedTool,
  annotations,
  onAnnotationsChange,
  selectedAnnotation,
  onAnnotationSelect,
  onAddText,
  onAddImage,
  onAddShape
}, ref) => {
  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pdfPageRef = useRef(null);

  useImperativeHandle(ref, () => ({
    refreshPDF: loadPDF
  }));

  const loadPDF = async () => {
    if (!fileId) return;
    
    try {
      const response = await API.getPDFPreview(fileId);
      setPdfData(response.data.data);
    } catch (error) {
      console.error('Failed to load PDF:', error);
    }
  };

  useEffect(() => {
    loadPDF();
  }, [fileId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (page) => {
    const { width, height } = page.originalWidth ? page : page._pageInfo || {};
    if (width && height) {
      setPageWidth(width * zoom);
      setPageHeight(height * zoom);
    }
  };

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.25, 3));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.25, 0.25));
  };

  const handlePrevPage = () => {
    onPageChange(Math.max(currentPage - 1, 0));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(currentPage + 1, numPages - 1));
  };

  const getMousePosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    if (selectedTool === 'select') return;
    
    const pos = getMousePosition(e);
    setStartPoint(pos);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || selectedTool === 'select') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentPos = getMousePosition(e);
    
    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (selectedTool === 'shape') {
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        startPoint.x, 
        startPoint.y, 
        currentPos.x - startPoint.x, 
        currentPos.y - startPoint.y
      );
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || selectedTool === 'select') return;
    
    const endPos = getMousePosition(e);
    setIsDrawing(false);
    
    // Convert screen coordinates to PDF coordinates
    const pdfX = (startPoint.x / zoom);
    const pdfY = (pageHeight / zoom) - (startPoint.y / zoom);
    
    if (selectedTool === 'text') {
      // For text, we'll trigger a modal or inline editing
      const text = prompt('Enter text:');
      if (text) {
        onAddText({
          text,
          x: pdfX,
          y: pdfY,
          fontSize: 12,
          color: '#000000'
        });
      }
    } else if (selectedTool === 'shape') {
      const width = Math.abs(endPos.x - startPoint.x) / zoom;
      const height = Math.abs(endPos.y - startPoint.y) / zoom;
      
      if (width > 10 && height > 10) {
        onAddShape({
          x: pdfX,
          y: pdfY,
          width,
          height,
          color: '#000000'
        });
      }
    }
    
    // Clear canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getCursor = () => {
    switch (selectedTool) {
      case 'text':
        return 'text';
      case 'shape':
        return 'crosshair';
      case 'image':
        return 'copy';
      default:
        return 'default';
    }
  };

  if (!pdfData) {
    return (
      <Container>
        <LoadingMessage>Loading PDF...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Controls>
        <PageControls>
          <Button onClick={handlePrevPage} disabled={currentPage <= 0}>
            <FiChevronLeft />
            Previous
          </Button>
          <PageInfo>
            Page {currentPage + 1} of {numPages || 0}
          </PageInfo>
          <Button onClick={handleNextPage} disabled={currentPage >= (numPages - 1)}>
            Next
            <FiChevronRight />
          </Button>
        </PageControls>
        
        <ZoomControls>
          <Button onClick={handleZoomOut} disabled={zoom <= 0.25}>
            <FiZoomOut />
          </Button>
          <ZoomLevel>{Math.round(zoom * 100)}%</ZoomLevel>
          <Button onClick={handleZoomIn} disabled={zoom >= 3}>
            <FiZoomIn />
          </Button>
        </ZoomControls>
      </Controls>

      <ViewerContainer ref={containerRef}>
        <PDFContainer>
          <Document
            file={pdfData}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<LoadingMessage>Loading document...</LoadingMessage>}
          >
            <div style={{ position: 'relative' }}>
              <Page
                pageNumber={currentPage + 1}
                scale={zoom}
                onLoadSuccess={onPageLoadSuccess}
                ref={pdfPageRef}
              />
              
              {pageWidth > 0 && pageHeight > 0 && (
                <OverlayCanvas
                  ref={canvasRef}
                  width={pageWidth}
                  height={pageHeight}
                  interactive={selectedTool !== 'select'}
                  cursor={getCursor()}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  style={{
                    width: pageWidth,
                    height: pageHeight
                  }}
                />
              )}
            </div>
          </Document>
        </PDFContainer>
      </ViewerContainer>
    </Container>
  );
});

export default PDFViewer;
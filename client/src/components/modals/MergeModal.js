import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiLayers } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  min-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #bdc3c7;
  border-radius: 8px;
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const FileList = styled.div`
  margin-bottom: 1rem;
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background: #3498db;
    color: white;
  ` : `
    background: #ecf0f1;
    color: #2c3e50;
  `}
`;

function MergeModal({ isOpen, onClose, onMergePDFs }) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    setSelectedFiles(prev => [...prev, ...pdfFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFiles.length < 2) {
      alert('Please select at least 2 PDF files to merge');
      return;
    }
    
    onMergePDFs(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <FiLayers />
            Merge PDFs
          </Title>
          <button style={{ background: 'none', border: 'none', fontSize: '1.5rem' }} onClick={onClose}>
            <FiX />
          </button>
        </Header>

        <form onSubmit={handleSubmit}>
          <DropzoneContainer {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag & drop PDF files here, or click to select</p>
          </DropzoneContainer>

          {selectedFiles.length > 0 && (
            <FileList>
              <h4>Selected Files ({selectedFiles.length}):</h4>
              {selectedFiles.map((file, index) => (
                <FileItem key={index}>
                  <span>{file.name}</span>
                  <button 
                    type="button" 
                    onClick={() => removeFile(index)}
                    style={{ background: 'none', border: 'none', color: '#e74c3c' }}
                  >
                    <FiX />
                  </button>
                </FileItem>
              ))}
            </FileList>
          )}

          <ButtonGroup>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" primary disabled={selectedFiles.length < 2}>
              Merge PDFs
            </Button>
          </ButtonGroup>
        </form>
      </Modal>
    </Overlay>
  );
}

export default MergeModal;
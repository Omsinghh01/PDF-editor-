import React, { useState } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';

const Container = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#3498db' : '#bdc3c7'};
  border-radius: 8px;
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.isDragActive ? '#ecf0f1' : 'white'};

  &:hover {
    border-color: #3498db;
    background: #ecf0f1;
  }
`;

const UploadIcon = styled(FiUpload)`
  font-size: 2rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
`;

const UploadText = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const FileInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #ecf0f1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileName = styled.span`
  font-weight: 500;
  color: #2c3e50;
`;

const FileSize = styled.span`
  font-size: 0.8rem;
  color: #7f8c8d;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  
  &:hover {
    background: #fadbd8;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function FileUpload({ onFileUpload, isLoading, currentFile }) {
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      onFileUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRemove = () => {
    setUploadedFile(null);
  };

  return (
    <Container>
      <Title>Upload PDF</Title>
      
      {!currentFile ? (
        <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
          <input {...getInputProps()} />
          <UploadIcon />
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <LoadingSpinner />
              <UploadText>Uploading...</UploadText>
            </div>
          ) : (
            <>
              <UploadText>
                {isDragActive
                  ? 'Drop the PDF file here...'
                  : 'Drag & drop a PDF file here, or click to select'}
              </UploadText>
              <UploadText style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Maximum file size: 100MB
              </UploadText>
            </>
          )}
        </DropzoneContainer>
      ) : (
        <FileInfo>
          <FileDetails>
            <FiFile />
            <div>
              <FileName>{currentFile.fileName}</FileName>
              <FileSize>{formatFileSize(currentFile.size)} • {currentFile.pageCount} pages</FileSize>
            </div>
          </FileDetails>
          <RemoveButton onClick={handleRemove} title="Remove file">
            <FiX />
          </RemoveButton>
        </FileInfo>
      )}
    </Container>
  );
}

export default FileUpload;
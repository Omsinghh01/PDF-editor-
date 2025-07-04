import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiX, FiImage, FiUpload } from 'react-icons/fi';
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
  max-width: 600px;
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

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  padding: 0.25rem;
  
  &:hover {
    color: #2c3e50;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#3498db' : '#bdc3c7'};
  border-radius: 8px;
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.isDragActive ? '#ecf0f1' : 'white'};
  margin-bottom: 1rem;

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

const ImagePreview = styled.div`
  margin-bottom: 1rem;
  text-align: center;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
`;

const ImageInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
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
    
    &:hover {
      background: #2980b9;
    }
  ` : `
    background: #ecf0f1;
    color: #2c3e50;
    
    &:hover {
      background: #d5dbdb;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function ImageModal({ isOpen, onClose, onAddImage }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState(1);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Calculate aspect ratio
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        setOriginalAspectRatio(aspectRatio);
        
        // Set default dimensions based on aspect ratio
        if (aspectRatio > 1) {
          setWidth(150);
          setHeight(Math.round(150 / aspectRatio));
        } else {
          setHeight(150);
          setWidth(Math.round(150 * aspectRatio));
        }
      };
      img.src = url;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const handleWidthChange = (newWidth) => {
    setWidth(newWidth);
    if (maintainAspectRatio) {
      setHeight(Math.round(newWidth / originalAspectRatio));
    }
  };

  const handleHeightChange = (newHeight) => {
    setHeight(newHeight);
    if (maintainAspectRatio) {
      setWidth(Math.round(newHeight * originalAspectRatio));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    onAddImage(selectedFile, {
      x: parseFloat(x),
      y: parseFloat(y),
      width: parseFloat(width),
      height: parseFloat(height)
    });
    
    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setX(50);
    setY(50);
    setWidth(100);
    setHeight(100);
    setMaintainAspectRatio(true);
    setOriginalAspectRatio(1);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <FiImage />
            Add Image
          </Title>
          <CloseButton onClick={handleCancel}>
            <FiX />
          </CloseButton>
        </Header>

        <form onSubmit={handleSubmit}>
          {!selectedFile ? (
            <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
              <input {...getInputProps()} />
              <UploadIcon />
              <UploadText>
                {isDragActive
                  ? 'Drop the image here...'
                  : 'Drag & drop an image here, or click to select'}
              </UploadText>
              <UploadText style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Supported formats: PNG, JPG, JPEG, GIF, BMP, WebP
              </UploadText>
            </DropzoneContainer>
          ) : (
            <ImagePreview>
              <PreviewImage src={previewUrl} alt="Preview" />
              <ImageInfo>
                {selectedFile.name} • {formatFileSize(selectedFile.size)}
              </ImageInfo>
              <Button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(previewUrl);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                style={{ marginTop: '0.5rem' }}
              >
                Choose Different Image
              </Button>
            </ImagePreview>
          )}

          {selectedFile && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormGroup>
                  <Label>X Position</Label>
                  <Input
                    type="number"
                    min="0"
                    value={x}
                    onChange={(e) => setX(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Y Position</Label>
                  <Input
                    type="number"
                    min="0"
                    value={y}
                    onChange={(e) => setY(e.target.value)}
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Maintain aspect ratio
                </Label>
              </FormGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormGroup>
                  <Label>Width</Label>
                  <Input
                    type="number"
                    min="10"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Height</Label>
                  <Input
                    type="number"
                    min="10"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                  />
                </FormGroup>
              </div>
            </>
          )}

          <ButtonGroup>
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" primary disabled={!selectedFile}>
              Add Image
            </Button>
          </ButtonGroup>
        </form>
      </Modal>
    </Overlay>
  );
}

export default ImageModal;
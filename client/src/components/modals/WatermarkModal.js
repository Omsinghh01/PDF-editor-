import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiDroplet } from 'react-icons/fi';

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
  min-width: 400px;
  max-width: 500px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const SliderValue = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-left: 0.5rem;
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

const Preview = styled.div`
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #f8f9fa;
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewText = styled.div`
  font-size: ${props => props.fontSize}px;
  opacity: ${props => props.opacity};
  color: #666;
  transform: rotate(${props => props.rotation}deg);
  user-select: none;
  font-weight: 500;
`;

function WatermarkModal({ isOpen, onClose, onAddWatermark }) {
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(45);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    onAddWatermark({
      text: text.trim(),
      fontSize: parseInt(fontSize),
      opacity: parseFloat(opacity),
      rotation: parseInt(rotation)
    });
    
    // Reset form
    setText('CONFIDENTIAL');
    setFontSize(50);
    setOpacity(0.3);
    setRotation(45);
    
    onClose();
  };

  const handleCancel = () => {
    setText('CONFIDENTIAL');
    setFontSize(50);
    setOpacity(0.3);
    setRotation(45);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <FiDroplet />
            Add Watermark
          </Title>
          <CloseButton onClick={handleCancel}>
            <FiX />
          </CloseButton>
        </Header>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Watermark Text</Label>
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter watermark text..."
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Font Size</Label>
            <Input
              type="number"
              min="20"
              max="100"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Opacity
              <SliderValue>{Math.round(opacity * 100)}%</SliderValue>
            </Label>
            <Slider
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Rotation
              <SliderValue>{rotation}°</SliderValue>
            </Label>
            <Slider
              type="range"
              min="-90"
              max="90"
              step="15"
              value={rotation}
              onChange={(e) => setRotation(e.target.value)}
            />
          </FormGroup>

          <Preview>
            <PreviewText
              fontSize={Math.min(fontSize * 0.3, 20)}
              opacity={opacity}
              rotation={rotation}
            >
              {text || 'WATERMARK'}
            </PreviewText>
          </Preview>

          <div style={{ 
            background: '#e8f4f8', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            fontSize: '0.9rem',
            color: '#2c3e50'
          }}>
            <strong>Note:</strong> The watermark will be applied to all pages of the PDF document.
          </div>

          <ButtonGroup>
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" primary disabled={!text.trim()}>
              Add Watermark
            </Button>
          </ButtonGroup>
        </form>
      </Modal>
    </Overlay>
  );
}

export default WatermarkModal;
import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiType } from 'react-icons/fi';

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
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ColorInput = styled.input`
  width: 100%;
  height: 3rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
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
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #f8f9fa;
  margin-bottom: 1rem;
`;

function TextModal({ isOpen, onClose, onAddText }) {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [color, setColor] = useState('#000000');
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    onAddText({
      text: text.trim(),
      fontSize: parseInt(fontSize),
      fontFamily,
      color,
      x: parseFloat(x),
      y: parseFloat(y)
    });
    
    // Reset form
    setText('');
    setFontSize(12);
    setFontFamily('Helvetica');
    setColor('#000000');
    setX(50);
    setY(50);
    
    onClose();
  };

  const handleCancel = () => {
    setText('');
    setFontSize(12);
    setFontFamily('Helvetica');
    setColor('#000000');
    setX(50);
    setY(50);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <FiType />
            Add Text
          </Title>
          <CloseButton onClick={handleCancel}>
            <FiX />
          </CloseButton>
        </Header>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Text Content</Label>
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              required
            />
          </FormGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <Label>Font Size</Label>
              <Input
                type="number"
                min="8"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Font Family</Label>
              <Select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="Helvetica">Helvetica</option>
                <option value="Times">Times Roman</option>
                <option value="Courier">Courier</option>
              </Select>
            </FormGroup>
          </div>

          <FormGroup>
            <Label>Text Color</Label>
            <ColorInput
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </FormGroup>

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

          {text && (
            <Preview>
              <strong>Preview:</strong>
              <div 
                style={{ 
                  fontSize: `${fontSize}px`, 
                  fontFamily: fontFamily === 'Times' ? 'Times, serif' : fontFamily === 'Courier' ? 'Courier, monospace' : 'Arial, sans-serif',
                  color: color,
                  marginTop: '0.5rem'
                }}
              >
                {text}
              </div>
            </Preview>
          )}

          <ButtonGroup>
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" primary disabled={!text.trim()}>
              Add Text
            </Button>
          </ButtonGroup>
        </form>
      </Modal>
    </Overlay>
  );
}

export default TextModal;
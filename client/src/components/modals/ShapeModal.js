import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiSquare } from 'react-icons/fi';

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
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewShape = styled.div`
  border: 2px solid ${props => props.borderColor};
  background: ${props => props.filled ? props.fillColor : 'transparent'};
  width: ${props => Math.min(props.width * 0.5, 100)}px;
  height: ${props => Math.min(props.height * 0.5, 80)}px;
`;

function ShapeModal({ isOpen, onClose, onAddShape }) {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(80);
  const [borderColor, setBorderColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#ffffff');
  const [filled, setFilled] = useState(false);
  const [borderWidth, setBorderWidth] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onAddShape({
      x: parseFloat(x),
      y: parseFloat(y),
      width: parseFloat(width),
      height: parseFloat(height),
      color: borderColor,
      fillColor: filled ? fillColor : null,
      borderWidth: parseInt(borderWidth)
    });
    
    // Reset form
    setX(50);
    setY(50);
    setWidth(100);
    setHeight(80);
    setBorderColor('#000000');
    setFillColor('#ffffff');
    setFilled(false);
    setBorderWidth(2);
    
    onClose();
  };

  const handleCancel = () => {
    setX(50);
    setY(50);
    setWidth(100);
    setHeight(80);
    setBorderColor('#000000');
    setFillColor('#ffffff');
    setFilled(false);
    setBorderWidth(2);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <FiSquare />
            Add Shape
          </Title>
          <CloseButton onClick={handleCancel}>
            <FiX />
          </CloseButton>
        </Header>

        <form onSubmit={handleSubmit}>
          <Preview>
            <PreviewShape
              width={width}
              height={height}
              borderColor={borderColor}
              fillColor={fillColor}
              filled={filled}
            />
          </Preview>

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <Label>Width</Label>
              <Input
                type="number"
                min="10"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Height</Label>
              <Input
                type="number"
                min="10"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </FormGroup>
          </div>

          <FormGroup>
            <Label>Border Color</Label>
            <ColorInput
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
            />
          </FormGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'end' }}>
            <FormGroup>
              <Label>Border Width</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={borderWidth}
                onChange={(e) => setBorderWidth(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={filled}
                  onChange={(e) => setFilled(e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Fill shape
              </Label>
            </FormGroup>
          </div>

          {filled && (
            <FormGroup>
              <Label>Fill Color</Label>
              <ColorInput
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
              />
            </FormGroup>
          )}

          <ButtonGroup>
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" primary>
              Add Shape
            </Button>
          </ButtonGroup>
        </form>
      </Modal>
    </Overlay>
  );
}

export default ShapeModal;
import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiScissors } from 'react-icons/fi';

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

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
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

function SplitModal({ isOpen, onClose, onSplitPDF }) {
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (startPage > endPage) {
      alert('Start page must be less than or equal to end page');
      return;
    }
    
    onSplitPDF(startPage - 1, endPage - 1); // Convert to 0-based indexing
    setStartPage(1);
    setEndPage(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <FiScissors />
            Split PDF
          </Title>
          <button style={{ background: 'none', border: 'none', fontSize: '1.5rem' }} onClick={onClose}>
            <FiX />
          </button>
        </Header>

        <form onSubmit={handleSubmit}>
          <label>Start Page</label>
          <Input
            type="number"
            min="1"
            value={startPage}
            onChange={(e) => setStartPage(parseInt(e.target.value))}
            required
          />
          
          <label>End Page</label>
          <Input
            type="number"
            min="1"
            value={endPage}
            onChange={(e) => setEndPage(parseInt(e.target.value))}
            required
          />

          <ButtonGroup>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" primary>Split PDF</Button>
          </ButtonGroup>
        </form>
      </Modal>
    </Overlay>
  );
}

export default SplitModal;
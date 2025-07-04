import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiMousePointer, 
  FiType, 
  FiImage, 
  FiSquare, 
  FiRotateCw,
  FiTrash2,
  FiScissors,
  FiLayers,
  FiDroplet,
  FiLock,
  FiSave,
  FiPlus
} from 'react-icons/fi';
import TextModal from './modals/TextModal';
import ImageModal from './modals/ImageModal';
import ShapeModal from './modals/ShapeModal';
import WatermarkModal from './modals/WatermarkModal';
import PasswordModal from './modals/PasswordModal';
import SplitModal from './modals/SplitModal';
import MergeModal from './modals/MergeModal';

const Container = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const ToolButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.5rem;
  border: 1px solid ${props => props.active ? '#3498db' : '#e0e0e0'};
  background: ${props => props.active ? '#ecf0f1' : 'white'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  color: ${props => props.active ? '#3498db' : '#2c3e50'};

  &:hover {
    border-color: #3498db;
    background: #ecf0f1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 1.2rem;
    margin-bottom: 0.25rem;
  }
`;

const FullWidthButton = styled(ToolButton)`
  grid-column: 1 / -1;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
`;

function Toolbar({ 
  selectedTool, 
  onToolSelect, 
  onAddText,
  onAddImage,
  onAddShape,
  onRotatePage,
  onDeletePages,
  onSplitPDF,
  onMergePDFs,
  onAddWatermark,
  onPasswordProtect,
  disabled 
}) {
  const [showTextModal, setShowTextModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showShapeModal, setShowShapeModal] = useState(false);
  const [showWatermarkModal, setShowWatermarkModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);

  const tools = [
    { id: 'select', icon: FiMousePointer, label: 'Select' },
    { id: 'text', icon: FiType, label: 'Text', action: () => setShowTextModal(true) },
    { id: 'image', icon: FiImage, label: 'Image', action: () => setShowImageModal(true) },
    { id: 'shape', icon: FiSquare, label: 'Shape', action: () => setShowShapeModal(true) }
  ];

  const pageTools = [
    { icon: FiRotateCw, label: 'Rotate 90°', action: () => onRotatePage(90) },
    { icon: FiTrash2, label: 'Delete Page', action: () => onDeletePages([0]) }
  ];

  const documentTools = [
    { icon: FiScissors, label: 'Split PDF', action: () => setShowSplitModal(true) },
    { icon: FiLayers, label: 'Merge PDFs', action: () => setShowMergeModal(true) },
    { icon: FiDroplet, label: 'Watermark', action: () => setShowWatermarkModal(true) },
    { icon: FiLock, label: 'Password', action: () => setShowPasswordModal(true) }
  ];

  return (
    <Container>
      <Section>
        <SectionTitle>Tools</SectionTitle>
        <ToolGrid>
          {tools.map(tool => (
            <ToolButton
              key={tool.id}
              active={selectedTool === tool.id}
              disabled={disabled}
              onClick={() => {
                if (tool.action) {
                  tool.action();
                } else {
                  onToolSelect(tool.id);
                }
              }}
            >
              <tool.icon />
              {tool.label}
            </ToolButton>
          ))}
        </ToolGrid>
      </Section>

      <Section>
        <SectionTitle>Page Actions</SectionTitle>
        <ToolGrid>
          {pageTools.map((tool, index) => (
            <ToolButton
              key={index}
              disabled={disabled}
              onClick={tool.action}
            >
              <tool.icon />
              {tool.label}
            </ToolButton>
          ))}
        </ToolGrid>
      </Section>

      <Section>
        <SectionTitle>Document Actions</SectionTitle>
        <ToolGrid>
          {documentTools.map((tool, index) => (
            <ToolButton
              key={index}
              disabled={disabled}
              onClick={tool.action}
            >
              <tool.icon />
              {tool.label}
            </ToolButton>
          ))}
        </ToolGrid>
      </Section>

      {/* Modals */}
      <TextModal
        isOpen={showTextModal}
        onClose={() => setShowTextModal(false)}
        onAddText={onAddText}
      />

      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onAddImage={onAddImage}
      />

      <ShapeModal
        isOpen={showShapeModal}
        onClose={() => setShowShapeModal(false)}
        onAddShape={onAddShape}
      />

      <WatermarkModal
        isOpen={showWatermarkModal}
        onClose={() => setShowWatermarkModal(false)}
        onAddWatermark={onAddWatermark}
      />

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onPasswordProtect={onPasswordProtect}
      />

      <SplitModal
        isOpen={showSplitModal}
        onClose={() => setShowSplitModal(false)}
        onSplitPDF={onSplitPDF}
      />

      <MergeModal
        isOpen={showMergeModal}
        onClose={() => setShowMergeModal(false)}
        onMergePDFs={onMergePDFs}
      />
    </Container>
  );
}

export default Toolbar;
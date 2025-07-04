import React from 'react';
import styled from 'styled-components';
import { FiFile, FiUser, FiCalendar, FiLayers, FiZoom } from 'react-icons/fi';

const Container = styled.div`
  padding: 1rem;
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

const PropertyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

const PropertyIcon = styled.div`
  color: #7f8c8d;
  display: flex;
  align-items: center;
`;

const PropertyContent = styled.div`
  flex: 1;
`;

const PropertyLabel = styled.div`
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
`;

const PropertyValue = styled.div`
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
`;

const ZoomSlider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ZoomButton = styled.button`
  background: white;
  border: 1px solid #e0e0e0;
  color: #2c3e50;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;

  &:hover {
    background: #ecf0f1;
    border-color: #3498db;
  }
`;

const AnnotationProperty = styled.div`
  margin-bottom: 1rem;
`;

const PropertyInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 0.25rem;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ColorPicker = styled.input`
  width: 100%;
  height: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.25rem;
`;

function PropertyPanel({ 
  selectedAnnotation, 
  documentInfo, 
  currentPage, 
  totalPages, 
  zoom, 
  onZoomChange 
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleZoomChange = (newZoom) => {
    onZoomChange(parseFloat(newZoom));
  };

  return (
    <Container>
      <Section>
        <SectionTitle>View Controls</SectionTitle>
        
        <PropertyItem>
          <PropertyIcon>
            <FiZoom />
          </PropertyIcon>
          <PropertyContent>
            <PropertyLabel>Zoom Level</PropertyLabel>
            <PropertyValue>{Math.round(zoom * 100)}%</PropertyValue>
            <ZoomSlider
              type="range"
              min="0.25"
              max="3"
              step="0.25"
              value={zoom}
              onChange={(e) => handleZoomChange(e.target.value)}
            />
            <ZoomControls>
              <ZoomButton onClick={() => handleZoomChange(0.5)}>50%</ZoomButton>
              <ZoomButton onClick={() => handleZoomChange(1)}>100%</ZoomButton>
              <ZoomButton onClick={() => handleZoomChange(1.5)}>150%</ZoomButton>
              <ZoomButton onClick={() => handleZoomChange(2)}>200%</ZoomButton>
            </ZoomControls>
          </PropertyContent>
        </PropertyItem>

        <PropertyItem>
          <PropertyIcon>
            <FiLayers />
          </PropertyIcon>
          <PropertyContent>
            <PropertyLabel>Current Page</PropertyLabel>
            <PropertyValue>{currentPage + 1} of {totalPages}</PropertyValue>
          </PropertyContent>
        </PropertyItem>
      </Section>

      {documentInfo && (
        <Section>
          <SectionTitle>Document Info</SectionTitle>
          
          <PropertyItem>
            <PropertyIcon>
              <FiFile />
            </PropertyIcon>
            <PropertyContent>
              <PropertyLabel>Title</PropertyLabel>
              <PropertyValue>{documentInfo.title || 'Untitled'}</PropertyValue>
            </PropertyContent>
          </PropertyItem>

          <PropertyItem>
            <PropertyIcon>
              <FiUser />
            </PropertyIcon>
            <PropertyContent>
              <PropertyLabel>Author</PropertyLabel>
              <PropertyValue>{documentInfo.author || 'Unknown'}</PropertyValue>
            </PropertyContent>
          </PropertyItem>

          <PropertyItem>
            <PropertyIcon>
              <FiLayers />
            </PropertyIcon>
            <PropertyContent>
              <PropertyLabel>Pages</PropertyLabel>
              <PropertyValue>{documentInfo.pageCount}</PropertyValue>
            </PropertyContent>
          </PropertyItem>

          <PropertyItem>
            <PropertyIcon>
              <FiCalendar />
            </PropertyIcon>
            <PropertyContent>
              <PropertyLabel>Created</PropertyLabel>
              <PropertyValue>{formatDate(documentInfo.creationDate)}</PropertyValue>
            </PropertyContent>
          </PropertyItem>

          <PropertyItem>
            <PropertyIcon>
              <FiCalendar />
            </PropertyIcon>
            <PropertyContent>
              <PropertyLabel>Modified</PropertyLabel>
              <PropertyValue>{formatDate(documentInfo.modificationDate)}</PropertyValue>
            </PropertyContent>
          </PropertyItem>

          {documentInfo.subject && (
            <PropertyItem>
              <PropertyIcon>
                <FiFile />
              </PropertyIcon>
              <PropertyContent>
                <PropertyLabel>Subject</PropertyLabel>
                <PropertyValue>{documentInfo.subject}</PropertyValue>
              </PropertyContent>
            </PropertyItem>
          )}

          {documentInfo.keywords && (
            <PropertyItem>
              <PropertyIcon>
                <FiFile />
              </PropertyIcon>
              <PropertyContent>
                <PropertyLabel>Keywords</PropertyLabel>
                <PropertyValue>{documentInfo.keywords}</PropertyValue>
              </PropertyContent>
            </PropertyItem>
          )}

          <PropertyItem>
            <PropertyIcon>
              <FiFile />
            </PropertyIcon>
            <PropertyContent>
              <PropertyLabel>Creator</PropertyLabel>
              <PropertyValue>{documentInfo.creator || 'Unknown'}</PropertyValue>
            </PropertyContent>
          </PropertyItem>

          <PropertyItem>
            <PropertyIcon>
              <FiFile />
            </PropertyIcon>
            <PropertyContent>
              <PropertyLabel>Producer</PropertyLabel>
              <PropertyValue>{documentInfo.producer || 'Unknown'}</PropertyValue>
            </PropertyContent>
          </PropertyItem>
        </Section>
      )}

      {selectedAnnotation && (
        <Section>
          <SectionTitle>Selected Element</SectionTitle>
          
          <AnnotationProperty>
            <PropertyLabel>Type</PropertyLabel>
            <PropertyValue>{selectedAnnotation.type || 'Unknown'}</PropertyValue>
          </AnnotationProperty>

          {selectedAnnotation.type === 'text' && (
            <>
              <AnnotationProperty>
                <PropertyLabel>Text Content</PropertyLabel>
                <PropertyInput
                  type="text"
                  value={selectedAnnotation.text || ''}
                  onChange={(e) => {
                    // Handle text change
                  }}
                />
              </AnnotationProperty>

              <AnnotationProperty>
                <PropertyLabel>Font Size</PropertyLabel>
                <PropertyInput
                  type="number"
                  min="8"
                  max="72"
                  value={selectedAnnotation.fontSize || 12}
                  onChange={(e) => {
                    // Handle font size change
                  }}
                />
              </AnnotationProperty>

              <AnnotationProperty>
                <PropertyLabel>Color</PropertyLabel>
                <ColorPicker
                  type="color"
                  value={selectedAnnotation.color || '#000000'}
                  onChange={(e) => {
                    // Handle color change
                  }}
                />
              </AnnotationProperty>
            </>
          )}

          {selectedAnnotation.type === 'shape' && (
            <>
              <AnnotationProperty>
                <PropertyLabel>Border Color</PropertyLabel>
                <ColorPicker
                  type="color"
                  value={selectedAnnotation.borderColor || '#000000'}
                  onChange={(e) => {
                    // Handle border color change
                  }}
                />
              </AnnotationProperty>

              <AnnotationProperty>
                <PropertyLabel>Fill Color</PropertyLabel>
                <ColorPicker
                  type="color"
                  value={selectedAnnotation.fillColor || '#ffffff'}
                  onChange={(e) => {
                    // Handle fill color change
                  }}
                />
              </AnnotationProperty>

              <AnnotationProperty>
                <PropertyLabel>Width</PropertyLabel>
                <PropertyInput
                  type="number"
                  min="1"
                  value={Math.round(selectedAnnotation.width || 0)}
                  onChange={(e) => {
                    // Handle width change
                  }}
                />
              </AnnotationProperty>

              <AnnotationProperty>
                <PropertyLabel>Height</PropertyLabel>
                <PropertyInput
                  type="number"
                  min="1"
                  value={Math.round(selectedAnnotation.height || 0)}
                  onChange={(e) => {
                    // Handle height change
                  }}
                />
              </AnnotationProperty>
            </>
          )}

          <AnnotationProperty>
            <PropertyLabel>X Position</PropertyLabel>
            <PropertyInput
              type="number"
              value={Math.round(selectedAnnotation.x || 0)}
              onChange={(e) => {
                // Handle x position change
              }}
            />
          </AnnotationProperty>

          <AnnotationProperty>
            <PropertyLabel>Y Position</PropertyLabel>
            <PropertyInput
              type="number"
              value={Math.round(selectedAnnotation.y || 0)}
              onChange={(e) => {
                // Handle y position change
              }}
            />
          </AnnotationProperty>
        </Section>
      )}
    </Container>
  );
}

export default PropertyPanel;
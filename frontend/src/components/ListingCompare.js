import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBalanceScale, FaTimes, FaShieldAlt, FaMapMarkerAlt, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';

const ListingCompare = ({ selectedListings = [], onRemoveListing, onClearAll }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (selectedListings.length === 0) return null;

  return (
    <>
      {/* Sticky Bottom Drawer Banner */}
      <DrawerContainer>
        <DrawerContent>
          <InfoSection>
            <FaBalanceScale size={20} />
            <TextContainer>
              <strong>Compare Accommodations</strong>
              <span>{selectedListings.length} of 3 selected</span>
            </TextContainer>
          </InfoSection>
          
          <ThumbnailSection>
            {selectedListings.map((listing) => (
              <MiniChip key={listing.id}>
                <img src={listing.image} alt={listing.property_name} />
                <span>{listing.property_name.split(' ')[0]}</span>
                <RemoveButton onClick={() => onRemoveListing(listing)} title="Remove">
                  <FaTimes size={10} />
                </RemoveButton>
              </MiniChip>
            ))}
          </ThumbnailSection>

          <ActionSection>
            <ClearButton onClick={onClearAll}>
              <FaTrashAlt size={12} />
              Clear
            </ClearButton>
            <CompareButton 
              onClick={() => setIsModalOpen(true)}
              disabled={selectedListings.length < 2}
              title={selectedListings.length < 2 ? 'Select at least 2 properties to compare' : 'Compare stays side-by-side'}
            >
              Compare Now
            </CompareButton>
          </ActionSection>
        </DrawerContent>
      </DrawerContainer>

      {/* Comparison Detailed Matrix Modal */}
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>
                <FaBalanceScale />
                Side-by-Side Comparison
              </h2>
              <CloseIconButton onClick={() => setIsModalOpen(false)}>
                <FaTimes size={20} />
              </CloseIconButton>
            </ModalHeader>

            <ModalBody>
              <ComparisonGrid $cols={selectedListings.length + 1}>
                {/* Headers Row */}
                <LabelCell $header>Feature</LabelCell>
                {selectedListings.map((listing) => (
                  <ValueCell key={`header-${listing.id}`} $header>
                    <HeaderCard>
                      <img src={listing.image} alt={listing.property_name} />
                      <h3>{listing.property_name}</h3>
                      <TypeTag>{listing.property_type}</TypeTag>
                    </HeaderCard>
                  </ValueCell>
                ))}

                {/* Rent Row */}
                <LabelCell>Monthly Rent</LabelCell>
                {selectedListings.map((listing) => (
                  <ValueCell key={`rent-${listing.id}`} $highlight>
                    <strong>Rs {listing.rent.toLocaleString('en-IN')}</strong>
                    <small>/ month</small>
                  </ValueCell>
                ))}

                {/* Distance Row */}
                <LabelCell>Campus Proximity</LabelCell>
                {selectedListings.map((listing) => (
                  <ValueCell key={`dist-${listing.id}`}>
                    <FaMapMarkerAlt />
                    <strong>{listing.distance_from_college} km</strong>
                    <small>from college</small>
                  </ValueCell>
                ))}

                {/* Verification Score */}
                <LabelCell>Verification Score</LabelCell>
                {selectedListings.map((listing) => (
                  <ValueCell key={`score-${listing.id}`}>
                    <ScoreBadge $score={listing.verification_score}>
                      <FaShieldAlt />
                      {listing.verification_score} / 100
                    </ScoreBadge>
                  </ValueCell>
                ))}

                {/* Safety Risk Level */}
                <LabelCell>Safety Assessment</LabelCell>
                {selectedListings.map((listing) => (
                  <ValueCell key={`risk-${listing.id}`}>
                    <RiskTag $risk={listing.risk}>
                      {listing.risk} Risk
                    </RiskTag>
                  </ValueCell>
                ))}

                {/* Amenities */}
                <LabelCell>Key Amenities</LabelCell>
                {selectedListings.map((listing) => (
                  <ValueCell key={`amenities-${listing.id}`} $alignLeft>
                    <AmenityGrid>
                      {listing.amenities.split(',').map((amenity) => (
                        <AmenityTag key={amenity.trim()}>
                          <FaCheckCircle size={10} />
                          {amenity.trim()}
                        </AmenityTag>
                      ))}
                    </AmenityGrid>
                  </ValueCell>
                ))}
              </ComparisonGrid>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ListingCompare;

// Styled Components
const DrawerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  box-shadow: 0 -10px 30px rgba(15, 23, 42, 0.08);
  z-index: 900;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
`;

const DrawerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--primary);
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  strong {
    color: var(--text);
    font-size: 0.95rem;
  }
  span {
    color: var(--muted);
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

const ThumbnailSection = styled.div`
  display: flex;
  gap: 0.8rem;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
`;

const MiniChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 0.25rem 0.6rem 0.25rem 0.25rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  position: relative;

  img {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    object-fit: cover;
  }

  span {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text);
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 2px;
  margin-left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #b91c1c;
  }
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid var(--border);
  color: var(--muted);
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #ef4444;
    border-color: #fca5a5;
  }
`;

const CompareButton = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  font-weight: 700;
  padding: 0.65rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.88rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(15, 118, 110, 0.15);

  &:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--muted);
    box-shadow: none;
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.2s ease forwards;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: var(--surface);
  border-radius: 16px;
  width: 100%;
  max-width: 1080px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: hidden;
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

  @keyframes scaleUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const ModalHeader = styled.header`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.4rem;
    color: var(--text);
  }
`;

const CloseIconButton = styled.button`
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  display: flex;

  &:hover {
    color: var(--text);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
  background: #f8fafc;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(180px, 1fr) repeat(${(props) => props.$cols - 1}, minmax(200px, 2fr));
  gap: 1px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
`;

const LabelCell = styled.div`
  background: ${(props) => (props.$header ? 'var(--primary)' : '#f1f5f9')};
  color: ${(props) => (props.$header ? 'white' : 'var(--text)')};
  padding: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
`;

const ValueCell = styled.div`
  background: ${(props) => (props.$header ? '#ffffff' : '#ffffff')};
  padding: 1.2rem;
  display: flex;
  flex-direction: ${(props) => (props.$alignLeft ? 'column' : 'row')};
  align-items: ${(props) => (props.$alignLeft ? 'flex-start' : 'center')};
  justify-content: ${(props) => (props.$alignLeft ? 'flex-start' : 'center')};
  gap: 0.4rem;
  text-align: center;
  font-size: 0.95rem;

  ${(props) => props.$highlight && `
    color: var(--primary);
    strong {
      font-size: 1.3rem;
    }
  `}

  svg {
    color: var(--muted);
  }

  small {
    color: var(--muted);
    font-size: 0.8rem;
  }
`;

const HeaderCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  width: 100%;

  img {
    width: 120px;
    height: 75px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
  }
`;

const TypeTag = styled.span`
  font-size: 0.75rem;
  font-weight: 800;
  background: #f1f5f9;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: var(--muted);
`;

const ScoreBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  background: ${(props) => (props.$score >= 85 ? '#e6f4ea' : '#fff8e1')};
  color: ${(props) => (props.$score >= 85 ? '#137333' : '#b06000')};

  svg {
    color: inherit;
  }
`;

const RiskTag = styled.span`
  font-size: 0.8rem;
  font-weight: 800;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  background: ${(props) => (props.$risk === 'Low' ? '#e6f4ea' : props.$risk === 'Medium' ? '#fff8e1' : '#fce8e6')};
  color: ${(props) => (props.$risk === 'Low' ? '#137333' : props.$risk === 'Medium' ? '#b06000' : '#c5221f')};
`;

const AmenityGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: flex-start;
`;

const AmenityTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  background: #f8fafc;
  border: 1px solid var(--border);
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  color: var(--muted);

  svg {
    color: #10b981;
  }
`;

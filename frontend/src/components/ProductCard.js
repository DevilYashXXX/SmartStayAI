import React from 'react';
import styled from 'styled-components';
import { FaHeart, FaMapMarkerAlt, FaShieldAlt, FaVrCardboard } from 'react-icons/fa';
import { getAmenityList, normalizeProperty } from '../data/smartStayData';

const ProductCard = ({ product, addToCart, compared = false, onCompareToggle = null, onVirtualTour = null }) => {
  const property = normalizeProperty(product);
  const amenities = getAmenityList(property.amenities).slice(0, 4);

  return (
    <Card $isVerified={property.verified}>
      <ImageWrap>
        {property.image ? (
          <ListingImage src={property.image} alt={property.property_name} />
        ) : (
          <ImageFallback>{property.property_type}</ImageFallback>
        )}
        <TypeBadge>{property.property_type}</TypeBadge>
        
        {onCompareToggle && (
          <CompareOverlay onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              id={`compare-${property.id}`}
              checked={compared}
              onChange={() => onCompareToggle(property)}
            />
            <label htmlFor={`compare-${property.id}`}>Compare</label>
          </CompareOverlay>
        )}
      </ImageWrap>

      <CardBody>
        <TitleRow>
          <h2>{property.property_name}</h2>
          {property.verified && (
            <VerifiedBadge title="Verified property">
              <FaShieldAlt />
              Verified
            </VerifiedBadge>
          )}
        </TitleRow>

        <Location>
          <FaMapMarkerAlt />
          <span>{property.location}</span>
        </Location>
        
        <DistanceBadge>
          {property.distance_from_college} km from campus
        </DistanceBadge>

        <Description>{property.description}</Description>

        <AmenityList>
          {amenities.map((amenity) => (
            <span key={amenity}>{amenity}</span>
          ))}
        </AmenityList>

        <FooterRow>
          <RentContainer>
            <RentLabel>Rent</RentLabel>
            <RentValue>Rs {property.rent.toLocaleString('en-IN')}<small>/mo</small></RentValue>
          </RentContainer>
          
          <ActionButtons>
            {onVirtualTour && (
              <TourButton type="button" title="Virtual 3D Tour" onClick={() => onVirtualTour(property)}>
                <FaVrCardboard />
                <span>3D Tour</span>
              </TourButton>
            )}
            
            <WishlistButton type="button" onClick={() => addToCart(property)} title="Add to Wishlist">
              <FaHeart />
              <span>Wishlist</span>
            </WishlistButton>
          </ActionButtons>
        </FooterRow>
      </CardBody>
    </Card>
  );
};

export default ProductCard;

const Card = styled.article`
  background: var(--surface);
  border: 1px solid ${(props) => (props.$isVerified ? 'rgba(15, 118, 110, 0.15)' : 'var(--border)')};
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    border-color: rgba(15, 118, 110, 0.3);
  }
`;

const ImageWrap = styled.div`
  aspect-ratio: 16 / 10;
  background: #f1f5f9;
  position: relative;
  overflow: hidden;
`;

const ListingImage = styled.img`
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
  transition: transform 0.5s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const ImageFallback = styled.div`
  align-items: center;
  color: var(--muted);
  display: flex;
  font-weight: 800;
  height: 100%;
  justify-content: center;
`;

const TypeBadge = styled.span`
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  border-radius: 6px;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  left: 0.75rem;
  padding: 0.3rem 0.55rem;
  position: absolute;
  top: 0.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  letter-spacing: 0.5px;
`;

const CompareOverlay = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  z-index: 5;

  input {
    cursor: pointer;
    margin: 0;
    accent-color: var(--primary);
  }

  label {
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text);
  }
`;

const CardBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.2rem;
`;

const TitleRow = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;

  h2 {
    color: var(--text);
    font-size: 1.15rem;
    line-height: 1.3;
    margin: 0;
    font-weight: 700;
    letter-spacing: -0.2px;
  }
`;

const VerifiedBadge = styled.span`
  align-items: center;
  background: #ccfbf1;
  color: #0f766e;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 800;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  white-space: nowrap;
`;

const Location = styled.p`
  align-items: center;
  color: var(--muted);
  display: flex;
  font-size: 0.85rem;
  gap: 0.3rem;
  margin: 0;
  font-weight: 500;
`;

const DistanceBadge = styled.span`
  align-self: flex-start;
  background: #f1f5f9;
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
`;

const Description = styled.p`
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AmenityList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.2rem;

  span {
    background: #f0fdf4;
    border: 1px solid #dcfce7;
    border-radius: 6px;
    color: #166534;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.45rem;
  }
`;

const FooterRow = styled.div`
  align-items: center;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-top: auto;
  border-top: 1px solid var(--border);
  padding-top: 0.8rem;
`;

const RentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RentLabel = styled.span`
  font-size: 0.75rem;
  color: var(--muted);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const RentValue = styled.strong`
  color: var(--text);
  font-size: 1.15rem;
  font-weight: 800;

  small {
    color: var(--muted);
    font-size: 0.78rem;
    font-weight: 500;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const TourButton = styled.button`
  align-items: center;
  background: #f59e0b;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-weight: 700;
  gap: 0.3rem;
  font-size: 0.8rem;
  height: 38px;
  padding: 0 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: #d97706;
    transform: translateY(-1px);
  }
`;

const WishlistButton = styled.button`
  align-items: center;
  background: var(--primary);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-weight: 700;
  gap: 0.3rem;
  font-size: 0.8rem;
  height: 38px;
  padding: 0 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
`;

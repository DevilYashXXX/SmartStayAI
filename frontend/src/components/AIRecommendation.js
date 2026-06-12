import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  fallbackProperties,
  getAmenityList,
  normalizeProperty,
  propertyTypes,
} from '../data/smartStayData';

const desiredAmenities = ['WiFi', 'Laundry', 'Meals', 'Security', 'Kitchen', 'Power Backup'];

const AIRecommendation = ({ properties = fallbackProperties, onWishlist }) => {
  const [preferences, setPreferences] = useState({
    budget: 7000,
    preferredArea: '',
    roomType: 'PG',
    maxDistance: 2,
    amenities: ['WiFi', 'Laundry'],
  });

  const recommendedProperties = useMemo(() => {
    return properties
      .map(normalizeProperty)
      .map((property) => {
        const amenityList = getAmenityList(property.amenities).map((amenity) => amenity.toLowerCase());
        const selectedAmenityMatches = preferences.amenities.filter((amenity) =>
          amenityList.includes(amenity.toLowerCase())
        ).length;
        const areaMatch =
          !preferences.preferredArea ||
          property.location.toLowerCase().includes(preferences.preferredArea.toLowerCase());

        const score =
          (property.rent <= Number(preferences.budget) ? 30 : 0) +
          (property.distance_from_college <= Number(preferences.maxDistance) ? 25 : 0) +
          (property.property_type === preferences.roomType ? 15 : 0) +
          (areaMatch ? 10 : 0) +
          Math.min(20, selectedAmenityMatches * 10);

        return {
          ...property,
          matchScore: Math.min(100, score),
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [preferences, properties]);

  const handleAmenityChange = (amenity) => {
    setPreferences((current) => {
      const amenities = current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity];

      return { ...current, amenities };
    });
  };

  return (
    <RecommendationPanel>
      <PanelHeader>
        <div>
          <Eyebrow>AI Recommendation Engine</Eyebrow>
          <h2>Recommended For You</h2>
        </div>
        <ConfidenceBadge>SmartStay Score</ConfidenceBadge>
      </PanelHeader>

      <PreferenceGrid>
        <Field>
          <label htmlFor="budget">Budget</label>
          <input
            id="budget"
            type="number"
            min="1000"
            step="500"
            value={preferences.budget}
            onChange={(event) =>
              setPreferences({ ...preferences, budget: event.target.value })
            }
          />
        </Field>

        <Field>
          <label htmlFor="preferredArea">Preferred Area</label>
          <input
            id="preferredArea"
            type="text"
            placeholder="College Road"
            value={preferences.preferredArea}
            onChange={(event) =>
              setPreferences({ ...preferences, preferredArea: event.target.value })
            }
          />
        </Field>

        <Field>
          <label htmlFor="roomType">Room Type</label>
          <select
            id="roomType"
            value={preferences.roomType}
            onChange={(event) =>
              setPreferences({ ...preferences, roomType: event.target.value })
            }
          >
            {propertyTypes.map((type) => (
              <option key={type.id} value={type.category_name}>
                {type.category_name}
              </option>
            ))}
          </select>
        </Field>

        <Field>
          <label htmlFor="maxDistance">Max Distance From College</label>
          <select
            id="maxDistance"
            value={preferences.maxDistance}
            onChange={(event) =>
              setPreferences({ ...preferences, maxDistance: event.target.value })
            }
          >
            <option value="1">Within 1 km</option>
            <option value="2">Within 2 km</option>
            <option value="5">Within 5 km</option>
          </select>
        </Field>
      </PreferenceGrid>

      <AmenityGroup>
        {desiredAmenities.map((amenity) => (
          <AmenityLabel key={amenity}>
            <input
              type="checkbox"
              checked={preferences.amenities.includes(amenity)}
              onChange={() => handleAmenityChange(amenity)}
            />
            {amenity}
          </AmenityLabel>
        ))}
      </AmenityGroup>

      <RecommendationGrid>
        {recommendedProperties.map((property) => (
          <RecommendationCard key={property.id}>
            <img src={property.image} alt={property.property_name} />
            <div>
              <CardTopLine>
                <span>{property.property_type}</span>
                <strong>Match Score: {property.matchScore}%</strong>
              </CardTopLine>
              <h3>{property.property_name}</h3>
              <p>{property.location} - {property.distance_from_college} km from college</p>
              <p>Rs {property.rent.toLocaleString('en-IN')} / month</p>
              <button type="button" onClick={() => onWishlist?.(property)}>
                Add to Wishlist
              </button>
            </div>
          </RecommendationCard>
        ))}
      </RecommendationGrid>
    </RecommendationPanel>
  );
};

export default AIRecommendation;

const RecommendationPanel = styled.section`
  background: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 28px rgba(20, 43, 34, 0.08);
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;

  h2 {
    margin: 0.2rem 0 0;
    font-size: 1.6rem;
    color: #1f3d2b;
  }
`;

const Eyebrow = styled.p`
  margin: 0;
  color: #4b7c63;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const ConfidenceBadge = styled.span`
  border: 1px solid #9fd4b8;
  border-radius: 999px;
  color: #1f6845;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.4rem 0.75rem;
  white-space: nowrap;
`;

const PreferenceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    color: #244337;
    font-weight: 700;
    font-size: 0.9rem;
  }

  input,
  select {
    border: 1px solid #bdd6cb;
    border-radius: 6px;
    font-size: 1rem;
    min-height: 44px;
    padding: 0.65rem;
  }
`;

const AmenityGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
`;

const AmenityLabel = styled.label`
  align-items: center;
  background: #edf7f2;
  border-radius: 999px;
  color: #214434;
  display: inline-flex;
  font-size: 0.9rem;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
`;

const RecommendationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const RecommendationCard = styled.article`
  border: 1px solid #e0ebe5;
  border-radius: 8px;
  overflow: hidden;
  background: #fbfdfc;

  img {
    aspect-ratio: 16 / 9;
    display: block;
    object-fit: cover;
    width: 100%;
  }

  > div {
    padding: 1rem;
  }

  h3 {
    color: #173629;
    font-size: 1.1rem;
    margin: 0.5rem 0;
  }

  p {
    color: #49665a;
    margin: 0.35rem 0;
  }

  button {
    background: #176b48;
    border: 0;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-weight: 700;
    margin-top: 0.75rem;
    min-height: 40px;
    padding: 0.6rem 0.8rem;
    width: 100%;
  }
`;

const CardTopLine = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;

  span {
    color: #4f7d64;
    font-size: 0.85rem;
    font-weight: 700;
  }

  strong {
    color: #176b48;
    font-size: 0.9rem;
  }
`;

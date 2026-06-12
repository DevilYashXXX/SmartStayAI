import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaHome, FaShieldAlt, FaTrashAlt } from 'react-icons/fa';
import { baseUrl } from '../components/common/baseUrl';
import {
  fallbackProperties,
  getRiskLevel,
  getVerificationScore,
  normalizeProperty,
  propertyTypes,
} from '../data/smartStayData';

const emptyProperty = {
  property_name: '',
  property_type: 'PG',
  rent: '',
  location: '',
  distance_from_college: '',
  amenities: '',
  description: '',
  image: '',
};

const OwnerDashboard = () => {
  const [properties, setProperties] = useState(fallbackProperties.slice(0, 3));
  const [newProperty, setNewProperty] = useState(emptyProperty);
  const [message, setMessage] = useState('');

  const verificationScore = useMemo(
    () =>
      getVerificationScore({
        description: newProperty.description,
        image: newProperty.image,
        amenities: newProperty.amenities,
      }),
    [newProperty]
  );
  const riskLevel = getRiskLevel(verificationScore);

  const handleInputChange = (event) => {
    setNewProperty({ ...newProperty, [event.target.name]: event.target.value });
  };

  const handleAddProperty = async (event) => {
    event.preventDefault();

    const property = normalizeProperty({
      ...newProperty,
      id: Date.now(),
      owner_id: null,
      rent: Number(newProperty.rent),
      distance_from_college: Number(newProperty.distance_from_college),
      verification_score: verificationScore,
      risk: riskLevel,
      verified: verificationScore >= 85,
    });

    try {
      await fetch(`${baseUrl}/api/add-property`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      setMessage('Property sent to admin verification.');
    } catch (error) {
      setMessage('Property saved locally. Start the backend to persist it.');
    }

    setProperties((current) => [property, ...current]);
    setNewProperty(emptyProperty);
  };

  const handleRemoveProperty = (propertyId) => {
    setProperties((current) => current.filter((property) => property.id !== propertyId));
  };

  return (
    <DashboardContainer>
      <Header>
        <div>
          <Eyebrow>Property Owner</Eyebrow>
          <h1>Owner Dashboard</h1>
          <p>Add properties, upload images, and monitor AI verification status.</p>
        </div>
        <Metric>
          <strong>{properties.length}</strong>
          <span>active listings</span>
        </Metric>
      </Header>

      <DashboardGrid>
        <Section>
          <SectionTitle>
            <FaHome />
            Add Property
          </SectionTitle>
          <Form onSubmit={handleAddProperty}>
            <TwoColumn>
              <Field>
                <label htmlFor="property_name">Property Name</label>
                <input
                  id="property_name"
                  type="text"
                  name="property_name"
                  value={newProperty.property_name}
                  onChange={handleInputChange}
                  required
                />
              </Field>

              <Field>
                <label htmlFor="property_type">Property Type</label>
                <select
                  id="property_type"
                  name="property_type"
                  value={newProperty.property_type}
                  onChange={handleInputChange}
                >
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.category_name}>
                      {type.category_name}
                    </option>
                  ))}
                </select>
              </Field>
            </TwoColumn>

            <TwoColumn>
              <Field>
                <label htmlFor="rent">Rent</label>
                <input
                  id="rent"
                  type="number"
                  min="0"
                  name="rent"
                  value={newProperty.rent}
                  onChange={handleInputChange}
                  required
                />
              </Field>

              <Field>
                <label htmlFor="distance_from_college">Distance From College</label>
                <input
                  id="distance_from_college"
                  type="number"
                  min="0"
                  step="0.1"
                  name="distance_from_college"
                  value={newProperty.distance_from_college}
                  onChange={handleInputChange}
                  required
                />
              </Field>
            </TwoColumn>

            <Field>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                value={newProperty.location}
                onChange={handleInputChange}
                required
              />
            </Field>

            <Field>
              <label htmlFor="amenities">Amenities</label>
              <input
                id="amenities"
                type="text"
                name="amenities"
                value={newProperty.amenities}
                onChange={handleInputChange}
                placeholder="WiFi, Laundry, Meals, Security"
                required
              />
            </Field>

            <Field>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                name="description"
                value={newProperty.description}
                onChange={handleInputChange}
                required
              />
            </Field>

            <Field>
              <label htmlFor="image">Images</label>
              <input
                id="image"
                type="text"
                name="image"
                value={newProperty.image}
                onChange={handleInputChange}
                placeholder="Paste two image URLs separated by comma"
              />
            </Field>

            <VerificationBox risk={riskLevel}>
              <FaShieldAlt />
              <div>
                <strong>AI Verification Score: {verificationScore}%</strong>
                <span>Fake Listing Risk: {riskLevel}</span>
              </div>
            </VerificationBox>

            <SubmitButton type="submit">Add Property</SubmitButton>
            {message && <Message>{message}</Message>}
          </Form>
        </Section>

        <Section>
          <SectionTitle>
            <FaShieldAlt />
            Manage Listings
          </SectionTitle>
          <PropertyList>
            {properties.map((property) => {
              const normalized = normalizeProperty(property);

              return (
                <PropertyItem key={normalized.id}>
                  <img src={normalized.image} alt={normalized.property_name} />
                  <div>
                    <TopLine>
                      <span>{normalized.property_type}</span>
                      <strong>{normalized.verification_score}% AI score</strong>
                    </TopLine>
                    <h3>{normalized.property_name}</h3>
                    <p>{normalized.location} - {normalized.distance_from_college} km</p>
                    <p>Rs {normalized.rent.toLocaleString('en-IN')} / month</p>
                    <StatusRow>
                      <VerificationStatus verified={normalized.verified}>
                        {normalized.verified ? 'Verified' : 'Pending Verification'}
                      </VerificationStatus>
                      <RiskBadge risk={normalized.risk}>{normalized.risk} risk</RiskBadge>
                    </StatusRow>
                  </div>
                  <IconButton
                    type="button"
                    aria-label={`Remove ${normalized.property_name}`}
                    onClick={() => handleRemoveProperty(normalized.id)}
                  >
                    <FaTrashAlt />
                  </IconButton>
                </PropertyItem>
              );
            })}
          </PropertyList>
        </Section>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default OwnerDashboard;

const DashboardContainer = styled.div`
  background: #f4f8f5;
  color: #173629;
  min-height: 100vh;
  padding: 2rem;
`;

const Header = styled.header`
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin: 0 auto 2rem;
  max-width: 1180px;

  h1 {
    margin: 0.2rem 0 0.5rem;
  }

  p {
    color: #48675a;
    margin: 0;
  }

  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

const Eyebrow = styled.p`
  color: #4f7d64;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0;
  margin: 0;
  text-transform: uppercase;
`;

const Metric = styled.div`
  align-items: center;
  background: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  min-width: 130px;
  padding: 1rem;

  strong {
    color: #176b48;
    font-size: 1.8rem;
  }

  span {
    color: #5f756c;
    font-weight: 700;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(320px, 0.9fr) minmax(340px, 1.1fr);
  margin: 0 auto;
  max-width: 1180px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  background-color: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(20, 43, 34, 0.08);
  padding: 1.25rem;
`;

const SectionTitle = styled.h2`
  align-items: center;
  color: #173629;
  display: flex;
  font-size: 1.2rem;
  gap: 0.55rem;
  margin: 0 0 1rem;
`;

const Form = styled.form`
  background: transparent;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
  max-width: none;
  padding: 0;
`;

const TwoColumn = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;

  label {
    color: #244337;
    font-weight: 800;
  }

  input,
  select,
  textarea {
    border: 1px solid #bdd6cb;
    border-radius: 6px;
    font-size: 1rem;
    min-height: 44px;
    padding: 0.7rem;
  }

  textarea {
    resize: vertical;
  }
`;

const VerificationBox = styled.div`
  align-items: center;
  background: ${({ risk }) => (risk === 'High' ? '#fff3f0' : risk === 'Medium' ? '#fff8e7' : '#edf7f2')};
  border: 1px solid ${({ risk }) => (risk === 'High' ? '#e3a19a' : risk === 'Medium' ? '#e8cf85' : '#9fd4b8')};
  border-radius: 8px;
  color: ${({ risk }) => (risk === 'High' ? '#9f2f20' : risk === 'Medium' ? '#775716' : '#176b48')};
  display: flex;
  gap: 0.8rem;
  padding: 0.9rem;

  div {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
`;

const SubmitButton = styled.button`
  background-color: #176b48;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 800;
  min-height: 44px;
  padding: 0.75rem 1rem;
`;

const Message = styled.p`
  color: #176b48;
  font-weight: 700;
  margin: 0;
`;

const PropertyList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PropertyItem = styled.article`
  align-items: center;
  border: 1px solid #e0ebe5;
  border-radius: 8px;
  display: grid;
  gap: 1rem;
  grid-template-columns: 120px 1fr auto;
  padding: 0.8rem;

  img {
    aspect-ratio: 4 / 3;
    border-radius: 6px;
    object-fit: cover;
    width: 100%;
  }

  h3 {
    margin: 0.3rem 0;
  }

  p {
    color: #48675a;
    margin: 0.2rem 0;
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const TopLine = styled.div`
  align-items: center;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;

  span {
    color: #4f7d64;
    font-size: 0.82rem;
    font-weight: 800;
  }

  strong {
    color: #176b48;
    font-size: 0.86rem;
  }
`;

const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.6rem;
`;

const VerificationStatus = styled.span`
  background: ${({ verified }) => (verified ? '#edf7f2' : '#fff8e7')};
  border-radius: 999px;
  color: ${({ verified }) => (verified ? '#176b48' : '#775716')};
  font-size: 0.8rem;
  font-weight: 800;
  padding: 0.35rem 0.6rem;
`;

const RiskBadge = styled.span`
  background: ${({ risk }) => (risk === 'High' ? '#fff3f0' : risk === 'Medium' ? '#fff8e7' : '#edf7f2')};
  border-radius: 999px;
  color: ${({ risk }) => (risk === 'High' ? '#9f2f20' : risk === 'Medium' ? '#775716' : '#176b48')};
  font-size: 0.8rem;
  font-weight: 800;
  padding: 0.35rem 0.6rem;
`;

const IconButton = styled.button`
  align-items: center;
  background: #fff3f0;
  border: 1px solid #e3a19a;
  border-radius: 6px;
  color: #9f2f20;
  cursor: pointer;
  display: inline-flex;
  height: 40px;
  justify-content: center;
  width: 40px;
`;

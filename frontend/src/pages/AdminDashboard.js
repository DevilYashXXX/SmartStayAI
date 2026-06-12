import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaChartLine, FaShieldAlt, FaTrashAlt, FaUserGraduate } from 'react-icons/fa';
import { baseUrl } from '../components/common/baseUrl';
import { fallbackProperties, normalizeProperty } from '../data/smartStayData';

const sampleUsers = [
  { id: 1, email: 'student.demo@smartstay.ai', role: 'student' },
  { id: 2, email: 'owner.demo@smartstay.ai', role: 'owner' },
  { id: 3, email: 'admin@smartstay.ai', role: 'admin' },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [properties, setProperties] = useState(fallbackProperties.map(normalizeProperty));
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, propertiesResponse] = await Promise.all([
          fetch(`${baseUrl}/api/users`),
          fetch(`${baseUrl}/api/properties`),
        ]);
        const usersData = await usersResponse.json();
        const propertiesData = await propertiesResponse.json();

        if (Array.isArray(usersData.data)) setUsers(usersData.data);
        if (Array.isArray(propertiesData.data)) {
          setProperties(propertiesData.data.map(normalizeProperty));
        }
      } catch (error) {
        setUsers(sampleUsers);
        setProperties(fallbackProperties.map(normalizeProperty));
      }
    };

    fetchData();
  }, []);

  const handleVerifyProperty = (propertyId) => {
    setProperties((current) =>
      current.map((property) =>
        property.id === propertyId
          ? { ...property, verified: true, verification_score: Math.max(property.verification_score, 90), risk: 'Low' }
          : property
      )
    );
  };

  const handleDeleteProperty = (propertyId) => {
    setProperties((current) => current.filter((property) => property.id !== propertyId));
    if (selectedProperty?.id === propertyId) setSelectedProperty(null);
  };

  const verifiedCount = properties.filter((property) => property.verified).length;
  const riskyCount = properties.filter((property) => property.risk === 'High').length;
  const averageRent =
    properties.reduce((total, property) => total + property.rent, 0) / Math.max(properties.length, 1);

  return (
    <DashboardContainer>
      <Header>
        <div>
          <Eyebrow>Admin Control Center</Eyebrow>
          <h1>Admin Dashboard</h1>
          <p>Verify properties, remove fake listings, and monitor SmartStay AI activity.</p>
        </div>
      </Header>

      <MetricGrid>
        <MetricCard>
          <FaShieldAlt />
          <strong>{verifiedCount}</strong>
          <span>verified properties</span>
        </MetricCard>
        <MetricCard>
          <FaTrashAlt />
          <strong>{riskyCount}</strong>
          <span>high-risk listings</span>
        </MetricCard>
        <MetricCard>
          <FaUserGraduate />
          <strong>{users.length}</strong>
          <span>platform users</span>
        </MetricCard>
        <MetricCard>
          <FaChartLine />
          <strong>Rs {Math.round(averageRent).toLocaleString('en-IN')}</strong>
          <span>average rent</span>
        </MetricCard>
      </MetricGrid>

      <DashboardGrid>
        <Section>
          <SectionTitle>Property Verification Queue</SectionTitle>
          <PropertyList>
            {properties.map((property) => (
              <PropertyItem
                key={property.id}
                selected={selectedProperty?.id === property.id}
                onClick={() => setSelectedProperty(property)}
              >
                <img src={property.image} alt={property.property_name} />
                <div>
                  <TopLine>
                    <span>{property.property_type}</span>
                    <strong>{property.verification_score}% AI score</strong>
                  </TopLine>
                  <h3>{property.property_name}</h3>
                  <p>{property.location} - {property.distance_from_college} km from college</p>
                  <StatusRow>
                    <VerificationStatus verified={property.verified}>
                      {property.verified ? 'Verified' : 'Needs Review'}
                    </VerificationStatus>
                    <RiskBadge risk={property.risk}>{property.risk} risk</RiskBadge>
                  </StatusRow>
                </div>
              </PropertyItem>
            ))}
          </PropertyList>
        </Section>

        <Section>
          <SectionTitle>Admin Actions</SectionTitle>
          {selectedProperty ? (
            <DetailsPanel>
              <img src={selectedProperty.image} alt={selectedProperty.property_name} />
              <h3>{selectedProperty.property_name}</h3>
              <p>{selectedProperty.description}</p>
              <DetailGrid>
                <div>
                  <span>Monthly Rent</span>
                  <strong>Rs {selectedProperty.rent.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span>Property Type</span>
                  <strong>{selectedProperty.property_type}</strong>
                </div>
                <div>
                  <span>AI Verification</span>
                  <strong>{selectedProperty.verification_score}%</strong>
                </div>
                <div>
                  <span>Fake Listing Risk</span>
                  <strong>{selectedProperty.risk}</strong>
                </div>
              </DetailGrid>
              <ActionRow>
                <ApproveButton type="button" onClick={() => handleVerifyProperty(selectedProperty.id)}>
                  <FaShieldAlt />
                  Verify Property
                </ApproveButton>
                <DeleteButton type="button" onClick={() => handleDeleteProperty(selectedProperty.id)}>
                  <FaTrashAlt />
                  Remove Listing
                </DeleteButton>
              </ActionRow>
            </DetailsPanel>
          ) : (
            <EmptyState>Select a property to review AI verification details.</EmptyState>
          )}
        </Section>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default AdminDashboard;

const DashboardContainer = styled.div`
  background: #f4f8f5;
  color: #173629;
  min-height: 100vh;
  padding: 2rem;
`;

const Header = styled.header`
  margin: 0 auto 1.5rem;
  max-width: 1180px;

  h1 {
    margin: 0.2rem 0 0.5rem;
  }

  p {
    color: #48675a;
    margin: 0;
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

const MetricGrid = styled.section`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  margin: 0 auto 1.5rem;
  max-width: 1180px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.article`
  background: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem;

  svg {
    color: #176b48;
  }

  strong {
    color: #173629;
    font-size: 1.5rem;
  }

  span {
    color: #5f756c;
    font-weight: 700;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(340px, 1fr) minmax(320px, 0.9fr);
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
  font-size: 1.2rem;
  margin: 0 0 1rem;
`;

const PropertyList = styled.div`
  display: grid;
  gap: 0.8rem;
`;

const PropertyItem = styled.button`
  align-items: center;
  background: ${({ selected }) => (selected ? '#edf7f2' : '#ffffff')};
  border: 1px solid ${({ selected }) => (selected ? '#9fd4b8' : '#e0ebe5')};
  border-radius: 8px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 1rem;
  grid-template-columns: 110px 1fr;
  padding: 0.8rem;
  text-align: left;
  width: 100%;

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
    margin: 0;
  }

  @media (max-width: 560px) {
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

const DetailsPanel = styled.div`
  img {
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    object-fit: cover;
    width: 100%;
  }

  h3 {
    margin: 1rem 0 0.4rem;
  }

  p {
    color: #48675a;
    line-height: 1.5;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 1rem 0;

  div {
    background: #f4f8f5;
    border-radius: 8px;
    padding: 0.8rem;
  }

  span {
    color: #5f756c;
    display: block;
    font-size: 0.82rem;
    font-weight: 700;
    margin-bottom: 0.3rem;
  }
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const ApproveButton = styled.button`
  align-items: center;
  background: #176b48;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 0.45rem;
  min-height: 44px;
  padding: 0.75rem 1rem;
`;

const DeleteButton = styled.button`
  align-items: center;
  background: #b23b3b;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 0.45rem;
  min-height: 44px;
  padding: 0.75rem 1rem;
`;

const EmptyState = styled.p`
  border: 1px dashed #bdd6cb;
  border-radius: 8px;
  color: #5f756c;
  margin: 0;
  padding: 2rem;
  text-align: center;
`;

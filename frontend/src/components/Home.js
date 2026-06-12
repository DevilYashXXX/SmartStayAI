import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaRobot, FaShieldAlt } from 'react-icons/fa';
import ProductCard from './ProductCard';
import { CartContext } from '../context/CartContext';
import { fallbackProperties } from '../data/smartStayData';

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const featuredProperties = fallbackProperties.filter((property) => property.verified).slice(0, 3);

  return (
    <HomeContainer>
      <HeroSection>
        <HeroOverlay>
          <HeroContent>
            <Eyebrow>SDG 11 - Sustainable Cities and Communities</Eyebrow>
            <h1>SmartStay AI</h1>
            <p>Finding safe and affordable student housing near campus.</p>
            <HeroActions>
              <PrimaryLink to="/properties">
                <FaHome />
                Browse Stays
              </PrimaryLink>
              <SecondaryLink to="/properties">
                <FaRobot />
                Get AI Matches
              </SecondaryLink>
            </HeroActions>
          </HeroContent>
        </HeroOverlay>
      </HeroSection>

      <StatsGrid>
        <StatCard>
          <strong>6</strong>
          <span>sample verified stays</span>
        </StatCard>
        <StatCard>
          <strong>96%</strong>
          <span>top AI verification score</span>
        </StatCard>
        <StatCard>
          <strong>0.5 km</strong>
          <span>nearest campus listing</span>
        </StatCard>
      </StatsGrid>

      <ImpactBand>
        <div>
          <FaShieldAlt />
          <h2>Safe, verified, student-focused housing</h2>
        </div>
        <p>
          SmartStay AI ranks stays by budget, campus distance, room type,
          amenities, and listing authenticity so students can make faster,
          safer housing decisions.
        </p>
      </ImpactBand>

      <FeaturedSection>
        <SectionHeader>
          <h2>Verified Student Accommodations</h2>
          <Link to="/properties">View all</Link>
        </SectionHeader>
        <PropertyGrid>
          {featuredProperties.map((property) => (
            <ProductCard key={property.id} product={property} addToCart={addToCart} />
          ))}
        </PropertyGrid>
      </FeaturedSection>
    </HomeContainer>
  );
};

export default Home;

const HomeContainer = styled.div`
  background: #f4f8f5;
  color: #173629;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background-image: url('https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1800&q=80');
  background-position: center;
  background-size: cover;
  min-height: 58vh;
`;

const HeroOverlay = styled.div`
  align-items: center;
  background: linear-gradient(90deg, rgba(16, 44, 32, 0.88), rgba(16, 44, 32, 0.32));
  display: flex;
  min-height: 58vh;
  padding: 2rem;
`;

const HeroContent = styled.div`
  color: white;
  max-width: 680px;

  h1 {
    font-size: 3.2rem;
    line-height: 1.05;
    margin: 0.35rem 0 0.75rem;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.5;
    margin: 0 0 1.4rem;
    max-width: 560px;
  }

  @media (max-width: 680px) {
    h1 {
      font-size: 2.4rem;
    }
  }
`;

const Eyebrow = styled.p`
  color: #c8f1d9;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0;
  margin: 0;
  text-transform: uppercase;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const PrimaryLink = styled(Link)`
  align-items: center;
  background: #ffffff;
  border-radius: 6px;
  color: #176b48;
  display: inline-flex;
  font-weight: 800;
  gap: 0.45rem;
  min-height: 44px;
  padding: 0.75rem 1rem;
  text-decoration: none;
`;

const SecondaryLink = styled(Link)`
  align-items: center;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  color: #ffffff;
  display: inline-flex;
  font-weight: 800;
  gap: 0.45rem;
  min-height: 44px;
  padding: 0.75rem 1rem;
  text-decoration: none;
`;

const StatsGrid = styled.section`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  margin: -2rem auto 2rem;
  max-width: 980px;
  padding: 0 2rem;
  position: relative;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    margin-top: 1rem;
  }
`;

const StatCard = styled.article`
  background: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(20, 43, 34, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;

  strong {
    color: #176b48;
    font-size: 1.7rem;
  }

  span {
    color: #5f756c;
    font-weight: 700;
  }
`;

const ImpactBand = styled.section`
  align-items: center;
  background: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  display: grid;
  gap: 1rem;
  grid-template-columns: 0.8fr 1.2fr;
  margin: 0 auto 2rem;
  max-width: 980px;
  padding: 1.25rem;

  > div {
    align-items: center;
    display: flex;
    gap: 0.75rem;
  }

  svg {
    color: #176b48;
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.25rem;
    margin: 0;
  }

  p {
    color: #48675a;
    line-height: 1.5;
    margin: 0;
  }

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedSection = styled.section`
  margin: 0 auto;
  max-width: 1180px;
  padding: 0 2rem 2rem;
`;

const SectionHeader = styled.div`
  align-items: baseline;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  h2 {
    margin: 0;
  }

  a {
    color: #176b48;
    font-weight: 800;
    text-decoration: none;
  }
`;

const PropertyGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
`;

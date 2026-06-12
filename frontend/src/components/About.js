import React from 'react';
import styled from 'styled-components';

const About = () => {
  return (
    <AboutContainer>
      <Content>
        <Eyebrow>SDG 11 Alignment</Eyebrow>
        <h1>About SmartStay AI</h1>
        <p>
          SmartStay AI helps students discover safe, affordable, and verified
          accommodation near their colleges. The platform converts a housing
          search into a structured marketplace where students can compare rent,
          distance, amenities, and authenticity before contacting property owners.
        </p>

        <Grid>
          <InfoBlock>
            <h2>Housing Problem</h2>
            <p>
              Students often face unclear rent, unsafe listings, fake images,
              long travel distances, and limited time to inspect every property.
            </p>
          </InfoBlock>
          <InfoBlock>
            <h2>SmartStay Solution</h2>
            <p>
              AI scoring recommends properties using student budget, preferred
              area, room type, distance from college, amenities, and verification
              signals.
            </p>
          </InfoBlock>
          <InfoBlock>
            <h2>Expected Impact</h2>
            <p>
              The project supports inclusive and sustainable communities by making
              student housing easier to discover, compare, and verify.
            </p>
          </InfoBlock>
        </Grid>

        <FeatureList>
          <li>Students search, filter, wishlist, and request bookings.</li>
          <li>Property owners add listings with AI verification feedback.</li>
          <li>Admins verify properties and remove fake or risky listings.</li>
        </FeatureList>
      </Content>
    </AboutContainer>
  );
};

export default About;

const AboutContainer = styled.div`
  background: #f4f8f5;
  color: #173629;
  min-height: 100vh;
  padding: 2rem;
`;

const Content = styled.main`
  background: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(20, 43, 34, 0.08);
  margin: 0 auto;
  max-width: 980px;
  padding: 2rem;

  h1 {
    margin: 0.2rem 0 1rem;
  }

  p {
    color: #48675a;
    line-height: 1.6;
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

const Grid = styled.section`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 1.5rem 0;

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBlock = styled.article`
  background: #f4f8f5;
  border-radius: 8px;
  padding: 1rem;

  h2 {
    font-size: 1.1rem;
    margin: 0 0 0.5rem;
  }

  p {
    margin: 0;
  }
`;

const FeatureList = styled.ul`
  color: #48675a;
  line-height: 1.8;
  padding-left: 1.2rem;
`;

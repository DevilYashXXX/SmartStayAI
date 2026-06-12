import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { FaCalendarCheck } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { normalizeProperty } from '../data/smartStayData';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const selectedProperties = cartItems.map(normalizeProperty);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    college: '',
    moveInDate: '',
    visitMode: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Full name is required.';
    if (!formData.phone) newErrors.phone = 'Contact number is required.';
    if (!formData.college) newErrors.college = 'College name is required.';
    if (!formData.moveInDate) newErrors.moveInDate = 'Move-in date is required.';
    if (!formData.visitMode) newErrors.visitMode = 'Please select a visit mode.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      clearCart();
    }
  };

  return (
    <Container>
      <TitleBlock>
        <Eyebrow>Booking Request</Eyebrow>
        <h1>Send Your Housing Request</h1>
        <p>
          SmartStay AI shares your shortlist and student details with verified
          property owners for confirmation.
        </p>
      </TitleBlock>

      {submitted ? (
        <SuccessBox>
          <FaCalendarCheck />
          <h2>Booking request sent</h2>
          <p>Owners will contact you with availability, visit timing, and next steps.</p>
        </SuccessBox>
      ) : (
        <ContentGrid>
          <ShortlistPanel>
            <h2>Selected stays</h2>
            {selectedProperties.length > 0 ? (
              selectedProperties.map((property) => (
                <ShortlistItem key={property.id}>
                  <strong>{property.property_name}</strong>
                  <span>{property.location} - Rs {property.rent.toLocaleString('en-IN')} / month</span>
                </ShortlistItem>
              ))
            ) : (
              <p>No stays selected yet. Add properties to your wishlist first.</p>
            )}
          </ShortlistPanel>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                placeholder="Student name"
              />
              {errors.name && <Error>{errors.name}</Error>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phone">Contact Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                placeholder="9876543210"
              />
              {errors.phone && <Error>{errors.phone}</Error>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="college">College Name</Label>
              <Input
                type="text"
                id="college"
                name="college"
                value={formData.college}
                onChange={(event) => setFormData({ ...formData, college: event.target.value })}
                placeholder="Your college"
              />
              {errors.college && <Error>{errors.college}</Error>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
              <Input
                type="date"
                id="moveInDate"
                name="moveInDate"
                value={formData.moveInDate}
                onChange={(event) =>
                  setFormData({ ...formData, moveInDate: event.target.value })
                }
              />
              {errors.moveInDate && <Error>{errors.moveInDate}</Error>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="visitMode">Visit Mode</Label>
              <Select
                id="visitMode"
                name="visitMode"
                value={formData.visitMode}
                onChange={(event) => setFormData({ ...formData, visitMode: event.target.value })}
              >
                <option value="">Select Visit Mode</option>
                <option value="physical">Physical Visit</option>
                <option value="video">Video Tour</option>
                <option value="owner-call">Owner Call First</option>
              </Select>
              {errors.visitMode && <Error>{errors.visitMode}</Error>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="notes">Amenities or Safety Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                placeholder="WiFi, laundry, late entry, food preferences..."
              />
            </FormGroup>

            <Button type="submit" disabled={selectedProperties.length === 0}>
              Send Booking Request
            </Button>
          </Form>
        </ContentGrid>
      )}
    </Container>
  );
};

export default Checkout;

const Container = styled.main`
  background: #f4f8f5;
  color: #173629;
  min-height: 100vh;
  padding: 2rem;
`;

const TitleBlock = styled.section`
  margin: 0 auto 1.5rem;
  max-width: 980px;

  h1 {
    margin: 0.2rem 0 0.5rem;
  }

  p {
    color: #48675a;
    margin: 0;
    max-width: 680px;
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

const ContentGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(240px, 0.8fr) minmax(300px, 1.2fr);
  margin: 0 auto;
  max-width: 980px;

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

const ShortlistPanel = styled.aside`
  background: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  padding: 1rem;

  h2 {
    font-size: 1.1rem;
    margin: 0 0 1rem;
  }

  p {
    color: #5f756c;
  }
`;

const ShortlistItem = styled.div`
  border-bottom: 1px solid #e3eee8;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.8rem 0;

  &:last-child {
    border-bottom: 0;
  }

  span {
    color: #5f756c;
    font-size: 0.92rem;
  }
`;

const Form = styled.form`
  background: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(20, 43, 34, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
  max-width: none;
  padding: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const Label = styled.label`
  color: #244337;
  font-weight: 800;
`;

const Input = styled.input`
  border: 1px solid #bdd6cb;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 44px;
  padding: 0.7rem;
`;

const Textarea = styled.textarea`
  border: 1px solid #bdd6cb;
  border-radius: 6px;
  font-size: 1rem;
  padding: 0.7rem;
  resize: vertical;
`;

const Select = styled.select`
  border: 1px solid #bdd6cb;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 44px;
  padding: 0.7rem;
`;

const Error = styled.p`
  color: #b23b3b;
  font-size: 0.88rem;
  margin: 0;
`;

const Button = styled.button`
  background-color: #176b48;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 800;
  min-height: 44px;
  padding: 0.75rem 1rem;

  &:disabled {
    background: #9ab9aa;
    cursor: not-allowed;
  }
`;

const SuccessBox = styled.section`
  align-items: center;
  background: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 560px;
  padding: 3rem 2rem;
  text-align: center;

  svg {
    color: #176b48;
    font-size: 2.5rem;
  }

  h2 {
    margin-bottom: 0.4rem;
  }

  p {
    color: #48675a;
    margin: 0;
  }
`;

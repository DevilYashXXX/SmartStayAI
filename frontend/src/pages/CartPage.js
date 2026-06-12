import React, { useContext } from 'react';
import styled from 'styled-components';
import { FaCalendarCheck, FaTrash } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { normalizeProperty } from '../data/smartStayData';

const CartPage = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const wishlistItems = cartItems.map(normalizeProperty);
  const totalRent = wishlistItems.reduce((total, item) => total + item.rent, 0);

  return (
    <WishlistContainer>
      <Header>
        <div>
          <Eyebrow>Student Shortlist</Eyebrow>
          <h1>Your Wishlist</h1>
          <p>Compare saved accommodations before sending a booking request.</p>
        </div>
        <Summary>
          <strong>{wishlistItems.length}</strong>
          <span>saved stays</span>
        </Summary>
      </Header>

      <WishlistItems>
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item) => (
            <WishlistItem key={item.id}>
              <ItemImage src={item.image} alt={item.property_name} />
              <ItemDetails>
                <h3>{item.property_name}</h3>
                <p>{item.property_type} in {item.location}</p>
                <p>{item.distance_from_college} km from college</p>
                <strong>Rs {item.rent.toLocaleString('en-IN')} / month</strong>
              </ItemDetails>
              <RemoveButton type="button" onClick={() => removeFromCart(item.id)}>
                <FaTrash />
                Remove
              </RemoveButton>
            </WishlistItem>
          ))
        ) : (
          <EmptyCart>Your wishlist is empty.</EmptyCart>
        )}
      </WishlistItems>

      <WishlistFooter>
        <TotalAmount>Estimated combined rent: Rs {totalRent.toLocaleString('en-IN')}</TotalAmount>
        <ActionButtons>
          <BookingButton to="/booking-request">
            <FaCalendarCheck />
            Request Booking
          </BookingButton>
          <ContinueShoppingLink to="/properties">Browse More Stays</ContinueShoppingLink>
        </ActionButtons>
      </WishlistFooter>
    </WishlistContainer>
  );
};

export default CartPage;

const WishlistContainer = styled.div`
  background: #f4f8f5;
  color: #173629;
  margin: 0 auto;
  min-height: 100vh;
  padding: 2rem;
`;

const Header = styled.header`
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin: 0 auto 2rem;
  max-width: 980px;

  h1 {
    margin: 0.2rem 0 0.5rem;
  }

  p {
    color: #48675a;
    margin: 0;
  }

  @media (max-width: 680px) {
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

const Summary = styled.div`
  align-items: center;
  background: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  min-width: 120px;
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

const WishlistItems = styled.div`
  display: grid;
  gap: 1rem;
  margin: 0 auto;
  max-width: 980px;
`;

const WishlistItem = styled.article`
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #d7e7df;
  border-radius: 8px;
  display: grid;
  gap: 1rem;
  grid-template-columns: 140px 1fr auto;
  padding: 1rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const ItemImage = styled.img`
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  object-fit: cover;
  width: 100%;
`;

const ItemDetails = styled.div`
  h3 {
    font-size: 1.2rem;
    margin: 0 0 0.4rem;
  }

  p {
    color: #48675a;
    margin: 0.3rem 0;
  }

  strong {
    color: #176b48;
    display: block;
    margin-top: 0.4rem;
  }
`;

const RemoveButton = styled.button`
  align-items: center;
  background-color: #b23b3b;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 0.4rem;
  justify-content: center;
  min-height: 40px;
  padding: 0.6rem 0.8rem;
`;

const EmptyCart = styled.p`
  background: #ffffff;
  border: 1px dashed #bdd6cb;
  border-radius: 8px;
  color: #5f756c;
  font-size: 1.1rem;
  margin: 0;
  padding: 2rem;
  text-align: center;
`;

const WishlistFooter = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem auto 0;
  max-width: 980px;
`;

const TotalAmount = styled.h2`
  font-size: 1.2rem;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const BookingButton = styled(Link)`
  align-items: center;
  background-color: #176b48;
  border-radius: 6px;
  color: white;
  display: inline-flex;
  font-weight: 800;
  gap: 0.45rem;
  min-height: 44px;
  padding: 0.75rem 1rem;
  text-decoration: none;
`;

const ContinueShoppingLink = styled(Link)`
  align-items: center;
  background-color: #e7f2ec;
  border-radius: 6px;
  color: #176b48;
  display: inline-flex;
  font-weight: 800;
  min-height: 44px;
  padding: 0.75rem 1rem;
  text-decoration: none;
`;

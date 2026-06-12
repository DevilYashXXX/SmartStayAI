import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Nav>
      <NavList>
        <NavItem><Link to="/">Home</Link></NavItem>
        <NavItem><Link to="/properties">Properties</Link></NavItem>
        <NavItem><Link to="/wishlist">Wishlist</Link></NavItem>
        <NavItem><Link to="/owner-dashboard">Owner</Link></NavItem>
        <NavItem><Link to="/admin-dashboard">Admin</Link></NavItem>
        <NavItem><Link to="/about">About</Link></NavItem>
        <NavItem><Link to="/support">Support</Link></NavItem>
        {isAuthenticated ? (
          <>
            <NavItem><Link to="/profile">Profile</Link></NavItem>
            <NavItem>
              <LogoutButton onClick={handleLogout} aria-label="Logout">Logout</LogoutButton>
            </NavItem>
          </>
        ) : (
          <NavItem><Link to="/register">Register/Login</Link></NavItem>
        )}
      </NavList>
    </Nav>
  );
};

export default NavBar;

const Nav = styled.nav`
  margin-left: auto;
`;

const NavList = styled.ul`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: flex-end;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  a {
    border-radius: 6px;
    color: #173629;
    display: inline-flex;
    font-size: 0.95rem;
    font-weight: 800;
    padding: 0.55rem 0.7rem;
    text-decoration: none;
  }

  a:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #173629;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 800;
  padding: 0.55rem 0.7rem;
`;

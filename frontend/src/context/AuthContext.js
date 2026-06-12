import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

// Create a provider component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated on initial load
    const token = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setUserRole(storedRole);
  }, []);

  const login = (token, role) => {
    localStorage.setItem('authToken', token); // Store token
    if (role) localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role || null);
    navigate('/'); // Redirect to home or desired route
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Clear token
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/'); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

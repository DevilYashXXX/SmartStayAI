import React, { createContext, useState } from 'react';
import { normalizeProperty } from '../data/smartStayData';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (property) => {
    const normalizedProperty = normalizeProperty(property);

    setCartItems((prevItems) => {
      const alreadySaved = prevItems.some((item) => item.id === normalizedProperty.id);
      return alreadySaved ? prevItems : [...prevItems, normalizedProperty];
    });
  };

  const removeFromCart = (property) => {
    const propertyId = typeof property === 'object' ? property.id : property;
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== propertyId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems: cartItems,
        addToCart,
        addToWishlist: addToCart,
        removeFromCart,
        removeFromWishlist: removeFromCart,
        clearCart,
        clearWishlist: clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

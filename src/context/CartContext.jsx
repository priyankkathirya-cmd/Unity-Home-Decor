import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const cartKey = currentUser ? `unity_cart_${currentUser._id}` : 'unity_cart_guest';

  // Synchronously load the correct cart on first render
  const [cart, setCart] = useState(() => {
    if (!currentUser) return []; // Guests always start with a new, empty cart on refresh
    const savedCart = localStorage.getItem(cartKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Whenever the user changes (login/logout), load their specific cart immediately
  useEffect(() => {
    if (!currentUser) {
      setCart([]); // reset guest cart
      return;
    }
    const savedCart = localStorage.getItem(cartKey);
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [cartKey, currentUser]);

  // Helper to safely update state and local storage accurately based on previous state
  const updateCart = (fn) => {
    setCart(prevCart => {
      const newCart = fn(prevCart);
      if (currentUser) {
        localStorage.setItem(cartKey, JSON.stringify(newCart)); // Only save if user is logged in
      }
      return newCart;
    });
  };

  const addToCart = (product, quantity) => {
    updateCart(prevCart => {
      const productId = product._id || product.id;
      const existingItem = prevCart.find(item => String(item._id || item.id) === String(productId));
      if (existingItem) {
        return prevCart.map(item => 
          String(item._id || item.id) === String(productId) ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, id: productId, quantity }]; // unify on id for older local maps
    });
  };

  const removeFromCart = (id) => {
    updateCart(prevCart => prevCart.filter(item => String(item._id || item.id) !== String(id)));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    updateCart(prevCart => prevCart.map(item => 
      String(item._id || item.id) === String(id) ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    updateCart(() => []);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

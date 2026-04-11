import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const wishlistKey = currentUser ? `unity_wishlist_${currentUser._id}` : 'unity_wishlist_guest';

  const [wishlist, setWishlist] = useState(() => {
    if (!currentUser) return [];
    const savedWishlist = localStorage.getItem(wishlistKey);
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    if (!currentUser) {
      setWishlist([]); 
      return;
    }
    const savedWishlist = localStorage.getItem(wishlistKey);
    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
  }, [wishlistKey, currentUser]);

  const updateWishlist = (fn) => {
    setWishlist(prevWishlist => {
      const newWishlist = fn(prevWishlist);
      if (currentUser) {
        localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
      }
      return newWishlist;
    });
  };

  const toggleWishlist = (product) => {
    updateWishlist(prevWishlist => {
      const productId = product._id || product.id;
      const isExist = prevWishlist.find(item => String(item._id || item.id) === String(productId));
      
      if (isExist) {
        // remove
        return prevWishlist.filter(item => String(item._id || item.id) !== String(productId));
      } else {
        // add
        return [...prevWishlist, { ...product, id: productId }];
      }
    });
  };

  const removeFromWishlist = (id) => {
    updateWishlist(prevWishlist => prevWishlist.filter(item => String(item._id || item.id) !== String(id)));
  };

  const isInWishlist = (id) => {
    return wishlist.some(item => String(item._id || item.id) === String(id));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

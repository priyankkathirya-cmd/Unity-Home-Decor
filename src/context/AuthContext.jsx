import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = sessionStorage.getItem('unity_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('unity_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('unity_user');
    }
  }, [currentUser]);

  const loginUser = (userData) => {
    setCurrentUser(userData);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

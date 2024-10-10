import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = () => {
      const authToken = localStorage.getItem('SuperstarChromeExtensionAuthToken');
      setIsLoggedIn(!!authToken);
    };

    checkLoggedIn();
    // You might want to add a listener for storage changes if you're using multiple tabs
    window.addEventListener('storage', checkLoggedIn);

    return () => window.removeEventListener('storage', checkLoggedIn);
  }, []);

  const login = (token) => {
    localStorage.setItem('SuperstarChromeExtensionAuthToken', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('SuperstarChromeExtensionAuthToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
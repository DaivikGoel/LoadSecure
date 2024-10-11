import React, { createContext, useState, useEffect, useContext } from 'react';
import ApiClient from '../api/apiclient'; // Adjust this import path as necessary

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const authToken = localStorage.getItem('SuperstarChromeExtensionAuthToken');
      if (authToken) {
        setIsLoggedIn(true);
        try {
          const response = await ApiClient.get('/v1/users/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // If fetching user data fails, we might want to log the user out
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
    window.addEventListener('storage', checkLoggedIn);

    return () => window.removeEventListener('storage', checkLoggedIn);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('SuperstarChromeExtensionAuthToken', token);
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('SuperstarChromeExtensionAuthToken');
    setIsLoggedIn(false);
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
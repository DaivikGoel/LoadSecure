import React, { createContext, useState, useEffect, useContext } from 'react';
import ApiClient from '../api/apiclient';

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
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
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
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
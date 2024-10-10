import React from 'react';
import './Popup.css';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import { AuthContextProvider, useAuth } from '../../lib/auth/AuthContextProvider';

const PopupContent = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="App">
      {isLoggedIn ? <Home /> : <Login />}
    </div>
  );
};

const Popup = () => {
  return (
    <AuthContextProvider>
      <PopupContent />
    </AuthContextProvider>
  );
};

export default Popup;
import React, { useEffect, useState } from 'react';
import './Popup.css';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import { AuthContextProvider, useAuth } from '../../lib/auth/AuthContextProvider';
import { GlobalStateProvider, useGlobalState } from '../../lib/state/GlobalStateProvider';

const PopupContent = () => {
  const { isLoggedIn } = useAuth();
  const { setCurrentCreator, setCurrentCreatorURL, setCurrentCreatorPlatform } = useGlobalState();
  const [localCreator, setLocalCreator] = useState(null);
  const [localCreatorURL, setLocalCreatorURL] = useState(null);
  const [localCreatorPlatform, setLocalCreatorPlatform] = useState(null);

  useEffect(() => {
    chrome.runtime.sendMessage({action: 'getCurrentCreator'}, response => {
      if (response && response.currentCreator) {
        setCurrentCreator(response.currentCreator);
        setLocalCreator(response.currentCreator);
        setCurrentCreatorURL(response.currentCreatorURL);
        setLocalCreatorURL(response.currentCreatorURL);
        setCurrentCreatorPlatform(response.currentCreatorPlatform);
        setLocalCreatorPlatform(response.currentCreatorPlatform);
      }
    });
  }, [setCurrentCreator, setCurrentCreatorURL, setCurrentCreatorPlatform]);

  return (
    <div className="App">
      {isLoggedIn ? <Home currentCreator={localCreator} currentCreatorURL={localCreatorURL} currentCreatorPlatform={localCreatorPlatform} /> : <Login />}
    </div>
  );
};

const Popup = () => {
  return (
    <AuthContextProvider>
      <GlobalStateProvider>
        <PopupContent />
      </GlobalStateProvider>
    </AuthContextProvider>
  );
};

export default Popup;
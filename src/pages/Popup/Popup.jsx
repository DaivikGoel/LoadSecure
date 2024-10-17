import React, {useEffect, useState} from 'react';
import './Popup.css';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import {  useAuth } from '../../lib/auth/AuthContextProvider';
import { useGlobalState } from '../../lib/state/GlobalStateProvider';
import { fetchCreators } from '../../lib/api/fetchcreators';

const AppInitializer = ({ children }) => {
  
  const { user, isLoggedIn } = useAuth();
  const {
    setSelectedBusiness,
    setBusinessCreators,
    setCurrentCreator,
    setCurrentCreatorURL,
    setCurrentCreatorPlatform
  } = useGlobalState();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {

    const initializeApp = async () => {

      try {
        if (isLoggedIn && user) {
  
          setSelectedBusiness(user.primaryBusiness);
          const creators = await fetchCreators(user.primaryBusiness.id);
          setBusinessCreators(creators);
        }

        // Get current creator info from Chrome runtime
        chrome.runtime.sendMessage({action: 'getCurrentCreator'}, response => {

          if (response && response.currentCreator) {
            setCurrentCreator(response.currentCreator);
            setCurrentCreatorURL(response.currentCreatorURL);
            setCurrentCreatorPlatform(response.currentCreatorPlatform);
          }
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    initializeApp();
  }, [isLoggedIn, user, setSelectedBusiness, setBusinessCreators, setCurrentCreator, setCurrentCreatorURL, setCurrentCreatorPlatform]);


  if (!isInitialized) {
    return <div>Initializing app...</div>;
  }

  return children;
};

const Popup = () => {
  const { isLoggedIn } = useAuth();
  const { currentCreator, currentCreatorURL, currentCreatorPlatform } = useGlobalState();

  return (
    <div className="App">
              <AppInitializer>
      {isLoggedIn ? (
        <Home
          currentCreator={currentCreator}
          currentCreatorURL={currentCreatorURL}
          currentCreatorPlatform={currentCreatorPlatform}
        />
      ) : (
        <Login />
      )}
      </AppInitializer>
    </div>
  );
};

export default Popup;
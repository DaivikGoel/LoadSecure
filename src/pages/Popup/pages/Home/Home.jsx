import React, { useEffect, useState } from 'react';
import './Home.css';
import { useGlobalState } from '../../../../lib/state/GlobalStateProvider';
import { useAuth } from '../../../../lib/auth/AuthContextProvider';
import { fetchCreators } from '../../helpers/fetchcreators';

const Home = () => {
  const { currentCreator, selectedBusiness, businessCreators, setBusinessCreators, setSelectedBusiness } = useGlobalState();
  const { user } = useAuth();

  useEffect(() => {
    if (selectedBusiness === null && user) {
      setSelectedBusiness(user.primaryBusiness);
    }
    if ((businessCreators === undefined || businessCreators === null) && selectedBusiness) {
      fetchCreators(selectedBusiness.id).then(creators => {
        setBusinessCreators(creators);
      });
    }
  }, [selectedBusiness, businessCreators, user]);
  console.log("CREATPRS", businessCreators)
  return (
    <div className="wave-container">
      {user && <h2>Welcome {user.firstName}!</h2>}
      {currentCreator && <h2>Current Creator: {currentCreator}</h2>}
    </div>
  );
};

export default Home;
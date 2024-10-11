import React, { useEffect, useState } from 'react';
import './Home.css';
import { useGlobalState } from '../../../../lib/state/GlobalStateProvider';
import { useAuth } from '../../../../lib/auth/AuthContextProvider';
import { fetchCreators } from '../../helpers/fetchcreators';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

const Home = () => {

  const { currentCreator, currentCreatorPlatform, selectedBusiness, businessCreators, setBusinessCreators, setSelectedBusiness } = useGlobalState();
  const { user } = useAuth();
  const [selectedCreator, setSelectedCreator] = useState(null);

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

  const handleCreatorChange = (e) => {
    const creatorId = e.target.value;
    setSelectedCreator(businessCreators.find(creator => creator.id === creatorId) || null);
    // You might want to update the currentCreator in your global state here as well
    console.log("Selected Creator:", creatorId);
  };

  return (
    <div className="wave-container">
      {user && <h2>Welcome {user.firstName}!</h2>}
      {currentCreator && (
        <>
          <h2>Current Creator: 
          {currentCreatorPlatform === 'Instagram' && <FaInstagram className="ml-2" />}
            {currentCreatorPlatform === 'Youtube' && <FaYoutube className="ml-2" />}
            {currentCreatorPlatform === 'TikTok' && <FaTiktok className="ml-2" />}
            {currentCreator}

          </h2>
        </>
      )}
      {businessCreators && (
        <>
          <select value={selectedCreator ? selectedCreator.id : ''} onChange={handleCreatorChange}>
            <option value="">Select a Creator</option>
            {businessCreators.map((creator) => (
              <option key={creator.id} value={creator.id}>
                {creator.legalName}
              </option>
            ))}
          </select>
          {selectedCreator && (
            <div className="social-icons">
              {selectedCreator.instagramHandle && <FaInstagram className="ml-2" />}
              {selectedCreator.youtubeHandle && <FaYoutube className="ml-2" />}
              {selectedCreator.tiktokHandle && <FaTiktok className="ml-2" />}
            </div>
          )}
          <p>Add social to existing creator</p>
          <button>Add</button>
        </>
      )}
    </div>
  );
};

export default Home;
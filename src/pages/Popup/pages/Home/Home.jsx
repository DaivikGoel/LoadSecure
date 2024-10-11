import React, { useEffect, useState } from 'react';
import './Home.css';
import { useGlobalState } from '../../../../lib/state/GlobalStateProvider';
import { useAuth } from '../../../../lib/auth/AuthContextProvider';
import { fetchCreators } from '../../helpers/fetchcreators';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';

const Home = () => {
  const { currentCreator, currentCreatorPlatform, selectedBusiness, businessCreators, setBusinessCreators, setSelectedBusiness } = useGlobalState();
  const { user } = useAuth();
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [platformToOverwrite, setPlatformToOverwrite] = useState(null);

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
    console.log("Selected Creator:", creatorId);
  };

  const handleAddClick = () => {
    if (selectedCreator && currentCreator && currentCreatorPlatform) {
      const platformHandle = `${currentCreatorPlatform.toLowerCase()}Handle`;
      if (selectedCreator[platformHandle]) {
        setPlatformToOverwrite(currentCreatorPlatform);
        setIsConfirmationDialogOpen(true);
      } else {
        addSocialHandle();
      }
    } else {
      alert("Please select a creator and ensure there's a current creator and platform.");
    }
  };

  const addSocialHandle = () => {
    // Call your API to add the social handle
    console.log('Calling API to add social handle');
    // Add your API call here
  };

  const handleConfirmationDialogClose = () => {
    setIsConfirmationDialogOpen(false);
    setPlatformToOverwrite(null);
  };

  const handleConfirmationDialogConfirm = () => {
    // Call your API to overwrite the existing handle
    console.log('Calling API to overwrite existing handle');
    // Add your API call here
    setIsConfirmationDialogOpen(false);
    setPlatformToOverwrite(null);
  };

  return (
    <div className="wave-container">
      {user && <h2>Welcome {user.firstName}!</h2>}
      {currentCreator && (
        <h2>
          Current Creator: 
          {currentCreatorPlatform === 'Instagram' && <FaInstagram className="ml-2" />}
          {currentCreatorPlatform === 'Youtube' && <FaYoutube className="ml-2" />}
          {currentCreatorPlatform === 'TikTok' && <FaTiktok className="ml-2" />}
          {currentCreator}
        </h2>
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
          <button onClick={handleAddClick}>Add</button>
          {isConfirmationDialogOpen && (
            <Dialog open={isConfirmationDialogOpen} onOpenChange={handleConfirmationDialogClose}>
              <DialogTitle>Overwrite Existing Handle?</DialogTitle>
              <DialogContent>
                Are you sure you want to overwrite the existing {platformToOverwrite} handle for this creator?
              </DialogContent>
              <div className="dialog-footer">
                <button onClick={handleConfirmationDialogClose}>Cancel</button>
                <button onClick={handleConfirmationDialogConfirm}>Confirm</button>
              </div>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
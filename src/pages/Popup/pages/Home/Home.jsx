import React, { useEffect, useState } from 'react';
import './Home.css';
import { useGlobalState } from '../../../../lib/state/GlobalStateProvider';
import { useAuth } from '../../../../lib/auth/AuthContextProvider';
import { fetchCreators } from '../../helpers/fetchcreators';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { Dialog, DialogContent, DialogTitle, DialogOverlay } from '@radix-ui/react-dialog';
import ApiClient from '../../../../lib/api/apiclient';
import wordmark from '../../../../assets/img/wordmark.png';
import CreateCreator from '../Onboard/CreateCreator';
import Button from '../../../../components/common/basics/button';

const Home = () => {
  const { currentCreator, currentCreatorPlatform, selectedBusiness, businessCreators, setBusinessCreators, setSelectedBusiness, currentCreatorURL } = useGlobalState();
  const { user } = useAuth();
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [platformToOverwrite, setPlatformToOverwrite] = useState(null);
  const [showCreateCreator, setShowCreateCreator] = useState(false);

  useEffect(() => {
    if (selectedBusiness === null && user) {
      setSelectedBusiness(user.primaryBusiness);
    }
    if ((businessCreators === undefined || businessCreators === null) && selectedBusiness) {
      fetchCreators(selectedBusiness.id).then(creators => {
        setBusinessCreators(creators);
      });
    }
  }, [selectedBusiness, businessCreators, user, setSelectedBusiness, setBusinessCreators]);

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

  const addSocialHandle = async () => {
    console.log('Calling API to add social handle');
    const platformHandle = `${currentCreatorPlatform.toLowerCase()}Handle`;
    const newHandle = currentCreatorURL;
    try {
      const response = await ApiClient.post(`v1/businesses/${selectedBusiness.id}/creator/edit/${selectedCreator.id}`, {
        [platformHandle]: newHandle,
      });
      if (response.status === 200) {
        console.log('Social handle added successfully');
        setBusinessCreators(prevCreators => prevCreators.map(creator => {
          if (creator.id === selectedCreator.id) {
            return { ...creator, [platformHandle]: newHandle };
          }
          return creator;
        }));
      } else {
        console.error('Error adding social handle');
      }
    } catch (error) {
      console.error('Error adding social handle:', error);
    }
  };

  const handleConfirmationDialogClose = () => {
    setIsConfirmationDialogOpen(false);
    setPlatformToOverwrite(null);
  };

  const handleConfirmationDialogConfirm = async () => {
    console.log('Calling API to overwrite existing handle');
    const platformHandle = `${platformToOverwrite.toLowerCase()}Handle`;
    const newHandle = currentCreatorURL;
    try {
      const response = await ApiClient.post(`v1/businesses/${selectedBusiness.id}/creator/edit/${selectedCreator.id}`, {
        [platformHandle]: newHandle,
      });
      if (response.status === 200) {
        console.log('Social handle overwritten successfully');
        setBusinessCreators(prevCreators => prevCreators.map(creator => {
          if (creator.id === selectedCreator.id) {
            return { ...creator, [platformHandle]: newHandle };
          }
          return creator;
        }));
      } else {
        console.error('Error overwriting social handle');
      }
    } catch (error) {
      console.error('Error overwriting social handle:', error);
    }
    setIsConfirmationDialogOpen(false);
    setPlatformToOverwrite(null);
  };

  const getPlatformIcon = () => {
    switch(currentCreatorPlatform) {
      case 'Instagram':
        return <FaInstagram />;
      case 'Youtube':
        return <FaYoutube />;
      case 'TikTok':
        return <FaTiktok />;
      default:
        return null;
    }
  };

  if (showCreateCreator) {
    return <CreateCreator onBack={() => setShowCreateCreator(false)} />;
  }

  return (
    <div className="home-container">
      <img src={wordmark} alt="Wordmark" style={{ width: '60%' }} />
  
      <h1> Current Creator</h1>
      <div className="creator-info">
      
        <span className="creator-name">{getPlatformIcon()}{currentCreator}</span>
        <span className="creator-platform">{currentCreatorPlatform}</span>
      </div>
      <div className="card">
        <h3>Add to an existing creator</h3>
        <select onChange={handleCreatorChange} value={selectedCreator ? selectedCreator.id : ''}>
          <option value="">Select a Creator</option>
          {businessCreators && businessCreators.sort((a, b) => a.legalName.localeCompare(b.legalName)).map((creator) => (
            <option key={creator.id} value={creator.id}>{creator.legalName}</option>
          ))}
        </select>
        <Button onClick={handleAddClick} className="action-button">Add</Button>
      </div>
      <Button onClick={() => setShowCreateCreator(true)} className="action-button">Add a new creator</Button>
      {isConfirmationDialogOpen && (
        <Dialog open={isConfirmationDialogOpen} onOpenChange={() => setIsConfirmationDialogOpen(false)}>
          <DialogOverlay className="dialog-overlay" />
          <DialogContent className="dialog-content">
            <DialogTitle className="dialog-title">Overwrite Existing Handle?</DialogTitle>
            <div className="dialog-message">
              Are you sure you want to overwrite the existing {platformToOverwrite} handle for this creator?
            </div>
            <div className="dialog-actions">
              <Button onClick={handleConfirmationDialogClose} className="dialog-button">Cancel</Button>
              <Button onClick={handleConfirmationDialogConfirm} className="dialog-button dialog-button-confirm">Confirm</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Home;
import React, { useEffect, useState } from 'react';
import './Home.css';
import { useGlobalState } from '../../../../lib/state/GlobalStateProvider';
import { useAuth } from '../../../../lib/auth/AuthContextProvider';
import { fetchCreators } from '../../helpers/fetchcreators';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { Dialog, DialogContent, DialogTitle, DialogOverlay } from '@radix-ui/react-dialog';
import ApiClient from '../../../../lib/api/apiclient';

const Home = () => {
  const { currentCreator, currentCreatorPlatform, selectedBusiness, businessCreators, setBusinessCreators, setSelectedBusiness, currentCreatorURL } = useGlobalState();
  const { user } = useAuth();
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [platformToOverwrite, setPlatformToOverwrite] = useState(null);
  const [newCreatorName, setNewCreatorName] = useState('');
  const [isAddingNewCreator, setIsAddingNewCreator] = useState(false);

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

  const handleAddNewCreator = async () => {
    if (!newCreatorName || !currentCreatorPlatform || !currentCreatorURL) {
      alert("Please enter a creator name and ensure there's a current creator and platform.");
      return;
    }
    setIsAddingNewCreator(true);
    try {
      const response = await ApiClient.post(`v1/businesses/${selectedBusiness.id}/addCreator`, {
        legalName: newCreatorName,
        [`${currentCreatorPlatform.toLowerCase()}Handle`]: currentCreatorURL,
      });
      if (response.status === 200) {
        console.log('New creator added successfully');
        const newCreator = response.data;
        setBusinessCreators(prevCreators => [...prevCreators, newCreator]);
        setNewCreatorName('');
        alert('New creator added successfully!');
      } else {
        console.error('Error adding new creator:', response.data.message);
        alert('Error adding new creator. Please try again.');
      }
    } catch (error) {
      console.error('Error adding new creator:', error.message);
      alert('An error occurred while adding the new creator.');
    } finally {
      setIsAddingNewCreator(false);
    }
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

  return (
    <div className="home-container">
    <h1>Welcome {user.firstName} </h1>
    <h2>Creator</h2>
    <div className="creator-info">
      <span className="creator-name">{currentCreator}</span>
      
      <span className="creator-platform">{getPlatformIcon()}{currentCreatorPlatform} </span>
    </div>
    <div className="card">
      <h3>Add to already existing creator</h3>
      <select onChange={handleCreatorChange} value={selectedCreator ? selectedCreator.id : ''}>
        <option value="">Select a Creator</option>
        {businessCreators && businessCreators.sort((a, b) => a.legalName.localeCompare(b.legalName)).map((creator) => (
          <option key={creator.id} value={creator.id}>{creator.legalName}</option>
        ))}
      </select>
      <button onClick={handleAddClick} className="action-button">Add</button>
    </div>
    <div className="card">
      <h3>Create a new creator</h3>
      <input
        type="text"
        placeholder="Name"
        value={newCreatorName}
        onChange={(e) => setNewCreatorName(e.target.value)}
      />
      <button onClick={handleAddNewCreator} className="action-button" disabled={isAddingNewCreator}>
        {isAddingNewCreator ? 'Creating...' : 'Create'}
      </button>
    </div>
      {isConfirmationDialogOpen && (
        <Dialog open={isConfirmationDialogOpen} onOpenChange={() => setIsConfirmationDialogOpen(false)}>
          <DialogOverlay className="dialog-overlay" />
          <DialogContent className="dialog-content">
            <DialogTitle className="dialog-title">Overwrite Existing Handle?</DialogTitle>
            <div className="dialog-message">
              Are you sure you want to overwrite the existing {platformToOverwrite} handle for this creator?
            </div>
            <div className="dialog-actions">
              <button onClick={handleConfirmationDialogClose} className="dialog-button">Cancel</button>
              <button onClick={handleConfirmationDialogConfirm} className="dialog-button dialog-button-confirm">Confirm</button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Home;
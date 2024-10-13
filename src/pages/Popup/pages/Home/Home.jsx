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
            {businessCreators.sort((a, b) => a.legalName.localeCompare(b.legalName)).map((creator) => (
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
          
          <div className="mt-4">
            <h3>Add New Creator</h3>
            <input 
              type="text" 
              value={newCreatorName} 
              onChange={(e) => setNewCreatorName(e.target.value)} 
              placeholder="Enter new creator name"
              className="border p-2 mr-2"
            />
            <button 
              onClick={handleAddNewCreator} 
              disabled={isAddingNewCreator}
              className="bg-blue-500 text-white p-2 rounded"
            >
              {isAddingNewCreator ? 'Adding...' : 'Add New Creator'}
            </button>
          </div>

          {isConfirmationDialogOpen && (
            <Dialog open={isConfirmationDialogOpen} onOpenChange={() => setIsConfirmationDialogOpen(false)}>
              <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
              <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
                <DialogTitle className="text-lg font-bold mb-4">Overwrite Existing Handle?</DialogTitle>
                <div className="mb-4">
                  Are you sure you want to overwrite the existing {platformToOverwrite} handle for this creator?
                </div>
                <div className="dialog-footer flex justify-end space-x-4">
                  <button 
                    onClick={handleConfirmationDialogClose}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmationDialogConfirm}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Confirm
                  </button> 
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
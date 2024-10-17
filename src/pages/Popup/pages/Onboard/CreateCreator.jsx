import React, { useState, useEffect } from 'react';
import './CreateCreator.css';
import { useGlobalState } from '../../../../lib/state/GlobalStateProvider';
import ApiClient from '../../../../lib/api/apiclient';
import wordmark from '../../../../assets/img/wordmark.png';
import Button from '../../../../components/common/basics/button';
import CountrySelectInput from '../../../../components/common/forms/CountrySelectInput';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { fetchCreators } from '../../../../lib/api/fetchcreators';

const CreateCreator = ({ onBack }) => {
  const [creatorName, setCreatorName] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [countries, setCountries] = useState([]);
  const [showNewCreatorFields, setShowNewCreatorFields] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState('');
  const { currentCreatorPlatform, selectedBusiness, setBusinessCreators, currentCreatorURL, businessCreators } = useGlobalState();



  useEffect(() => {
    if (currentCreatorPlatform === 'Instagram') {
      setInstagramLink(currentCreatorURL);
    } else if (currentCreatorPlatform === 'YouTube') {
      setYoutubeLink(currentCreatorURL);
    } else if (currentCreatorPlatform === 'TikTok') {
      setTiktokLink(currentCreatorURL);
    }
    // Fetch creators if not already available and selectedBusiness is not null
    if (selectedBusiness && (!businessCreators || businessCreators.length === 0)) {
      fetchCreators(selectedBusiness.id).then(creators => {
        setBusinessCreators(creators);
      });
    }
  }, [currentCreatorPlatform, currentCreatorURL, selectedBusiness, setBusinessCreators, businessCreators]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showNewCreatorFields) {
        const response = await ApiClient.post(`v1/businesses/${selectedBusiness.id}/addCreator`, {
          legalName: creatorName,
          instagramHandle: instagramLink,
          youtubeHandle: youtubeLink,
          tiktokHandle: tiktokLink,
          countries: countries,
        });
        if (response.status === 200) {
          alert('New creator added successfully!');
          setBusinessCreators(prev => [...prev, response.data]);
          onBack();
        } else {
          alert('Error adding new creator. Please try again.');
        }
      } else {
        // Add to existing creator logic
        const platformHandle = `${currentCreatorPlatform.toLowerCase()}Handle`;
        const response = await ApiClient.post(`v1/businesses/${selectedBusiness.id}/creator/edit/${selectedCreator}`, {
          [platformHandle]: currentCreatorURL,
        });
        if (response.status === 200) {
          alert('Creator updated successfully!');
          setBusinessCreators(prevCreators => prevCreators.map(creator => {
            if (creator.id === selectedCreator) {
              return { ...creator, [platformHandle]: currentCreatorURL };
            }
            return creator;
          }));
          onBack();
        } else {
          alert('Error updating creator. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="create-creator-container">
      <img src={wordmark} alt="Wordmark" style={{ width: '60%', marginBottom: '10px' }} />
      <h1>Add creator</h1>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <h3>Add to an existing creator</h3>
          <select 
            value={selectedCreator} 
            onChange={(e) => setSelectedCreator(e.target.value)}
            className="creator-select"
          >
            <option value="">Select a Creator</option>
            {businessCreators && businessCreators.sort((a, b) => a.legalName.localeCompare(b.legalName)).map((creator) => (
              <option key={creator.id} value={creator.id}>{creator.legalName}</option>
            ))}
          </select>
        </div>

        <div className="card">
          <div 
            className="new-creator-header" 
            onClick={() => setShowNewCreatorFields(!showNewCreatorFields)}
          >
            <h3>Create a new creator</h3>
            {showNewCreatorFields ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {showNewCreatorFields && (
            <div className="new-creator-fields">
              <div className="form-group">
                <label htmlFor="creatorName">Creator Name</label>
                <input
                  id="creatorName"
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="instagramLink">Instagram Link</label>
                <input
                  id="instagramLink"
                  type="text"
                  value={instagramLink}
                  onChange={(e) => setInstagramLink(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="youtubeLink">Youtube Link</label>
                <input
                  id="youtubeLink"
                  type="text"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tiktokLink">Tiktok Link</label>
                <input
                  id="tiktokLink"
                  type="text"
                  value={tiktokLink}
                  onChange={(e) => setTiktokLink(e.target.value)}
                />
              </div>
              <CountrySelectInput
                label="What countries is this creator associated with?"
                onChange={(selectedCountries) => setCountries(selectedCountries)}
                initialSelectedValues={countries}
                isInvalid={false}
                errorMessage=""
              />
            </div>
          )}
        </div>
        <Button type="submit" className="action-button">
          {showNewCreatorFields ? 'Create New Creator' : 'Add to Existing Creator'}
        </Button>
      </form>
      <Button onClick={onBack} className="back-button">Back</Button>
    </div>
  );
};

export default CreateCreator;
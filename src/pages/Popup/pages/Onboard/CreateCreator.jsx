import React, { useState, useEffect } from 'react';
import './CreateCreator.css';
import { useGlobalState } from '../../../../lib/state/GlobalStateProvider';
import ApiClient from '../../../../lib/api/apiclient';
import wordmark from '../../../../assets/img/wordmark.png';
import Button from '../../../../components/common/basics/button';

const CreateCreator = ({ onBack }) => {

  const [creatorName, setCreatorName] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [countries, setCountries] = useState([]);
  const { currentCreatorPlatform, selectedBusiness, setBusinessCreators, currentCreatorURL } = useGlobalState();

  useEffect(() => {
    if (currentCreatorPlatform === 'Instagram') {
      setInstagramLink(currentCreatorURL);
    } else if (currentCreatorPlatform === 'YouTube') {
      setYoutubeLink(currentCreatorURL);
    } else if (currentCreatorPlatform === 'TikTok') {
      setTiktokLink(currentCreatorURL);
    }
  }, [currentCreatorPlatform, currentCreatorURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
    } catch (error) {
      console.error('Error adding new creator:', error.message);
      alert('An error occurred while adding the new creator.');
    }
  };

  return (
    <div className="create-creator-container">
      <img src={wordmark} alt="Wordmark" style={{ width: '60%', marginBottom: '10px' }} />
      <h1>Add creators</h1>
      <form onSubmit={handleSubmit}>
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
        <div className="form-group">
          <label htmlFor="countries">What countries is this creator associated with?</label>
          <select
            id="countries"
            multiple
            value={countries}
            onChange={(e) => setCountries(Array.from(e.target.selectedOptions, option => option.value))}
          >
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            {/* Add more country options as needed */}
          </select>
        </div>
        <Button type="submit" className="action-button">Submit</Button>
      </form>
      <Button onClick={onBack} className="back-button">Back</Button>
    </div>
  );
};

export default CreateCreator;
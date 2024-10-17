import React from 'react';
import './CreatorCard.css';
import Button from './basics/button';
import Divider from './Divider';

const CreatorCard = ({ creator, onSave }) => {
  return (
    <div className="creator-card">
      <div className="creator-header">
        <img src={creator.image} alt={creator.name} className="creator-image" />
        <div className="creator-info">
          <h2>{creator.name}</h2>
        </div>
      </div>
      <div className="creator-labels">
        <div className="label-group">
          <span className="label">Content</span>
          <span className="label">Label</span>
          <span className="label">Label</span>
        </div>
        <div className="label-group">
          <span className="label">Industry</span>
          <span className="label">Label</span>
          <span className="label">Label</span>
        </div>
      </div>
      <Divider />
      <div className="creator-actions">
        <Button onClick={onSave} className="save-button">
          Save to Superstar
        </Button>
      </div>
    </div>
  );
};

export default CreatorCard;

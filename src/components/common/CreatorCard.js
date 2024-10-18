import React from 'react';
import './CreatorCard.css';
import Button from './basics/button';
import Divider from './Divider';
import PlusSquare from '@untitled-ui/icons-react/build/esm/PlusSquare';

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
          {creator.categories.map((category, index) => (
            <span key={index} className="label">
              {category}
            </span>
          ))}
        </div>
        <div className="label-group">
          <span className="label">Industries</span>
          {creator.industries.map((industry, index) => (
            <span key={index} className="label">
              {industry}
            </span>
          ))}
        </div>
      </div>
      <Divider />
      <div className="creator-actions">
        <Button onClick={onSave} className="save-button" icon={<PlusSquare />}>
          Save to Superstar
        </Button>
      </div>
    </div>
  );
};

export default CreatorCard;

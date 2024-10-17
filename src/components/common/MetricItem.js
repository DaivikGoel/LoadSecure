import React from 'react';
import './MetricItem.css';

const MetricItem = ({ icon, value, label, growth }) => {
  return (
    <div className="metric-item">
      <div className="metric-header">
        {icon && <span className="metric-icon">{icon}</span>}
        <span className="metric-value">{value}</span>
        {growth && (
          <span
            className={`metric-growth ${growth > 0 ? 'positive' : 'negative'}`}
          >
            {growth}%
          </span>
        )}
      </div>
      <p className="metric-label">{label}</p>
    </div>
  );
};

export default MetricItem;

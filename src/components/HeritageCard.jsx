import React from 'react';
import '../Style/HeritageCard.css';

export default function HeritageCard({ title, location, image }) {
  return (
    <div className="heritage-card">
      <img src={image} alt={title} />
      <div className="heritage-card-overlay">
        <h3 className="heritage-card-title">{title}</h3>
        <p className="heritage-card-location">{location}</p>
      </div>
    </div>
  );
}
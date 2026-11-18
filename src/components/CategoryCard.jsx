import React from 'react';
import '../Style/CategoryCard.css';

export default function CategoryCard({ title, image }) {
  return (
    <div className="category-card">
      <img src={image} alt={title} />
      <div className="category-card-overlay">
        <span className="category-card-title">{title}</span>
      </div>
    </div>
  );
}
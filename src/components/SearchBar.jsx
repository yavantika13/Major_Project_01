import React from 'react';
import '../Style/SearchBar.css';

export default function SearchBar({ placeholder }) {
  return (
    <div className="search-bar-wrapper">
      <input 
        type="text" 
        placeholder={placeholder || "Search places, art, festivals..."} 
        className="search-input"
      />
      <button className="search-submit-btn">🔍</button>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import heritagePlaces from "../data/heritagePlaces";
import "../Style/Explore.css";
import useFavorites from "../hooks/useFavorites";

export default function ExplorePage() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedRegion = searchParams.get("region");
  const searchQuery = searchParams.get("search");

  const [search, setSearch] = useState(searchQuery || "");
  const [activeCategory, setActiveCategory] = useState("All");

  const { toggleFavorite, isFavorite } = useFavorites();

  const categories = [
    "All",
    "Monuments",
    "Art & Culture",
    "Festivals",
    "Architecture"
  ];

  // Search, category and region filter
  const filteredPlaces = heritagePlaces.filter((place) => {

    const query = search.trim().toLowerCase();

    const matchesSearch =
      place.title?.toLowerCase().includes(query) ||
      place.location?.toLowerCase().includes(query) ||
      place.category?.toLowerCase().includes(query) ||
      place.description?.toLowerCase().includes(query);

    const matchesCategory =
      activeCategory === "All" ||
      place.category === activeCategory;

    const matchesRegion =
      !selectedRegion ||
      place.region?.toLowerCase() === selectedRegion.toLowerCase();

    return matchesSearch && matchesCategory && matchesRegion;
  });

  return (
    <div className="explore-page">

      {/* Page Heading */}
      <div className="explore-header">
        <span className="explore-tag">DISCOVER INDIA</span>

        <h1>Explore India's Heritage</h1>

        <p>
          Discover magnificent monuments, rich traditions,
          beautiful architecture and colourful festivals.
        </p>
      </div>

      {/* Search Bar */}
      <div className="explore-search">
        <span>🔍</span>

        <input
          type="text"
          placeholder="Search monuments, places, festivals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="explore-categories">

        {categories.map((category) => (
          <button
            key={category}
            className={
              activeCategory === category
                ? "category-btn active"
                : "category-btn"
            }
            onClick={() => {
              setActiveCategory(category);
              setSearch("");
            }}
          >
            {category}
          </button>
        ))}

      </div>

      {/* Heritage Places */}
      <div className="explore-results-heading">
        <h2>Discover Heritage Places</h2>
        <span>{filteredPlaces.length} Places Found</span>
      </div>

      <div className="explore-grid">

        {filteredPlaces.length > 0 ? (

          filteredPlaces.map((place) => (

            <div className="explore-card" key={place.id}>

              <img src={place.image} alt={place.title} />

              <button
                className="favorite-btn"
                onClick={() => toggleFavorite(place)}
              >
                {isFavorite(place.id) ? "❤️" : "🤍"}
              </button>

              <div className="explore-card-content">

                <span className="place-category">
                  {place.category}
                </span>

                <h3>{place.title}</h3>

                <p className="place-location">
                  📍 {place.location}
                </p>

                <p className="place-description">
                  {place.description}
                </p>

                <button
                  className="explore-more-btn"
                  onClick={() => navigate(`/place/${place.id}`)}
                >
                  Explore More →
                </button>

              </div>
            </div>

          ))

        ) : (

          <div className="no-results">
            <h3>No Heritage Places Found</h3>
            <p>Try searching with another place or category.</p>
          </div>

        )}

      </div>

    </div>
  );
}

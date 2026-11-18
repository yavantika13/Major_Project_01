
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import heritagePlaces from "../data/heritagePlaces";
import useFavorites from "../hooks/useFavorites";
import "../Style/HeritageDetails.css";

export default function HeritageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const place = heritagePlaces.find(
    (item) => item.id === Number(id)
  );

  if (!place) {
    return (
      <div className="details-not-found">
        <h2>Heritage Place Not Found</h2>
        <button onClick={() => navigate("/explore")}>
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="details-page">

      <button
        className="back-btn"
        onClick={() => navigate("/explore")}
      >
        ← Back to Explore
      </button>

      <div className="details-hero">
        <img src={place.image} alt={place.title} />

        <div className="details-title">
          <span>{place.category}</span>
          <h1>{place.title}</h1>
          <p>📍 {place.location}</p>
          <button className="details-favorite-btn" onClick={() => toggleFavorite(place)}>
                {isFavorite(place.id)
                ? "❤️ Remove from Favorites": "🤍 Add to Favorites"}
        </button>
        </div>
      </div>

      <div className="details-content">

        <section>
          <h2>About This Heritage</h2>
          <p>{place.description}</p>
        </section>

        <section>
          <h2>History</h2>
          <p>{place.history}</p>
        </section>

        <section>
          <h2>Architecture & Highlights</h2>
          <p>{place.architecture}</p>
        </section>

        <section className="visitor-info">
          <h2>Visitor Information</h2>
          <p><strong>Best Time to Visit:</strong> {place.bestTime}</p>
          <p><strong>Timings:</strong> {place.timings}</p>
        </section>

      </div>
    </div>
  );
}

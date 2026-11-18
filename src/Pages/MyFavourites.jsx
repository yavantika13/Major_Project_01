
import React from "react";
import useFavorites from "../hooks/useFavorites";
import "../Style/MyFavourites.css";

export default function MyFavourites() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="favorites-page">

      <div className="favorites-header">
        <span>YOUR COLLECTION</span>
        <h1>My Favourites ❤️</h1>
        <p>Your saved heritage places in one place.</p>
      </div>

      {favorites.length > 0 ? (

        <div className="favorites-grid">

          {favorites.map((place) => (

            <div className="favorite-card" key={place.id}>

              <img src={place.image} alt={place.title} />

              <div className="favorite-card-content">

                <span className="favorite-category">
                  {place.category}
                </span>

                <h3>{place.title}</h3>

                <p>📍 {place.location}</p>

                <p>{place.description}</p>

                <button
                  onClick={() => toggleFavorite(place)}
                >
                  ❤️ Remove from Favourites
                </button>

              </div>
            </div>

          ))}

        </div>

      ) : (

        <div className="empty-favorites">
          <h2>🤍 No Favourites Yet</h2>
          <p>
            Explore India's heritage and save your
            favourite places here.
          </p>
        </div>

      )}

    </div>
  );
}


import { useState, useEffect } from "react";

export default function useFavorites() {

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("bharatBytesFavorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "bharatBytesFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  const toggleFavorite = (place) => {
    setFavorites((currentFavorites) => {
      const alreadySaved = currentFavorites.some(
        (item) => item.id === place.id
      );

      if (alreadySaved) {
        return currentFavorites.filter(
          (item) => item.id !== place.id
        );
      }

      return [...currentFavorites, place];
    });
  };

  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
}

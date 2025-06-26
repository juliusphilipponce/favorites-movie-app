/**
 * Favorites Management Utilities
 * Handles localStorage operations for favorite movies
 */

const FAVORITES_KEY = 'movieapp_favorites';

/**
 * Get all favorite movies from localStorage
 */
export const getFavorites = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Add a movie to favorites
 */
export const addToFavorites = (movie) => {
  if (typeof window === 'undefined') return false;
  
  try {
    const favorites = getFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, movie];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

/**
 * Remove a movie from favorites
 */
export const removeFromFavorites = (movieId) => {
  if (typeof window === 'undefined') return false;
  
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

/**
 * Check if a movie is in favorites
 */
export const isFavorite = (movieId) => {
  if (typeof window === 'undefined') return false;
  
  try {
    const favorites = getFavorites();
    return favorites.some(movie => movie.id === movieId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

/**
 * Toggle favorite status of a movie
 */
export const toggleFavorite = (movie) => {
  if (isFavorite(movie.id)) {
    return removeFromFavorites(movie.id);
  } else {
    return addToFavorites(movie);
  }
};

/**
 * Clear all favorites
 */
export const clearFavorites = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }
};

/**
 * Get favorites count
 */
export const getFavoritesCount = () => {
  return getFavorites().length;
};

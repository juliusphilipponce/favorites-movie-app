/**
 * Enhanced Movie Grid Component for Favorites with removal animations
 */

"use client";

import { useState } from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

export default function FavoritesGrid({ 
  movies = [], 
  loading = false, 
  error = null, 
  onRetry = null,
  emptyMessage = "No favorite movies found",
  className = ""
}) {
  const [removingMovies, setRemovingMovies] = useState(new Set());

  const handleFavoriteRemoved = (movieId) => {
    // Add movie to removing set for visual feedback
    setRemovingMovies(prev => new Set([...prev, movieId]));
    
    // Remove from set after animation completes
    setTimeout(() => {
      setRemovingMovies(prev => {
        const newSet = new Set(prev);
        newSet.delete(movieId);
        return newSet;
      });
    }, 500);
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400">
          <svg className="w-20 h-20 mx-auto mb-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No favorites yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Start building your collection by clicking the heart icon on any movie you love!
          </p>
          <a
            href="/movies"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Browse Movies
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ${className}`}>
      {movies.map((movie) => (
        <div
          key={movie.id}
          className={`
            transition-all duration-500 ease-in-out
            ${removingMovies.has(movie.tmdbId || movie.id) 
              ? 'opacity-0 scale-75 transform translate-y-4' 
              : 'opacity-100 scale-100 transform translate-y-0'
            }
          `}
        >
          <MovieCard
            movie={movie}
            showFavoriteButton={true}
            favoriteButtonProps={{
              onFavoriteRemoved: handleFavoriteRemoved,
              showRemovalFeedback: true
            }}
            isRemoving={removingMovies.has(movie.tmdbId || movie.id)}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Movie Grid Component
 */

import MovieCard from './MovieCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

export default function MovieGrid({ 
  movies = [], 
  loading = false, 
  error = null, 
  onRetry = null,
  showFavoriteButton = true,
  emptyMessage = "No movies found",
  className = ""
}) {
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
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 7v10h6V7H9z" />
          </svg>
          <p className="text-lg">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 ${className}`}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          showFavoriteButton={showFavoriteButton}
        />
      ))}
    </div>
  );
}

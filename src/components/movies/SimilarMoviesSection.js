/**
 * Similar Movies Section Component
 * Displays movies similar to the current movie using the existing MovieGrid layout
 */

"use client";

import { useSimilarMovies } from '@/lib/hooks/useMovies';
import MovieCard from './MovieCard';
import { SimilarMoviesSkeleton } from '@/components/ui/SkeletonLoader';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function SimilarMoviesSection({ 
  movieId, 
  currentMovieTitle = "this movie",
  limit = 10,
  className = "" 
}) {
  const { movies, loading, error } = useSimilarMovies(movieId, limit);

  // Don't render if no movieId
  if (!movieId) return null;

  // Show loading skeleton
  if (loading) {
    return <SimilarMoviesSkeleton count={limit} />;
  }

  // Show error state
  if (error) {
    return (
      <section className={`mt-12 ${className}`}>
        <h2 className="text-2xl font-bold text-white mb-6">More Like This</h2>
        <ErrorMessage 
          message="Failed to load similar movies" 
          onRetry={() => window.location.reload()}
        />
      </section>
    );
  }

  // Don't render if no similar movies found
  if (!movies || movies.length === 0) {
    return (
      <section className={`mt-12 ${className}`}>
        <h2 className="text-2xl font-bold text-white mb-6">More Like This</h2>
        <div className="text-center py-8">
          <p className="text-gray-400">No similar movies found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`mt-12 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">More Like This</h2>
        {movies.length >= limit && (
          <span className="text-gray-400 text-sm">
            Showing {movies.length} similar movies
          </span>
        )}
      </div>

      {/* Movies Grid - Using same layout as MovieGrid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            showFavoriteButton={true}
            favoriteButtonProps={{
              size: "md",
              showRemovalFeedback: false
            }}
          />
        ))}
      </div>

      {/* Show hint if we have more movies available */}
      {movies.length < 5 && (
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Looking for more recommendations? Try exploring different genres or check out trending movies.
          </p>
        </div>
      )}
    </section>
  );
}

/**
 * Compact Similar Movies Section
 * A more compact version for smaller spaces
 */
export function CompactSimilarMoviesSection({ 
  movieId, 
  limit = 6,
  className = "" 
}) {
  const { movies, loading, error } = useSimilarMovies(movieId, limit);

  if (!movieId || loading || error || !movies?.length) return null;

  return (
    <section className={`mt-8 ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-4">You might also like</h3>
      
      {/* Horizontal scrollable grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {movies.slice(0, 6).map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-32 sm:w-40">
            <MovieCard
              movie={movie}
              showFavoriteButton={true}
              favoriteButtonProps={{
                size: "sm",
                showRemovalFeedback: false
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Similar Movies with Genre Filter
 * Shows similar movies filtered by specific genres
 */
export function SimilarMoviesByGenre({ 
  movieId, 
  genres = [],
  limit = 8,
  className = "" 
}) {
  const { movies, loading, error } = useSimilarMovies(movieId, limit * 2); // Get more to filter

  if (!movieId || loading || error) return null;

  // Filter movies by genres if provided
  const filteredMovies = genres.length > 0 
    ? movies.filter(movie => 
        movie.genre_ids?.some(genreId => 
          genres.some(genre => genre.id === genreId)
        )
      ).slice(0, limit)
    : movies.slice(0, limit);

  if (!filteredMovies.length) return null;

  const genreNames = genres.map(g => g.name).join(', ');

  return (
    <section className={`mt-12 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-2">
        More {genreNames} Movies
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Similar movies in the {genreNames.toLowerCase()} genre{genres.length > 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            showFavoriteButton={true}
            favoriteButtonProps={{
              size: "md",
              showRemovalFeedback: false
            }}
          />
        ))}
      </div>
    </section>
  );
}

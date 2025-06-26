/**
 * Movie Section Component
 * Displays a section of movies with a title and optional "View All" link
 */

import Link from 'next/link';
import MovieGrid from './MovieGrid';
import { CompactFilterIndicator } from '@/components/ui/FilterStatusIndicator';

export default function MovieSection({
  title,
  movies = [],
  loading = false,
  error = null,
  onRetry = null,
  viewAllLink = null,
  showFavoriteButton = true,
  maxItems = null,
  emptyMessage = "No movies found",
  className = "",
  // Filter-related props
  isFiltered = false,
  originalCount = 0,
  filteredCount = 0
}) {
  // Limit the number of items if maxItems is specified
  const displayMovies = maxItems ? movies.slice(0, maxItems) : movies;

  return (
    <section className={`mb-12 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {isFiltered && (
            <CompactFilterIndicator
              originalCount={originalCount}
              filteredCount={filteredCount}
            />
          )}
        </div>
        {viewAllLink && movies.length > 0 && (
          <Link
            href={viewAllLink}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 flex items-center space-x-1"
          >
            <span>View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Movies Grid */}
      <MovieGrid
        movies={displayMovies}
        loading={loading}
        error={error}
        onRetry={onRetry}
        showFavoriteButton={showFavoriteButton}
        emptyMessage={emptyMessage}
      />

      {/* Show more indicator if items are limited */}
      {maxItems && movies.length > maxItems && (
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Showing {maxItems} of {movies.length} movies
          </p>
          {viewAllLink && (
            <Link 
              href={viewAllLink}
              className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              View All {movies.length} Movies
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

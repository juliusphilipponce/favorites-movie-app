"use client";

import { usePopularMovies, useTrendingMovies } from '@/lib/hooks/useMovies';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import MovieSection from '@/components/movies/MovieSection';

export default function Home() {
  const {
    movies: popularMovies,
    loading: popularLoading,
    error: popularError,
    isFiltered: popularFiltered,
    originalCount: popularOriginalCount,
    filteredCount: popularFilteredCount
  } = usePopularMovies();

  const {
    movies: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
    isFiltered: trendingFiltered,
    originalCount: trendingOriginalCount,
    filteredCount: trendingFilteredCount
  } = useTrendingMovies();

  const { favorites } = useFavoritesContext();

  return (
    <div className="w-full max-w-none md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Welcome to MovieApp
        </h1>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          Your one-stop destination for all things movies! Discover popular films,
          trending releases, and build your personal favorites collection.
        </p>
      </div>

      {/* Favorites Section - Only show if user has favorites */}
      {favorites.length > 0 && (
        <MovieSection
          title="Your Favorites"
          movies={favorites}
          viewAllLink="/favorites"
          maxItems={10}
          emptyMessage="No favorite movies yet"
          className="mb-16"
        />
      )}

      {/* Trending Movies Section */}
      <MovieSection
        title="Trending Today"
        movies={trendingMovies}
        loading={trendingLoading}
        error={trendingError}
        viewAllLink="/movies?category=trending"
        maxItems={10}
        className="mb-16"
        isFiltered={trendingFiltered}
        originalCount={trendingOriginalCount}
        filteredCount={trendingFilteredCount}
      />

      {/* Popular Movies Section */}
      <MovieSection
        title="Popular Movies"
        movies={popularMovies}
        loading={popularLoading}
        error={popularError}
        viewAllLink="/movies?category=popular"
        maxItems={10}
        isFiltered={popularFiltered}
        originalCount={popularOriginalCount}
        filteredCount={popularFilteredCount}
      />
    </div>
  );
}

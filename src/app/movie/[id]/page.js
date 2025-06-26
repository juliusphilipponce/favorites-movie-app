"use client";

import { useParams, useRouter } from 'next/navigation';
import { useMovieDetails, useMovieCredits } from '@/lib/hooks/useMovies';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { useSession } from 'next-auth/react';
import MovieDetailHeader from '@/components/movies/MovieDetailHeader';
import MovieCastSection from '@/components/movies/MovieCastSection';
import SimilarMoviesSection from '@/components/movies/SimilarMoviesSection';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { MovieDetailSkeleton, CastSkeleton } from '@/components/ui/SkeletonLoader';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const movieId = params.id;

  const { movie, loading: movieLoading, error: movieError } = useMovieDetails(movieId);
  const { credits, loading: creditsLoading, error: creditsError } = useMovieCredits(movieId);
  const { favorites, toggleFavorite } = useFavoritesContext();

  const isLoading = movieLoading || creditsLoading;
  const hasError = movieError || creditsError;
  // Check if movie is favorite by comparing TMDB ID
  const isFavorite = session && movie && favorites.some(fav =>
    fav.tmdbId === movie.id || fav.id === parseInt(movieId)
  );

  const handleGoBack = () => {
    router.back();
  };

  const handleToggleFavorite = async () => {
    if (!session || !movie) return;

    try {
      // Prepare movie data for the API
      const movieData = {
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        runtime: movie.runtime,
        genres: movie.genres?.map(g => g.name) || [],
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        popularity: movie.popularity,
        adult: movie.adult,
        originalLanguage: movie.original_language,
        originalTitle: movie.original_title,
      };

      // Use TMDB ID and movie data
      await toggleFavorite(movie.id, movieData);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Back Navigation Skeleton */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-700 rounded mr-1 sm:mr-2 animate-pulse" />
              <div className="w-20 sm:w-32 h-4 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Movie Detail Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MovieDetailSkeleton />
          <CastSkeleton />
        </div>
      </div>
    );
  }

  if (hasError || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <ErrorMessage 
            message={movieError || creditsError || "Movie not found"} 
            onRetry={() => window.location.reload()}
          />
          <div className="mt-6 text-center">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Navigation */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="w-full max-w-none md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-2 py-1 text-sm sm:text-base"
            aria-label="Go back to previous page"
          >
            <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Movies</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </div>

      {/* Movie Detail Content */}
      <div className="w-full max-w-none md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MovieDetailHeader 
          movie={movie}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
          showFavoriteButton={!!session}
        />

        {/* Cast Section */}
        {credits && credits.cast && credits.cast.length > 0 && (
          <MovieCastSection cast={credits.cast} />
        )}

        {/* Similar Movies Section */}
        <SimilarMoviesSection
          movieId={movieId}
          currentMovieTitle={movie.title}
          limit={10}
        />
      </div>
    </div>
  );
}

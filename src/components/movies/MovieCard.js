/**
 * Movie Card Component
 */

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getImageUrl } from '@/lib/api/tmdb';
import FavoriteButton from './FavoriteButton';

export default function MovieCard({
  movie,
  showFavoriteButton = true,
  favoriteButtonProps = {},
  isRemoving = false
}) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  // Handle both TMDB API format (poster_path) and database format (posterPath)
  const posterPath = movie.poster_path || movie.posterPath;
  const backdropPath = movie.backdrop_path || movie.backdropPath;
  const releaseDate = movie.release_date || movie.releaseDate;
  const voteAverage = movie.vote_average || movie.voteAverage;
  const voteCount = movie.vote_count || movie.voteCount;

  return (
    <div className={`
      bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl
      transition-all duration-300 hover:scale-105 group relative
      ${isRemoving ? 'opacity-50 scale-95 pointer-events-none' : ''}
    `}>
      <Link href={`/movie/${movie.tmdbId || movie.id}`} className="block">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] bg-gray-700">
          {!imageError && posterPath && getImageUrl(posterPath, 'w500') ? (
            <Image
              src={getImageUrl(posterPath, 'w500')}
              alt={movie.title}
              fill
              className="object-cover"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-xs">No Image</p>
              </div>
            </div>
          )}

          {/* Rating Badge */}
          {voteAverage > 0 && (
            <div className="absolute bottom-2 left-2 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
              ⭐ {formatRating(voteAverage)}
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
            <span>{formatDate(releaseDate)}</span>
            {voteCount > 0 && (
              <span>{voteCount} votes</span>
            )}
          </div>

          {movie.overview && (
            <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
              {movie.overview}
            </p>
          )}
        </div>
      </Link>

      {/* Favorite Button - Outside the link to prevent nested interactive elements */}
      {showFavoriteButton && (
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton
            movie={movie}
            size="md"
            className="backdrop-blur-sm"
            {...favoriteButtonProps}
          />
        </div>
      )}
    </div>
  );
}

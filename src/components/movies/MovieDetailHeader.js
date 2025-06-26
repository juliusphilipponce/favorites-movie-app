/**
 * Movie Detail Header Component
 * Displays the main movie information including poster, title, details, and overview
 */

"use client";

import Image from 'next/image';
import { useState } from 'react';
import { getImageUrl, formatRuntime, formatReleaseDate, formatVoteAverage } from '@/lib/api/tmdb';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function MovieDetailHeader({ 
  movie, 
  isFavorite = false, 
  onToggleFavorite, 
  showFavoriteButton = true 
}) {
  const [imageError, setImageError] = useState(false);
  const [backdropError, setBackdropError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleBackdropError = () => {
    setBackdropError(true);
  };

  const posterPath = movie.poster_path;
  const backdropPath = movie.backdrop_path;

  return (
    <div className="relative">
      {/* Backdrop Image */}
      {!backdropError && backdropPath && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={getImageUrl(backdropPath, 'w1280')}
            alt=""
            fill
            className="object-cover opacity-20"
            onError={handleBackdropError}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 py-6 sm:py-8">
        {/* Movie Poster */}
        <div className="lg:col-span-1">
          <div className="relative aspect-[2/3] max-w-xs sm:max-w-sm mx-auto lg:mx-0 bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
            {!imageError && posterPath ? (
              <Image
                src={getImageUrl(posterPath, 'w500')}
                alt={movie.title}
                fill
                className="object-cover"
                onError={handleImageError}
                priority
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-sm">No Image Available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Movie Information */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Title and Favorite Button */}
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 leading-tight">
                {movie.title}
              </h1>
              {movie.original_title && movie.original_title !== movie.title && (
                <p className="text-lg sm:text-xl text-gray-400 italic">
                  {movie.original_title}
                </p>
              )}
            </div>
            
            {showFavoriteButton && (
              <button
                onClick={onToggleFavorite}
                className="flex-shrink-0 p-3 rounded-full bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-all duration-200" />
                )}
              </button>
            )}
          </div>

          {/* Movie Details */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-gray-300">
            {movie.release_date && (
              <span className="bg-gray-800/50 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                {formatReleaseDate(movie.release_date)}
              </span>
            )}

            {movie.runtime && (
              <span className="bg-gray-800/50 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                {formatRuntime(movie.runtime)}
              </span>
            )}

            {movie.vote_average > 0 && (
              <span className="bg-blue-600/80 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-white">
                ⭐ {formatVoteAverage(movie.vote_average)}
              </span>
            )}

            {movie.vote_count > 0 && (
              <span className="text-xs sm:text-sm text-gray-400">
                {movie.vote_count.toLocaleString()} votes
              </span>
            )}
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-700/50 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-600/50"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          {movie.overview && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Overview</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {movie.overview}
              </p>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {movie.status && (
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="ml-2 text-white">{movie.status}</span>
              </div>
            )}
            
            {movie.original_language && (
              <div>
                <span className="text-gray-400">Language:</span>
                <span className="ml-2 text-white uppercase">{movie.original_language}</span>
              </div>
            )}
            
            {movie.budget > 0 && (
              <div>
                <span className="text-gray-400">Budget:</span>
                <span className="ml-2 text-white">${movie.budget.toLocaleString()}</span>
              </div>
            )}
            
            {movie.revenue > 0 && (
              <div>
                <span className="text-gray-400">Revenue:</span>
                <span className="ml-2 text-white">${movie.revenue.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

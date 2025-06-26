'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useFavoritesContext } from '@/contexts/FavoritesContext'

export default function FavoriteButton({
  movie,
  size = 'md',
  showText = false,
  className = '',
  onFavoriteRemoved = null,
  showRemovalFeedback = false
}) {
  const { data: session } = useSession()
  const { isFavorite, toggleFavorite } = useFavoritesContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      // Redirect to sign in if not authenticated
      window.location.href = '/auth/signin'
      return
    }

    if (isLoading) return

    const wasAlreadyFavorite = isMovieFavorite

    try {
      setIsLoading(true)

      // Prepare movie data for the API
      // Handle different data formats (TMDB API vs Database)
      let genres = [];
      if (movie.genres) {
        if (Array.isArray(movie.genres)) {
          // TMDB API format: array of objects or strings
          genres = movie.genres.map(g => typeof g === 'string' ? g : g.name);
        } else if (typeof movie.genres === 'string') {
          // Database format: comma-separated string
          genres = movie.genres.split(',').map(g => g.trim()).filter(g => g);
        }
      }

      const movieData = {
        tmdbId: movie.tmdbId || movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date || movie.releaseDate ? new Date(movie.release_date || movie.releaseDate) : null,
        posterPath: movie.poster_path || movie.posterPath,
        backdropPath: movie.backdrop_path || movie.backdropPath,
        runtime: movie.runtime,
        genres: genres,
        voteAverage: movie.vote_average || movie.voteAverage,
        voteCount: movie.vote_count || movie.voteCount,
        popularity: movie.popularity,
        adult: movie.adult,
        originalLanguage: movie.original_language || movie.originalLanguage,
        originalTitle: movie.original_title || movie.originalTitle,
      }

      // Use TMDB ID for the API call
      const tmdbId = movie.tmdbId || movie.id;
      await toggleFavorite(tmdbId, movieData)

      // If we removed from favorites and have a callback, trigger it with delay for animation
      if (wasAlreadyFavorite && onFavoriteRemoved && showRemovalFeedback) {
        setTimeout(() => {
          onFavoriteRemoved(tmdbId)
        }, 300) // Delay to allow for visual feedback
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Failed to update favorites. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Use TMDB ID for checking favorite status
  const tmdbId = movie.tmdbId || movie.id;
  const isMovieFavorite = isFavorite(tmdbId)

  // Size configurations
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const buttonClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`
        ${buttonClasses[size]}
        rounded-full
        transition-all duration-200
        ${isMovieFavorite 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-red-400'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
        ${!session ? 'hover:bg-blue-600' : ''}
        ${className}
      `}
      title={
        !session 
          ? 'Sign in to add favorites' 
          : isMovieFavorite 
            ? 'Remove from favorites' 
            : 'Add to favorites'
      }
    >
      <div className="flex items-center space-x-1">
        {isLoading ? (
          <svg 
            className={`${sizeClasses[size]} animate-spin`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        ) : (
          <svg 
            className={sizeClasses[size]} 
            fill={isMovieFavorite ? "currentColor" : "none"} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        )}
        
        {showText && (
          <span className="text-sm font-medium">
            {!session 
              ? 'Sign in' 
              : isMovieFavorite 
                ? 'Favorited' 
                : 'Favorite'
            }
          </span>
        )}
      </div>
    </button>
  )
}

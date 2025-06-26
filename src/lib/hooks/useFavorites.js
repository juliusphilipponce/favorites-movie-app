/**
 * Custom hook for managing favorite movies with authentication
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export function useFavorites() {
  const { data: session, status } = useSession()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/favorites')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch favorites')
      }

      setFavorites(result.data || [])
    } catch (err) {
      console.error('Error fetching favorites:', err)
      setError(err.message)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch favorites when user is authenticated
  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      setFavorites([])
      setLoading(false)
      return
    }

    fetchFavorites()
  }, [session, status, fetchFavorites])

  const addToFavorites = async (movieId, movieData = null) => {
    if (!session) {
      throw new Error('Authentication required')
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId,
          movieData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add to favorites')
      }

      // Update local state
      setFavorites(prev => [result.data, ...prev])
      return result.data
    } catch (err) {
      console.error('Error adding to favorites:', err)
      throw err
    }
  }

  const removeFromFavorites = async (movieId) => {
    if (!session) {
      throw new Error('Authentication required')
    }

    try {
      const response = await fetch(`/api/favorites/${movieId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove from favorites')
      }

      // Update local state - movieId is TMDB ID, filter by tmdbId
      setFavorites(prev => prev.filter(movie => movie.tmdbId !== parseInt(movieId)))
      return result
    } catch (err) {
      console.error('Error removing from favorites:', err)
      throw err
    }
  }

  const clearAllFavorites = async () => {
    if (!session) {
      throw new Error('Authentication required')
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to clear favorites')
      }

      // Update local state
      setFavorites([])
      return result
    } catch (err) {
      console.error('Error clearing favorites:', err)
      throw err
    }
  }

  const isFavorite = (movieId) => {
    // movieId is TMDB ID, check against tmdbId in favorites
    return favorites.some(movie => movie.tmdbId === parseInt(movieId))
  }

  const toggleFavorite = async (movieId, movieData = null) => {
    if (isFavorite(movieId)) {
      return await removeFromFavorites(movieId)
    } else {
      return await addToFavorites(movieId, movieData)
    }
  }

  return {
    favorites,
    loading,
    error,
    favoritesCount: favorites.length,
    isAuthenticated: !!session,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
    // Legacy method names for backward compatibility
    addFavorite: addToFavorites,
    removeFavorite: removeFromFavorites,
    toggleFavoriteStatus: toggleFavorite,
    checkIsFavorite: isFavorite,
  }
}

/**
 * Movie Filtering Service
 * Centralized service for applying user preferences to movie data
 */

import { filterMoviesByPreferences, getFilterSummary } from '@/lib/constants/genres'

/**
 * Get user preferences for movie filtering
 */
export async function getUserMoviePreferences(userId = null) {
  if (!userId) return null

  try {
    const response = await fetch('/api/user/preferences')
    if (!response.ok) return null
    
    const data = await response.json()
    return data.preferences
  } catch (error) {
    console.error('Failed to fetch user preferences:', error)
    return null
  }
}

/**
 * Apply user preferences to filter a list of movies
 */
export function applyMovieFilters(movies, userPreferences) {
  if (!movies || !Array.isArray(movies)) return []
  if (!userPreferences || !userPreferences.advancedFilteringEnabled) return movies

  return filterMoviesByPreferences(movies, userPreferences)
}

/**
 * Filter movies with client-side preferences (for hooks)
 */
export function filterMoviesWithPreferences(movies, preferences) {
  if (!preferences || !preferences.advancedFilteringEnabled) {
    return {
      filteredMovies: movies,
      isFiltered: false,
      filterSummary: null
    }
  }

  const filteredMovies = filterMoviesByPreferences(movies, preferences)
  const filterSummary = getFilterSummary(preferences)

  return {
    filteredMovies,
    isFiltered: true,
    filterSummary,
    originalCount: movies.length,
    filteredCount: filteredMovies.length
  }
}

/**
 * Create TMDB API parameters for genre filtering
 */
export function createTMDBFilterParams(userPreferences) {
  if (!userPreferences || !userPreferences.advancedFilteringEnabled) {
    return {}
  }

  const params = {}
  
  // Add preferred genres to with_genres parameter
  if (userPreferences.preferredGenres) {
    const preferredGenres = JSON.parse(userPreferences.preferredGenres)
    if (preferredGenres.length > 0) {
      params.with_genres = preferredGenres.join(',')
    }
  }

  // Add excluded genres to without_genres parameter
  if (userPreferences.excludedGenres) {
    const excludedGenres = JSON.parse(userPreferences.excludedGenres)
    if (excludedGenres.length > 0) {
      params.without_genres = excludedGenres.join(',')
    }
  }

  return params
}

/**
 * Enhanced movie fetching with user preferences
 */
export async function fetchMoviesWithFiltering(fetchFunction, userPreferences, ...args) {
  try {
    // Get base movies from the fetch function
    const movies = await fetchFunction(...args)
    
    // Apply client-side filtering if needed
    const result = filterMoviesWithPreferences(movies, userPreferences)
    
    return {
      ...result,
      error: null
    }
  } catch (error) {
    return {
      filteredMovies: [],
      isFiltered: false,
      filterSummary: null,
      originalCount: 0,
      filteredCount: 0,
      error: error.message
    }
  }
}

/**
 * Check if filtering is active for a user
 */
export function isFilteringActive(userPreferences) {
  return userPreferences && userPreferences.advancedFilteringEnabled
}

/**
 * Get filter status for UI display
 */
export function getFilterStatus(userPreferences) {
  if (!isFilteringActive(userPreferences)) {
    return {
      isActive: false,
      message: 'No filters applied'
    }
  }

  const summary = getFilterSummary(userPreferences)
  if (!summary) {
    return {
      isActive: false,
      message: 'No filters applied'
    }
  }

  let message = 'Filtering active'
  const parts = []

  if (summary.preferredCount > 0) {
    parts.push(`${summary.preferredCount} preferred genre${summary.preferredCount > 1 ? 's' : ''}`)
  }

  if (summary.excludedCount > 0) {
    parts.push(`${summary.excludedCount} excluded genre${summary.excludedCount > 1 ? 's' : ''}`)
  }

  if (parts.length > 0) {
    message += `: ${parts.join(', ')}`
  }

  return {
    isActive: true,
    message,
    summary
  }
}

/**
 * Create a filter indicator component data
 */
export function createFilterIndicator(userPreferences, originalCount, filteredCount) {
  const status = getFilterStatus(userPreferences)
  
  if (!status.isActive) return null

  return {
    isActive: true,
    message: status.message,
    originalCount,
    filteredCount,
    hiddenCount: originalCount - filteredCount,
    summary: status.summary
  }
}

/**
 * Validate and sanitize user preferences
 */
export function sanitizeUserPreferences(preferences) {
  if (!preferences) return null

  const sanitized = {
    advancedFilteringEnabled: Boolean(preferences.advancedFilteringEnabled),
    preferredGenres: null,
    excludedGenres: null
  }

  // Safely parse JSON strings
  try {
    if (preferences.preferredGenres) {
      const parsed = typeof preferences.preferredGenres === 'string' 
        ? JSON.parse(preferences.preferredGenres)
        : preferences.preferredGenres
      
      if (Array.isArray(parsed) && parsed.every(id => typeof id === 'number')) {
        sanitized.preferredGenres = JSON.stringify(parsed)
      }
    }
  } catch (error) {
    console.warn('Invalid preferredGenres format:', error)
  }

  try {
    if (preferences.excludedGenres) {
      const parsed = typeof preferences.excludedGenres === 'string'
        ? JSON.parse(preferences.excludedGenres)
        : preferences.excludedGenres
      
      if (Array.isArray(parsed) && parsed.every(id => typeof id === 'number')) {
        sanitized.excludedGenres = JSON.stringify(parsed)
      }
    }
  } catch (error) {
    console.warn('Invalid excludedGenres format:', error)
  }

  return sanitized
}

/**
 * Create a context for movie filtering throughout the app
 */
export class MovieFilterContext {
  constructor(userPreferences) {
    this.preferences = sanitizeUserPreferences(userPreferences)
    this.isActive = isFilteringActive(this.preferences)
  }

  filterMovies(movies) {
    return filterMoviesWithPreferences(movies, this.preferences)
  }

  getStatus() {
    return getFilterStatus(this.preferences)
  }

  createIndicator(originalCount, filteredCount) {
    return createFilterIndicator(this.preferences, originalCount, filteredCount)
  }

  getTMDBParams() {
    return createTMDBFilterParams(this.preferences)
  }
}

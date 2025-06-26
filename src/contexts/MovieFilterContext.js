'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MovieFilterContext as FilterService } from '@/lib/services/movieFilterService'

const MovieFilterContext = createContext()

export function MovieFilterProvider({ children }) {
  const { data: session } = useSession()
  const [preferences, setPreferences] = useState(null)
  const [filterService, setFilterService] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user preferences when session changes
  useEffect(() => {
    const loadPreferences = async () => {
      if (!session?.user?.id) {
        setPreferences(null)
        setFilterService(null)
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/user/preferences')
        if (response.ok) {
          const data = await response.json()
          const userPrefs = data.preferences
          setPreferences(userPrefs)
          setFilterService(new FilterService(userPrefs))
        } else {
          setPreferences(null)
          setFilterService(null)
        }
      } catch (error) {
        console.error('Failed to load movie filter preferences:', error)
        setPreferences(null)
        setFilterService(null)
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [session])

  // Refresh preferences (called after settings update)
  const refreshPreferences = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      const response = await fetch('/api/user/preferences')
      if (response.ok) {
        const data = await response.json()
        const userPrefs = data.preferences
        setPreferences(userPrefs)
        setFilterService(new FilterService(userPrefs))
      }
    } catch (error) {
      console.error('Failed to refresh movie filter preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter movies using current preferences
  const filterMovies = (movies) => {
    if (!filterService) {
      return {
        filteredMovies: movies,
        isFiltered: false,
        filterSummary: null,
        originalCount: movies?.length || 0,
        filteredCount: movies?.length || 0
      }
    }
    return filterService.filterMovies(movies)
  }

  // Get filter status for UI
  const getFilterStatus = () => {
    if (!filterService) {
      return { isActive: false, message: 'No filters applied' }
    }
    return filterService.getStatus()
  }

  // Check if filtering is active
  const isFilteringActive = () => {
    return filterService?.isActive || false
  }

  // Get TMDB API parameters for server-side filtering
  const getTMDBParams = () => {
    if (!filterService) return {}
    return filterService.getTMDBParams()
  }

  const value = {
    preferences,
    filterService,
    loading,
    filterMovies,
    getFilterStatus,
    isFilteringActive,
    getTMDBParams,
    refreshPreferences
  }

  return (
    <MovieFilterContext.Provider value={value}>
      {children}
    </MovieFilterContext.Provider>
  )
}

export function useMovieFilter() {
  const context = useContext(MovieFilterContext)
  if (context === undefined) {
    throw new Error('useMovieFilter must be used within a MovieFilterProvider')
  }
  return context
}

// Hook for filtering movies with current user preferences
export function useFilteredMovies(movies) {
  const { filterMovies, getFilterStatus } = useMovieFilter()
  
  const result = filterMovies(movies)
  const status = getFilterStatus()

  return {
    ...result,
    status
  }
}

// Hook for getting filter status
export function useFilterStatus() {
  const { getFilterStatus, isFilteringActive } = useMovieFilter()
  
  return {
    status: getFilterStatus(),
    isActive: isFilteringActive()
  }
}

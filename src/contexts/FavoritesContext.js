/**
 * Favorites Context Provider
 * Provides shared favorites state across the entire app
 */

'use client'

import { createContext, useContext } from 'react'
import { useFavorites } from '@/lib/hooks/useFavorites'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const favoritesData = useFavorites()
  
  return (
    <FavoritesContext.Provider value={favoritesData}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider')
  }
  return context
}

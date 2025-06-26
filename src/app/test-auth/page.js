'use client'

import { useSession } from 'next-auth/react'
import { useFavorites } from '@/lib/hooks/useFavorites'
import { useState } from 'react'

export default function TestAuth() {
  const { data: session, status } = useSession()
  const { 
    favorites, 
    loading, 
    error, 
    addToFavorites, 
    removeFromFavorites, 
    clearAllFavorites,
    favoritesCount 
  } = useFavorites()
  
  const [testResult, setTestResult] = useState('')

  const testMovie = {
    id: 'test-movie-1',
    tmdbId: 12345,
    title: 'Test Movie',
    overview: 'This is a test movie for authentication testing',
    release_date: '2024-01-01',
    poster_path: '/test-poster.jpg',
    backdrop_path: '/test-backdrop.jpg',
    vote_average: 8.5,
    vote_count: 1000,
    popularity: 100,
    adult: false,
    original_language: 'en',
    original_title: 'Test Movie'
  }

  const runTests = async () => {
    if (!session) {
      setTestResult('❌ Not authenticated - please sign in first')
      return
    }

    try {
      setTestResult('🧪 Running tests...')
      
      // Test 1: Add to favorites
      await addToFavorites(testMovie.id, testMovie)
      setTestResult(prev => prev + '\n✅ Test 1: Added movie to favorites')
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Test 2: Remove from favorites
      await removeFromFavorites(testMovie.id)
      setTestResult(prev => prev + '\n✅ Test 2: Removed movie from favorites')
      
      setTestResult(prev => prev + '\n🎉 All tests passed!')
      
    } catch (error) {
      setTestResult(prev => prev + `\n❌ Test failed: ${error.message}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Authentication Test Page</h1>
        
        {/* Authentication Status */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Authentication Status</h2>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-300">
              Status: <span className={status === 'authenticated' ? 'text-green-400' : 'text-red-400'}>
                {status}
              </span>
            </p>
            {session && (
              <div className="mt-2">
                <p className="text-gray-300">User: {session.user?.name || session.user?.email}</p>
                <p className="text-gray-300">ID: {session.user?.id}</p>
              </div>
            )}
          </div>
        </div>

        {/* Favorites Status */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Favorites Status</h2>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-300">Loading: {loading ? 'Yes' : 'No'}</p>
            <p className="text-gray-300">Count: {favoritesCount}</p>
            {error && <p className="text-red-400">Error: {error}</p>}
          </div>
        </div>

        {/* Test Controls */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Test Controls</h2>
          <div className="space-x-4">
            <button
              onClick={runTests}
              disabled={!session || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Run Favorites Tests
            </button>
            
            <button
              onClick={clearAllFavorites}
              disabled={!session || loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Clear All Favorites
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Test Results</h2>
            <div className="bg-gray-900 p-4 rounded">
              <pre className="text-green-400 whitespace-pre-wrap">{testResult}</pre>
            </div>
          </div>
        )}

        {/* Current Favorites */}
        {favorites.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Current Favorites</h2>
            <div className="bg-gray-700 p-4 rounded">
              {favorites.map((movie, index) => (
                <div key={movie.id} className="text-gray-300 mb-2">
                  {index + 1}. {movie.title} (ID: {movie.id})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

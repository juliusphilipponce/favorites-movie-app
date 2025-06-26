
"use client";

import { useFavoritesContext } from '@/contexts/FavoritesContext';
import FavoritesGrid from '@/components/movies/FavoritesGrid';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Favorites() {
  return (
    <ProtectedRoute>
      <FavoritesContent />
    </ProtectedRoute>
  );
}

function FavoritesContent() {
  const {
    favorites,
    loading,
    error,
    clearAllFavorites,
    favoritesCount
  } = useFavoritesContext();

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove all movies from your favorites?')) {
      try {
        await clearAllFavorites();
      } catch (err) {
        alert('Failed to clear favorites. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-none md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-none md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <div className="text-red-400">
            <svg className="w-20 h-20 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Error Loading Favorites</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Favorites</h1>
          <p className="text-gray-400">
            {favoritesCount > 0
              ? `You have ${favoritesCount} favorite movie${favoritesCount !== 1 ? 's' : ''}`
              : 'No favorite movies yet'
            }
          </p>
        </div>

        {favoritesCount > 0 && (
          <button
            onClick={handleClearAll}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Favorites Grid */}
      {favoritesCount === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-400">
            <svg className="w-20 h-20 mx-auto mb-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No favorites yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start building your collection by clicking the heart icon on any movie you love!
            </p>
            <a
              href="/movies"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Browse Movies
            </a>
          </div>
        </div>
      ) : (
        <FavoritesGrid
          movies={favorites}
          emptyMessage="No favorite movies found"
        />
      )}
    </div>
  );
}
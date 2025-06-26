'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { MOVIE_GENRES, getGenreNames, validateGenrePreferences } from '@/lib/constants/genres'
import { useMovieFilter } from '@/contexts/MovieFilterContext'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('profile')

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage your account and application preferences</p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-700">
              <nav className="flex overflow-x-auto scrollbar-hide px-4 sm:px-6" aria-label="Tabs">
                <div className="flex space-x-4 sm:space-x-8 min-w-max">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === 'profile'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === 'preferences'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    Preferences
                  </button>
                  <button
                    onClick={() => setActiveTab('movies')}
                    className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === 'movies'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    Movie Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === 'account'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    Account
                  </button>
                </div>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'profile' && <ProfileSection session={session} />}
              {activeTab === 'preferences' && <PreferencesSection />}
              {activeTab === 'movies' && <AdvancedMovieSettingsSection />}
              {activeTab === 'account' && <AccountSection session={session} />}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// Profile Section Component
function ProfileSection({ session }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setMessage('Profile updated successfully!')
      setIsEditing(false)
      // Optionally refresh the session to update the UI
      window.location.reload()
    } catch (error) {
      setMessage(error.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Profile Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200 self-start sm:self-auto"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('successfully')
            ? 'bg-green-900 text-green-300 border border-green-700'
            : 'bg-red-900 text-red-300 border border-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Profile Image */}
        <div className="flex-shrink-0 self-center sm:self-start">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gray-600"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg sm:text-2xl border-4 border-gray-600">
              {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {/* Profile Form */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-400">Name</label>
                <p className="text-white text-sm sm:text-base break-words">{session?.user?.name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <p className="text-white text-sm sm:text-base break-words">{session?.user?.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Preferences Section Component
function PreferencesSection() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    movieRecommendations: true,
    theme: 'dark',
    language: 'en',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Load preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/user/preferences')
        if (response.ok) {
          const data = await response.json()
          setPreferences(data.preferences)
        }
      } catch (error) {
        console.error('Failed to load preferences:', error)
      }
    }
    loadPreferences()
  }, [])

  const handlePreferenceChange = async (key, value) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)

    // Auto-save preferences
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences),
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      setMessage('Preferences saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to save preferences. Please try again.')
      // Revert the change
      setPreferences(preferences)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-white">App Preferences</h2>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('successfully')
            ? 'bg-green-900 text-green-300 border border-green-700'
            : 'bg-red-900 text-red-300 border border-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        {/* Email Notifications */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-300">Email Notifications</h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Receive email updates about new movies and features</p>
          </div>
          <button
            onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 self-start sm:self-auto ${
              preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Movie Recommendations */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-300">Movie Recommendations</h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Get personalized movie suggestions based on your favorites</p>
          </div>
          <button
            onClick={() => handlePreferenceChange('movieRecommendations', !preferences.movieRecommendations)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 self-start sm:self-auto ${
              preferences.movieRecommendations ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                preferences.movieRecommendations ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Language Selection */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
            Language
          </label>
          <select
            id="language"
            value={preferences.language}
            onChange={(e) => handlePreferenceChange('language', e.target.value)}
            className="w-full sm:max-w-xs px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
    </div>
  )
}

// Account Section Component
function AccountSection({ session }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-white">Account Settings</h2>

      <div className="space-y-4 sm:space-y-6">
        {/* Account Information */}
        <div className="bg-gray-700 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-white mb-3">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-gray-400 font-medium">Account ID:</span>
              <span className="text-gray-300 font-mono text-xs sm:text-sm break-all">{session?.user?.id || 'N/A'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-gray-400 font-medium">Member since:</span>
              <span className="text-gray-300">January 2024</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-gray-400 font-medium">Account type:</span>
              <span className="text-gray-300">Free</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-red-400 mb-3">Danger Zone</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-300">Delete Account</h4>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 leading-relaxed">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 text-sm sm:text-base">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Advanced Movie Settings Section Component
function AdvancedMovieSettingsSection() {
  const { refreshPreferences } = useMovieFilter()
  const [movieSettings, setMovieSettings] = useState({
    advancedFilteringEnabled: false,
    preferredGenres: [],
    excludedGenres: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Load movie settings on component mount
  useEffect(() => {
    const loadMovieSettings = async () => {
      try {
        const response = await fetch('/api/user/preferences')
        if (response.ok) {
          const data = await response.json()
          const preferences = data.preferences
          setMovieSettings({
            advancedFilteringEnabled: preferences.advancedFilteringEnabled || false,
            preferredGenres: preferences.preferredGenres ? JSON.parse(preferences.preferredGenres) : [],
            excludedGenres: preferences.excludedGenres ? JSON.parse(preferences.excludedGenres) : [],
          })
        }
      } catch (error) {
        console.error('Failed to load movie settings:', error)
      }
    }
    loadMovieSettings()
  }, [])

  const handleToggleAdvancedFiltering = async () => {
    const newEnabled = !movieSettings.advancedFilteringEnabled
    const newSettings = { ...movieSettings, advancedFilteringEnabled: newEnabled }
    setMovieSettings(newSettings)
    await saveMovieSettings(newSettings)
  }

  const handleGenreToggle = async (genreId, type) => {
    let newSettings = { ...movieSettings }

    if (type === 'preferred') {
      if (newSettings.preferredGenres.includes(genreId)) {
        newSettings.preferredGenres = newSettings.preferredGenres.filter(id => id !== genreId)
      } else {
        newSettings.preferredGenres = [...newSettings.preferredGenres, genreId]
        // Remove from excluded if it was there
        newSettings.excludedGenres = newSettings.excludedGenres.filter(id => id !== genreId)
      }
    } else if (type === 'excluded') {
      if (newSettings.excludedGenres.includes(genreId)) {
        newSettings.excludedGenres = newSettings.excludedGenres.filter(id => id !== genreId)
      } else {
        newSettings.excludedGenres = [...newSettings.excludedGenres, genreId]
        // Remove from preferred if it was there
        newSettings.preferredGenres = newSettings.preferredGenres.filter(id => id !== genreId)
      }
    }

    setMovieSettings(newSettings)
    await saveMovieSettings(newSettings)
  }

  const saveMovieSettings = async (settings) => {
    try {
      const requestBody = {
        advancedFilteringEnabled: settings.advancedFilteringEnabled,
        preferredGenres: JSON.stringify(settings.preferredGenres),
        excludedGenres: JSON.stringify(settings.excludedGenres),
      }

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save movie settings')
      }

      setMessage('Movie settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)

      // Refresh the movie filter context
      await refreshPreferences()
    } catch (error) {
      setMessage('Failed to save movie settings. Please try again.')
    }
  }

  const handleResetFilters = async () => {
    const resetSettings = {
      advancedFilteringEnabled: false,
      preferredGenres: [],
      excludedGenres: [],
    }
    setMovieSettings(resetSettings)
    await saveMovieSettings(resetSettings)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Advanced Movie Settings</h2>
        <button
          onClick={handleResetFilters}
          className="px-3 py-1 text-sm text-gray-400 hover:text-red-400 transition-colors duration-200 self-start sm:self-auto"
        >
          Reset All
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('successfully')
            ? 'bg-green-900 text-green-300 border border-green-700'
            : 'bg-red-900 text-red-300 border border-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Global Filtering Toggle */}
      <div className="bg-gray-700 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-medium text-white">Global Movie Filtering</h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Apply genre preferences across all movie lists in the application
            </p>
          </div>
          <button
            onClick={handleToggleAdvancedFiltering}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 self-start sm:self-auto ${
              movieSettings.advancedFilteringEnabled ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                movieSettings.advancedFilteringEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {movieSettings.advancedFilteringEnabled && (
          <div className="text-xs sm:text-sm text-blue-300 bg-blue-900/30 border border-blue-700 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-relaxed">
                Advanced filtering is active. These preferences will affect all movie displays throughout the app.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Genre Preferences */}
      {movieSettings.advancedFilteringEnabled && (
        <>
          {/* Preferred Genres */}
          <div className="bg-gray-700 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-white mb-3">Preferred Genres</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed">
              Movies with these genres will be prioritized and highlighted. Leave empty to show all genres.
            </p>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {MOVIE_GENRES.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreToggle(genre.id, 'preferred')}
                  className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 text-center ${
                    movieSettings.preferredGenres.includes(genre.id)
                      ? 'bg-green-600 text-white border-2 border-green-500'
                      : 'bg-gray-600 text-gray-300 border-2 border-transparent hover:bg-gray-500'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
            {movieSettings.preferredGenres.length > 0 && (
              <div className="mt-3 text-xs sm:text-sm text-green-300 break-words">
                <span className="font-medium">Selected:</span> {getGenreNames(movieSettings.preferredGenres).join(', ')}
              </div>
            )}
          </div>

          {/* Excluded Genres */}
          <div className="bg-gray-700 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-white mb-3">Excluded Genres</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed">
              Movies with these genres will be hidden from all lists and search results.
            </p>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {MOVIE_GENRES.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreToggle(genre.id, 'excluded')}
                  className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 text-center ${
                    movieSettings.excludedGenres.includes(genre.id)
                      ? 'bg-red-600 text-white border-2 border-red-500'
                      : 'bg-gray-600 text-gray-300 border-2 border-transparent hover:bg-gray-500'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
            {movieSettings.excludedGenres.length > 0 && (
              <div className="mt-3 text-xs sm:text-sm text-red-300 break-words">
                <span className="font-medium">Excluded:</span> {getGenreNames(movieSettings.excludedGenres).join(', ')}
              </div>
            )}
          </div>

          {/* Filter Summary */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-blue-300 mb-3">Filter Summary</h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="text-gray-300">
                <span className="font-medium">Preferred Genres:</span>{' '}
                <span className="break-words">
                  {movieSettings.preferredGenres.length > 0
                    ? getGenreNames(movieSettings.preferredGenres).join(', ')
                    : 'None (all genres shown)'
                  }
                </span>
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Excluded Genres:</span>{' '}
                <span className="break-words">
                  {movieSettings.excludedGenres.length > 0
                    ? getGenreNames(movieSettings.excludedGenres).join(', ')
                    : 'None'
                  }
                </span>
              </div>
              <div className="text-blue-300 mt-3 leading-relaxed">
                <span className="font-medium">Applied to:</span> Home page sections, Movies page, Search results, and Recommendations.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

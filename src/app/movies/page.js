"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePopularMovies, useTrendingMovies, useTopRatedMoviesWithFilter, useUpcomingMovies, useMovieSearch } from '@/lib/hooks/useMovies';
import MovieSection from '@/components/movies/MovieSection';
import YearFilter from '@/components/ui/YearFilter';
import { DetailedFilterIndicator } from '@/components/ui/FilterStatusIndicator';

export default function Movies() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'popular';
  const searchQuery = searchParams.get('search') || '';

  const [activeTab, setActiveTab] = useState(category);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedYear, setSelectedYear] = useState(null);

  // Movie hooks with filtering
  const {
    movies: popularMovies,
    loading: popularLoading,
    error: popularError,
    isFiltered: popularFiltered,
    originalCount: popularOriginalCount,
    filteredCount: popularFilteredCount
  } = usePopularMovies();

  const {
    movies: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
    isFiltered: trendingFiltered,
    originalCount: trendingOriginalCount,
    filteredCount: trendingFilteredCount
  } = useTrendingMovies();

  const { movies: topRatedMovies, loading: topRatedLoading, error: topRatedError } = useTopRatedMoviesWithFilter(selectedYear);
  const { movies: upcomingMovies, loading: upcomingLoading, error: upcomingError } = useUpcomingMovies();
  const { movies: searchResults, loading: searchLoading, error: searchError, searchMovies, clearSearch } = useMovieSearch();

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(category);
  }, [category]);

  // Handle search
  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
      searchMovies(searchQuery);
    }
  }, [searchQuery, searchMovies]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchMovies(searchTerm);
    } else {
      clearSearch();
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    clearSearch();
    setSearchTerm('');
    // Reset year filter when switching away from Top Rated tab
    if (tab !== 'top_rated') {
      setSelectedYear(null);
    }
  };

  const tabs = [
    { id: 'popular', label: 'Popular', movies: popularMovies, loading: popularLoading, error: popularError },
    { id: 'trending', label: 'Trending', movies: trendingMovies, loading: trendingLoading, error: trendingError },
    { id: 'top_rated', label: 'Top Rated', movies: topRatedMovies, loading: topRatedLoading, error: topRatedError },
    { id: 'upcoming', label: 'Upcoming', movies: upcomingMovies, loading: upcomingLoading, error: upcomingError },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <div className="w-full max-w-none md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Movies</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Discover amazing movies, search for your favorites, and explore different categories.
        </p>
      </div>

      {/* Filter Status Indicator */}
      <DetailedFilterIndicator
        originalCount={activeTab === 'popular' ? popularOriginalCount : trendingOriginalCount}
        filteredCount={activeTab === 'popular' ? popularFilteredCount : trendingFilteredCount}
        className="mb-6"
      />

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for movies..."
              className="w-full px-4 py-3 pl-12 pr-4 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  clearSearch();
                }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <MovieSection
          title={`Search Results for "${searchTerm}"`}
          movies={searchResults}
          loading={searchLoading}
          error={searchError}
          emptyMessage="No movies found for your search"
          className="mb-12"
        />
      )}

      {/* Category Tabs - Only show when not searching */}
      {!searchTerm && (
        <>
          <div className="mb-8">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Year Filter - Only show for Top Rated tab */}
          {activeTab === 'top_rated' && (
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <label className="text-gray-300 font-medium">Filter by Year:</label>
                <div className="w-48">
                  <YearFilter
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    placeholder="All Years"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Tab Content */}
          <MovieSection
            title={activeTabData.label}
            movies={activeTabData.movies}
            loading={activeTabData.loading}
            error={activeTabData.error}
            isFiltered={activeTab === 'popular' ? popularFiltered : activeTab === 'trending' ? trendingFiltered : false}
            originalCount={activeTab === 'popular' ? popularOriginalCount : activeTab === 'trending' ? trendingOriginalCount : 0}
            filteredCount={activeTab === 'popular' ? popularFilteredCount : activeTab === 'trending' ? trendingFilteredCount : 0}
          />
        </>
      )}
    </div>
  );
}
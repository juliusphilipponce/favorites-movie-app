/**
 * Debug component to help troubleshoot year filtering issues
 */

"use client";

import { useState } from 'react';
import { getTopRatedMoviesWithFilter, getTopRatedMoviesWithStrictYearFilter } from '@/lib/api/tmdb';

export default function YearFilterDebug() {
  const [selectedYear, setSelectedYear] = useState(2023);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testYearFilter = async (useStrict = false) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = useStrict 
        ? await getTopRatedMoviesWithStrictYearFilter(1, selectedYear)
        : await getTopRatedMoviesWithFilter(1, selectedYear);
      
      setResults({
        method: useStrict ? 'Strict Date Range' : 'Primary Release Year',
        year: selectedYear,
        count: data.length,
        movies: data.slice(0, 10).map(movie => ({
          title: movie.title,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count
        }))
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Year Filter Debug Tool</h2>
      
      <div className="mb-4 flex items-center space-x-4">
        <label className="text-gray-300">Test Year:</label>
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          min="1900"
          max="2024"
          className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
        />
        <button
          onClick={() => testYearFilter(false)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Primary Release Year
        </button>
        <button
          onClick={() => testYearFilter(true)}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Strict Date Range
        </button>
      </div>

      {loading && (
        <div className="text-blue-400">Loading...</div>
      )}

      {error && (
        <div className="text-red-400 bg-red-900/20 p-3 rounded">
          Error: {error}
        </div>
      )}

      {results && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Results for {results.year} ({results.method})
          </h3>
          <p className="text-gray-300 mb-4">Found {results.count} movies</p>
          
          <div className="space-y-2">
            {results.movies.map((movie, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">{movie.title}</div>
                  <div className="text-gray-400 text-sm">Release: {movie.release_date}</div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</div>
                  <div className="text-gray-400 text-sm">{movie.vote_count} votes</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-400">
        <p><strong>Primary Release Year:</strong> Uses TMDB's primary_release_year parameter</p>
        <p><strong>Strict Date Range:</strong> Uses release_date.gte and release_date.lte parameters</p>
        <p>Check the browser console for detailed API request logs.</p>
      </div>
    </div>
  );
}

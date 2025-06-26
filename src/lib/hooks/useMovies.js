/**
 * Custom hooks for movie API operations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getPopularMovies,
  fetchMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getTopRatedMoviesWithFilter,
  getUpcomingMovies,
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getRecommendedMovies
} from '../api/tmdb';
import { useFilteredMovies } from '@/contexts/MovieFilterContext';

/**
 * Hook for fetching popular movies with filtering
 */
export const usePopularMovies = () => {
  const [rawMovies, setRawMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply filtering to raw movies
  const { filteredMovies: movies, isFiltered, filterSummary, originalCount, filteredCount, status } = useFilteredMovies(rawMovies);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPopularMovies();
        setRawMovies(data);
      } catch (err) {
        setError(err.message);
        setRawMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  return {
    movies,
    loading,
    error,
    isFiltered,
    filterSummary,
    originalCount,
    filteredCount,
    filterStatus: status
  };
};

/**
 * Hook for searching movies
 */
export const useMovieSearch = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setMovies([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchMovies(searchTerm);
      setMovies(data);
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setMovies([]);
    setError(null);
  }, []);

  return { movies, loading, error, searchMovies, clearSearch };
};

/**
 * Hook for fetching trending movies with filtering
 */
export const useTrendingMovies = (timeWindow = 'day') => {
  const [rawMovies, setRawMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply filtering to raw movies
  const { filteredMovies: movies, isFiltered, filterSummary, originalCount, filteredCount, status } = useFilteredMovies(rawMovies);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTrendingMovies(timeWindow);
        setRawMovies(data);
      } catch (err) {
        setError(err.message);
        setRawMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, [timeWindow]);

  return {
    movies,
    loading,
    error,
    isFiltered,
    filterSummary,
    originalCount,
    filteredCount,
    filterStatus: status
  };
};

/**
 * Hook for fetching top rated movies
 */
export const useTopRatedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTopRatedMovies();
        setMovies(data);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedMovies();
  }, []);

  return { movies, loading, error };
};

/**
 * Hook for fetching top rated movies with optional year filter
 */
export const useTopRatedMoviesWithFilter = (year = null) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use the configurable filter function
        const data = await getTopRatedMoviesWithFilter(1, year);
        setMovies(data);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedMovies();
  }, [year]);

  return { movies, loading, error };
};

/**
 * Hook for fetching upcoming movies
 */
export const useUpcomingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUpcomingMovies();
        setMovies(data);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, []);

  return { movies, loading, error };
};

/**
 * Hook for fetching movie details with enhanced data
 */
export const useMovieDetails = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) {
      setMovie(null);
      setLoading(false);
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(movieId);
        setMovie(data);
      } catch (err) {
        setError(err.message);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return { movie, loading, error };
};

/**
 * Hook for fetching movie cast and crew
 */
export const useMovieCredits = (movieId) => {
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) {
      setCredits(null);
      setLoading(false);
      return;
    }

    const fetchMovieCredits = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieCredits(movieId);
        setCredits(data);
      } catch (err) {
        setError(err.message);
        setCredits(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieCredits();
  }, [movieId]);

  return { credits, loading, error };
};

/**
 * Hook for fetching similar movies
 */
export const useSimilarMovies = (movieId, limit = 10) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) {
      setMovies([]);
      setLoading(false);
      return;
    }

    const fetchSimilarMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try similar movies first, fallback to recommendations
        let data;
        try {
          data = await getSimilarMovies(movieId);
        } catch (similarError) {
          console.warn('Similar movies failed, trying recommendations:', similarError);
          data = await getRecommendedMovies(movieId);
        }

        // Limit the results and ensure we have valid movies
        const validMovies = (data.results || [])
          .filter(movie => movie.poster_path && movie.overview)
          .slice(0, limit);

        setMovies(validMovies);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarMovies();
  }, [movieId, limit]);

  return { movies, loading, error };
};

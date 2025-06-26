/**
 * TMDB API Service
 * Handles all API calls to The Movie Database
 */

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Validate API key
if (!API_KEY) {
  console.error('TMDB API key is not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your .env file.');
}

/**
 * Generic API request handler with error handling
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * Get popular movies
 */
export const getPopularMovies = async (page = 1) => {
  const endpoint = `/movie/popular?api_key=${API_KEY}&page=${page}`;
  const data = await apiRequest(endpoint);
  return data.results;
};

/**
 * Search for movies
 */
export const fetchMovies = async (searchTerm, page = 1) => {
  if (!searchTerm.trim()) {
    return [];
  }
  
  const endpoint = `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&page=${page}`;
  const data = await apiRequest(endpoint);
  return data.results;
};

/**
 * Get movie details by ID with additional information
 */
export const getMovieDetails = async (movieId) => {
  const endpoint = `/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,similar`;
  return await apiRequest(endpoint);
};

/**
 * Get movie cast and crew by ID
 */
export const getMovieCredits = async (movieId) => {
  const endpoint = `/movie/${movieId}/credits?api_key=${API_KEY}`;
  return await apiRequest(endpoint);
};

/**
 * Get movie genres list
 */
export const getMovieGenres = async () => {
  const endpoint = `/genre/movie/list?api_key=${API_KEY}`;
  return await apiRequest(endpoint);
};

/**
 * Get similar movies by movie ID
 */
export const getSimilarMovies = async (movieId, page = 1) => {
  const endpoint = `/movie/${movieId}/similar?api_key=${API_KEY}&page=${page}`;
  return await apiRequest(endpoint);
};

/**
 * Get recommended movies by movie ID
 */
export const getRecommendedMovies = async (movieId, page = 1) => {
  const endpoint = `/movie/${movieId}/recommendations?api_key=${API_KEY}&page=${page}`;
  return await apiRequest(endpoint);
};

/**
 * Get trending movies
 */
export const getTrendingMovies = async (timeWindow = 'day') => {
  const endpoint = `/trending/movie/${timeWindow}?api_key=${API_KEY}`;
  const data = await apiRequest(endpoint);
  return data.results;
};

/**
 * Get top rated movies
 */
export const getTopRatedMovies = async (page = 1) => {
  const endpoint = `/movie/top_rated?api_key=${API_KEY}&page=${page}`;
  const data = await apiRequest(endpoint);
  return data.results;
};

/**
 * Get top rated movies with optional year filter
 * Uses discover endpoint when year filter is applied to maintain top-rated sorting
 */
export const getTopRatedMoviesWithFilter = async (page = 1, year = null) => {
  if (year) {
    // Get configuration from environment variables
    const minVoteCount = process.env.NEXT_PUBLIC_TMDB_MIN_VOTE_COUNT || 100;
    const minRating = process.env.NEXT_PUBLIC_TMDB_MIN_RATING || 6.0;
    const useStrictDateFilter = process.env.NEXT_PUBLIC_TMDB_USE_STRICT_DATE_FILTER === 'true';

    let endpoint;

    if (useStrictDateFilter) {
      // Use strict date range filtering
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      endpoint = `/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=vote_average.desc&vote_count.gte=${minVoteCount}&vote_average.gte=${minRating}&release_date.gte=${startDate}&release_date.lte=${endDate}`;
    } else {
      // Use primary_release_year filter (default)
      endpoint = `/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=vote_average.desc&vote_count.gte=${minVoteCount}&vote_average.gte=${minRating}&primary_release_year=${year}`;
    }

    // Debug logging to help troubleshoot
    console.log(`Fetching top-rated movies for year ${year} (strict: ${useStrictDateFilter}):`, endpoint);

    const data = await apiRequest(endpoint);

    // Log the results to help debug
    console.log(`Found ${data.results.length} movies for year ${year}`);
    if (data.results.length > 0) {
      console.log('Sample movies:', data.results.slice(0, 3).map(m => ({
        title: m.title,
        release_date: m.release_date,
        vote_average: m.vote_average
      })));
    }

    return data.results;
  } else {
    // Use regular top-rated endpoint when no year filter
    return getTopRatedMovies(page);
  }
};

/**
 * Alternative implementation using date range filtering
 * This might be more accurate for strict year filtering
 */
export const getTopRatedMoviesWithStrictYearFilter = async (page = 1, year = null) => {
  if (year) {
    // Use date range filtering for more precise year matching
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    const endpoint = `/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=vote_average.desc&vote_count.gte=100&release_date.gte=${startDate}&release_date.lte=${endDate}`;

    console.log(`Fetching top-rated movies with strict year filter for ${year}:`, endpoint);

    const data = await apiRequest(endpoint);

    console.log(`Strict filter found ${data.results.length} movies for year ${year}`);
    if (data.results.length > 0) {
      console.log('Sample movies (strict):', data.results.slice(0, 3).map(m => ({
        title: m.title,
        release_date: m.release_date,
        vote_average: m.vote_average
      })));
    }

    return data.results;
  } else {
    return getTopRatedMovies(page);
  }
};

/**
 * Get upcoming movies
 */
export const getUpcomingMovies = async (page = 1) => {
  const endpoint = `/movie/upcoming?api_key=${API_KEY}&page=${page}`;
  const data = await apiRequest(endpoint);
  return data.results;
};

/**
 * Helper function to get full image URL
 */
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null; // Return null for missing images, let component handle fallback
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * Helper function to format movie data
 */
export const formatMovieData = (movie) => {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    genreIds: movie.genre_ids,
    adult: movie.adult,
    originalLanguage: movie.original_language,
    originalTitle: movie.original_title,
    video: movie.video,
  };
};

/**
 * Helper function to format runtime in hours and minutes
 */
export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Helper function to format release date
 */
export const formatReleaseDate = (dateString) => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Helper function to format vote average
 */
export const formatVoteAverage = (rating) => {
  return rating ? rating.toFixed(1) : 'N/A';
};

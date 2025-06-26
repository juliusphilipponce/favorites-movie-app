const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

if (!TMDB_API_KEY) {
  console.warn('TMDB_API_KEY is not set in environment variables')
}

/**
 * Make a request to the TMDB API
 */
async function tmdbRequest(endpoint, params = {}) {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured')
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  url.searchParams.append('api_key', TMDB_API_KEY)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString())
    }
  })

  const response = await fetch(url.toString())
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Search for movies
 */
export async function searchMovies(query, page = 1) {
  return tmdbRequest('/search/movie', {
    query,
    page,
    include_adult: false,
  })
}

/**
 * Get popular movies
 */
export async function getPopularMovies(page = 1) {
  return tmdbRequest('/movie/popular', { page })
}

/**
 * Get top rated movies
 */
export async function getTopRatedMovies(page = 1) {
  return tmdbRequest('/movie/top_rated', { page })
}

/**
 * Get now playing movies
 */
export async function getNowPlayingMovies(page = 1) {
  return tmdbRequest('/movie/now_playing', { page })
}

/**
 * Get upcoming movies
 */
export async function getUpcomingMovies(page = 1) {
  return tmdbRequest('/movie/upcoming', { page })
}

/**
 * Get movie details by TMDB ID
 */
export async function getMovieDetails(tmdbId) {
  return tmdbRequest(`/movie/${tmdbId}`)
}

/**
 * Get movie credits (cast and crew)
 */
export async function getMovieCredits(tmdbId) {
  return tmdbRequest(`/movie/${tmdbId}/credits`)
}

/**
 * Get movie videos (trailers, teasers, etc.)
 */
export async function getMovieVideos(tmdbId) {
  return tmdbRequest(`/movie/${tmdbId}/videos`)
}

/**
 * Get similar movies
 */
export async function getSimilarMovies(tmdbId, page = 1) {
  return tmdbRequest(`/movie/${tmdbId}/similar`, { page })
}

/**
 * Get movie recommendations
 */
export async function getMovieRecommendations(tmdbId, page = 1) {
  return tmdbRequest(`/movie/${tmdbId}/recommendations`, { page })
}

/**
 * Get genres list
 */
export async function getGenres() {
  return tmdbRequest('/genre/movie/list')
}

/**
 * Discover movies with filters
 */
export async function discoverMovies(filters = {}) {
  const {
    page = 1,
    sortBy = 'popularity.desc',
    withGenres,
    year,
    minRating,
    maxRating,
    ...otherFilters
  } = filters

  const params = {
    page,
    sort_by: sortBy,
    ...otherFilters,
  }

  if (withGenres) {
    params.with_genres = Array.isArray(withGenres) ? withGenres.join(',') : withGenres
  }

  if (year) {
    params.year = year
  }

  if (minRating) {
    params['vote_average.gte'] = minRating
  }

  if (maxRating) {
    params['vote_average.lte'] = maxRating
  }

  return tmdbRequest('/discover/movie', params)
}

/**
 * Get full image URL for TMDB images
 */
export function getImageUrl(path, size = 'w500') {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

/**
 * Get backdrop image URL
 */
export function getBackdropUrl(path, size = 'w1280') {
  return getImageUrl(path, size)
}

/**
 * Get poster image URL
 */
export function getPosterUrl(path, size = 'w500') {
  return getImageUrl(path, size)
}

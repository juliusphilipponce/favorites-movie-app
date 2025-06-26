/**
 * TMDB Movie Genres
 * Official genre IDs and names from The Movie Database API
 */

export const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

/**
 * Create a map of genre ID to genre name for quick lookups
 */
export const GENRE_MAP = MOVIE_GENRES.reduce((map, genre) => {
  map[genre.id] = genre.name;
  return map;
}, {});

/**
 * Create a map of genre name to genre ID for reverse lookups
 */
export const GENRE_NAME_MAP = MOVIE_GENRES.reduce((map, genre) => {
  map[genre.name.toLowerCase()] = genre.id;
  return map;
}, {});

/**
 * Get genre name by ID
 */
export function getGenreName(genreId) {
  return GENRE_MAP[genreId] || 'Unknown';
}

/**
 * Get genre ID by name
 */
export function getGenreId(genreName) {
  return GENRE_NAME_MAP[genreName.toLowerCase()];
}

/**
 * Get multiple genre names by IDs
 */
export function getGenreNames(genreIds) {
  if (!Array.isArray(genreIds)) return [];
  return genreIds.map(id => getGenreName(id)).filter(name => name !== 'Unknown');
}

/**
 * Check if a movie matches preferred genres
 */
export function matchesPreferredGenres(movieGenres, preferredGenres) {
  if (!preferredGenres || preferredGenres.length === 0) return true;
  if (!movieGenres || movieGenres.length === 0) return false;
  
  // Movie matches if it has at least one preferred genre
  return movieGenres.some(genreId => preferredGenres.includes(genreId));
}

/**
 * Check if a movie should be excluded based on excluded genres
 */
export function shouldExcludeMovie(movieGenres, excludedGenres) {
  if (!excludedGenres || excludedGenres.length === 0) return false;
  if (!movieGenres || movieGenres.length === 0) return false;
  
  // Movie should be excluded if it has any excluded genre
  return movieGenres.some(genreId => excludedGenres.includes(genreId));
}

/**
 * Filter movies based on user preferences
 */
export function filterMoviesByPreferences(movies, preferences) {
  if (!preferences || !preferences.advancedFilteringEnabled) {
    return movies;
  }

  const preferredGenres = preferences.preferredGenres ? JSON.parse(preferences.preferredGenres) : [];
  const excludedGenres = preferences.excludedGenres ? JSON.parse(preferences.excludedGenres) : [];

  return movies.filter(movie => {
    const movieGenres = movie.genre_ids || movie.genreIds || [];
    
    // First check if movie should be excluded
    if (shouldExcludeMovie(movieGenres, excludedGenres)) {
      return false;
    }
    
    // Then check if movie matches preferred genres (if any are set)
    if (preferredGenres.length > 0) {
      return matchesPreferredGenres(movieGenres, preferredGenres);
    }
    
    // If no preferred genres set, include movie (as long as it's not excluded)
    return true;
  });
}

/**
 * Get a summary of active filters for display
 */
export function getFilterSummary(preferences) {
  if (!preferences || !preferences.advancedFilteringEnabled) {
    return null;
  }

  const preferredGenres = preferences.preferredGenres ? JSON.parse(preferences.preferredGenres) : [];
  const excludedGenres = preferences.excludedGenres ? JSON.parse(preferences.excludedGenres) : [];

  const summary = {
    isActive: true,
    preferredCount: preferredGenres.length,
    excludedCount: excludedGenres.length,
    preferredNames: getGenreNames(preferredGenres),
    excludedNames: getGenreNames(excludedGenres)
  };

  return summary;
}

/**
 * Validate genre preferences
 */
export function validateGenrePreferences(preferredGenres, excludedGenres) {
  const errors = [];

  // Check for valid genre IDs
  if (preferredGenres) {
    const invalidPreferred = preferredGenres.filter(id => !GENRE_MAP[id]);
    if (invalidPreferred.length > 0) {
      errors.push(`Invalid preferred genre IDs: ${invalidPreferred.join(', ')}`);
    }
  }

  if (excludedGenres) {
    const invalidExcluded = excludedGenres.filter(id => !GENRE_MAP[id]);
    if (invalidExcluded.length > 0) {
      errors.push(`Invalid excluded genre IDs: ${invalidExcluded.join(', ')}`);
    }
  }

  // Check for overlapping preferences
  if (preferredGenres && excludedGenres) {
    const overlap = preferredGenres.filter(id => excludedGenres.includes(id));
    if (overlap.length > 0) {
      const overlapNames = getGenreNames(overlap);
      errors.push(`Genres cannot be both preferred and excluded: ${overlapNames.join(', ')}`);
    }
  }

  return errors;
}

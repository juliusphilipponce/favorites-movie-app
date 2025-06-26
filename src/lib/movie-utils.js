import { prisma } from '@/lib/prisma'

/**
 * Create or update a movie in the database from TMDB data
 */
export async function upsertMovie(tmdbMovie) {
  return await prisma.movie.upsert({
    where: {
      tmdbId: tmdbMovie.id,
    },
    update: {
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      releaseDate: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) : null,
      posterPath: tmdbMovie.poster_path,
      backdropPath: tmdbMovie.backdrop_path,
      runtime: tmdbMovie.runtime,
      genres: tmdbMovie.genres?.map(g => g.name) || [],
      voteAverage: tmdbMovie.vote_average,
      voteCount: tmdbMovie.vote_count,
      popularity: tmdbMovie.popularity,
      adult: tmdbMovie.adult,
      originalLanguage: tmdbMovie.original_language,
      originalTitle: tmdbMovie.original_title,
    },
    create: {
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      releaseDate: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) : null,
      posterPath: tmdbMovie.poster_path,
      backdropPath: tmdbMovie.backdrop_path,
      runtime: tmdbMovie.runtime,
      genres: tmdbMovie.genres?.map(g => g.name) || [],
      voteAverage: tmdbMovie.vote_average,
      voteCount: tmdbMovie.vote_count,
      popularity: tmdbMovie.popularity,
      adult: tmdbMovie.adult,
      originalLanguage: tmdbMovie.original_language,
      originalTitle: tmdbMovie.original_title,
    },
  })
}

/**
 * Add movie to user's watchlist
 */
export async function addToWatchlist(userId, movieId, watchlistId, notes = null) {
  return await prisma.watchlistItem.create({
    data: {
      userId,
      movieId,
      watchlistId,
      notes,
    },
    include: {
      movie: true,
      watchlist: true,
    },
  })
}

/**
 * Remove movie from user's watchlist
 */
export async function removeFromWatchlist(userId, movieId, watchlistId) {
  return await prisma.watchlistItem.deleteMany({
    where: {
      watchlistId,
      movieId,
      watchlist: {
        userId,
      },
    },
  })
}

/**
 * Add movie to user's favorites
 */
export async function addToFavorites(userId, movieId) {
  return await prisma.favorite.upsert({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
    update: {},
    create: {
      userId,
      movieId,
    },
    include: {
      movie: true,
    },
  })
}

/**
 * Remove movie from user's favorites
 */
export async function removeFromFavorites(userId, movieId) {
  return await prisma.favorite.delete({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
  })
}

/**
 * Create or update user's movie rating
 */
export async function rateMovie(userId, movieId, rating) {
  return await prisma.movieRating.upsert({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
    update: {
      rating,
    },
    create: {
      userId,
      movieId,
      rating,
    },
    include: {
      movie: true,
    },
  })
}

/**
 * Create or update user's movie review
 */
export async function reviewMovie(userId, movieId, content, rating = null) {
  return await prisma.review.upsert({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
    update: {
      content,
      rating,
    },
    create: {
      userId,
      movieId,
      content,
      rating,
    },
    include: {
      movie: true,
    },
  })
}

/**
 * Get movie with user-specific data
 */
export async function getMovieWithUserData(movieId, userId = null) {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      ratings: true,
      favorites: userId ? {
        where: { userId },
      } : false,
      watchlistItems: userId ? {
        where: {
          watchlist: {
            userId,
          },
        },
        include: {
          watchlist: true,
        },
      } : false,
    },
  })

  if (!movie) return null

  // Calculate average rating
  const avgRating = movie.ratings.length > 0
    ? movie.ratings.reduce((sum, r) => sum + r.rating, 0) / movie.ratings.length
    : null

  return {
    ...movie,
    averageRating: avgRating,
    userRating: userId ? movie.ratings.find(r => r.userId === userId)?.rating : null,
    isFavorite: userId ? movie.favorites.length > 0 : false,
    inWatchlists: userId ? movie.watchlistItems : [],
  }
}

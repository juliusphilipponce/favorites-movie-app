import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/favorites - Get user's favorite movies
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        movie: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform the data to return just the movies with favorite info
    const favoriteMovies = favorites.map(favorite => ({
      ...favorite.movie,
      favoriteId: favorite.id,
      favoritedAt: favorite.createdAt,
    }))

    return NextResponse.json({
      success: true,
      data: favoriteMovies,
      count: favoriteMovies.length,
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add movie to favorites
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Debug: Check if user exists in database
    console.log('Session user ID:', session.user.id)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    console.log('User found in database:', user ? 'Yes' : 'No')
    if (!user) {
      console.error('User not found in database:', session.user.id)
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    const { movieId, movieData } = await request.json()

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    // Parse movieId to ensure it's a valid number
    const tmdbId = parseInt(movieId)

    if (isNaN(tmdbId)) {
      return NextResponse.json(
        { error: 'Invalid movie ID format' },
        { status: 400 }
      )
    }

    // First, try to find the movie by TMDB ID (movieId is actually TMDB ID from frontend)
    let movie = await prisma.movie.findUnique({
      where: { tmdbId: tmdbId }
    })

    // If movie doesn't exist and movieData is provided, create it
    if (!movie && movieData) {
      movie = await prisma.movie.create({
        data: {
          tmdbId: parseInt(movieId),
          title: movieData.title,
          overview: movieData.overview,
          releaseDate: movieData.releaseDate ? new Date(movieData.releaseDate) : null,
          posterPath: movieData.posterPath,
          backdropPath: movieData.backdropPath,
          runtime: movieData.runtime,
          genres: Array.isArray(movieData.genres) ? movieData.genres.join(',') : null,
          voteAverage: movieData.voteAverage,
          voteCount: movieData.voteCount,
          popularity: movieData.popularity,
          adult: movieData.adult || false,
          originalLanguage: movieData.originalLanguage,
          originalTitle: movieData.originalTitle,
        }
      })
    }

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movie.id,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Movie already in favorites' },
        { status: 409 }
      )
    }

    // Add to favorites
    console.log('Creating favorite with userId:', session.user.id, 'movieId:', movie.id)
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        movieId: movie.id,
      },
      include: {
        movie: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...favorite.movie,
        favoriteId: favorite.id,
        favoritedAt: favorite.createdAt,
      },
    })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Remove all favorites
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const deletedCount = await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Removed ${deletedCount.count} movies from favorites`,
      deletedCount: deletedCount.count,
    })
  } catch (error) {
    console.error('Error clearing favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

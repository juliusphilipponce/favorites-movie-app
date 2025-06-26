import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE /api/favorites/[movieId] - Remove specific movie from favorites
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { movieId } = await params

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    // First find the movie by TMDB ID to get our internal movie ID
    const movie = await prisma.movie.findUnique({
      where: { tmdbId: parseInt(movieId) }
    })

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }

    // Check if the favorite exists using our internal movie ID
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movie.id,
        },
      },
      include: {
        movie: true,
      },
    })

    if (!existingFavorite) {
      return NextResponse.json(
        { error: 'Movie not found in favorites' },
        { status: 404 }
      )
    }

    // Remove from favorites using our internal movie ID
    await prisma.favorite.delete({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movie.id,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Movie removed from favorites',
      data: {
        movieId: movieId,
        movieTitle: existingFavorite.movie.title,
      },
    })
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/favorites/[movieId] - Check if movie is in favorites
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { movieId } = params

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    // First find the movie by TMDB ID to get our internal movie ID
    const movie = await prisma.movie.findUnique({
      where: { tmdbId: parseInt(movieId) }
    })

    if (!movie) {
      return NextResponse.json({
        success: true,
        isFavorite: false,
        data: null,
      })
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movie.id,
        },
      },
      include: {
        movie: true,
      },
    })

    return NextResponse.json({
      success: true,
      isFavorite: !!favorite,
      data: favorite ? {
        ...favorite.movie,
        favoriteId: favorite.id,
        favoritedAt: favorite.createdAt,
      } : null,
    })
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

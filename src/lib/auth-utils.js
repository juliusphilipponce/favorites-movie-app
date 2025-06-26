import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Get the current user session on the server side
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

/**
 * Get the current user with full database information
 */
export async function getCurrentUserWithDetails() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      watchlists: {
        include: {
          items: {
            include: {
              movie: true,
            },
          },
        },
      },
      reviews: {
        include: {
          movie: true,
        },
      },
      favorites: {
        include: {
          movie: true,
        },
      },
    },
  })

  return user
}

/**
 * Check if user is authenticated (server-side)
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error('Authentication required')
  }
  
  return session
}

/**
 * Get user's watchlists
 */
export async function getUserWatchlists(userId) {
  return await prisma.watchlist.findMany({
    where: {
      userId: userId,
    },
    include: {
      items: {
        include: {
          movie: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

/**
 * Get user's favorite movies
 */
export async function getUserFavorites(userId) {
  return await prisma.favorite.findMany({
    where: {
      userId: userId,
    },
    include: {
      movie: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

/**
 * Get user's movie reviews
 */
export async function getUserReviews(userId) {
  return await prisma.review.findMany({
    where: {
      userId: userId,
    },
    include: {
      movie: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// Re-export Prisma types for convenience
export type {
  User,
  Movie,
  Watchlist,
  WatchlistItem,
  Review,
  MovieRating,
  Favorite,
  Account,
  Session,
  VerificationToken,
} from '@/generated/prisma'

// TMDB API types
export interface TMDBMovie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  runtime?: number
  genres: TMDBGenre[]
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  original_language: string
  original_title: string
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBSearchResponse {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

// Extended types with relations
export interface MovieWithDetails extends Movie {
  reviews: Review[]
  ratings: MovieRating[]
  favorites: Favorite[]
  watchlistItems: WatchlistItem[]
}

export interface WatchlistWithItems extends Watchlist {
  items: (WatchlistItem & {
    movie: Movie
  })[]
}

export interface UserWithDetails extends User {
  watchlists: WatchlistWithItems[]
  reviews: (Review & {
    movie: Movie
  })[]
  favorites: (Favorite & {
    movie: Movie
  })[]
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types
export interface CreateWatchlistData {
  name: string
  description?: string
  isPublic?: boolean
}

export interface CreateReviewData {
  content: string
  rating?: number
  movieId: string
}

export interface CreateRatingData {
  rating: number
  movieId: string
}

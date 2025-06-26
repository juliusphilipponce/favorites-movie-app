/**
 * Application Configuration
 * Manages environment-specific settings and database configuration
 */

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

// Database configuration
export const database = {
  url: process.env.DATABASE_URL,
  isPostgreSQL: process.env.DATABASE_URL?.includes('postgresql'),
  isSQLite: process.env.DATABASE_URL?.includes('file:') || !process.env.DATABASE_URL?.includes('postgresql'),
}

// NextAuth configuration
export const auth = {
  secret: process.env.NEXTAUTH_SECRET,
  url: process.env.NEXTAUTH_URL,
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      enabled: !!(process.env.GITHUB_ID && process.env.GITHUB_SECRET),
    },
  },
}

// TMDB API configuration
export const tmdb = {
  apiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  baseUrl: process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  minVoteCount: parseInt(process.env.NEXT_PUBLIC_TMDB_MIN_VOTE_COUNT || '100'),
  minRating: parseFloat(process.env.NEXT_PUBLIC_TMDB_MIN_RATING || '6.0'),
}

// Supabase configuration (optional)
export const supabase = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  enabled: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
}

// Validation function
export function validateConfig() {
  const errors = []

  // Required environment variables
  if (!database.url) {
    errors.push('DATABASE_URL is required')
  }

  if (!auth.secret) {
    errors.push('NEXTAUTH_SECRET is required')
  }

  if (!auth.url) {
    errors.push('NEXTAUTH_URL is required')
  }

  if (!tmdb.apiKey) {
    errors.push('NEXT_PUBLIC_TMDB_API_KEY is required')
  }

  // Production-specific validations
  if (isProduction) {
    if (!database.isPostgreSQL) {
      errors.push('Production environment should use PostgreSQL database')
    }

    if (auth.secret === 'development-secret-key-change-in-production') {
      errors.push('NEXTAUTH_SECRET should be changed for production')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Log configuration on startup (development only)
if (isDevelopment && typeof window === 'undefined') {
  console.log('🔧 Application Configuration:')
  console.log(`  Environment: ${process.env.NODE_ENV}`)
  console.log(`  Database: ${database.isPostgreSQL ? 'PostgreSQL' : 'SQLite'}`)
  console.log(`  Auth Providers: ${Object.entries(auth.providers).filter(([, config]) => config.enabled).map(([name]) => name).join(', ') || 'None'}`)
  
  const validation = validateConfig()
  if (!validation.isValid) {
    console.warn('⚠️  Configuration Issues:')
    validation.errors.forEach(error => console.warn(`    - ${error}`))
  }
}

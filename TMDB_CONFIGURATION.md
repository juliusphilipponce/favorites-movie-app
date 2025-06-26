# TMDB API Configuration Guide

## Environment Variables Setup

Your TMDB API configuration is now managed through environment variables in the `.env` file. This provides better security and flexibility.

### Required Variables

```env
# The Movie Database (TMDB) API
# Note: NEXT_PUBLIC_ prefix makes these available on client-side
NEXT_PUBLIC_TMDB_API_KEY=your-actual-api-key-here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
```

### Optional Configuration Variables

```env
# TMDB API Configuration Options
# Minimum vote count for top-rated movies (higher = more popular movies only)
NEXT_PUBLIC_TMDB_MIN_VOTE_COUNT=100

# Minimum rating for filtered results
NEXT_PUBLIC_TMDB_MIN_RATING=6.0

# Use strict date range filtering (true/false)
NEXT_PUBLIC_TMDB_USE_STRICT_DATE_FILTER=false
```

## Configuration Options Explained

### `TMDB_MIN_VOTE_COUNT`
- **Default**: 100
- **Purpose**: Filters out movies with too few votes
- **Recommended values**:
  - `50` - Include more indie/niche movies
  - `100` - Balanced (default)
  - `500` - Only popular movies
  - `1000` - Only very popular movies

### `TMDB_MIN_RATING`
- **Default**: 6.0
- **Purpose**: Sets minimum rating threshold
- **Recommended values**:
  - `5.0` - Include lower-rated movies
  - `6.0` - Good quality movies (default)
  - `7.0` - High quality movies only
  - `8.0` - Excellent movies only

### `TMDB_USE_STRICT_DATE_FILTER`
- **Default**: false
- **Purpose**: Controls year filtering method
- **Options**:
  - `false` - Use `primary_release_year` (recommended)
  - `true` - Use exact date range filtering

## Troubleshooting Year Filter Issues

If you're seeing old movies when filtering by year, try these configurations:

### Option 1: Increase Vote Count (Recommended)
```env
TMDB_MIN_VOTE_COUNT=500
TMDB_MIN_RATING=6.5
```

### Option 2: Use Strict Date Filtering
```env
TMDB_USE_STRICT_DATE_FILTER=true
TMDB_MIN_VOTE_COUNT=200
```

### Option 3: High Quality Only
```env
TMDB_MIN_VOTE_COUNT=1000
TMDB_MIN_RATING=7.0
```

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use `.env.local` for local development** (not tracked by git)
3. **Set environment variables in production** deployment platform
4. **Rotate API keys periodically**

## Getting Your Own TMDB API Key

1. Visit [TMDB API](https://www.themoviedb.org/settings/api)
2. Create an account if you don't have one
3. Request an API key
4. Replace the key in your `.env` file

## Testing Configuration Changes

1. **Restart your development server** after changing `.env` variables
2. **Use the debug page** at `/debug/year-filter` to test different configurations
3. **Check browser console** for API request logs
4. **Monitor the results** to find the best configuration for your needs

## Production Deployment

When deploying to production, make sure to set these environment variables in your hosting platform:

- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables  
- Railway: Project → Variables
- Heroku: Settings → Config Vars

## Example Configurations

### For General Audience (Default)
```env
TMDB_MIN_VOTE_COUNT=100
TMDB_MIN_RATING=6.0
TMDB_USE_STRICT_DATE_FILTER=false
```

### For Movie Enthusiasts
```env
TMDB_MIN_VOTE_COUNT=50
TMDB_MIN_RATING=5.5
TMDB_USE_STRICT_DATE_FILTER=true
```

### For Mainstream Movies Only
```env
TMDB_MIN_VOTE_COUNT=1000
TMDB_MIN_RATING=6.5
TMDB_USE_STRICT_DATE_FILTER=false
```

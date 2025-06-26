# Deployment Guide: Next.js Movie App with Supabase

This guide walks you through deploying your Next.js movie app to Vercel with Supabase PostgreSQL as the production database.

## Prerequisites

- [x] Supabase project created
- [x] Supabase database connection string
- [x] TMDB API key
- [x] Vercel account
- [x] GitHub repository (recommended)

## Step 1: Prepare Your Supabase Database

### 1.1 Get Your Connection String
1. Go to your Supabase project dashboard
2. Navigate to **Settings → Database**
3. Copy the **Connection string** (URI format)
4. It should look like: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 1.2 Set Up Production Schema
```bash
# Create .env.production with your Supabase credentials
cp .env.production.example .env.production

# Edit .env.production and add your actual values:
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
# NEXTAUTH_URL="https://your-app-domain.vercel.app"
# NEXTAUTH_SECRET="your-secure-production-secret"
# ... other variables

# Set environment to production and run setup
export NODE_ENV=production
npm run db:setup

# Test the connection
npm run db:test
```

## Step 2: Deploy to Vercel

### 2.1 Connect Your Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Select **Next.js** as the framework preset

### 2.2 Configure Environment Variables

In your Vercel project settings, add these environment variables:

#### Required Variables
```env
# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# NextAuth.js
NEXTAUTH_URL=https://your-app-domain.vercel.app
NEXTAUTH_SECRET=your-secure-production-secret-key

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3

# TMDB Configuration
NEXT_PUBLIC_TMDB_MIN_VOTE_COUNT=100
NEXT_PUBLIC_TMDB_MIN_RATING=6.0
```

#### Optional OAuth Variables
```env
# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# GitHub OAuth (if using)
GITHUB_ID=your-production-github-client-id
GITHUB_SECRET=your-production-github-client-secret
```

### 2.3 Deploy
1. Click **"Deploy"** in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## Step 3: Post-Deployment Setup

### 3.1 Update OAuth Redirect URLs

If you're using OAuth providers, update their redirect URLs:

#### Google OAuth Console
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Navigate to **APIs & Services → Credentials**
- Edit your OAuth 2.0 Client ID
- Add to **Authorized redirect URIs**:
  ```
  https://your-app-domain.vercel.app/api/auth/callback/google
  ```

#### GitHub OAuth App
- Go to [GitHub Developer Settings](https://github.com/settings/developers)
- Edit your OAuth App
- Update **Authorization callback URL**:
  ```
  https://your-app-domain.vercel.app/api/auth/callback/github
  ```

### 3.2 Test Your Deployment

1. **Visit your deployed app**
2. **Test authentication** (sign up/sign in)
3. **Test movie features** (search, favorites, ratings)
4. **Check database** in Supabase dashboard

## Step 4: Environment-Specific Development

### Local Development (SQLite)
```bash
# Use development environment
export NODE_ENV=development
npm run dev
```

### Production Testing (Supabase)
```bash
# Use production environment locally
export NODE_ENV=production
npm run dev
```

### Database Operations
```bash
# Export data from development
npm run db:export

# Import data to production
npm run db:import filename.json

# Reset database (development only)
npm run db:reset

# Open Prisma Studio
npm run db:studio

# Test database connection
npm run db:test
```

## Step 5: Monitoring and Maintenance

### Vercel Dashboard
- Monitor deployment logs
- Check function performance
- View analytics

### Supabase Dashboard
- Monitor database performance
- Check query logs
- Manage database backups

### Environment Variables Management
```bash
# Using Vercel CLI
vercel env add DATABASE_URL production
vercel env ls
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check your connection string format
# Ensure password is URL-encoded
# Verify Supabase project is active
```

#### 2. Build Failures
```bash
# Check Vercel build logs
# Ensure all environment variables are set
# Verify Prisma client generation
```

#### 3. Authentication Issues
```bash
# Verify NEXTAUTH_URL matches your domain
# Check OAuth redirect URLs
# Ensure NEXTAUTH_SECRET is set
```

#### 4. TMDB API Issues
```bash
# Verify API key is correct
# Check rate limits
# Ensure NEXT_PUBLIC_ prefix for client-side variables
```

### Debug Commands
```bash
# Test database connection
npm run db:test

# Check configuration
node -e "console.log(require('./src/lib/config'))"

# Verify environment variables
vercel env ls
```

## Security Checklist

- [x] Strong NEXTAUTH_SECRET in production
- [x] Database credentials secured
- [x] OAuth redirect URLs updated
- [x] Environment variables not in code
- [x] Supabase RLS policies configured (if needed)

## Performance Optimization

### Database
- Enable connection pooling in Supabase
- Add database indexes for frequently queried fields
- Monitor query performance

### Vercel
- Enable Edge Functions for better performance
- Configure caching headers
- Monitor Core Web Vitals

## Backup Strategy

### Database Backups
- Supabase provides automatic backups
- Export critical data regularly: `npm run db:export`
- Store exports in secure location

### Code Backups
- Use Git for version control
- Tag releases for easy rollback
- Maintain staging environment

## Next Steps

1. **Set up monitoring** (Sentry, LogRocket)
2. **Configure analytics** (Google Analytics, Vercel Analytics)
3. **Add error tracking**
4. **Set up staging environment**
5. **Configure CI/CD pipeline**

Your Next.js movie app is now successfully deployed with Supabase! 🎉

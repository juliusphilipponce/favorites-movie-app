# Supabase Setup Instructions

## Step 1: Create .env.production file

Create a `.env.production` file in your project root with your actual Supabase credentials:

```env
# Production Environment Configuration
# Replace with your actual Supabase credentials

# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# NextAuth.js - Production settings
NEXTAUTH_URL="https://your-app-domain.vercel.app"
NEXTAUTH_SECRET="your-secure-production-secret-key-here"

# TMDB API Configuration
NEXT_PUBLIC_TMDB_API_KEY="your-tmdb-api-key-here"
NEXT_PUBLIC_TMDB_BASE_URL="https://api.themoviedb.org/3"

# TMDB Configuration Options
NEXT_PUBLIC_TMDB_MIN_VOTE_COUNT="100"
NEXT_PUBLIC_TMDB_MIN_RATING="6.0"

# OAuth Providers (if using)
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"
GITHUB_ID="your-production-github-client-id"
GITHUB_SECRET="your-production-github-client-secret"
```

## Step 2: Run Migration Commands

After creating the `.env.production` file, run these commands:

```bash
# Set environment to production
export NODE_ENV=production

# Set up the database schema for production
npm run db:setup

# Verify the migration worked
npm run db:studio
```

## Step 3: Test the Connection

Create a test script to verify your Supabase connection:

```bash
# Test database connection
node -e "
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  console.log('✅ Supabase connection successful! User count:', count);
  process.exit(0);
}).catch(err => {
  console.error('❌ Supabase connection failed:', err.message);
  process.exit(1);
});
"
```

## Step 4: Backup Your Local Data (Optional)

If you have important data in your local SQLite database, you can export it:

```bash
# Export data from SQLite (development)
npx prisma db seed --preview-feature

# Or manually export specific data
node scripts/export-data.js
```

## Troubleshooting

### Connection Issues
- Verify your Supabase password is correct
- Check that your IP is allowed (Supabase allows all IPs by default)
- Ensure the connection string format is correct

### Schema Issues
- Make sure you're using the production schema
- Verify all environment variables are set correctly
- Check Prisma client generation completed successfully

### Migration Errors
- Try running `npx prisma db push --force-reset` (⚠️ This will delete all data)
- Check Supabase dashboard for any error logs
- Verify your database user has proper permissions

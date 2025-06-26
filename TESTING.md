# Testing Guide: Supabase Migration

This guide helps you test the complete migration from SQLite to Supabase PostgreSQL.

## Pre-Migration Testing (Development)

### 1. Test Current Development Setup
```bash
# Ensure development environment works
export NODE_ENV=development
npm run dev

# Test database connection
npm run db:test

# Export existing data (if any)
npm run db:export
```

### 2. Test Features in Development
- [ ] User registration/login
- [ ] Movie search and browsing
- [ ] Adding/removing favorites
- [ ] Movie ratings
- [ ] User preferences
- [ ] OAuth authentication (if configured)

## Migration Testing

### 1. Set Up Supabase Environment
```bash
# Create production environment file
cp .env.production.example .env.production

# Edit .env.production with your Supabase credentials
# DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 2. Test Production Database Setup
```bash
# Set production environment
export NODE_ENV=production

# Set up production database schema
npm run db:setup

# Test database connection
npm run db:test
```

### 3. Import Data (Optional)
```bash
# If you have existing data to migrate
npm run db:import your-export-file.json
```

## Post-Migration Testing

### 1. Test Local Production Environment
```bash
# Run app with production database locally
export NODE_ENV=production
npm run dev

# Test all features with Supabase database
```

### 2. Feature Testing Checklist

#### Authentication
- [ ] User registration with email/password
- [ ] User login with email/password
- [ ] Google OAuth login (if configured)
- [ ] GitHub OAuth login (if configured)
- [ ] User session persistence
- [ ] Logout functionality

#### Movie Features
- [ ] Movie search functionality
- [ ] Movie detail pages
- [ ] Popular movies display
- [ ] Top-rated movies display
- [ ] Movie filtering by year/genre

#### User Features
- [ ] Add movies to favorites
- [ ] Remove movies from favorites
- [ ] View favorites page
- [ ] Rate movies (1-10 scale)
- [ ] View user ratings
- [ ] Update user preferences
- [ ] Theme switching (dark/light)

#### Data Persistence
- [ ] Favorites persist after logout/login
- [ ] Ratings persist after logout/login
- [ ] User preferences persist
- [ ] Session data properly stored

### 3. Database Verification

#### Check Supabase Dashboard
- [ ] Users table populated
- [ ] Movies table populated
- [ ] Favorites table populated
- [ ] Ratings table populated
- [ ] Sessions table populated
- [ ] Accounts table populated (for OAuth)

#### Run Database Tests
```bash
# Comprehensive database test
npm run db:test

# Check data integrity
node -e "
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
Promise.all([
  prisma.user.count(),
  prisma.movie.count(),
  prisma.favorite.count(),
  prisma.movieRating.count()
]).then(([users, movies, favorites, ratings]) => {
  console.log('Database Statistics:');
  console.log('Users:', users);
  console.log('Movies:', movies);
  console.log('Favorites:', favorites);
  console.log('Ratings:', ratings);
  process.exit(0);
});
"
```

## Deployment Testing

### 1. Pre-Deployment Validation
```bash
# Run deployment validation
npm run deploy

# This will check:
# - Environment configuration
# - Dependencies
# - Database connection
# - Production build
```

### 2. Deploy to Vercel
```bash
# Deploy to production
npm run deploy:prod

# Or manually:
# 1. Push code to GitHub
# 2. Connect repository to Vercel
# 3. Configure environment variables
# 4. Deploy
```

### 3. Production Testing

#### Test Production URL
- [ ] App loads successfully
- [ ] No console errors
- [ ] All pages accessible
- [ ] Authentication works
- [ ] Movie features work
- [ ] Database operations work

#### Performance Testing
- [ ] Page load times acceptable
- [ ] API responses fast
- [ ] Database queries optimized
- [ ] Images load properly

## Troubleshooting Common Issues

### Database Connection Issues
```bash
# Check connection string format
echo $DATABASE_URL

# Test connection manually
node -e "
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
prisma.\$connect().then(() => {
  console.log('✅ Connected successfully');
  process.exit(0);
}).catch(err => {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
});
"
```

### Schema Issues
```bash
# Reset and recreate schema
npm run db:setup

# Force reset (⚠️ deletes all data)
npx prisma db push --force-reset
```

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npx prisma generate
```

### Environment Issues
```bash
# Check environment variables
node -e "console.log(process.env.DATABASE_URL ? '✅ DATABASE_URL set' : '❌ DATABASE_URL missing')"
node -e "console.log(process.env.NEXTAUTH_SECRET ? '✅ NEXTAUTH_SECRET set' : '❌ NEXTAUTH_SECRET missing')"
```

## Performance Monitoring

### Database Performance
- Monitor query performance in Supabase dashboard
- Check connection pool usage
- Review slow query logs

### Application Performance
- Monitor Vercel function execution times
- Check Core Web Vitals
- Review error logs

## Security Checklist

- [ ] Production NEXTAUTH_SECRET is secure
- [ ] Database credentials are not in code
- [ ] OAuth redirect URLs updated for production
- [ ] Environment variables properly configured
- [ ] Supabase RLS policies configured (if needed)

## Rollback Plan

If issues occur, you can rollback:

### 1. Revert to Development Database
```bash
# Switch back to development
export NODE_ENV=development
npm run dev
```

### 2. Restore from Backup
```bash
# If you exported data before migration
npm run db:import your-backup-file.json
```

### 3. Revert Code Changes
```bash
# Revert to previous commit
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-hash>
```

## Success Criteria

Migration is successful when:
- [ ] All tests pass
- [ ] Production app works correctly
- [ ] Database operations are fast
- [ ] No data loss occurred
- [ ] Authentication works properly
- [ ] All features function as expected

## Next Steps After Successful Migration

1. **Monitor production** for 24-48 hours
2. **Set up monitoring** (error tracking, performance)
3. **Configure backups** (automated exports)
4. **Update documentation** with new procedures
5. **Train team** on new database operations

Your migration to Supabase is complete! 🎉

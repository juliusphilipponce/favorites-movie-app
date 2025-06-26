#!/usr/bin/env node

/**
 * Pre-deployment check script
 * Validates that all necessary environment variables and configurations are set
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Running pre-deployment checks...\n');

// Check if DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set');
  console.log('   Please set your Supabase connection string in Vercel environment variables');
  process.exit(1);
}

// Validate DATABASE_URL format for PostgreSQL
if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
  console.error('❌ DATABASE_URL must be a PostgreSQL connection string');
  console.log('   Expected format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
  process.exit(1);
}

console.log('✅ DATABASE_URL is properly configured');

// Check if NEXTAUTH_SECRET is set
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  console.error('❌ NEXTAUTH_SECRET environment variable is not set');
  process.exit(1);
}

console.log('✅ NEXTAUTH_SECRET is configured');

// Check if TMDB API key is set
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
if (!tmdbApiKey) {
  console.error('❌ NEXT_PUBLIC_TMDB_API_KEY environment variable is not set');
  process.exit(1);
}

console.log('✅ TMDB API key is configured');

// Check Prisma schema
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Prisma schema file not found');
  process.exit(1);
}

const schemaContent = fs.readFileSync(schemaPath, 'utf8');
if (!schemaContent.includes('provider = "postgresql"')) {
  console.error('❌ Prisma schema must use PostgreSQL provider for Supabase');
  console.log('   Please update datasource db provider to "postgresql"');
  process.exit(1);
}

console.log('✅ Prisma schema is configured for PostgreSQL');

console.log('\n🎉 All pre-deployment checks passed!');
console.log('📝 Make sure to set the following environment variables in Vercel:');
console.log('   - DATABASE_URL (your Supabase connection string)');
console.log('   - NEXTAUTH_URL (your Vercel app URL)');
console.log('   - NEXTAUTH_SECRET');
console.log('   - NEXT_PUBLIC_TMDB_API_KEY');
console.log('   - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET (if using Google OAuth)');

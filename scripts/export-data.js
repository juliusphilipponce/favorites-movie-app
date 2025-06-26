#!/usr/bin/env node

/**
 * Data Export Script
 * Exports data from development database for migration to production
 */

const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');

async function exportData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Exporting data from development database...');
    
    // Export all data
    const data = {
      users: await prisma.user.findMany({
        include: {
          accounts: true,
          sessions: true,
          preferences: true,
        }
      }),
      movies: await prisma.movie.findMany(),
      favorites: await prisma.favorite.findMany(),
      movieRatings: await prisma.movieRating.findMany(),
      reviews: await prisma.review.findMany(),
      watchlists: await prisma.watchlist.findMany({
        include: {
          items: true,
        }
      }),
      verificationTokens: await prisma.verificationToken.findMany(),
    };
    
    // Create exports directory
    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir);
    }
    
    // Save data to JSON file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `data-export-${timestamp}.json`;
    const filepath = path.join(exportsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    
    console.log('✅ Data exported successfully!');
    console.log(`📁 File: ${filepath}`);
    console.log(`📊 Statistics:`);
    console.log(`   Users: ${data.users.length}`);
    console.log(`   Movies: ${data.movies.length}`);
    console.log(`   Favorites: ${data.favorites.length}`);
    console.log(`   Ratings: ${data.movieRatings.length}`);
    console.log(`   Reviews: ${data.reviews.length}`);
    console.log(`   Watchlists: ${data.watchlists.length}`);
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function importData(filename) {
  const prisma = new PrismaClient();
  
  try {
    console.log(`🔄 Importing data from ${filename}...`);
    
    const filepath = path.join(__dirname, '../exports', filename);
    if (!fs.existsSync(filepath)) {
      throw new Error(`File not found: ${filepath}`);
    }
    
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    
    // Import data in correct order (respecting foreign key constraints)
    console.log('📥 Importing users...');
    for (const user of data.users) {
      const { accounts, sessions, preferences, ...userData } = user;
      
      await prisma.user.upsert({
        where: { id: userData.id },
        update: userData,
        create: userData,
      });
      
      // Import user accounts
      for (const account of accounts) {
        await prisma.account.upsert({
          where: { 
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            }
          },
          update: account,
          create: account,
        });
      }
      
      // Import user sessions
      for (const session of sessions) {
        await prisma.session.upsert({
          where: { id: session.id },
          update: session,
          create: session,
        });
      }
      
      // Import user preferences
      if (preferences) {
        await prisma.userPreferences.upsert({
          where: { userId: preferences.userId },
          update: preferences,
          create: preferences,
        });
      }
    }
    
    console.log('📥 Importing movies...');
    for (const movie of data.movies) {
      await prisma.movie.upsert({
        where: { id: movie.id },
        update: movie,
        create: movie,
      });
    }
    
    console.log('📥 Importing favorites...');
    for (const favorite of data.favorites) {
      await prisma.favorite.upsert({
        where: { 
          userId_movieId: {
            userId: favorite.userId,
            movieId: favorite.movieId,
          }
        },
        update: favorite,
        create: favorite,
      });
    }
    
    console.log('📥 Importing ratings...');
    for (const rating of data.movieRatings) {
      await prisma.movieRating.upsert({
        where: { 
          userId_movieId: {
            userId: rating.userId,
            movieId: rating.movieId,
          }
        },
        update: rating,
        create: rating,
      });
    }
    
    console.log('📥 Importing reviews...');
    for (const review of data.reviews) {
      await prisma.review.upsert({
        where: { id: review.id },
        update: review,
        create: review,
      });
    }
    
    console.log('📥 Importing watchlists...');
    for (const watchlist of data.watchlists) {
      const { items, ...watchlistData } = watchlist;
      
      await prisma.watchlist.upsert({
        where: { id: watchlistData.id },
        update: watchlistData,
        create: watchlistData,
      });
      
      // Import watchlist items
      for (const item of items) {
        await prisma.watchlistItem.upsert({
          where: { 
            watchlistId_movieId: {
              watchlistId: item.watchlistId,
              movieId: item.movieId,
            }
          },
          update: item,
          create: item,
        });
      }
    }
    
    console.log('📥 Importing verification tokens...');
    for (const token of data.verificationTokens) {
      await prisma.verificationToken.upsert({
        where: { 
          identifier_token: {
            identifier: token.identifier,
            token: token.token,
          }
        },
        update: token,
        create: token,
      });
    }
    
    console.log('✅ Data imported successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const command = process.argv[2];
const filename = process.argv[3];

switch (command) {
  case 'export':
    exportData();
    break;
  case 'import':
    if (!filename) {
      console.error('Usage: node scripts/export-data.js import <filename>');
      process.exit(1);
    }
    importData(filename);
    break;
  default:
    console.log('Usage: node scripts/export-data.js [export|import] [filename]');
    console.log('  export          - Export data from current database');
    console.log('  import <file>   - Import data from exported file');
    process.exit(1);
}

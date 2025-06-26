#!/usr/bin/env node

/**
 * Authentication Test Script
 * Tests database connection and NextAuth.js compatibility
 */

const { PrismaClient } = require('../src/generated/prisma');

async function testDatabaseConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test user table
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);
    
    // Test NextAuth tables
    const accountCount = await prisma.account.count();
    const sessionCount = await prisma.session.count();
    
    console.log(`📊 Accounts: ${accountCount}`);
    console.log(`📊 Sessions: ${sessionCount}`);
    
    // Test other tables
    const movieCount = await prisma.movie.count();
    const favoriteCount = await prisma.favorite.count();
    
    console.log(`📊 Movies: ${movieCount}`);
    console.log(`📊 Favorites: ${favoriteCount}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function testAuthTables() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Testing NextAuth.js table structure...');
    
    // Test creating a test user (will be cleaned up)
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      }
    });
    
    console.log('✅ User creation successful');
    
    // Test creating a test session
    const testSession = await prisma.session.create({
      data: {
        sessionToken: 'test-session-token',
        userId: testUser.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    });
    
    console.log('✅ Session creation successful');
    
    // Test creating user preferences
    const testPreferences = await prisma.userPreferences.create({
      data: {
        userId: testUser.id,
        theme: 'dark',
        language: 'en',
      }
    });
    
    console.log('✅ User preferences creation successful');
    
    // Clean up test data
    await prisma.userPreferences.delete({
      where: { id: testPreferences.id }
    });
    
    await prisma.session.delete({
      where: { id: testSession.id }
    });
    
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    
    console.log('✅ Test data cleaned up');
    console.log('✅ NextAuth.js compatibility verified');
    
    return true;
    
  } catch (error) {
    console.error('❌ NextAuth.js compatibility test failed:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function testMovieFeatures() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Testing movie features...');
    
    // Test creating a test movie
    const testMovie = await prisma.movie.create({
      data: {
        id: 999999, // Use a high ID to avoid conflicts
        title: 'Test Movie',
        overview: 'This is a test movie',
        releaseDate: '2024-01-01',
        voteAverage: 8.5,
        voteCount: 1000,
      }
    });
    
    console.log('✅ Movie creation successful');
    
    // Test creating a test user for favorites
    const testUser = await prisma.user.create({
      data: {
        email: 'movietest@example.com',
        name: 'Movie Test User',
      }
    });
    
    // Test creating a favorite
    const testFavorite = await prisma.favorite.create({
      data: {
        userId: testUser.id,
        movieId: testMovie.id,
      }
    });
    
    console.log('✅ Favorite creation successful');
    
    // Test creating a rating
    const testRating = await prisma.movieRating.create({
      data: {
        userId: testUser.id,
        movieId: testMovie.id,
        rating: 9.0,
      }
    });
    
    console.log('✅ Rating creation successful');
    
    // Clean up test data
    await prisma.movieRating.delete({
      where: { id: testRating.id }
    });
    
    await prisma.favorite.delete({
      where: { id: testFavorite.id }
    });
    
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    
    await prisma.movie.delete({
      where: { id: testMovie.id }
    });
    
    console.log('✅ Movie features test completed');
    
    return true;
    
  } catch (error) {
    console.error('❌ Movie features test failed:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function runAllTests() {
  console.log('🧪 Starting comprehensive database tests...\n');
  
  const tests = [
    { name: 'Database Connection', fn: testDatabaseConnection },
    { name: 'NextAuth.js Compatibility', fn: testAuthTables },
    { name: 'Movie Features', fn: testMovieFeatures },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`\n📋 Running ${test.name} test...`);
    const result = await test.fn();
    
    if (result) {
      passed++;
      console.log(`✅ ${test.name} test PASSED`);
    } else {
      failed++;
      console.log(`❌ ${test.name} test FAILED`);
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your database is ready for production.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});

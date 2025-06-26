#!/usr/bin/env node

/**
 * Test Database Connection Script
 * Run this to verify your Supabase connection works
 */

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Test the connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database query successful!');
    console.log('PostgreSQL version:', result[0].version);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Tip: Check your database password in the connection string');
    } else if (error.message.includes('does not exist')) {
      console.log('\n💡 Tip: Check your project reference in the connection string');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Tip: Check your internet connection and Supabase project status');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

#!/usr/bin/env node

/**
 * Database Setup Script
 * Handles environment-specific database operations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('postgresql');

function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error running command: ${command}`);
    process.exit(1);
  }
}

function setupDatabase() {
  console.log(`Setting up database for ${isProduction ? 'production' : 'development'} environment...`);
  
  if (isProduction) {
    console.log('Using PostgreSQL (Production)');
    
    // Use production schema
    const prodSchemaPath = path.join(__dirname, '../prisma/schema.production.prisma');
    const mainSchemaPath = path.join(__dirname, '../prisma/schema.prisma');
    
    // Backup current schema
    if (fs.existsSync(mainSchemaPath)) {
      fs.copyFileSync(mainSchemaPath, `${mainSchemaPath}.backup`);
    }
    
    // Copy production schema
    fs.copyFileSync(prodSchemaPath, mainSchemaPath);
    
    console.log('Switched to production schema (PostgreSQL)');
  } else {
    console.log('Using SQLite (Development)');
    
    // Restore development schema if backup exists
    const backupPath = path.join(__dirname, '../prisma/schema.prisma.backup');
    const mainSchemaPath = path.join(__dirname, '../prisma/schema.prisma');
    
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, mainSchemaPath);
      console.log('Restored development schema (SQLite)');
    }
  }
  
  // Generate Prisma client
  runCommand('npx prisma generate');
  
  // Push schema to database
  runCommand('npx prisma db push');
  
  console.log('Database setup completed successfully!');
}

function migrate() {
  console.log('Running database migration...');
  
  if (isProduction) {
    runCommand('npx prisma migrate deploy');
  } else {
    runCommand('npx prisma db push');
  }
  
  console.log('Migration completed!');
}

function reset() {
  console.log('Resetting database...');
  runCommand('npx prisma db push --force-reset');
  console.log('Database reset completed!');
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'setup':
    setupDatabase();
    break;
  case 'migrate':
    migrate();
    break;
  case 'reset':
    reset();
    break;
  default:
    console.log('Usage: node scripts/db-setup.js [setup|migrate|reset]');
    console.log('  setup   - Set up database for current environment');
    console.log('  migrate - Run database migrations');
    console.log('  reset   - Reset database (development only)');
    process.exit(1);
}

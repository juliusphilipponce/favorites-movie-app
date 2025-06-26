#!/usr/bin/env node

/**
 * Deployment Helper Script
 * Automates deployment preparation and validation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, options = {}) {
  console.log(`🔄 Running: ${command}`);
  try {
    const result = execSync(command, { 
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      ...options 
    });
    return result;
  } catch (error) {
    console.error(`❌ Error running command: ${command}`);
    if (options.exitOnError !== false) {
      process.exit(1);
    }
    return null;
  }
}

function checkEnvironmentFile() {
  console.log('📋 Checking environment configuration...');
  
  const envProdPath = path.join(__dirname, '../.env.production');
  const envExamplePath = path.join(__dirname, '../.env.production.example');
  
  if (!fs.existsSync(envProdPath)) {
    console.log('⚠️  .env.production not found');
    
    if (fs.existsSync(envExamplePath)) {
      console.log('📝 Creating .env.production from example...');
      fs.copyFileSync(envExamplePath, envProdPath);
      console.log('✅ .env.production created');
      console.log('🔧 Please edit .env.production with your actual values before deploying');
      return false;
    } else {
      console.error('❌ .env.production.example not found');
      return false;
    }
  }
  
  // Check if environment file has placeholder values
  const envContent = fs.readFileSync(envProdPath, 'utf8');
  const placeholders = [
    '[YOUR-PASSWORD]',
    '[YOUR-PROJECT-REF]',
    'your-tmdb-api-key-here',
    'your-secure-production-secret',
  ];
  
  const hasPlaceholders = placeholders.some(placeholder => 
    envContent.includes(placeholder)
  );
  
  if (hasPlaceholders) {
    console.log('⚠️  .env.production contains placeholder values');
    console.log('🔧 Please update the following in .env.production:');
    placeholders.forEach(placeholder => {
      if (envContent.includes(placeholder)) {
        console.log(`   - ${placeholder}`);
      }
    });
    return false;
  }
  
  console.log('✅ Environment configuration looks good');
  return true;
}

function validateDependencies() {
  console.log('📦 Validating dependencies...');
  
  try {
    // Check if node_modules exists
    if (!fs.existsSync(path.join(__dirname, '../node_modules'))) {
      console.log('📥 Installing dependencies...');
      runCommand('npm install');
    }
    
    // Check if Prisma client is generated
    const prismaClientPath = path.join(__dirname, '../src/generated/prisma');
    if (!fs.existsSync(prismaClientPath)) {
      console.log('🔧 Generating Prisma client...');
      runCommand('npx prisma generate');
    }
    
    console.log('✅ Dependencies validated');
    return true;
  } catch (error) {
    console.error('❌ Dependency validation failed:', error.message);
    return false;
  }
}

function testBuild() {
  console.log('🏗️  Testing production build...');
  
  try {
    // Set production environment
    process.env.NODE_ENV = 'production';
    
    // Run build
    runCommand('npm run build');
    
    console.log('✅ Production build successful');
    return true;
  } catch (error) {
    console.error('❌ Production build failed');
    return false;
  }
}

function testDatabase() {
  console.log('🗄️  Testing database connection...');
  
  try {
    // Set production environment
    process.env.NODE_ENV = 'production';
    
    // Run database test
    runCommand('npm run db:test');
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed');
    return false;
  }
}

function deployToVercel() {
  console.log('🚀 Deploying to Vercel...');
  
  try {
    // Check if Vercel CLI is installed
    const vercelVersion = runCommand('vercel --version', { silent: true, exitOnError: false });
    
    if (!vercelVersion) {
      console.log('📥 Installing Vercel CLI...');
      runCommand('npm install -g vercel');
    }
    
    // Deploy to production
    runCommand('vercel --prod');
    
    console.log('✅ Deployment to Vercel successful');
    return true;
  } catch (error) {
    console.error('❌ Vercel deployment failed');
    return false;
  }
}

function showPostDeploymentSteps() {
  console.log('\n🎉 Deployment completed successfully!');
  console.log('\n📋 Post-deployment checklist:');
  console.log('   1. Update OAuth redirect URLs (Google, GitHub)');
  console.log('   2. Test authentication on production site');
  console.log('   3. Test movie features (search, favorites, ratings)');
  console.log('   4. Check Supabase dashboard for database activity');
  console.log('   5. Monitor Vercel dashboard for any issues');
  console.log('\n📚 For detailed instructions, see DEPLOYMENT.md');
}

async function main() {
  console.log('🚀 Next.js Movie App Deployment Helper\n');
  
  const steps = [
    { name: 'Environment Configuration', fn: checkEnvironmentFile },
    { name: 'Dependencies Validation', fn: validateDependencies },
    { name: 'Database Connection', fn: testDatabase },
    { name: 'Production Build', fn: testBuild },
  ];
  
  // Run validation steps
  for (const step of steps) {
    console.log(`\n📋 ${step.name}...`);
    const success = step.fn();
    
    if (!success) {
      console.log(`\n❌ ${step.name} failed. Please fix the issues above before deploying.`);
      process.exit(1);
    }
  }
  
  console.log('\n✅ All validation steps passed!');
  
  // Ask user if they want to deploy
  const shouldDeploy = process.argv.includes('--deploy') || process.argv.includes('-d');
  
  if (shouldDeploy) {
    console.log('\n🚀 Starting deployment...');
    const deploySuccess = deployToVercel();
    
    if (deploySuccess) {
      showPostDeploymentSteps();
    }
  } else {
    console.log('\n🎯 Ready to deploy! Run with --deploy flag to deploy to Vercel:');
    console.log('   npm run deploy -- --deploy');
    console.log('\n📚 Or follow the manual steps in DEPLOYMENT.md');
  }
}

// Handle command line arguments
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Deployment helper failed:', error);
    process.exit(1);
  });
}

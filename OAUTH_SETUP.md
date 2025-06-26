# OAuth Provider Setup Guide

The authentication system is now working with email/password. OAuth providers (Google, GitHub) are optional and will only appear if properly configured.

## Current Status
✅ **Email/Password Authentication** - Ready to use  
⚠️ **OAuth Providers** - Need setup (optional)

## Quick Test
1. Go to `http://localhost:3000/auth/signup`
2. Create an account with email/password
3. Sign in and test the favorites functionality

## OAuth Setup (Optional)

### Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.developers.google.com/

2. **Create/Select Project**
   - Create a new project or select existing one

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

4. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Movie App"
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

5. **Update Environment Variables**
   ```bash
   GOOGLE_CLIENT_ID=your-actual-google-client-id
   GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
   ```

### GitHub OAuth Setup

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/applications/new

2. **Create OAuth App**
   - Application name: "Movie App"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

3. **Update Environment Variables**
   ```bash
   GITHUB_ID=your-actual-github-client-id
   GITHUB_SECRET=your-actual-github-client-secret
   ```

### After Setup
1. Restart your development server: `npm run dev`
2. OAuth buttons will automatically appear on sign-in/sign-up pages
3. Test the OAuth flow

## Production Setup
For production deployment, make sure to:
1. Update `NEXTAUTH_URL` to your production domain
2. Generate a secure `NEXTAUTH_SECRET`: `openssl rand -base64 32`
3. Update OAuth redirect URIs to production URLs
4. Use environment variables in your hosting platform

## Troubleshooting
- **"OAuth client not found"**: OAuth credentials not configured (expected)
- **"Invalid redirect URI"**: Check callback URLs in OAuth provider settings
- **"Invalid client"**: Check client ID/secret values
- **Email/password not working**: Check database connection and Prisma setup

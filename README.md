# 🎬 Next.js Movie App

A modern, responsive movie discovery and favorites tracking application built with Next.js 15, featuring user authentication, movie search, detailed movie information, and personal favorites management.

![Movie App](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **🔍 Movie Discovery**: Browse popular, trending, top-rated, and upcoming movies
- **🔐 User Authentication**: Secure login with NextAuth.js (Google, GitHub, Email/Password)
- **❤️ Favorites System**: Save and manage favorite movies with smooth animations
- **🎭 Movie Details**: Comprehensive movie information including cast, crew, and similar movies
- **🔎 Advanced Search**: Search movies with real-time results and filtering
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🌙 Dark Theme**: Modern dark UI with blue accent colors
- **⚡ Performance**: Optimized loading states, skeleton screens, and error handling
- **♿ Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with modern hooks
- **Tailwind CSS 4** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

### Backend & Database
- **NextAuth.js** - Authentication library
- **Prisma ORM** - Database toolkit and query builder
- **Supabase PostgreSQL** - Production database (SQLite for development)
- **bcryptjs** - Password hashing

### APIs & Services
- **TMDB API** - Movie data and images
- **Next.js API Routes** - Backend API endpoints

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type definitions for better development experience

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **TMDB API Key** - [Get one here](https://www.themoviedb.org/settings/api)
- **Database** - Supabase PostgreSQL for production or SQLite for development
- **OAuth Providers** (optional) - Google and/or GitHub OAuth apps

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nextjs-movie-app.git
cd nextjs-movie-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# Database
DATABASE_URL="file:./dev.db"  # SQLite for development
# DATABASE_URL="postgresql://user:password@localhost:5432/movieapp"  # PostgreSQL for production

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# TMDB API
TMDB_API_KEY="your-tmdb-api-key-here"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### 4. Database Setup

#### Development (SQLite)
```bash
# Generate Prisma client and set up development database
npm run db:setup

# (Optional) View database in Prisma Studio
npm run db:studio
```

#### Production (Supabase)
```bash
# Create .env.production with your Supabase credentials
cp .env.production.example .env.production

# Edit .env.production with your actual values
# Then set up production database
export NODE_ENV=production
npm run db:setup

# Test the connection
npm run db:test
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nextjs-movie-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── dev.db                 # SQLite database (development)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth.js routes
│   │   │   ├── favorites/    # Favorites management
│   │   │   └── user/         # User preferences
│   │   ├── auth/             # Authentication pages
│   │   ├── movie/[id]/       # Dynamic movie detail pages
│   │   ├── movies/           # Movies listing page
│   │   ├── favorites/        # User favorites page
│   │   ├── globals.css       # Global styles
│   │   └── layout.js         # Root layout
│   ├── components/           # React components
│   │   ├── movies/          # Movie-related components
│   │   ├── ui/              # Reusable UI components
│   │   └── providers/       # Context providers
│   ├── contexts/            # React contexts
│   │   ├── FavoritesContext.js
│   │   └── MovieFilterContext.js
│   ├── lib/                 # Utility libraries
│   │   ├── api/            # API utilities
│   │   ├── hooks/          # Custom React hooks
│   │   ├── auth.js         # NextAuth configuration
│   │   ├── prisma.js       # Prisma client
│   │   └── tmdb.js         # TMDB API utilities
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── middleware.js          # Next.js middleware
└── package.json           # Dependencies and scripts
```

## 🔌 API Documentation

### Authentication Routes
- `GET/POST /api/auth/*` - NextAuth.js authentication endpoints
- `GET /api/auth/session` - Get current user session

### Favorites Routes
- `GET /api/favorites` - Get user's favorite movies
- `POST /api/favorites` - Add movie to favorites
- `DELETE /api/favorites/[movieId]` - Remove movie from favorites

### User Routes
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update user preferences

### Example API Usage

```javascript
// Add movie to favorites
const response = await fetch('/api/favorites', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tmdbId: 550, // Fight Club
    title: "Fight Club",
    posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
  })
});

// Get user's favorites
const favorites = await fetch('/api/favorites').then(res => res.json());
```

## 🌐 Deployment

### Environment Variables for Production

Update your `.env` file for production:

```env
# Production Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Production URLs
NEXTAUTH_URL="https://yourdomain.com"

# Secure secret for production
NEXTAUTH_SECRET="your-production-secret-key"

# Keep API keys the same
TMDB_API_KEY="your-tmdb-api-key"
```

### Database Migration for Production

```bash
# Run migrations on production database
npx prisma db push

# Or use migrate for production
npx prisma migrate deploy
```

### Deployment Platforms

This app can be deployed on:

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Other Platforms
- **Netlify** - Full-stack deployment with serverless functions
- **Railway** - Easy PostgreSQL database hosting
- **Heroku** - Traditional platform-as-a-service
- **DigitalOcean App Platform** - Managed container platform

### Production Checklist

- [ ] Set up production PostgreSQL database
- [ ] Configure all environment variables
- [ ] Set up OAuth providers for production domains
- [ ] Run database migrations
- [ ] Test authentication flows
- [ ] Verify TMDB API integration
- [ ] Test responsive design on various devices

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
src/
├── components/
│   └── ui/
│       └── __tests__/
│           └── YearFilter.test.js
└── lib/
    └── __tests__/
        └── tmdb.test.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add TypeScript types for new features
- Include proper error handling and loading states
- Test responsive design on multiple screen sizes
- Update documentation for new features
- Write tests for new functionality

### Code Style

- Use functional components with hooks
- Implement proper error boundaries
- Follow Next.js best practices
- Use Tailwind CSS for styling
- Maintain accessibility standards

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Reset database
npx prisma db push --force-reset
npx prisma generate
```

**TMDB API Issues**
- Verify your API key is correct
- Check API rate limits
- Ensure proper error handling

**Authentication Issues**
- Verify OAuth provider settings
- Check NEXTAUTH_URL matches your domain
- Ensure NEXTAUTH_SECRET is set

### Getting Help

- Check the [Issues](https://github.com/yourusername/nextjs-movie-app/issues) page
- Review Next.js [documentation](https://nextjs.org/docs)
- Check TMDB [API documentation](https://developers.themoviedb.org/3)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Prisma](https://www.prisma.io/) for the database toolkit
- [Heroicons](https://heroicons.com/) for beautiful icons

---

**Built with ❤️ using Next.js and modern web technologies**

> This is a portfolio project demonstrating full-stack web development with modern technologies and best practices.

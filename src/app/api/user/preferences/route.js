import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user preferences exist
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id }
    })

    // If no preferences exist, create default ones
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId: session.user.id,
          emailNotifications: true,
          movieRecommendations: true,
          language: 'en',
          theme: 'dark',
          advancedFilteringEnabled: false,
          preferredGenres: null,
          excludedGenres: null,
        }
      })
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      emailNotifications,
      movieRecommendations,
      language,
      theme,
      advancedFilteringEnabled,
      preferredGenres,
      excludedGenres
    } = body

    // Validate input - be more lenient
    if (emailNotifications !== undefined && typeof emailNotifications !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid emailNotifications value' },
        { status: 400 }
      )
    }

    if (movieRecommendations !== undefined && typeof movieRecommendations !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid movieRecommendations value' },
        { status: 400 }
      )
    }

    if (language && !['en', 'es', 'fr', 'de'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language selection' },
        { status: 400 }
      )
    }

    if (theme && !['light', 'dark'].includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme selection' },
        { status: 400 }
      )
    }

    // Validate advanced filtering settings
    if (advancedFilteringEnabled !== undefined && typeof advancedFilteringEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid advancedFilteringEnabled value' },
        { status: 400 }
      )
    }

    // Validate genre arrays - they come as JSON strings from frontend
    if (preferredGenres !== undefined) {
      try {
        if (typeof preferredGenres === 'string') {
          const parsed = JSON.parse(preferredGenres)
          if (!Array.isArray(parsed) || !parsed.every(id => typeof id === 'number')) {
            return NextResponse.json(
              { error: 'Invalid preferredGenres format - must be array of numbers' },
              { status: 400 }
            )
          }
        } else if (!Array.isArray(preferredGenres) || !preferredGenres.every(id => typeof id === 'number')) {
          return NextResponse.json(
            { error: 'Invalid preferredGenres format - must be array of numbers' },
            { status: 400 }
          )
        }
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid preferredGenres JSON format' },
          { status: 400 }
        )
      }
    }

    if (excludedGenres !== undefined) {
      try {
        if (typeof excludedGenres === 'string') {
          const parsed = JSON.parse(excludedGenres)
          if (!Array.isArray(parsed) || !parsed.every(id => typeof id === 'number')) {
            return NextResponse.json(
              { error: 'Invalid excludedGenres format - must be array of numbers' },
              { status: 400 }
            )
          }
        } else if (!Array.isArray(excludedGenres) || !excludedGenres.every(id => typeof id === 'number')) {
          return NextResponse.json(
            { error: 'Invalid excludedGenres format - must be array of numbers' },
            { status: 400 }
          )
        }
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid excludedGenres JSON format' },
          { status: 400 }
        )
      }
    }

    // Get existing preferences first for partial updates
    const existingPreferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id }
    })

    // Build update data, preserving existing values for fields not provided
    const updateData = {}

    // Only update fields that are provided
    if (emailNotifications !== undefined) {
      updateData.emailNotifications = emailNotifications
    }
    if (movieRecommendations !== undefined) {
      updateData.movieRecommendations = movieRecommendations
    }
    if (language !== undefined) {
      updateData.language = language
    }
    if (theme !== undefined) {
      updateData.theme = theme
    }
    if (advancedFilteringEnabled !== undefined) {
      updateData.advancedFilteringEnabled = advancedFilteringEnabled
    }
    if (preferredGenres !== undefined) {
      updateData.preferredGenres = preferredGenres
    }
    if (excludedGenres !== undefined) {
      updateData.excludedGenres = excludedGenres
    }



    const preferences = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        emailNotifications: emailNotifications ?? true,
        movieRecommendations: movieRecommendations ?? true,
        language: language || 'en',
        theme: theme || 'dark',
        advancedFilteringEnabled: advancedFilteringEnabled ?? false,
        preferredGenres: preferredGenres || null,
        excludedGenres: excludedGenres || null,
      }
    })

    return NextResponse.json({ 
      message: 'Preferences updated successfully',
      preferences 
    })
  } catch (error) {
    console.error('Error updating user preferences:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

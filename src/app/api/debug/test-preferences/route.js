import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Received body:', body)
    
    const { 
      emailNotifications, 
      movieRecommendations, 
      language, 
      theme 
    } = body

    console.log('Parsed values:', {
      emailNotifications,
      movieRecommendations,
      language,
      theme,
      types: {
        emailNotifications: typeof emailNotifications,
        movieRecommendations: typeof movieRecommendations,
        language: typeof language,
        theme: typeof theme
      }
    })

    // Test creating preferences
    const preferences = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: {
        emailNotifications: emailNotifications ?? true,
        movieRecommendations: movieRecommendations ?? true,
        language: language || 'en',
        theme: theme || 'dark',
      },
      create: {
        userId: session.user.id,
        emailNotifications: emailNotifications ?? true,
        movieRecommendations: movieRecommendations ?? true,
        language: language || 'en',
        theme: theme || 'dark',
      }
    })

    return NextResponse.json({ 
      message: 'Test successful',
      preferences,
      receivedData: body
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}

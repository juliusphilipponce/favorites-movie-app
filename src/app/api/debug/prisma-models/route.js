import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test what models are available
    const models = Object.keys(prisma)
    
    // Try to access UserPreferences with different casings
    let userPreferencesTest = null
    let error = null
    
    try {
      // Test lowercase
      if (prisma.userPreferences) {
        userPreferencesTest = 'userPreferences exists'
      }
    } catch (e) {
      error = e.message
    }
    
    try {
      // Test PascalCase
      if (prisma.UserPreferences) {
        userPreferencesTest = 'UserPreferences exists'
      }
    } catch (e) {
      error = e.message
    }

    return NextResponse.json({
      success: true,
      availableModels: models.filter(key => !key.startsWith('$') && !key.startsWith('_')),
      userPreferencesTest,
      error
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}

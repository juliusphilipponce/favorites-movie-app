import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  console.log('POST /api/auth/register-simple called')
  
  try {
    const body = await request.json()
    console.log('Request body:', { ...body, password: '[REDACTED]' })
    
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, store password as plain text (NOT for production!)
    // This is just to test the database connection
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: password, // Plain text for testing only
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'User created successfully (simple version)',
        user: userWithoutPassword
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

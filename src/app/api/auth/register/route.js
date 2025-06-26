import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// Handle GET requests (for debugging)
export async function GET() {
  return NextResponse.json(
    {
      message: 'This endpoint only accepts POST requests for user registration',
      methods: ['POST', 'OPTIONS']
    },
    { status: 405 }
  )
}

export async function POST(request) {
  console.log('POST /api/auth/register called')

  try {
    const body = await request.json()
    console.log('Request body:', { ...body, password: '[REDACTED]' })

    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      console.log('Validation failed: missing fields')
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Checking for existing user...')
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    console.log('Existing user check complete:', !!existingUser)

    if (existingUser) {
      console.log('User already exists')
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    console.log('Hashing password...')
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('Password hashed successfully')

    console.log('Creating user...')
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })
    console.log('User created successfully:', user.id)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    console.log('Returning success response')
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

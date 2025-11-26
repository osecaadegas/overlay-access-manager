import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { hasAccess: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user has access (all authenticated users can access, but you can customize this)
    const hasAccess = ['USER', 'MODERATOR', 'ADMIN'].includes(session.role)

    return NextResponse.json({
      hasAccess,
      role: session.role,
      email: session.email
    })
  } catch (error) {
    console.error('Check access error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

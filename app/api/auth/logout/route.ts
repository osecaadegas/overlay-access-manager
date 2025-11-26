import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (token) {
      const payload = verifyToken(token)
      if (payload) {
        // Delete session from database
        await prisma.session.deleteMany({
          where: { token }
        })
      }
    }

    // Clear cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete('session')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

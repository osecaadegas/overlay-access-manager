import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/api/auth/login', '/api/auth/register']
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token
  const payload = verifyToken(token)
  
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin-only routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (payload.role !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Forbidden: Admin access required' },
          { status: 403 }
        )
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

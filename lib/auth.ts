import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}

export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) return null

  return verifyToken(token)
}

export async function requireAuth(): Promise<TokenPayload> {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}

export async function requireAdmin(): Promise<TokenPayload> {
  const session = await requireAuth()
  
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }

  return session
}

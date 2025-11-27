import { NextResponse } from 'next/server'

// Temporary debug route. REMOVE after use.
export async function GET() {
  const allow = process.env.NODE_ENV !== 'production' ? true : process.env.ALLOW_ENV_DEBUG === 'true'
  if (!allow) {
    return NextResponse.json({ error: 'Disabled' }, { status: 403 })
  }
  const exposed: Record<string, string | undefined> = {}
  const keysToShow = ['NODE_ENV', 'DATABASE_URL', 'JWT_SECRET', 'NEXT_PUBLIC_APP_URL', 'POSTGRES_PRISMA_URL']
  for (const k of keysToShow) {
    const v = process.env[k]
    if (v) exposed[k] = v.replace(/(.{6}).*(.{4})/, '$1***$2') // mask middle
  }
  return NextResponse.json({ env: exposed })
}

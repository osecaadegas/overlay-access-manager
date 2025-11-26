import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Update user role (Admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const { role } = await request.json()

    if (!role || !['USER', 'ADMIN', 'MODERATOR'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete user (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

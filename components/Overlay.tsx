'use client'

import { useEffect, useState } from 'react'

interface OverlayProps {
  children?: React.ReactNode
  requireRole?: 'USER' | 'MODERATOR' | 'ADMIN'
}

export default function OverlayComponent({ children, requireRole }: OverlayProps) {
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>('')
  const [error, setError] = useState('')

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    try {
      const response = await fetch('/api/overlay/access')
      const data = await response.json()

      if (response.ok && data.hasAccess) {
        setUserRole(data.role)
        
        // If a specific role is required, check if user has it
        if (requireRole) {
          const roleHierarchy: { [key: string]: number } = {
            'USER': 1,
            'MODERATOR': 2,
            'ADMIN': 3
          }
          
          const userLevel = roleHierarchy[data.role] || 0
          const requiredLevel = roleHierarchy[requireRole] || 0
          
          setHasAccess(userLevel >= requiredLevel)
        } else {
          setHasAccess(true)
        }
      } else {
        setError(data.message || 'Access denied')
      }
    } catch (err) {
      setError('Failed to verify access')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-xl text-gray-800">Verifying access...</div>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            {error || 'You do not have permission to view this overlay.'}
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login to Continue
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="overlay-wrapper">
      {/* Overlay Content */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 shadow-lg z-40">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h3 className="text-xl font-bold">Protected Overlay</h3>
            <p className="text-sm opacity-90">Access granted - Role: {userRole}</p>
          </div>
          <div className="flex gap-4">
            <a href="/dashboard" className="px-4 py-2 bg-white text-purple-600 rounded hover:bg-gray-100 transition">
              Dashboard
            </a>
            <a href="/logout" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Logout
            </a>
          </div>
        </div>
      </div>

      {/* Custom Content */}
      {children && (
        <div className="pt-20">
          {children}
        </div>
      )}
    </div>
  )
}

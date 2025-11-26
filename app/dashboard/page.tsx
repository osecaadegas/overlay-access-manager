'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      
      if (!response.ok) {
        router.push('/login')
        return
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">User Information</h2>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Email:</span> {user?.email}</p>
                <p><span className="font-medium">Name:</span> {user?.name || 'Not set'}</p>
                <p><span className="font-medium">Role:</span> <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{user?.role}</span></p>
                <p><span className="font-medium">Member since:</span> {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Links</h2>
              <div className="flex gap-4">
                {user?.role === 'ADMIN' && (
                  <a
                    href="/admin"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Admin Panel
                  </a>
                )}
                <a
                  href="/overlay"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  View Overlay
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

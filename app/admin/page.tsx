'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAuthAndFetchUsers()
  }, [])

  const checkAuthAndFetchUsers = async () => {
    try {
      // Check if user is authenticated and is admin
      const authResponse = await fetch('/api/auth/me')
      
      if (!authResponse.ok) {
        router.push('/login')
        return
      }

      const authData = await authResponse.json()
      
      if (authData.user.role !== 'ADMIN') {
        router.push('/dashboard')
        return
      }

      // Fetch all users
      const usersResponse = await fetch('/api/admin/users')
      
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users')
      }

      const usersData = await usersResponse.json()
      setUsers(usersData.users)
    } catch (error) {
      setError('Failed to load users')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error('Failed to update role')
      }

      // Refresh users list
      await checkAuthAndFetchUsers()
    } catch (error) {
      alert('Failed to update user role')
      console.error(error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      // Refresh users list
      await checkAuthAndFetchUsers()
    } catch (error) {
      alert('Failed to delete user')
      console.error(error)
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
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
            <div className="flex gap-4">
              <a
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Dashboard
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Management</h2>
            <p className="text-gray-600 mb-4">Total Users: {users.length}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-gray-900"
                      >
                        <option value="USER">USER</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from 'react'

interface User {
  sub: string
  email: string
  name?: string
  picture?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth(): AuthState & {
  login: () => void
  logout: () => void
  getUserId: () => string | null
} {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/me')

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setError(null)
      } else {
        setUser(null)
        if (response.status !== 401) {
          setError('Failed to check authentication status')
        }
      }
    } catch (err) {
      console.error('Auth check error:', err)
      setUser(null)
      setError('Failed to check authentication status')
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    window.location.href = '/api/auth/login'
  }

  const logout = () => {
    window.location.href = '/api/auth/logout'
  }

  const getUserId = (): string | null => {
    return user?.sub || null
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    getUserId
  }
}
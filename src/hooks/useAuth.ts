"use client"

import { useUser } from '@auth0/nextjs-auth0'

export function useAuth() {
  const { user, error, isLoading } = useUser()

  return {
    user,
    loading: isLoading,
    error,
    login: () => window.location.href = '/auth/login',
    logout: () => window.location.href = '/auth/logout',
    getUserId: () => user?.sub || null,
    isAuthenticated: !!user,
    refreshUser: async () => {
      window.location.reload()
    },
  }
}
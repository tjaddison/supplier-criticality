"use client"

import { useUser } from '@auth0/nextjs-auth0'

export function useAuth() {
  const { user, error, isLoading } = useUser()

  return {
    user: user ? {
      id: user.sub || '',
      email: user.email || '',
      name: user.name || '',
      picture: user.picture || '',
      role: user.app_metadata?.role || user.app_metadata?.subscription_tier || 'free',
      subscription: user.app_metadata?.subscription_tier
    } : null,
    loading: isLoading,
    error: error?.message || null,
    login: () => window.location.href = '/auth/login',
    logout: () => window.location.href = '/auth/logout',
    getUserId: () => user?.sub || null,
    isAuthenticated: !!user,
    refreshUser: async () => {
      window.location.reload()
    },
  }
}
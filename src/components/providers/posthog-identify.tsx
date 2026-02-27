"use client"

import { usePostHog } from "posthog-js/react"
import { useEffect } from "react"

interface Props {
  userId: string
  email: string
  name: string
  role?: string
  subscription?: string
}

export function PostHogIdentify({ userId, email, name, role, subscription }: Props) {
  const posthog = usePostHog()

  useEffect(() => {
    if (posthog && userId) {
      posthog.identify(userId, { email, name, role, subscription })
    }
  }, [posthog, userId, email, name, role, subscription])

  return null
}

'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function UserSyncComponent() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user data to database
      fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(err => console.error('Failed to sync user:', err))
    }
  }, [user, isLoaded])

  return null // This component doesn't render anything
}
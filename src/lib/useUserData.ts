'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './auth'
import { db } from './db'

export function useUserData() {
  const { user } = useAuth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    db.getOnboarding(user.id).then((data: Record<string, unknown> | null) => {
      setUserData(data)
      setLoading(false)
    })
  }, [user])

  const refresh = () => {
    if (!user) return
    db.getOnboarding(user.id).then((data: Record<string, unknown> | null) => setUserData(data))
  }

  return { userData, loading, refresh }
}

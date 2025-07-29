'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface PowerSyncContextType {
  db: any | null
  isConnected: boolean
  isInitialized: boolean
  error: string | null
}

const PowerSyncContext = createContext<PowerSyncContextType>({
  db: null,
  isConnected: false,
  isInitialized: false,
  error: null,
})

export function PowerSyncProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<any | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initializePowerSync() {
      try {
        // Get environment variables
        const powerSyncUrl = process.env.NEXT_PUBLIC_POWERSYNC_URL
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!powerSyncUrl || !supabaseUrl || !supabaseAnonKey) {
          console.log('PowerSync not configured - running in offline-only mode')
          setIsInitialized(true)
          return
        }

        // For MVP, we'll initialize PowerSync when needed
        // In a full implementation, this would use the proper PowerSync SDK
        console.log('PowerSync configuration available, ready for initialization')
        setIsConnected(false) // Start in offline mode
        setIsInitialized(true)
        
        console.log('PowerSync context initialized successfully')
      } catch (err) {
        console.error('Failed to initialize PowerSync:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setIsInitialized(true)
      }
    }

    initializePowerSync()
  }, [])

  return (
    <PowerSyncContext.Provider 
      value={{ 
        db, 
        isConnected, 
        isInitialized, 
        error 
      }}
    >
      {children}
    </PowerSyncContext.Provider>
  )
}

export function usePowerSync() {
  const context = useContext(PowerSyncContext)
  if (!context) {
    throw new Error('usePowerSync must be used within a PowerSyncProvider')
  }
  return context
}
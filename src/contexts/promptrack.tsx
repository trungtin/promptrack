'use client'

import { Promptrack } from '@/lib/promptrack'
import { IStorage } from '@promptrack/storage'
import React from 'react'

interface PromptrackConfig {
  storage: IStorage
}

const PromptrackContext = React.createContext<{
  promptrack: Promptrack
} | null>(null)

export function PromptrackProvider({
  children,
  storage,
}: PromptrackConfig & { children: React.ReactNode }) {
  const promptrack = React.useMemo(() => {
    return new Promptrack({ storage })
  }, [storage])
  return (
    <PromptrackContext.Provider value={{ promptrack }}>
      {children}
    </PromptrackContext.Provider>
  )
}

export function usePromptrack() {
  const context = React.useContext(PromptrackContext)
  if (!context) {
    throw new Error('usePromptrack must be used within a PromptrackProvider')
  }
  return context.promptrack
}

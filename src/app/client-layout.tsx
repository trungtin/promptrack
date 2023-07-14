'use client'

import { PromptrackProvider } from '@/contexts/promptrack'
import { firestore } from '@/lib/firestore'
import { FirestoreStorage } from '@promptrack/storage-firestore'
import * as React from 'react'

const storage = new FirestoreStorage(firestore)

function ClientLayout({ children }: { children: React.ReactNode }) {
  return <PromptrackProvider storage={storage}>{children}</PromptrackProvider>
}

export default ClientLayout

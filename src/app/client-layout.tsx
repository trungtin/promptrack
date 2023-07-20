'use client'

import { PromptrackProvider } from '@/contexts/promptrack'
import { firestore } from '@/lib/firestore'
import { FirestoreStorage } from '@promptrack/storage-firestore'

import ChakraLayout from './layouts/chakra'

import * as React from 'react'

const storage = new FirestoreStorage(firestore)

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChakraLayout>
      <PromptrackProvider storage={storage}>{children}</PromptrackProvider>
    </ChakraLayout>
  )
}

export default ClientLayout

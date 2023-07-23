'use client'

import { PromptrackProvider } from '@/contexts/promptrack'
import { firestore } from '@/lib/firestore'
import { FirestoreStorage } from '@promptrack/storage-firestore'

import ChakraLayout from './layouts/chakra'

import * as React from 'react'
import Nav from '@/components/Nav'

import { Box, Container } from '@chakra-ui/react'

const storage = new FirestoreStorage(firestore)

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChakraLayout>
      <PromptrackProvider storage={storage}>
        <Nav />
        <main>
          <Container maxWidth="container.lg" centerContent>
            <Box w="100%">{children}</Box>
          </Container>
        </main>
      </PromptrackProvider>
    </ChakraLayout>
  )
}

export default ClientLayout

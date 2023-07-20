import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, LightMode } from '@chakra-ui/react'

import { theme } from './theme'

export default function ChakraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}

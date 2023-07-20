import { Theme, extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
} as const

const colors = {}

export const theme = extendTheme({ config, colors } as const) as Theme

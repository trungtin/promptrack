import { Theme, extendTheme } from '@chakra-ui/react'
import { inputTheme } from './components/input'
import { textareaTheme } from './components/textarea'

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true,
} as const

const colors = {}

export const theme = extendTheme({
  config,
  colors,
  components: { Input: inputTheme, Textarea: textareaTheme },
} as const) as Theme

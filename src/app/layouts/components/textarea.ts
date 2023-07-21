import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  _dark: {
    bg: 'gray.700',
    _placeholder: {
      color: 'gray.400',
    },
  },
  _light: {
    bg: 'gray.300',
  },
})

export const textareaTheme = defineStyleConfig({
  baseStyle,
})

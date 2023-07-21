import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    _dark: {
      bg: 'gray.700',
      _placeholder: {
        color: 'gray.400',
      },
    },
    _light: {
      bg: 'gray.300',
    },
  },
})

export const inputTheme = defineMultiStyleConfig({ baseStyle })

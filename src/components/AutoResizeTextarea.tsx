import { Textarea, TextareaProps } from '@chakra-ui/react'
import ResizeTextarea from 'react-textarea-autosize'
import React from 'react'

export const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>((props, ref) => {
  return (
    <Textarea
      minH="unset"
      w="100%"
      resize="none"
      ref={ref}
      minRows={1}
      as={ResizeTextarea}
      {...props}
    />
  )
})

AutoResizeTextarea.displayName = 'AutoResizeTextarea'

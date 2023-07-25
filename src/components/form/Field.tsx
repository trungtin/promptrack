import { AutoResizeTextarea } from '@/components'
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import { UseFormRegisterReturn } from 'react-hook-form'

function Field<T>({
  fieldErrorMessage,
  displayName,
  placeholder,
  fieldProps,
  disabled,
}: {
  fieldErrorMessage: (name: keyof T) => string
  displayName: string
  placeholder: string
  fieldProps: UseFormRegisterReturn<any>
  disabled?: boolean
}) {
  const fieldError = fieldErrorMessage(fieldProps.name)
  return (
    <FormControl
      isInvalid={Boolean(fieldError)}
      isDisabled={disabled}
      key={fieldProps.name}
    >
      <FormLabel htmlFor={fieldProps.name + '-input'}>{displayName}</FormLabel>
      <AutoResizeTextarea
        id={fieldProps.name + '-input'}
        placeholder={placeholder}
        {...fieldProps}
        variant={'outline'}
        maxRows={20}
      />
      <FormErrorMessage>{fieldError}</FormErrorMessage>
    </FormControl>
  )
}

export default Field

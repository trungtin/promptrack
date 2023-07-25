'use client'

import { AutoResizeTextarea, GoBackButton, LoadingStatus } from '@/components'
import { usePromptrack } from '@/contexts/promptrack'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { IPrompt } from '@promptrack/storage'
import { useParams, useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'

function PlaygroundScriptsCreatePageForm(props: { prompt: IPrompt }) {
  const promptrack = usePromptrack()
  const router = useRouter()
  const toast = useToast()

  // must use the same key as in prompt
  // because later we use _.extend to merge the values
  const defaultValues = {
    context: {},
  }
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    getFieldState,
  } = useForm({
    defaultValues,
  })

  async function onSubmit(values: any) {
    const { context } = values
    await promptrack.storage.script.upsertScript({
      promptName: props.prompt.name,
      script: {
        context: context,
      },
    })
    toast({
      title: 'Success',
      description: `Script created`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
    router.push('.')
  }
  function fieldErrorMessage(name: keyof typeof defaultValues) {
    const fieldState = getFieldState(name)

    return fieldState.error?.message?.toString() ?? ''
  }

  const contextArgKeys = props.prompt.keys

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={6}>
        {[
          ...contextArgKeys.map((key) => {
            return {
              // name: `context.${key}`,
              name: `context.${key}`,
              displayName: key,
              disabled: false,
              placeholder: '',
              props: register(`context.${key}` as any, {
                required: 'This is required',
              }),
            }
          }),
        ].map((field) => {
          const fieldError = fieldErrorMessage(field.name as any)
          return (
            <FormControl
              isInvalid={Boolean(fieldError)}
              isDisabled={isSubmitting || field.disabled}
              key={field.name}
            >
              <FormLabel htmlFor={field.name + '-input'}>
                {field.displayName}
              </FormLabel>
              <AutoResizeTextarea
                id={field.name + '-input'}
                placeholder={field.placeholder}
                {...field.props}
                variant={'outline'}
                maxRows={20}
              />
              <FormErrorMessage>{fieldError}</FormErrorMessage>
            </FormControl>
          )
        })}
      </Stack>
      <Button mt={12} colorScheme="blue" isLoading={isSubmitting} type="submit">
        Create
      </Button>
    </form>
  )
}

function PlaygroundScriptsCreatePage(props: {}) {
  const { prompt_name } = useParams()
  const promptrack = usePromptrack()
  const [prompt, loading, loadError] = promptrack.usePrompt({
    promptName: prompt_name,
  })
  return (
    <Stack spacing={4} direction="column">
      <div>
        <GoBackButton />
      </div>
      <LoadingStatus data={prompt} loading={loading} error={loadError}>
        <PlaygroundScriptsCreatePageForm prompt={prompt!} />
      </LoadingStatus>
    </Stack>
  )
}

export default PlaygroundScriptsCreatePage

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

function PromptAddVersionPage(props: {}) {
  const { prompt_name } = useParams()
  const promptrack = usePromptrack()
  const [prompt, loading, loadError] = promptrack.usePrompt({
    promptName: prompt_name,
  })

  return (
    <Stack spacing={4} direction="column">
      <div>
        <GoBackButton></GoBackButton>
      </div>
      <LoadingStatus data={prompt} loading={loading} error={loadError}>
        <PromptAddVersionPageInner prompt={prompt!}></PromptAddVersionPageInner>
      </LoadingStatus>
    </Stack>
  )
}

export default PromptAddVersionPage

function PromptAddVersionPageInner({ prompt }: { prompt: IPrompt }) {
  const promptrack = usePromptrack()
  const router = useRouter()
  const toast = useToast()

  // must use the same key as in prompt
  // because later we use _.extend to merge the values
  const defaultValues = {
    name: prompt.name,
    displayName: '',
    prompt: prompt.prompt,
  }
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    getFieldState,
  } = useForm({
    defaultValues,
  })

  async function onSubmit(values: any) {
    await promptrack.storage.prompt.upsertPromptVersion({
      promptId: prompt.id,
      version: {
        prompt: values.prompt,
        displayName: values.displayName,
      },
    })

    toast({
      title: 'Success',
      description: `Prompt "${prompt.name}" has been updated`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
    router.push('.')
  }
  function fieldErrorMessage(name: keyof typeof defaultValues) {
    return getFieldState(name).error?.message?.toString() ?? ''
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={6}>
        {[
          {
            displayName: 'Prompt name',
            disabled: true,
            placeholder: '',
            props: register('name'),
          },
          {
            displayName: 'Version name',
            placeholder: '',
            props: register('displayName', {
              required: 'This is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            }),
          },
          {
            displayName: 'Prompt value',
            disabled: false,
            placeholder: '',
            props: register('prompt', {
              required: 'This is required',
            }),
            textarea: true,
          },
        ].map((field) => {
          const Element = field.textarea ? AutoResizeTextarea : Input
          const fieldError = fieldErrorMessage(field.props.name as any)
          return (
            <FormControl
              isInvalid={Boolean(fieldError)}
              isDisabled={isSubmitting || field.disabled}
              key={field.props.name}
            >
              <FormLabel htmlFor={field.props.name + '-input'}>
                {field.displayName}
              </FormLabel>
              <Element
                id={field.props.name + '-input'}
                placeholder={field.placeholder}
                {...field.props}
                variant={'outline'}
                {...(field.textarea
                  ? {
                      maxRows: 20,
                    }
                  : {})}
              />
              <FormErrorMessage>{fieldError}</FormErrorMessage>
            </FormControl>
          )
        })}
      </Stack>
      <Button mt={12} colorScheme="blue" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}

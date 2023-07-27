'use client'

import { Field, GoBackButton, LoadingStatus } from '@/components'
import { usePromptrack } from '@/contexts/promptrack'
import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { IPrompt } from '@promptrack/storage'
import { useParams, useRouter } from 'next/navigation'

import { FieldPath, useForm } from 'react-hook-form'

function PlaygroundScriptsCreatePageForm(props: { prompt: IPrompt }) {
  const promptrack = usePromptrack()
  const router = useRouter()
  const toast = useToast()

  // must use the same key as in prompt
  // because later we use _.extend to merge the values
  const defaultValues = {
    displayName: '',
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

  async function onSubmit(values: typeof defaultValues) {
    const { context } = values
    await promptrack.storage.script.upsertScript({
      promptName: props.prompt.name,
      script: {
        displayName: values.displayName,
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
  function fieldErrorMessage(name: FieldPath<typeof defaultValues>) {
    return getFieldState(name).error?.message?.toString() ?? ''
  }

  const contextArgKeys = props.prompt.keys

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={6}>
        {[
          {
            displayName: 'Display Name',
            placeholder: '',
            props: register('displayName' as any, {
              required: 'This is required',
            }),
          },
        ].map((field) => {
          return (
            <Field<typeof defaultValues>
              {...field}
              disabled={isSubmitting}
              key={field.props.name}
              fieldErrorMessage={fieldErrorMessage}
              fieldProps={field.props}
            ></Field>
          )
        })}
        <Box position="relative" padding="10">
          <Divider />
          <AbsoluteCenter
            bg={useColorModeValue('#fff', 'rgb(25, 30, 42)')}
            px="4"
          >
            <Text as="b">Context</Text>
          </AbsoluteCenter>
        </Box>
        {contextArgKeys.map((key) => {
          const name = `context.${key}`
          return (
            <Field<typeof defaultValues>
              displayName={key}
              placeholder=""
              disabled={isSubmitting}
              key={name}
              fieldErrorMessage={fieldErrorMessage}
              fieldProps={register(name as any, {
                required: 'This is required',
              })}
            />
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
  const [prompt, loading, loadError] = promptrack.storage.prompt.usePrompt({
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

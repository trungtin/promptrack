'use client'

import { AutoResizeTextarea } from '@/components/AutoResizeTextarea'
import { usePromptrack } from '@/contexts/promptrack'
import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Skeleton,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react'
import { IPrompt } from '@promptrack/storage'
import { clone, extend } from 'lodash'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

function PromptEditPage(props: {}) {
  const { prompt_name } = useParams()
  const promptrack = usePromptrack()
  const [prompt, loading, loadError] = promptrack.usePrompt({
    promptName: prompt_name,
  })

  let inner

  if (loading) {
    inner = (
      <Stack spacing={4}>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    )
  } else if (loadError) {
    inner = <Text>{loadError.message}</Text>
  } else if (!prompt) {
    inner = <Text>Not found</Text>
  } else {
    inner = <PromptEditPageInner prompt={prompt}></PromptEditPageInner>
  }

  return (
    <Stack spacing={4} direction="column">
      <div>
        <IconButton
          aria-label="Go back"
          icon={<ArrowBackIcon />}
          as={Link}
          href={`.`}
        />
      </div>
      {inner}
    </Stack>
  )
}

export default PromptEditPage

function PromptEditPageInner({ prompt }: { prompt: IPrompt }) {
  const promptrack = usePromptrack()
  const router = useRouter()
  const toast = useToast()

  // must use the same key as in prompt
  // because later we use _.extend to merge the values
  const defaultValues = {
    name: prompt.name,
    prompt: prompt.prompt,
  }
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, touchedFields: touched },
  } = useForm({
    defaultValues,
  })

  async function onSubmit(values: any) {
    await promptrack.updatePrompt({
      prompt: extend(clone(prompt), values),
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
  function fieldError(name: keyof typeof defaultValues) {
    return Boolean(errors[name] && touched[name])
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {[
        {
          name: 'name' as const,
          displayName: 'Prompt Name',
          disabled: true,
          placeholder: '',
          props: register('name', {
            required: 'This is required',
            minLength: { value: 4, message: 'Minimum length should be 4' },
          }),
        },
        {
          name: 'prompt' as const,
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
        return (
          <FormControl
            isInvalid={fieldError('name')}
            isDisabled={isSubmitting || field.disabled}
            key={field.name}
          >
            <FormLabel htmlFor={field.name + '-input'}>
              {field.displayName}
            </FormLabel>
            <Element
              id={field.name + '-input'}
              placeholder={field.placeholder}
              {...field.props}
              variant={'outline'}
              {...(field.textarea
                ? {
                    maxRows: 20,
                  }
                : {})}
            />
            <FormErrorMessage>
              {errors[field.name]?.message?.toString()}
            </FormErrorMessage>
          </FormControl>
        )
      })}
      <Button mt={4} colorScheme="blue" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}

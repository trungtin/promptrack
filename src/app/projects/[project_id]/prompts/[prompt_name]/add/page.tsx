'use client'

import {
  AutoResizeTextarea,
  Divider,
  GoBackButton,
  LoadingStatus,
} from '@/components'
import { usePromptrack } from '@/contexts/promptrack'
import { notNull } from '@/utils'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  ListItem,
  Select,
  Stack,
  UnorderedList,
  useToast,
} from '@chakra-ui/react'
import { IPrompt } from '@promptrack/storage'
import { useParams, useRouter } from 'next/navigation'
import { Controller, FieldPath, useFieldArray, useForm } from 'react-hook-form'

function PromptAddVersionPage(props: {}) {
  const { prompt_name } = useParams()
  const promptrack = usePromptrack()
  const [prompt, loading, loadError] = promptrack.storage.prompt.usePrompt({
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

  const isCompletionPrompt = 'prompt' in prompt

  const defaultValues = {
    name: prompt.name,
    displayName: '',
    ...(isCompletionPrompt
      ? { prompt: prompt.prompt, messages: [] }
      : { messages: prompt.messages, prompt: '' }),
  }
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    control,
    getFieldState,
    getValues,
  } = useForm({
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'messages',
  })
  async function onSubmit(values: typeof defaultValues) {
    await promptrack.storage.prompt.upsertPromptVersion(prompt.id, {
      displayName: values.displayName,
      ...(isCompletionPrompt
        ? { prompt: values.prompt }
        : { messages: values.messages }),
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
  function fieldErrorMessage(name: FieldPath<typeof defaultValues>) {
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
          isCompletionPrompt
            ? {
                displayName: 'Prompt value',
                disabled: false,
                placeholder: '',
                props: register('prompt', {
                  required: 'This is required',
                }),
                textarea: true,
              }
            : null,
        ]
          .filter(notNull)
          .map((field) => {
            const Element = field.textarea ? AutoResizeTextarea : Input
            const fieldError = fieldErrorMessage(field.props.name)
            return (
              <FormControl
                isInvalid={Boolean(fieldError)}
                isDisabled={isSubmitting || field.disabled}
                key={field.props.name}
              >
                <FormLabel>{field.displayName}</FormLabel>
                <Element
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
        {!isCompletionPrompt ? (
          <>
            <Divider>Messages</Divider>
            <UnorderedList listStyleType="none" marginInline={0} spacing={4}>
              <FormControl
                isInvalid={fields.length == 0}
                {...register('messages', { required: 'Must exists' })}
              >
                <FormErrorMessage>
                  Must have at least one message
                </FormErrorMessage>
              </FormControl>
              {fields.map((item, index, arr) => {
                const contentErrorMessage = fieldErrorMessage(
                  `messages.${index}.content`
                )
                return (
                  <ListItem key={item.id}>
                    <Stack direction="row" spacing={4}>
                      <Controller
                        render={({ field, fieldState: { error } }) => {
                          return (
                            <FormControl isInvalid={!!error} maxW={'8rem'}>
                              <Select {...field}>
                                <option value="system">System</option>
                                <option value="user">User</option>
                                <option value="assistant">Assistant</option>
                              </Select>

                              <FormErrorMessage>
                                {fieldErrorMessage(`messages.${index}.role`)}
                              </FormErrorMessage>
                            </FormControl>
                          )
                        }}
                        name={`messages.${index}.role`}
                        control={control}
                      />
                      <FormControl
                        isInvalid={Boolean(contentErrorMessage)}
                        isDisabled={isSubmitting}
                      >
                        <AutoResizeTextarea
                          placeholder="Message content"
                          {...register(`messages.${index}.content`, {
                            required: 'This is required',
                          })}
                        />
                        <FormErrorMessage>
                          {contentErrorMessage}
                        </FormErrorMessage>
                      </FormControl>

                      <IconButton
                        aria-label="Delete a message"
                        icon={<DeleteIcon />}
                        onClick={() => remove(index)}
                        isDisabled={arr.length == 1 || isSubmitting}
                      />
                    </Stack>
                  </ListItem>
                )
              })}
            </UnorderedList>
            <IconButton
              aria-label="Add a message"
              icon={<AddIcon />}
              onClick={() =>
                append({
                  role:
                    getValues(`messages.${fields.length - 1}.role`) === 'user'
                      ? 'assistant'
                      : 'user',
                  content: '',
                })
              }
            />
          </>
        ) : null}
      </Stack>
      <Button mt={12} colorScheme="blue" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}

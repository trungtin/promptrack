'use client'

import { LoadingStatus } from '@/components'
import { usePromptrack } from '@/contexts/promptrack'
import { PlusSquareIcon, TriangleUpIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Heading,
  IconButton,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { IScript } from '@promptrack/storage'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

import { Select } from 'chakra-react-select'
import { Controller, useForm } from 'react-hook-form'

function PlaygrounPromptPage(props: {}) {
  const { prompt_name } = useParams()
  return (
    <Box>
      <Flex justifyContent="space-between">
        <Box />
        <Box>
          <Flex>
            <IconButton
              aria-label="Create new script"
              icon={<PlusSquareIcon />}
              as={Link}
              href={`./${prompt_name}/scripts/create`}
            />
          </Flex>
        </Box>
      </Flex>
      <PlaygroundPromptScripts></PlaygroundPromptScripts>
    </Box>
  )
}

export default PlaygrounPromptPage

function PlaygroundPromptScripts() {
  const { prompt_name } = useParams()
  const promptrack = usePromptrack()
  const [scripts, scriptsLoading, scriptsError] =
    promptrack.storage.script.useScriptCollection({ promptName: prompt_name })
  return (
    <Stack spacing={4}>
      <Heading as="h1">Scripts</Heading>

      <Divider></Divider>
      <LoadingStatus
        data={scripts}
        loading={scriptsLoading}
        error={scriptsError}
      >
        <PlaygroundPromptScriptsInner scripts={scripts!} />
      </LoadingStatus>
    </Stack>
  )
}

function PlaygroundPromptScriptsInner(p: { scripts: IScript[] }) {
  return (
    <UnorderedList
      listStyleType="none"
      marginInline={0}
      spacing={6}
      pt={2}
      pb={2}
    >
      {p.scripts.map((script) => {
        return (
          <ListItem key={script.id}>
            <PlaygroundPromptScript script={script} />
          </ListItem>
        )
      })}
    </UnorderedList>
  )
}

function PlaygroundPromptScript({ script }: { script: IScript }) {
  const promptrack = usePromptrack()
  const { prompt_name: promptName } = useParams()
  const router = useRouter()

  const defaultValues = {
    promptVersions: [] as { value: string }[],
  }
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
  })

  const [selecting, setSelect] = useState(false)
  const [promptVersions, promptVersionsLoading, promptVersionsError] =
    promptrack.storage.prompt.usePromptVersionCollection({
      promptName: promptName,
    })

  const onRun = async (values: typeof defaultValues) => {
    const path = [
      'compare',
      script.id,
      values.promptVersions.map((v) => v.value).join('-'),
    ].join('/')

    router.push(`./${promptName}/${path}`)
  }
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Text fontSize="lg" as="b">
        {script.displayName}
      </Text>
      {selecting ? (
        <Flex>
          <LoadingStatus
            data={promptVersions}
            loading={promptVersionsLoading}
            error={promptVersionsError}
            numberOfLines={1}
            loadingProps={{
              width: '12rem',
            }}
          >
            <Controller
              control={control}
              name="promptVersions"
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { error },
              }) => (
                <FormControl>
                  <Select
                    options={promptVersions?.map((v) => {
                      return {
                        label: v.displayName,
                        value: v.id,
                      }
                    })}
                    isMulti
                    ref={ref}
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    selectedOptionStyle="check"
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        minWidth: '12rem',
                      }),
                    }}
                  ></Select>
                </FormControl>
              )}
            />
          </LoadingStatus>
          <Button onClick={handleSubmit(onRun)} ml={2}>
            <TriangleUpIcon transform="auto" rotate={90} />
          </Button>
        </Flex>
      ) : (
        <Button onClick={() => setSelect(true)}>
          <TriangleUpIcon transform="auto" rotate={90} mr={2} /> Run Script
        </Button>
      )}
    </Stack>
  )
}

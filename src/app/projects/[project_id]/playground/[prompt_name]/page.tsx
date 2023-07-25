'use client'

import { LoadingStatus } from '@/components'
import { usePromptrack } from '@/contexts/promptrack'
import { PlusSquareIcon } from '@chakra-ui/icons'
import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { IScript } from '@promptrack/storage'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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
    <UnorderedList listStyleType="none" marginInline={0} spacing={6} pt={2} pb={2}>
      {p.scripts.map((script) => {
        return (
          <ListItem key={script.id}>
            <Stack direction="row">
              <Text fontSize="lg" as="b">
                {script.displayName}
              </Text>
            </Stack>
          </ListItem>
        )
      })}
    </UnorderedList>
  )
}

'use client'

import { usePromptrack } from '@/contexts/promptrack'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

function Promtps(props: {}) {
  const promptrack = usePromptrack()
  const { project_id } = useParams()
  const [prompts, promptsLoading, promptsError] = promptrack.usePrompts()
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      {prompts?.map((prompt) => (
        <Prompt
          key={prompt.id}
          prompt={prompt}
          project_id={project_id}
        ></Prompt>
      ))}
    </Accordion>
  )
}

export default Promtps

function Prompt({ prompt, project_id }: { prompt: any; project_id: string }) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton bg="blackAlpha.300">
          <Box as="span" flex="1" textAlign="left">
            {prompt.name}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <Stack
          spacing={4}
          direction="row"
          align="top"
          justifyContent="space-between"
        >
          <Text>{prompt.prompt}</Text>
          <Stack spacing={4} direction="row" align="top">
            <Button
              colorScheme={useColorModeValue('blackAlpha', 'gray')}
              size="sm"
              as={Link}
              href={`/projects/${project_id}/playground/${prompt.id}`}
            >
              Playground
            </Button>
            <Button
              colorScheme={useColorModeValue('blackAlpha', 'gray')}
              size="sm"
              as={Link}
              href={`/projects/${project_id}/prompts/${prompt.id}/add`}
            >
              Add version
            </Button>
          </Stack>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  )
}

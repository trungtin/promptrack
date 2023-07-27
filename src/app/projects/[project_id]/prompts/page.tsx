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
  Flex,
  Input,
  ListItem,
  PropsOf,
  Stack,
  Text,
  UnorderedList,
  useColorModeValue,
} from '@chakra-ui/react'
import { IPrompt, IPromptChat, IPromptCompletion } from '@promptrack/storage'
import Link from 'next/link'
import { useParams } from 'next/navigation'

function BorderBox({ children, ...props }: PropsOf<typeof Box>) {
  return (
    <Box
      borderWidth="1px"
      borderRadius={4}
      borderColor="gray.700"
      py={2}
      px={3}
      {...props}
    >
      {children}
    </Box>
  )
}

function Promtps(props: {}) {
  const promptrack = usePromptrack()
  const { project_id } = useParams()
  const [prompts, promptsLoading, promptsError] =
    promptrack.storage.prompt.usePromptCollection()
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

function Prompt({
  prompt,
  project_id,
}: {
  prompt: IPrompt
  project_id: string
}) {
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
          {'prompt' in prompt ? (
            <PromptCompletionInner prompt={prompt} />
          ) : (
            <PromptChatInner prompt={prompt} />
          )}

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

function PromptCompletionInner(props: { prompt: IPromptCompletion }) {
  return (
    <BorderBox w="100%" maxH={80} overflow="auto">
      <Text>{props.prompt.prompt}</Text>
    </BorderBox>
  )
}
function PromptChatInner(props: { prompt: IPromptChat }) {
  return (
    <UnorderedList spacing={4} w="100%" px={0} marginInlineStart={0}>
      {props.prompt.messages.map((message, idx) => {
        return (
          <ListItem key={idx} listStyleType="none">
            <Flex direction="row">
              <Input isDisabled value={message.role} w="6rem" px={2} />

              <BorderBox flex={1} ml={3}>
                <Text>{message.content}</Text>
              </BorderBox>
            </Flex>
          </ListItem>
        )
      })}
    </UnorderedList>
  )
}

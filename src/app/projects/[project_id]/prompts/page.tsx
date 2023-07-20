'use client'

import { usePromptrack } from '@/contexts/promptrack'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react'

function Promtps(props: {}) {
  const promptrack = usePromptrack()
  const [prompts, promptsLoading, promptsError] = promptrack.usePrompts()
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      {prompts?.docs.map((prompt) => (
        <Prompt key={prompt.id} prompt={prompt.data()}></Prompt>
      ))}
    </Accordion>
  )
}

export default Promtps

function Prompt(props: { prompt: any }) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton bg="blackAlpha.300">
          <Box as="span" flex="1" textAlign="left">
            {props.prompt.name}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {props.prompt.prompt}
      </AccordionPanel>
    </AccordionItem>
  )
}

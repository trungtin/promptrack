'use client'

import { PlusSquareIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton } from '@chakra-ui/react'
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
    </Box>
  )
}

export default PlaygrounPromptPage

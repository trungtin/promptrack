import { Box, Divider as ChakraDivider, Stack, Text } from '@chakra-ui/react'

function Divider(props: { children: React.ReactNode }) {
  return (
    <Stack spacing="6" py="4" px="8" direction="row" alignItems="center">
      <ChakraDivider />
      <Text as="b">{props.children}</Text>
      <ChakraDivider />
    </Stack>
  )
}

export default Divider

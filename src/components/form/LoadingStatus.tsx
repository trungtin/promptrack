import { Skeleton, Stack, Text } from '@chakra-ui/react'
import React from 'react'

/**
 * Add loading and error states to a component
 * If loading, show a skeleton
 * If error, show the error message
 * Else render the children
 *
 *
 * @props loading
 * @props error
 * @props data (optional)
 *
 */
export default function LoadingStatus(props: {
  loading: boolean
  error: Error | undefined
  data?: any
  children: React.ReactNode
}) {
  if (props.loading) {
    return (
      <Stack spacing={4}>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    )
  }
  if (props.error) {
    return <Text>{props.error.message}</Text>
  }
  if ('data' in props && !props.data) {
    return <Text>Not found</Text>
  }
  return props.children
}

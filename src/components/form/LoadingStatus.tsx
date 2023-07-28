import { PropsOf, Skeleton, Stack, Text } from '@chakra-ui/react'
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
  numberOfLines?: number
  data?: any
  children: React.ReactNode
  skeletonProps?: PropsOf<typeof Skeleton>
  loadingProps?: PropsOf<typeof Stack>
}) {
  if (props.loading) {
    return (
      <Stack
        spacing={4}
        justifyContent="center"
        width="100%"
        {...props.loadingProps}
      >
        {Array.from({ length: props.numberOfLines ?? 3 }).map((_, i) => (
          <Skeleton
            height="20px"
            key={i}
            width="100%"
            {...props.skeletonProps}
          />
        ))}
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

import { ArrowBackIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import Link from 'next/link'

export default function GoBackButton() {
  return (
    <IconButton
      aria-label="Go back"
      icon={<ArrowBackIcon />}
      as={Link}
      href={`.`}
    />
  )
}

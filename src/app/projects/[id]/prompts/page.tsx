'use client'

import { usePromptrack } from '@/contexts/promptrack'
import * as React from 'react'
type Props = {}

function Promtps(props: Props) {
  const promptrack = usePromptrack()
  const [prompts, promptsLoading, promptsError] = promptrack.usePrompts()
  return
}

export default Promtps

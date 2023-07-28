import { usePromptrack } from '@/contexts/promptrack'
import { useParams } from 'next/navigation'

function ComparePage(props: {}) {
  const { prompt_name, script_id, compare_ids } = useParams()
  const promptrack = usePromptrack()

  return <div></div>
}

export default ComparePage

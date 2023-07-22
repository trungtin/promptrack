import { headers } from 'next/headers'

import { redirect } from 'next/navigation'

function Page(props: {}) {
  const h = headers()
  const fullUrl = h.get('referer') || h.get('x-url') || ''
  const [, project_id] =
    fullUrl.match(new RegExp(`/projects/(.*?)/prompts`)) || []

  redirect(`/projects/${project_id}/prompts`)
}

export default Page

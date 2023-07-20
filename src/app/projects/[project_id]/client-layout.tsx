'use client'

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import {
  redirect,
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from 'next/navigation'

const tabs = [
  {
    name: 'Prompts',
    path: 'prompts',
  },
]

function ProjectClientLayout(props: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment()
  const router = useRouter()
  const params = useParams()
  if (!segment) {
    redirect(`/projects/${params.project_id}/${tabs[0].path}`)
  }
  return (
    <Tabs>
      <TabList>
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            onClick={() => {
              router.push(`/projects/${params.project_id}/${tab.path}`)
            }}
          >
            {tab.name}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {tabs.map((tab) => (
          <TabPanel key={tab.path}>
            {segment == tab.path ? props.children : null}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}

export default ProjectClientLayout

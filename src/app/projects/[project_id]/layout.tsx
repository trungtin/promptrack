import ProjectClientLayout from './client-layout'

function ProjectLayout(props: { children: React.ReactNode }) {
  return <ProjectClientLayout>{props.children}</ProjectClientLayout>
}

export default ProjectLayout

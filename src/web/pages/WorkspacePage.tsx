import Breadcrumb from '../components/common/Breadcrumb'
import WorkspaceEditCard from '../components/workspaces/WorkspaceEditCard'
import ShippingBuildList from '../components/shippingBuilds/ShippingBuildList'
import { useParams } from 'react-router-dom'

function WorkspacePage() {
  const { workspaceId = '' } = useParams()
  return (
    <>
      <Breadcrumb workspaceId={workspaceId} />
      <WorkspaceEditCard workspaceId={workspaceId} />
      <ShippingBuildList workspaceId={workspaceId} />
    </>
  )
}

export default WorkspacePage

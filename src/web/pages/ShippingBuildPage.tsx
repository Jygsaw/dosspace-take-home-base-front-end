import Breadcrumb from '../components/common/Breadcrumb'
import ShippingBuildEditCard from '../components/shippingBuilds/ShippingBuildEditCard'
import ShipmentList from '../components/shipments/ShipmentList'
import { useParams } from 'react-router-dom'

function ShippingBuildPage() {
  const { workspaceId = '', buildShipmentId = '' } = useParams()
  return (
    <>
      <Breadcrumb workspaceId={workspaceId} buildShipmentId={buildShipmentId} />
      <ShippingBuildEditCard workspaceId={workspaceId} buildShipmentId={buildShipmentId} />
      <ShipmentList workspaceId={workspaceId} buildShipmentId={buildShipmentId} />
    </>
  )
}

export default ShippingBuildPage

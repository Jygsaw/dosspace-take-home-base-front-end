import Breadcrumb from '../components/common/Breadcrumb'
import ShipmentEditCard from '../components/shipments/ShipmentEditCard'
import { useParams } from 'react-router-dom'

function ShipmentPage() {
  const { workspaceId = '', buildShipmentId = '', shipmentId = '' } = useParams()
  return (
    <>
      <Breadcrumb
        workspaceId={workspaceId}
        buildShipmentId={buildShipmentId}
        shipmentId={shipmentId}
      />
      <ShipmentEditCard
        workspaceId={workspaceId}
        buildShipmentId={buildShipmentId}
        shipmentId={shipmentId}
      />
    </>
  )
}

export default ShipmentPage

import { Link } from 'react-router-dom'

interface Props {
  workspaceId?: string
  buildShipmentId?: string
  shipmentId?: string
}

const Breadcrumb = ({ workspaceId, buildShipmentId, shipmentId }: Props) => {
  const links: React.ReactNode[] = [
    <Link key="home" to={`/`}>
      Home
    </Link>,
  ]
  if (workspaceId) {
    links.push(
      <Link key="workspace" to={`/${workspaceId}`}>
        Workspace
      </Link>
    )
  }
  if (buildShipmentId) {
    links.push(
      <Link key="buildShipment" to={`/${workspaceId}/buildShipments/${buildShipmentId}`}>
        Shipping Build
      </Link>
    )
  }
  if (shipmentId) {
    links.push(
      <Link
        key="shipment"
        to={`/${workspaceId}/buildShipments/${buildShipmentId}/shipments/${shipmentId}`}
      >
        Shipment
      </Link>
    )
  }
  for (let i = links.length - 1; i >= 0; i--) {
    if (i !== 0) {
      links.splice(i, 0, ' > ')
    }
  }

  return <div>{links}</div>
}

export default Breadcrumb

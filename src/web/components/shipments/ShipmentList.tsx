import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, Stack, Button, CardHeader } from '@mui/material'
import DosspaceApi from '../../api'
import type { BuildShipment } from '../../../api/types'

interface ShipmentListItem {
  id: string
  orderNumber: string
}

const ShipmentList = ({
  workspaceId,
  buildShipmentId,
}: {
  workspaceId: string
  buildShipmentId: string
}) => {
  const [buildShipment, setBuildShipment] = useState<Partial<BuildShipment>>()
  const navigate = useNavigate()

  const handleAddShipment = async () => {
    const newShipment = await DosspaceApi.addShipment(workspaceId, buildShipmentId)
    navigate(`/${workspaceId}/buildShipments/${buildShipmentId}/shipments/${newShipment.id}`)
  }

  useEffect(() => {
    async function fetchBuildShipment(workspaceId: string, buildShipmentId: string) {
      const buildShipment = await DosspaceApi.getBuildShipment(workspaceId, buildShipmentId)
      setBuildShipment(buildShipment)
    }
    fetchBuildShipment(workspaceId, buildShipmentId)
  }, [workspaceId, buildShipmentId])

  return (
    <Card variant="outlined" className="Card">
      <CardHeader sx={{ marginBottom: 0, paddingBottom: 0 }} title="Shipments" />
      <CardContent>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {buildShipment?.shipments?.map((shipment: ShipmentListItem) => (
            <Link
              key={shipment.id}
              to={`/${workspaceId}/buildShipments/${buildShipmentId}/shipments/${shipment.id}`}
              style={{ textDecoration: 'none' }}
            >
              {shipment.orderNumber || '[Untitled Shipment]'}
            </Link>
          ))}
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleAddShipment}>
            Add Shipment
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ShipmentList

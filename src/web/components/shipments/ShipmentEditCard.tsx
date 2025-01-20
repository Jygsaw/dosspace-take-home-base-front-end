import { useEffect, useState } from 'react'
import { debounce, Card, CardContent, CardHeader, TextField } from '@mui/material'
import DosspaceApi from '../../api'
import { validateOrderNumber, validateString, validateCost } from '../../utils/validation'
import type { Shipment } from '../../../api/types'

const debouncedUpdateShipment = debounce(DosspaceApi.updateShipment, 1000)

interface Props {
  workspaceId: string
  buildShipmentId: string
  shipmentId: string
}

const ShipmentEditCard = ({ workspaceId, buildShipmentId, shipmentId }: Props) => {
  const [shipment, setShipment] = useState<Partial<Shipment>>()

  const handleSave = (shipment: Partial<Shipment>) => {
    debouncedUpdateShipment(workspaceId, buildShipmentId, shipment)
    return shipment
  }

  const handleOrderNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShipment((prev) => handleSave({ ...prev, orderNumber: event.target.value }))
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShipment((prev) => handleSave({ ...prev, description: event.target.value }))
  }

  const handleCostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShipment((prev) => handleSave({ ...prev, cost: Number(event.target.value) }))
  }

  useEffect(() => {
    async function fetchShipment(workspaceId: string, buildShipmentId: string, shipmentId: string) {
      const shipment = await DosspaceApi.getShipment(workspaceId, buildShipmentId, shipmentId)
      setShipment(shipment)
    }

    fetchShipment(workspaceId, buildShipmentId, shipmentId)
  }, [workspaceId, buildShipmentId, shipmentId])

  return (
    <Card variant="outlined" className="Card">
      <CardHeader title="Shipment Details" />
      <CardContent>
        <TextField
          error={!validateOrderNumber(shipment?.orderNumber)}
          fullWidth
          margin="normal"
          label="Order Number"
          name="orderNumber"
          value={shipment?.orderNumber || ''}
          onChange={handleOrderNumberChange}
        />
        <TextField
          error={!validateString(shipment?.description)}
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={shipment?.description || ''}
          onChange={handleDescriptionChange}
        />
        <TextField
          error={!validateCost(shipment?.cost)}
          fullWidth
          margin="normal"
          label="Cost"
          name="cost"
          type="number"
          value={shipment?.cost || ''}
          onChange={handleCostChange}
        />
      </CardContent>
    </Card>
  )
}

export default ShipmentEditCard

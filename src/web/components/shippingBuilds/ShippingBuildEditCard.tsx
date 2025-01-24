import { useEffect, useState } from 'react'
import DosspaceApi from '../../api'
import { debounce, Card, CardContent, CardHeader, TextField } from '@mui/material'
import type { BuildShipment } from '../../../api/types'
import { validateBuildNumber } from '../../utils/validation'

const debouncedUpdateBuildShipment = debounce(DosspaceApi.updateBuildShipment, 1000)

interface Props {
  workspaceId: string
  buildShipmentId: string
}

const ShippingBuildEditCard = ({ workspaceId, buildShipmentId }: Props) => {
  const [buildShipment, setBuildShipment] = useState<Partial<BuildShipment>>()

  const handleSave = (buildShipment: Partial<BuildShipment>) => {
    debouncedUpdateBuildShipment(workspaceId, buildShipment)
    return buildShipment
  }

  const handleBuildNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuildShipment((prev) => handleSave({ ...prev, buildNumber: event.target.value }))
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
      <CardHeader title="Shipping Build" />
      <CardContent>
        <TextField
          error={!validateBuildNumber(buildShipment?.buildNumber)}
          fullWidth
          margin="normal"
          label="Build Number"
          name="buildNumber"
          value={buildShipment?.buildNumber || ''}
          onChange={handleBuildNumberChange}
        />
      </CardContent>
    </Card>
  )
}

export default ShippingBuildEditCard

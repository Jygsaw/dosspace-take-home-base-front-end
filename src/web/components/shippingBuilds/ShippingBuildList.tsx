import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, Stack, Button, CardHeader } from '@mui/material'
import DosspaceApi from '../../api'
import type { Workspace } from '../../../api/types'

interface ShippingBuildListItem {
  id: string
  buildNumber: string
}

const ShippingBuildList = ({ workspaceId }: { workspaceId: string }) => {
  const [workspace, setWorkspace] = useState<Partial<Workspace>>()
  const navigate = useNavigate()

  const handleAddBuildShipment = async () => {
    const newBuildShipment = await DosspaceApi.addBuildShipment(workspaceId)
    navigate(`/${workspaceId}/buildShipments/${newBuildShipment.id}`)
  }

  useEffect(() => {
    async function fetchWorkspace(workspaceId: string) {
      const workspace = await DosspaceApi.getWorkspace(workspaceId)
      setWorkspace(workspace)
    }
    fetchWorkspace(workspaceId)
  }, [workspaceId])

  return (
    <Card variant="outlined" className="Card">
      <CardHeader sx={{ marginBottom: 0, paddingBottom: 0 }} title="Shipping Builds" />
      <CardContent>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {workspace?.buildShipments?.map((shippingBuild: ShippingBuildListItem) => (
            <Link
              key={shippingBuild.id}
              to={`/${workspace.id}/buildShipments/${shippingBuild.id}`}
              style={{ textDecoration: 'none' }}
            >
              {shippingBuild.buildNumber || '[Untitled Shipping Build]'}
            </Link>
          ))}
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleAddBuildShipment}>
            Add Shipping Build
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ShippingBuildList

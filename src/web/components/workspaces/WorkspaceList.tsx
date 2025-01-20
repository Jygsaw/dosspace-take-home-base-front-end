import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, Stack, Button, CardHeader } from '@mui/material'
import DosspaceApi from '../../api'
import '../../style/WorkspaceList.css'

interface WorkspaceListItem {
  id: string
  title: string
}

/** Homepage list of all workspaces that have been created */
const WorkspaceList = () => {
  const [workspaces, setWorkspaces] = useState<WorkspaceListItem[]>()
  const navigate = useNavigate()

  const fetchWorkspaces = async () => {
    const workspaces = await DosspaceApi.getWorkspaces()
    setWorkspaces(workspaces)
  }

  const handleAddWorkspace = async () => {
    const newWorkspace = await DosspaceApi.addWorkspace()
    navigate(`/${newWorkspace.id}`)
  }

  const handleResetWorkspaces = async () => {
    await DosspaceApi.resetWorkspaces()
    fetchWorkspaces()
  }

  // Fetch all workspaces from the API
  useEffect(() => {
    fetchWorkspaces()
  }, [])

  return (
    <Card variant="outlined" className="Card">
      <CardHeader sx={{ marginBottom: 0, paddingBottom: 0 }} title="Workspaces" />
      <CardContent>
        <Stack spacing={1} mb={3}>
          {workspaces?.map((workspace) => (
            <Link key={workspace.id} to={`/${workspace.id}`} style={{ textDecoration: 'none' }}>
              {workspace.title || '[Untitled Workspace]'}
            </Link>
          ))}
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleAddWorkspace}>
            Add Workspace
          </Button>
          <Button variant="outlined" onClick={handleResetWorkspaces}>
            Reset Workspaces
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default WorkspaceList

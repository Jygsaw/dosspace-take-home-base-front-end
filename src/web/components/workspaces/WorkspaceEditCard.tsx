import { useState, useEffect } from 'react'
import DosspaceApi from '../../api'
import { debounce, Card, CardContent, CardHeader, TextField } from '@mui/material'
import type { Workspace } from '../../../api/types'
import { validateString } from '../../utils/validation'

const debouncedUpdateWorkspace = debounce(DosspaceApi.updateWorkspace, 1000)

interface Props {
  workspaceId: string
}

function WorkspaceEditCard({ workspaceId }: Props) {
  const [workspace, setWorkspace] = useState<Partial<Workspace>>()

  const handleSave = (workspace: Partial<Workspace>) => {
    debouncedUpdateWorkspace(workspace)
    return workspace
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspace((prev) => handleSave({ ...prev, title: event.target.value }))
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
      <CardHeader title="Workspace" />
      <CardContent>
        <TextField
          error={!validateString(workspace?.title)}
          fullWidth
          margin="normal"
          label="Title"
          name="title"
          value={workspace?.title || ''}
          onChange={handleTitleChange}
        />
      </CardContent>
    </Card>
  )
}

export default WorkspaceEditCard

import { useEffect, useState } from 'react'
import '../style/WorkspaceList.css'
import DosspaceApi from '../api'

interface HomepageWorkspace {
  id: string
  title: string
}

/** Homepage list of all workspaces that have been created */
export default function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<HomepageWorkspace[]>([])

  // Fetch all workspaces from the API
  useEffect(() => {
    async function fetchWorkspaces() {
      const workspaces = await DosspaceApi.getWorkspaces()
      setWorkspaces(workspaces)
    }

    fetchWorkspaces()
  }, [])

  return (
    <div className="WorkspaceList">
      <h1 className="WorkspaceList__header">All workspaces</h1>
      {workspaces.map((workspace) => (
        <div key={workspace.id} className="WorkspaceList__workspaceCard">
          {workspace.title}
        </div>
      ))}
    </div>
  )
}

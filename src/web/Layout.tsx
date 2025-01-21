import { useNavigate } from 'react-router-dom'
import WorkspacesRoutes from './routes/WorkspacesRoutes'

import './style/Workspaces.css'

function Workspaces() {
  const navigate = useNavigate()

  return (
    <div className="Workspace__container">
      <div className="Workspaces__header" onClick={() => navigate('/')}>
        Dosspace
      </div>
      <div className="Workspaces__content">
        <WorkspacesRoutes />
      </div>
    </div>
  )
}

export default Workspaces

import { Routes, Route } from 'react-router-dom'
import ReadMe from '../components/ReadMe'
import WorkspacesPage from '../pages/WorkspacesPage'
import ShipmentPage from '../pages/ShipmentPage'
import ShippingBuildPage from '../pages/ShippingBuildPage'
import WorkspacePage from '../pages/WorkspacePage'

const WorkspacesRoutes = () => {
  return (
    <Routes>
      {/* static routes*/}
      <Route path="/readme" element={<ReadMe />} />

      {/* dynamic routes */}
      <Route
        path="/:workspaceId/buildShipments/:buildShipmentId/shipments/:shipmentId"
        element={<ShipmentPage />}
      />
      <Route path="/:workspaceId/buildShipments/:buildShipmentId" element={<ShippingBuildPage />} />
      <Route path="/:workspaceId" element={<WorkspacePage />} />

      {/* catch-all route */}
      <Route path="*" element={<WorkspacesPage />} />
    </Routes>
  )
}

export default WorkspacesRoutes

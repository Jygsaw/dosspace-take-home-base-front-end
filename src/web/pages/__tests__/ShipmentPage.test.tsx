import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ShipmentPage from '../ShipmentPage'

// Mock the child components
jest.mock('../../components/common/Breadcrumb', () => ({
  __esModule: true,
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}))

jest.mock('../../components/shipments/ShipmentEditCard', () => ({
  __esModule: true,
  default: () => <div data-testid="shipment-edit-card">ShipmentEditCard</div>,
}))

const renderWithRouter = () => {
  return render(
    <MemoryRouter initialEntries={['/workspace/123/build/456/shipment/789']}>
      <Routes>
        <Route
          path="/workspace/:workspaceId/build/:buildShipmentId/shipment/:shipmentId"
          element={<ShipmentPage />}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('ShipmentPage', () => {
  it('renders all components with correct props from URL params', () => {
    renderWithRouter()

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    expect(screen.getByTestId('shipment-edit-card')).toBeInTheDocument()
  })
})

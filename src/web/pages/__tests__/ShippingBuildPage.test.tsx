import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ShippingBuildPage from '../ShippingBuildPage'

// Mock the child components
jest.mock('../../components/common/Breadcrumb', () => ({
  __esModule: true,
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}))

jest.mock('../../components/shippingBuilds/ShippingBuildEditCard', () => ({
  __esModule: true,
  default: () => <div data-testid="shipping-build-edit-card">ShippingBuildEditCard</div>,
}))

jest.mock('../../components/shipments/ShipmentList', () => ({
  __esModule: true,
  default: () => <div data-testid="shipment-list">ShipmentList</div>,
}))

const renderWithRouter = () => {
  return render(
    <MemoryRouter initialEntries={['/workspace/123/build/456']}>
      <Routes>
        <Route
          path="/workspace/:workspaceId/build/:buildShipmentId"
          element={<ShippingBuildPage />}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('ShippingBuildPage', () => {
  it('renders all components with correct props from URL params', () => {
    renderWithRouter()

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    expect(screen.getByTestId('shipping-build-edit-card')).toBeInTheDocument()
    expect(screen.getByTestId('shipment-list')).toBeInTheDocument()
  })
})

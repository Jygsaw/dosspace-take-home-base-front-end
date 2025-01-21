import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ShipmentList from '../ShipmentList'
import DosspaceApi from '../../../api'

// Mock the router hooks
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock the API
jest.mock('../../../api', () => ({
  getBuildShipment: jest.fn(),
  addShipment: jest.fn(),
}))

describe('ShipmentList', () => {
  const defaultProps = {
    workspaceId: 'workspace-123',
    buildShipmentId: 'build-456',
  }

  const renderWithProps = (props: any = defaultProps) => {
    return render(
      <MemoryRouter>
        <ShipmentList {...defaultProps} {...props} />
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the shipments title', () => {
    renderWithProps()
    expect(screen.getByText('Shipments')).toBeInTheDocument()
  })

  it('fetches and displays shipments', async () => {
    const mockBuildShipment = {
      shipments: [
        { id: 'ship-1', orderNumber: 'ORDER-001' },
        { id: 'ship-2', orderNumber: 'ORDER-002' },
      ],
    }
    ;(DosspaceApi.getBuildShipment as jest.Mock).mockResolvedValue(mockBuildShipment)

    renderWithProps()

    // Wait for shipments to be displayed
    expect(await screen.findByText('ORDER-001')).toBeInTheDocument()
    expect(await screen.findByText('ORDER-002')).toBeInTheDocument()

    // Verify API was called correctly
    expect(DosspaceApi.getBuildShipment).toHaveBeenCalledWith(
      defaultProps.workspaceId,
      defaultProps.buildShipmentId
    )
  })

  it('displays [Untitled Shipment] for shipments without order numbers', async () => {
    const mockBuildShipment = {
      shipments: [{ id: 'ship-1', orderNumber: '' }],
    }
    ;(DosspaceApi.getBuildShipment as jest.Mock).mockResolvedValue(mockBuildShipment)

    renderWithProps()

    expect(await screen.findByText('[Untitled Shipment]')).toBeInTheDocument()
  })

  it('handles adding a new shipment', async () => {
    const newShipment = { id: 'new-ship-1' }
    ;(DosspaceApi.addShipment as jest.Mock).mockResolvedValue(newShipment)

    renderWithProps()

    // Click the Add Shipment button
    fireEvent.click(screen.getByText('Add Shipment'))

    // Verify API call
    await waitFor(() => {
      expect(DosspaceApi.addShipment).toHaveBeenCalledWith(
        defaultProps.workspaceId,
        defaultProps.buildShipmentId
      )
    })

    // Verify navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        `/${defaultProps.workspaceId}/buildShipments/${defaultProps.buildShipmentId}/shipments/${newShipment.id}`
      )
    })
  })
})

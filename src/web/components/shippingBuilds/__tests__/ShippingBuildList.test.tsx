import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ShippingBuildList from '../ShippingBuildList'
import DosspaceApi from '../../../api'

// Mock the router hooks
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock the API
jest.mock('../../../api', () => ({
  getWorkspace: jest.fn(),
  addBuildShipment: jest.fn(),
}))

describe('ShippingBuildList', () => {
  const defaultProps = {
    workspaceId: 'workspace-123',
  }

  const renderWithProps = (props: any = defaultProps) => {
    return render(
      <MemoryRouter>
        <ShippingBuildList {...defaultProps} {...props} />
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the shipping builds title', () => {
    renderWithProps()
    expect(screen.getByText('Shipping Builds')).toBeInTheDocument()
  })

  it('fetches and displays shipping builds', async () => {
    const mockWorkspace = {
      id: defaultProps.workspaceId,
      buildShipments: [
        { id: 'build-1', buildNumber: 'Build 001' },
        { id: 'build-2', buildNumber: 'Build 002' },
      ],
    }
    ;(DosspaceApi.getWorkspace as jest.Mock).mockResolvedValue(mockWorkspace)

    renderWithProps()

    // Wait for shipping builds to be displayed
    expect(await screen.findByText('Build 001')).toBeInTheDocument()
    expect(await screen.findByText('Build 002')).toBeInTheDocument()

    // Verify API was called correctly
    expect(DosspaceApi.getWorkspace).toHaveBeenCalledWith(defaultProps.workspaceId)
  })

  it('displays [Untitled Shipping Build] for builds without build numbers', async () => {
    const mockWorkspace = {
      id: defaultProps.workspaceId,
      buildShipments: [{ id: 'build-1', buildNumber: '' }],
    }
    ;(DosspaceApi.getWorkspace as jest.Mock).mockResolvedValue(mockWorkspace)

    renderWithProps()

    expect(await screen.findByText('[Untitled Shipping Build]')).toBeInTheDocument()
  })

  it('handles adding a new shipping build', async () => {
    const newBuildShipment = { id: 'new-build-1' }
    ;(DosspaceApi.addBuildShipment as jest.Mock).mockResolvedValue(newBuildShipment)

    renderWithProps()

    // Click the Add Shipping Build button
    fireEvent.click(screen.getByText('Add Shipping Build'))

    // Verify API call
    await waitFor(() => {
      expect(DosspaceApi.addBuildShipment).toHaveBeenCalledWith(defaultProps.workspaceId)
    })

    // Verify navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        `/${defaultProps.workspaceId}/buildShipments/${newBuildShipment.id}`
      )
    })
  })
})

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ShippingBuildEditCard from '../ShippingBuildEditCard'
import DosspaceApi from '../../../api'

// Mock the API module
jest.mock('../../../api', () => ({
  __esModule: true,
  default: {
    getBuildShipment: jest.fn(),
    updateBuildShipment: jest.fn(),
  },
}))

const baseProps = {
  workspaceId: '123',
  buildShipmentId: '456',
}

const renderWithProps = (props: any = baseProps) => render(<ShippingBuildEditCard {...props} />)

describe('ShippingBuildEditCard', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Setup default mock implementation
    const mockBuildShipment = {
      id: '456',
      buildNumber: 'BUILD-123',
    }
    ;(DosspaceApi.getBuildShipment as jest.Mock).mockResolvedValue(mockBuildShipment)
  })

  it('renders the component with loading state', async () => {
    renderWithProps()

    expect(await screen.findByText('Shipping Build')).toBeInTheDocument()
    expect(await screen.findByLabelText('Build Number')).toBeInTheDocument()
  })

  it('fetches and displays build shipment data on mount', async () => {
    await act(() => renderWithProps())

    // Verify API call
    expect(DosspaceApi.getBuildShipment).toHaveBeenCalledWith('123', '456')

    await expect(await screen.findByLabelText('Build Number')).toHaveValue('BUILD-123')
  })

  it('updates build number when input changes', async () => {
    await act(() => renderWithProps())

    // Wait for initial data to load
    expect(await screen.findByLabelText('Build Number')).toHaveValue('BUILD-123')

    // Simulate user input
    const buildNumberInput = screen.getByLabelText('Build Number')
    fireEvent.change(buildNumberInput, { target: { value: 'BUILD-456' } })

    // Verify the input value changed
    expect(buildNumberInput).toHaveValue('BUILD-456')

    // Wait for debounced API call
    await waitFor(
      () => {
        expect(DosspaceApi.updateBuildShipment).toHaveBeenCalledWith('123', {
          id: '456',
          buildNumber: 'BUILD-456',
        })
      },
      { timeout: 1500 }
    )
  })

  describe('validation', () => {
    it('shows error for invalid build number', async () => {
      await act(() => renderWithProps())

      const buildNumberInput = await screen.findByLabelText('Build Number')

      // Test invalid inputs
      await act(() => fireEvent.change(buildNumberInput, { target: { value: '' } }))
      expect(buildNumberInput).toHaveAttribute('aria-invalid', 'true')

      await act(() => fireEvent.change(buildNumberInput, { target: { value: 'invalid-format' } }))
      expect(buildNumberInput).toHaveAttribute('aria-invalid', 'true')

      await act(() => fireEvent.change(buildNumberInput, { target: { value: '12345-12' } }))
      expect(buildNumberInput).toHaveAttribute('aria-invalid', 'true')

      // Test valid input
      await act(() => fireEvent.change(buildNumberInput, { target: { value: 'ABC12-123' } }))
      expect(buildNumberInput).toHaveAttribute('aria-invalid', 'false')
    })
  })
})

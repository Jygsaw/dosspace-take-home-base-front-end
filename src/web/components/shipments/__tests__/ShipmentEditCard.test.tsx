import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ShipmentEditCard from '../ShipmentEditCard'
import DosspaceApi from '../../../api'

// Mock the API module
jest.mock('../../../api', () => ({
  __esModule: true,
  default: {
    getShipment: jest.fn(),
    updateShipment: jest.fn(),
  },
}))

const baseProps = {
  workspaceId: '123',
  buildShipmentId: '456',
  shipmentId: '789',
}

const renderWithProps = (props: any = baseProps) => render(<ShipmentEditCard {...props} />)

describe('ShipmentEditCard', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Setup default mock implementation with valid order number format
    const mockShipment = {
      id: '789',
      orderNumber: '123-4567890-1234567',
      description: 'Test Shipment',
      cost: 100,
    }
    ;(DosspaceApi.getShipment as jest.Mock).mockResolvedValue(mockShipment)
  })

  it('renders the component with loading state', async () => {
    renderWithProps()

    expect(await screen.findByText('Shipment Details')).toBeInTheDocument()
    expect(await screen.findByLabelText('Order Number')).toBeInTheDocument()
    expect(await screen.findByLabelText('Description')).toBeInTheDocument()
    expect(await screen.findByLabelText('Cost')).toBeInTheDocument()
  })

  it('fetches and displays shipment data on mount', async () => {
    await act(() => renderWithProps())

    // Verify API call
    expect(DosspaceApi.getShipment).toHaveBeenCalledWith('123', '456', '789')

    // Verify displayed values
    expect(await screen.findByLabelText('Order Number')).toHaveValue('123-4567890-1234567')
    expect(await screen.findByLabelText('Description')).toHaveValue('Test Shipment')
    expect(await screen.findByLabelText('Cost')).toHaveValue(100)
  })

  it('updates order number when input changes', async () => {
    await act(() => renderWithProps())

    // Wait for initial data to load
    const orderInput = await screen.findByLabelText('Order Number')
    expect(orderInput).toHaveValue('123-4567890-1234567')

    // Simulate user input with valid order number
    fireEvent.change(orderInput, { target: { value: '456-7890123-4567890' } })

    // Verify the input value changed
    expect(orderInput).toHaveValue('456-7890123-4567890')

    // Wait for debounced API call
    await waitFor(
      () => {
        expect(DosspaceApi.updateShipment).toHaveBeenCalledWith('123', '456', {
          id: '789',
          orderNumber: '456-7890123-4567890',
          description: 'Test Shipment',
          cost: 100,
        })
      },
      { timeout: 1500 }
    )
  })

  it('updates description when input changes', async () => {
    await act(() => renderWithProps())

    // Wait for initial data to load
    const descriptionInput = await screen.findByLabelText('Description')
    expect(descriptionInput).toHaveValue('Test Shipment')

    // Simulate user input
    fireEvent.change(descriptionInput, { target: { value: 'Updated Shipment' } })

    // Verify the input value changed
    expect(descriptionInput).toHaveValue('Updated Shipment')

    // Wait for debounced API call
    await waitFor(
      () => {
        expect(DosspaceApi.updateShipment).toHaveBeenCalledWith('123', '456', {
          id: '789',
          orderNumber: '123-4567890-1234567',
          description: 'Updated Shipment',
          cost: 100,
        })
      },
      { timeout: 1500 }
    )
  })

  it('updates cost when input changes', async () => {
    await act(() => renderWithProps())

    // Wait for initial data to load
    const costInput = await screen.findByLabelText('Cost')
    expect(costInput).toHaveValue(100)

    // Simulate user input
    fireEvent.change(costInput, { target: { value: 200 } })

    // Verify the input value changed
    expect(costInput).toHaveValue(200)

    // Wait for debounced API call
    await waitFor(
      () => {
        expect(DosspaceApi.updateShipment).toHaveBeenCalledWith('123', '456', {
          id: '789',
          orderNumber: '123-4567890-1234567',
          description: 'Test Shipment',
          cost: 200,
        })
      },
      { timeout: 1500 }
    )
  })

  describe('validation', () => {
    it('shows error for invalid order number', async () => {
      await act(() => renderWithProps())

      const orderInput = await screen.findByLabelText('Order Number')

      // Test invalid input
      await act(() => fireEvent.change(orderInput, { target: { value: '' } }))
      expect(orderInput).toHaveAttribute('aria-invalid', 'true')

      // Test another invalid input
      await act(() => fireEvent.change(orderInput, { target: { value: 'invalid-format' } }))
      expect(orderInput).toHaveAttribute('aria-invalid', 'true')

      // Test valid input
      await act(() => fireEvent.change(orderInput, { target: { value: '123-4567890-1234567' } }))
      expect(orderInput).toHaveAttribute('aria-invalid', 'false')
    })

    it('shows error for invalid description', async () => {
      await act(() => renderWithProps())

      const descriptionInput = await screen.findByLabelText('Description')

      // Test invalid input
      await act(() => fireEvent.change(descriptionInput, { target: { value: '' } }))
      expect(descriptionInput).toHaveAttribute('aria-invalid', 'true')

      // Test valid input
      await act(() =>
        fireEvent.change(descriptionInput, { target: { value: 'Valid Description' } })
      )
      expect(descriptionInput).toHaveAttribute('aria-invalid', 'false')
    })

    it('shows error for invalid cost', async () => {
      await act(() => renderWithProps())

      const costInput = await screen.findByLabelText('Cost')

      // Test invalid input
      await act(() => fireEvent.change(costInput, { target: { value: '-100' } }))
      expect(costInput).toHaveAttribute('aria-invalid', 'true')

      // Test valid input
      await act(() => fireEvent.change(costInput, { target: { value: 100 } }))
      expect(costInput).toHaveAttribute('aria-invalid', 'false')
    })
  })
})

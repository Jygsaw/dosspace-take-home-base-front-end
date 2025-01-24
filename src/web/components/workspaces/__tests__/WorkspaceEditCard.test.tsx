import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import WorkspaceEditCard from '../WorkspaceEditCard'
import DosspaceApi from '../../../api'

// Mock the API module
jest.mock('../../../api', () => ({
  __esModule: true,
  default: {
    getWorkspace: jest.fn(),
    updateWorkspace: jest.fn(),
  },
}))

const baseProps = {
  workspaceId: '123',
}

const renderWithProps = (props: any = baseProps) => render(<WorkspaceEditCard {...props} />)

describe('WorkspaceEditCard', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Setup default mock implementation
    const mockWorkspace = {
      id: '123',
      title: 'Test Workspace',
    }
    ;(DosspaceApi.getWorkspace as jest.Mock).mockResolvedValue(mockWorkspace)
  })

  it('renders the component with loading state', async () => {
    renderWithProps()

    expect(await screen.findByText('Workspace')).toBeInTheDocument()
    expect(await screen.findByLabelText('Title')).toBeInTheDocument()
  })

  it('fetches and displays workspace data on mount', async () => {
    await act(() => renderWithProps())

    // Verify API call
    expect(DosspaceApi.getWorkspace).toHaveBeenCalledWith('123')

    await expect(await screen.findByLabelText('Title')).toHaveValue('Test Workspace')
  })

  it('updates workspace title when input changes', async () => {
    await act(() => renderWithProps())

    // Wait for initial data to load
    expect(await screen.findByLabelText('Title')).toHaveValue('Test Workspace')

    // Simulate user input
    const titleInput = screen.getByLabelText('Title')
    fireEvent.change(titleInput, { target: { value: 'Updated Workspace' } })

    // Verify the input value changed
    expect(titleInput).toHaveValue('Updated Workspace')

    // Wait for debounced API call
    await waitFor(
      () => {
        expect(DosspaceApi.updateWorkspace).toHaveBeenCalledWith({
          id: '123',
          title: 'Updated Workspace',
        })
      },
      { timeout: 1500 }
    )
  })

  describe('validation', () => {
    it('shows error for invalid title', async () => {
      await act(() => renderWithProps())

      const titleInput = await screen.findByLabelText('Title')

      // Test invalid input
      await act(() => fireEvent.change(titleInput, { target: { value: '' } }))
      expect(titleInput).toHaveAttribute('aria-invalid', 'true')

      // Test valid input
      await act(() => fireEvent.change(titleInput, { target: { value: 'Valid Title' } }))
      expect(titleInput).toHaveAttribute('aria-invalid', 'false')
    })
  })
})

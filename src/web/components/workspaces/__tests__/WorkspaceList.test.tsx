import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WorkspaceList from '../WorkspaceList'
import DosspaceApi from '../../../api'

// Mock the router hooks
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock the API
jest.mock('../../../api', () => ({
  getWorkspaces: jest.fn(),
  addWorkspace: jest.fn(),
  resetWorkspaces: jest.fn(),
}))

describe('WorkspaceList', () => {
  const defaultProps = {}

  const renderWithProps = (props: any = defaultProps) => {
    return render(
      <MemoryRouter>
        <WorkspaceList />
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the workspaces title', () => {
    renderWithProps()
    expect(screen.getByText('Workspaces')).toBeInTheDocument()
  })

  it('fetches and displays workspaces', async () => {
    const mockWorkspaces = [
      { id: 'workspace-1', title: 'Workspace 001' },
      { id: 'workspace-2', title: 'Workspace 002' },
    ]
    ;(DosspaceApi.getWorkspaces as jest.Mock).mockResolvedValue(mockWorkspaces)

    renderWithProps()

    // Wait for workspaces to be displayed
    expect(await screen.findByText('Workspace 001')).toBeInTheDocument()
    expect(await screen.findByText('Workspace 002')).toBeInTheDocument()

    // Verify API was called correctly
    expect(DosspaceApi.getWorkspaces).toHaveBeenCalledTimes(1)
  })

  it('displays [Untitled Workspace] for workspaces without titles', async () => {
    const mockWorkspaces = [{ id: 'workspace-1', title: '' }]
    ;(DosspaceApi.getWorkspaces as jest.Mock).mockResolvedValue(mockWorkspaces)

    renderWithProps()

    expect(await screen.findByText('[Untitled Workspace]')).toBeInTheDocument()
  })

  it('handles adding a new workspace', async () => {
    const newWorkspace = { id: 'new-workspace-1' }
    ;(DosspaceApi.addWorkspace as jest.Mock).mockResolvedValue(newWorkspace)

    renderWithProps()

    // Click the Add Workspace button
    fireEvent.click(screen.getByText('Add Workspace'))

    // Verify API call
    await waitFor(() => {
      expect(DosspaceApi.addWorkspace).toHaveBeenCalledTimes(1)
    })

    // Verify navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/${newWorkspace.id}`)
    })
  })

  it('handles resetting workspaces', async () => {
    renderWithProps()

    // Click the Reset Workspaces button
    fireEvent.click(screen.getByText('Reset Workspaces'))

    // Verify API calls
    await waitFor(() => {
      expect(DosspaceApi.resetWorkspaces).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      // Initial + after reset
      expect(DosspaceApi.getWorkspaces).toHaveBeenCalledTimes(2)
    })
  })
})

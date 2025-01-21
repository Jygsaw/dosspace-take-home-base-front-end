import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import WorkspacesPage from '../WorkspacesPage'

// Mock the child components
jest.mock('../../components/common/Breadcrumb', () => ({
  __esModule: true,
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}))

jest.mock('../../components/workspaces/WorkspaceList', () => ({
  __esModule: true,
  default: () => <div data-testid="workspace-list">WorkspaceList</div>,
}))

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<WorkspacesPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('WorkspacesPage', () => {
  it('renders all components', () => {
    renderWithRouter()

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    expect(screen.getByTestId('workspace-list')).toBeInTheDocument()
  })
})

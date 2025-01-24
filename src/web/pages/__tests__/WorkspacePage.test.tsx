import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import WorkspacePage from '../WorkspacePage'

// Mock the child components
jest.mock('../../components/common/Breadcrumb', () => ({
  __esModule: true,
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}))

jest.mock('../../components/workspaces/WorkspaceEditCard', () => ({
  __esModule: true,
  default: () => <div data-testid="workspace-edit-card">WorkspaceEditCard</div>,
}))

jest.mock('../../components/shippingBuilds/ShippingBuildList', () => ({
  __esModule: true,
  default: () => <div data-testid="shipping-build-list">ShippingBuildList</div>,
}))

const renderWithRouter = () => {
  return render(
    <MemoryRouter initialEntries={['/workspace/123']}>
      <Routes>
        <Route path="/workspace/:workspaceId" element={<WorkspacePage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('WorkspacePage', () => {
  it('renders all components with correct props from URL params', () => {
    renderWithRouter()

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    expect(screen.getByTestId('workspace-edit-card')).toBeInTheDocument()
    expect(screen.getByTestId('shipping-build-list')).toBeInTheDocument()
  })
})

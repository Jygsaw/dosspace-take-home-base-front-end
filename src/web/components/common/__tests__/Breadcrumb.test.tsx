import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Breadcrumb from '../Breadcrumb'

const renderWithProps = (props: any = {}) => {
  return render(
    <MemoryRouter>
      <Breadcrumb {...props} />
    </MemoryRouter>
  )
}

describe('Breadcrumb', () => {
  it('renders only Home link when no props are provided', () => {
    renderWithProps()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.queryByText('Workspace')).not.toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  })

  it('renders Home and Workspace links when workspaceId is provided', () => {
    renderWithProps({ workspaceId: 'workspace-123' })
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Workspace')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Workspace' })).toHaveAttribute(
      'href',
      '/workspace-123'
    )
  })

  it('renders Home, Workspace, and Shipping Build links when workspaceId and buildShipmentId are provided', () => {
    renderWithProps({
      workspaceId: 'workspace-123',
      buildShipmentId: 'build-123',
    })

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Workspace')).toBeInTheDocument()
    expect(screen.getByText('Shipping Build')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Shipping Build' })).toHaveAttribute(
      'href',
      '/workspace-123/buildShipments/build-123'
    )
  })

  it('renders full breadcrumb trail when all props are provided', () => {
    renderWithProps({
      workspaceId: 'workspace-123',
      buildShipmentId: 'build-123',
      shipmentId: 'shipment-123',
    })

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Workspace')).toBeInTheDocument()
    expect(screen.getByText('Shipping Build')).toBeInTheDocument()
    expect(screen.getByText('Shipment')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Shipment' })).toHaveAttribute(
      'href',
      '/workspace-123/buildShipments/build-123/shipments/shipment-123'
    )
  })
})

import { all, findOne, insert, update } from './db/db'
import { BuildShipment, Shipment, Workspace } from './types'
import { v4 as uuidv4 } from 'uuid'

const buildDefaultWorkspace = (): Workspace => ({
  id: uuidv4(),
  title: '',
  buildShipments: [buildDefaultBuildShipment()],
})

const buildDefaultBuildShipment = (): BuildShipment => ({
  id: uuidv4(),
  buildNumber: '',
  shipments: [buildDefaultShipment()],
})

const buildDefaultShipment = (): Shipment => ({
  id: uuidv4(),
  description: '',
  orderNumber: '',
  cost: 0,
})

/** Returns a list of all workspaces in the database */
export function getWorkspaces(dbString: string): Workspace[] {
  return all(dbString, 'workspaces')
}

/** Returns a single workspace from the database */
export function getWorkspace(dbString: string, id: string): Workspace {
  return findOne(dbString, 'workspaces', id)
}

/** Create a workspace in the database */
export function createWorkspace(dbString: string): Workspace {
  const workspace = buildDefaultWorkspace()
  insert(dbString, 'workspaces', workspace)
  return getWorkspace(dbString, workspace.id)
}

/** Update a workspace in the database */
export function updateWorkspace(
  dbString: string,
  workspace: Partial<Workspace> & { id: string }
): Workspace {
  const updatedWorkspace = {
    ...getWorkspace(dbString, workspace.id),
    ...workspace,
  }
  update(dbString, 'workspaces', updatedWorkspace.id, updatedWorkspace)
  return getWorkspace(dbString, updatedWorkspace.id)
}

/** Returns a single buildShipment from the database */
export function getBuildShipment(
  dbString: string,
  workspaceId: string,
  buildShipmentId: string
): BuildShipment {
  const workspace = getWorkspace(dbString, workspaceId)
  const buildShipment = workspace.buildShipments.find(
    (buildShipment) => buildShipment.id === buildShipmentId
  )
  if (!buildShipment) {
    throw new Error('Could not find item with id "' + buildShipmentId + '"')
  }
  return buildShipment
}

/** Create a buildShipment in the database */
export function createBuildShipment(dbString: string, workspaceId: string): BuildShipment {
  const buildShipment = buildDefaultBuildShipment()
  const workspace = getWorkspace(dbString, workspaceId)
  workspace.buildShipments.push(buildShipment)
  updateWorkspace(dbString, workspace)
  return getBuildShipment(dbString, workspaceId, buildShipment.id)
}

/** Update a buildShipment in the database */
export function updateBuildShipment(
  dbString: string,
  workspaceId: string,
  buildShipment: Partial<BuildShipment> & { id: string }
): BuildShipment {
  const updatedWorkspace = getWorkspace(dbString, workspaceId)
  const buildShipmentIndex = updatedWorkspace.buildShipments.findIndex(
    (buildShipmentElem) => buildShipmentElem.id === buildShipment.id
  )
  if (buildShipmentIndex === -1) {
    throw new Error('Could not find item with id "' + buildShipment.id + '"')
  }
  updatedWorkspace.buildShipments[buildShipmentIndex] = {
    ...updatedWorkspace.buildShipments[buildShipmentIndex],
    ...buildShipment,
  }
  updateWorkspace(dbString, updatedWorkspace)
  return getBuildShipment(dbString, workspaceId, buildShipment.id)
}

/** Returns a single shipment from the database */
export function getShipment(
  dbString: string,
  workspaceId: string,
  buildShipmentId: string,
  shipmentId: string
): Shipment {
  const buildShipment = getBuildShipment(dbString, workspaceId, buildShipmentId)
  const shipment = buildShipment.shipments.find((shipment) => shipment.id === shipmentId)
  if (!shipment) {
    throw new Error('Could not find item with id "' + shipmentId + '"')
  }
  return shipment
}

/** Create a shipment in the database */
export function createShipment(
  dbString: string,
  workspaceId: string,
  buildShipmentId: string
): Shipment {
  const shipment: Shipment = buildDefaultShipment()
  const buildShipment = getBuildShipment(dbString, workspaceId, buildShipmentId)
  buildShipment.shipments.push(shipment)
  updateBuildShipment(dbString, workspaceId, buildShipment)
  return getShipment(dbString, workspaceId, buildShipmentId, shipment.id)
}

/** Update a shipment in the database */
export function updateShipment(
  dbString: string,
  workspaceId: string,
  buildShipmentId: string,
  shipment: Partial<Shipment> & { id: string }
): Shipment {
  const updatedBuildShipment = getBuildShipment(dbString, workspaceId, buildShipmentId)
  const shipmentIndex = updatedBuildShipment.shipments.findIndex(
    (shipmentElem) => shipmentElem.id === shipment.id
  )
  if (shipmentIndex === -1) {
    throw new Error('Could not find item with id "' + shipment.id + '"')
  }
  updatedBuildShipment.shipments[shipmentIndex] = {
    ...updatedBuildShipment.shipments[shipmentIndex],
    ...shipment,
  }
  updateBuildShipment(dbString, workspaceId, updatedBuildShipment)
  return getShipment(dbString, workspaceId, buildShipmentId, shipment.id)
}

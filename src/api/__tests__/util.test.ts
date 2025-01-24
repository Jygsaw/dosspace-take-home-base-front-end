import * as utils from '../util'
import { reset } from '../db/db'
import mock from 'mock-fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const testDbString = '../database.test.txt'

describe('Util tests', () => {
  const workspaceId = uuidv4()

  beforeEach(() => {
    mock({ [path.resolve(__dirname, testDbString)]: '' })
    reset(testDbString, workspaceId)
  })

  afterEach(() => {
    mock.restore()
  })

  describe('getWorkspaces', () => {
    it('returns the workspaces from the db', () => {
      const workspaces = utils.getWorkspaces(testDbString)
      expect(workspaces).toBeDefined()
      expect(workspaces).toHaveLength(1)
      expect(workspaces[0].id).toBe(workspaceId)
      expect(workspaces[0].title).toEqual("Wiley's Shipping")
      expect(workspaces[0].buildShipments).toHaveLength(1)
      expect(workspaces[0].buildShipments[0].buildNumber).toEqual('A82D2-108')
      expect(workspaces[0].buildShipments[0].shipments).toHaveLength(1)
      expect(workspaces[0].buildShipments[0].shipments[0].description).toEqual('64 units')
    })
  })

  describe('getWorkspace', () => {
    it('returns the queried workspace from the db', () => {
      const workspace = utils.getWorkspace(testDbString, workspaceId)
      expect(workspace).toBeDefined()
      expect(workspace.title).toEqual("Wiley's Shipping")
      expect(workspace.buildShipments).toHaveLength(1)
    })
  })

  describe('createWorkspace', () => {
    it('creates a new workspace', () => {
      const workspace = utils.createWorkspace(testDbString)
      expect(workspace).toBeDefined()
      expect(workspace.title).toEqual('')
      expect(workspace.buildShipments).toHaveLength(1)
      expect(utils.getWorkspace(testDbString, workspace.id)).toBeDefined()
    })
  })

  describe('updateWorkspace', () => {
    it('updates a workspace', () => {
      const workspace = utils.createWorkspace(testDbString)
      workspace.title = "Arnav's Shipping"
      utils.updateWorkspace(testDbString, workspace)
      const updatedWorkspace = utils.getWorkspace(testDbString, workspace.id)
      expect(updatedWorkspace.title).toEqual("Arnav's Shipping")
    })
  })

  describe('getBuildShipment', () => {
    it('returns the queried build shipment from the db', () => {
      const buildShipmentId = utils.getWorkspace(testDbString, workspaceId).buildShipments[0].id
      const buildShipment = utils.getBuildShipment(testDbString, workspaceId, buildShipmentId)
      expect(buildShipment).toBeDefined()
      expect(buildShipment.buildNumber).toEqual('A82D2-108')
      expect(buildShipment.shipments).toHaveLength(1)
    })
  })

  describe('createBuildShipment', () => {
    it('creates a new build shipment', () => {
      const buildShipment = utils.createBuildShipment(testDbString, workspaceId)
      expect(buildShipment).toBeDefined()
      expect(buildShipment.buildNumber).toEqual('')
      expect(buildShipment.shipments).toHaveLength(1)
      expect(utils.getBuildShipment(testDbString, workspaceId, buildShipment.id)).toBeDefined()
    })
  })

  describe('updateBuildShipment', () => {
    it('updates a build shipment', () => {
      const buildShipment = utils.createBuildShipment(testDbString, workspaceId)
      buildShipment.buildNumber = 'A82D2-109'
      utils.updateBuildShipment(testDbString, workspaceId, buildShipment)
      const updatedBuildShipment = utils.getBuildShipment(
        testDbString,
        workspaceId,
        buildShipment.id
      )
      expect(updatedBuildShipment.buildNumber).toEqual('A82D2-109')
    })
  })

  describe('getShipment', () => {
    it('returns the queried shipment from the db', () => {
      const shipmentId = utils.getWorkspace(testDbString, workspaceId).buildShipments[0]
        .shipments[0].id
      const buildShipmentId = utils.getWorkspace(testDbString, workspaceId).buildShipments[0].id
      const shipment = utils.getShipment(testDbString, workspaceId, buildShipmentId, shipmentId)
      expect(shipment).toBeDefined()
      expect(shipment.orderNumber).toEqual('121-5821131-5985042')
    })
  })

  describe('createShipment', () => {
    it('creates a new shipment', () => {
      const buildShipmentId = utils.getWorkspace(testDbString, workspaceId).buildShipments[0].id
      const shipment = utils.createShipment(testDbString, workspaceId, buildShipmentId)
      expect(shipment).toBeDefined()
      expect(shipment.orderNumber).toEqual('')
      expect(shipment.description).toEqual('')
      expect(shipment.cost).toEqual(0)
      expect(
        utils.getShipment(testDbString, workspaceId, buildShipmentId, shipment.id)
      ).toBeDefined()
    })
  })

  describe('updateShipment', () => {
    it('updates a shipment', () => {
      const buildShipmentId = utils.getWorkspace(testDbString, workspaceId).buildShipments[0].id
      const shipment = utils.createShipment(testDbString, workspaceId, buildShipmentId)
      shipment.orderNumber = '121-5821131-5985043'
      utils.updateShipment(testDbString, workspaceId, buildShipmentId, shipment)
      const updatedShipment = utils.getShipment(
        testDbString,
        workspaceId,
        buildShipmentId,
        shipment.id
      )
      expect(updatedShipment.orderNumber).toEqual('121-5821131-5985043')
    })
  })
})

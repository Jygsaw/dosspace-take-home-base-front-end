import axios from 'axios'
import type { BuildShipment, Shipment, Workspace } from '../api/types'

const BASE_URL = 'http://localhost:8080'

/** The API for the app, for querying, creating and updating workspaces */
class DosspaceApi {
  /** Resets the workspaces to the default state */
  static async resetWorkspaces() {
    try {
      await axios.delete(`${BASE_URL}/reset`)
      return
    } catch (err) {
      throw new Error('Unable to reset workspaces')
    }
  }

  /** Returns the ID and title of every existing workspace */
  static async getWorkspaces() {
    try {
      const req = await axios.get(BASE_URL)
      const { workspaces } = req.data
      return workspaces
    } catch (err) {
      throw new Error('Unable to fetch workspaces')
    }
  }

  /** Creates a new workspace in the database and returns it */
  static async addWorkspace() {
    try {
      const req = await axios.post(BASE_URL)
      const { workspace } = req.data
      return workspace
    } catch (err) {
      throw new Error('Unable to create workspace')
    }
  }

  /** Returns the workspace with the given ID */
  static async getWorkspace(workspaceId: string) {
    try {
      const req = await axios.get(`${BASE_URL}/${workspaceId}`)
      const { workspace } = req.data
      return workspace
    } catch (err) {
      throw new Error('Unable to fetch workspace')
    }
  }

  /** Updates the workspace with the given ID */
  static async updateWorkspace(workspace: Partial<Workspace>) {
    try {
      const workspaceFields = {
        id: workspace.id,
        title: workspace.title,
      }
      const req = await axios.patch(`${BASE_URL}/${workspace.id}`, { workspace: workspaceFields })
      const { workspace: updatedWorkspace } = req.data
      return updatedWorkspace
    } catch (err) {
      throw new Error('Unable to update workspace')
    }
  }

  /** Creates a new shipment table in the database and returns it */
  static async addBuildShipment(workspaceId: string) {
    try {
      const req = await axios.post(`${BASE_URL}/${workspaceId}/buildShipments`)
      const { buildShipment } = req.data
      return buildShipment
    } catch (err) {
      throw new Error('Unable to create shipment table')
    }
  }

  /** Returns the shipment table with the given ID */
  static async getBuildShipment(workspaceId: string, buildShipmentId: string) {
    try {
      const req = await axios.get(`${BASE_URL}/${workspaceId}/buildShipments/${buildShipmentId}`)
      const { buildShipment } = req.data
      return buildShipment
    } catch (err) {
      throw new Error('Unable to fetch shipment table')
    }
  }

  /** Updates the shipment table with the given ID */
  static async updateBuildShipment(workspaceId: string, buildShipment: Partial<BuildShipment>) {
    try {
      const buildShipmentFields = {
        id: buildShipment.id,
        buildNumber: buildShipment.buildNumber,
      }
      const req = await axios.patch(
        `${BASE_URL}/${workspaceId}/buildShipments/${buildShipment.id}`,
        { buildShipment: buildShipmentFields }
      )
      const { buildShipment: updatedBuildShipment } = req.data
      return updatedBuildShipment
    } catch (err) {
      throw new Error('Unable to update shipment table')
    }
  }

  /** Creates a new shipment in the database and returns it */
  static async addShipment(workspaceId: string, shipmentTableId: string) {
    try {
      const req = await axios.post(
        `${BASE_URL}/${workspaceId}/buildShipments/${shipmentTableId}/shipments`
      )
      const { shipment } = req.data
      return shipment
    } catch (err) {
      throw new Error('Unable to create shipment')
    }
  }

  /** Returns the shipment with the given ID */
  static async getShipment(workspaceId: string, shipmentTableId: string, shipmentId: string) {
    try {
      const req = await axios.get(
        `${BASE_URL}/${workspaceId}/buildShipments/${shipmentTableId}/shipments/${shipmentId}`
      )
      const { shipment } = req.data
      return shipment
    } catch (err) {
      throw new Error('Unable to fetch shipment')
    }
  }

  /** Updates the shipment with the given ID */
  static async updateShipment(
    workspaceId: string,
    shipmentTableId: string,
    shipment: Partial<Shipment>
  ) {
    try {
      const shipmentFields = {
        id: shipment.id,
        orderNumber: shipment.orderNumber,
        description: shipment.description,
        cost: shipment.cost,
      }
      const req = await axios.patch(
        `${BASE_URL}/${workspaceId}/buildShipments/${shipmentTableId}/shipments/${shipment.id}`,
        { shipment: shipmentFields }
      )
      const { shipment: updatedShipment } = req.data
      return updatedShipment
    } catch (err) {
      throw new Error('Unable to update shipment')
    }
  }
}

export default DosspaceApi

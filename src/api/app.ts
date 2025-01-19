import express from 'express'
import cors from 'cors'
import { reset } from './db/db'
import {
  createWorkspace,
  createBuildShipment,
  createShipment,
  getWorkspaces,
  getWorkspace,
  getBuildShipment,
  getShipment,
  updateWorkspace,
  updateBuildShipment,
  updateShipment,
} from './util'
import { Shipment, BuildShipment } from './types'

const app = express()
app.use(cors())
app.use(express.json())

const port = 8080
const dbString = '../database.txt'

/** Admin endpoint for resetting the database */
app.delete('/reset', (req, res) => {
  reset(dbString)
  res.send('Reset database')
})

/** Creates a new shipment in the database and returns it */
app.post('/:workspaceId/buildShipments/:buildShipmentId/shipments', (req, res) => {
  const shipment = createShipment(dbString, req.params.workspaceId, req.params.buildShipmentId)
  res.json({ shipment })
})

/** Returns the shipment with the given ID */
app.get('/:workspaceId/buildShipments/:buildShipmentId/shipments/:shipmentId', (req, res) => {
  const shipment = getShipment(
    dbString,
    req.params.workspaceId,
    req.params.buildShipmentId,
    req.params.shipmentId
  )
  res.json({ shipment })
})

/** Updates the shipment with the given ID   */
app.patch('/:workspaceId/buildShipments/:buildShipmentId/shipments/:shipmentId', (req, res) => {
  const shipment = updateShipment(
    dbString,
    req.params.workspaceId,
    req.params.buildShipmentId,
    req.body.shipment
  )
  res.json({ shipment })
})

/** Creates a new buildShipment in the database and returns it */
app.post('/:workspaceId/buildShipments', (req, res) => {
  const buildShipment = createBuildShipment(dbString, req.params.workspaceId)
  res.json({ buildShipment })
})

/** Returns the buildShipment with the given ID */
app.get('/:workspaceId/buildShipments/:buildShipmentId', (req, res) => {
  const buildShipment = getBuildShipment(
    dbString,
    req.params.workspaceId,
    req.params.buildShipmentId
  )
  buildShipment.shipments = buildShipment.shipments.map((shipment) => ({
    id: shipment.id,
    orderNumber: shipment.orderNumber,
  })) as Shipment[]
  res.json({ buildShipment })
})

/** Updates the buildShipment with the given ID  */
app.patch('/:workspaceId/buildShipments/:buildShipmentId', (req, res) => {
  const buildShipment = updateBuildShipment(
    dbString,
    req.params.workspaceId,
    req.body.buildShipment
  )
  res.json({ buildShipment })
})

/** Returns the workspace with the given ID */
app.get('/:workspaceId', (req, res) => {
  const workspace = getWorkspace(dbString, req.params.workspaceId)
  workspace.buildShipments = workspace.buildShipments.map((buildShipment) => ({
    id: buildShipment.id,
    buildNumber: buildShipment.buildNumber,
  })) as BuildShipment[]
  res.json({ workspace })
})

/** Updates the workspace with the given ID and returns the updated workspace */
app.patch('/:workspaceId', (req, res) => {
  const workspace = req.body.workspace
  res.json({ workspace: updateWorkspace(dbString, workspace) })
})

/** Returns all workspaces in the database */
app.get('/', (req, res) => {
  const allWorkspaces = getWorkspaces(dbString)
  const workspaces = allWorkspaces.map((workspace) => ({
    id: workspace.id,
    title: workspace.title,
  }))
  res.json({ workspaces })
})

/** Creates a new workspace in the database and returns it */
app.post('/', (req, res) => {
  res.json({ workspace: createWorkspace(dbString) })
})

module.exports = app

app.listen(port, () => {
  console.log(`Dosspace is running on port ${port}.`)
})

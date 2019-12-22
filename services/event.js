//@ts-check
/**
 * @template T
 * @typedef {import("gstore-node/lib/types").EntityData<T>} EntityData
 */
/**
 * @typedef {import("../models/event").Event} Event
 */
const { NotFound, BadRequest } = require('../error')

const Event = require('../models/event')

/**
 * Inserts an Even in db
 * @param {Object} value
 * @return {Promise<Event>}
 */
async function create(value) {
  value.value = value.value.toString()
  delete value.createdOn
  delete value.modifiedOn

  let override = new Event(Event.sanitize(value, undefined))

  const { entityKey, entityData } = await override.save()

  return {
    ...entityData,
    id: entityKey.id
  }
}

/**
 * Gets the latest modified Event
 * @return {Promise<Event>}
 * @throws {NotFound} when no event is to be found
 */
async function getLatest() {
  let { entities: events } = await Event.list({
    order: {
      property: 'modifiedOn',
      descending: true
    },
    limit: 1
  })

  if (events.length === 0) {
    throw new NotFound('Event', 'latest')
  }

  return events[0]
}

/**
 * Gets the latest modified event of a given type
 * @param {{ type: string }} param
 * @return {Promise<Event>}
 * @throws {NotFound} when ne event is to be found
 * @throws {BadRequest} when the type is unknown
 */
async function getLatestByType({ type }) {
  if (!Object.values(Event.Types).includes(type)) {
    throw new BadRequest('Invalid event type')
  }

  let { entities: events } = await Event.list({
    filters: [
      [ 'type', type ]
    ],
    order: {
      property: 'modifiedOn',
      descending: true
    },
    limit: 1
  })

  if (events.length === 0) {
    throw new NotFound(`Event.${type}`, 'latest')
  }

  return events[0]
}

/**
 * Gets a paginated list of all events
 * @param {{ page: number, pageSize: number }} param A cursor parameter
 * @return {Promise<Event[]>}
 */
async function getAll({ page, pageSize }) {
  let { entities: events } = await Event.list({
    order: {
      property: 'modifiedOn',
      descending: true
    },
    offset: page * pageSize,
    limit: pageSize
  })

  return events
}

/**
 * Gets a paginated list of all events of a given type
 * @param {{ type: string, page: number, pageSize: number }} param A cursor parameter and a type
 * @return {Promise<Event[]>}
 * @throws {BadRequest} when the type is invalid
 */
async function getAllByType({ type, page, pageSize }) {
  if (!Object.values(Event.Types).includes(type)) {
    throw new BadRequest('Invalid event type')
  }

  let { entities: events } = await Event.list({
    filters: [
      [ 'type', type ]
    ],
    order: {
      property: 'modifiedOn',
      descending: true
    },
    offset: page * pageSize,
    limit: pageSize
  })

  return events
}


module.exports = {
  createEvent: create,
  dispatchEvent: create,
  getLatestEvent: getLatest,
  getLatestEventType: getLatestByType,
  getAllEvents: getAll,
  getAllEventsType: getAllByType
}
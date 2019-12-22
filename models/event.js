//@ts-check
/**
 * @template T
 * @template M
 * @typedef {import("gstore-node/lib/schema").default<T, M>} Schema
 */

/**
 * @template T
 * @typedef {import("gstore-node/lib/types").CustomEntityFunction<T>} CustomEntityFunction
 */

/**
 *  @typedef {import("gstore-node").Gstore} Gstore
 */

/**
 * @template T
 * @typedef {import("gstore-node/lib/model").Model<T>} Model
 */

/** @type {Gstore} */
const gstore = require('../store').getInstance()

const { Schema } = gstore

/**
 * @typedef {Object} Event
 * @property {string} [id]
 * @property {string} type
 * @property {number} value
 * @property {Date} createdOn
 * @property {Date} modifiedOn
 */

/**
 * @type {Schema<Event, Object<String, CustomEntityFunction<Event>>> } 
 */
const EventSchema = new Schema({
  type: { type: String, required: true },
  value: { type: String, required: true },
  createdOn: { type: Date, default: gstore.defaultValues.NOW },
  modifiedOn: { type: Date }
})

/**
 * @typedef {Object} EventType
 * @property {string} EventType.BoilerStatus
 */

/** @type {Model<Event> & { Types: EventType }} */
module.exports = gstore.model('Event', EventSchema)

module.exports.Types = {
  BoilerStatus: 'BoilerStatus',
}

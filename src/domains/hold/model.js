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
const gstore = require('../../store').getInstance()

const { Schema } = gstore

/**
 * @typedef {Object} Override
 * @property {string} [id]
 * @property {number} value
 * @property {Date} untilTime
 * @property {Date} createdOn
 * @property {Date} modifiedOn
 */

/**
 * @type {Schema<Override, Object<String, CustomEntityFunction<Override>>> } 
 */
const OverrideSchema = new Schema({
  value: { type: Number, required: true },
  untilTime: { type: Date, required: true },
  createdOn: { type: Date, default: gstore.defaultValues.NOW },
  modifiedOn: { type: Date }
})

/** @type {Model<Override>} */
module.exports = gstore.model('Override', OverrideSchema)

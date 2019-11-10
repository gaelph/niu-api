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
  * @template T
  * @typedef {import("gstore-node/lib/model").Model<T>} Model
  */

const gstore = require('../store').getInstance()

const { Schema } = gstore

/**
 * @typedef {Object} TemperatureRecord
 * @property {string} [id]
 * @property {number} value
 * @property {Date} [createdOn]
 * @property {Date} [modifiedOn]
 */

/**
 * @type {Schema<TemperatureRecord, Object<String, CustomEntityFunction<TemperatureRecord>>> } 
 */
const TemperatureRecordSchema = new Schema({
  // @ts-ignore
  value: { type: Schema.Types.Double, required: true },
  createdOn: { type: Date, default: gstore.defaultValues.NOW },
  modifiedOn: { type: Date }
})

const listSettings = {
  limit: 100,
  order: { 
    property: 'createdOn', 
    decending: true 
  }
}
//@ts-ignore
TemperatureRecordSchema.queries('list', listSettings)

/** @type {Model<TemperatureRecord>} */
module.exports = gstore.model('TemperatureRecord', TemperatureRecordSchema)
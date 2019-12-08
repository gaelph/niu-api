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
  * @typedef {Object} Setting
  * @property {string} [id]
  * @property {string} value
  * @property {string} title
  * @property {string} description
  * @property {Date}   createdOn
  * @property {Date}   modifiedOn
  */

  /**
  * @type {Schema<Setting, Object<String, CustomEntityFunction<Setting>>> } 
  */
 const SettingSchema = new Schema({
  value: { type: String },
  title: { type: String },
  description: { type: String },
  createdOn: { type: Date, default: gstore.defaultValues.NOW },
  modifiedOn: { type: Date }
  // schedules: { from: string, to: string, high: number }[]
 })
 
 /** @type {Model<Setting>} */
 module.exports = gstore.model('Setting', SettingSchema)
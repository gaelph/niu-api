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
  * @typedef {Object} Days
  * @property {boolean} Days.mon
  * @property {boolean} Days.tue
  * @property {boolean} Days.wed
  * @property {boolean} Days.thu
  * @property {boolean} Days.fri
  * @property {boolean} Days.sat
  * @property {boolean} Days.sun
  */

/**
 * @typedef {Object} Schedule
 * @property {string} from
 * @property {string} to
 * @property {number} high
 */
 
 /**
  * @typedef {Object} Rule
  * @property {string} [id]
  * @property {string} name
  * @property {boolean} active
  * @property {Days} days
  * @property {boolean} repeat
  * @property {Schedule[]} schedules
  * @property {Date} [createdOn]
  * @property {Date} [modifiedOn]
  */
 
 /**
  * @type {Schema<Rule, Object<String, CustomEntityFunction<Rule>>> } 
  */
 const RuleSchema = new Schema({
  name: { type: String, required: true },
  active: { type: Boolean, required: true },
  days: { type: Object, required: true },
  // days: {
  //   [Day.Mon]: boolean,
  //   [Day.Tue]: boolean,
  //   [Day.Wed]: boolean,
  //   [Day.Thu]: boolean,
  //   [Day.Fri]: boolean,
  //   [Day.Sat]: boolean,
  //   [Day.Sun]: boolean,
  // },
  repeat: { type: Boolean, required: true },
  schedules: { type: Array, required: true },
  // schedules: { from: string, to: string, high: number }[]
 })
 
 const listSettings = {
   limit: 100,
   order: { 
     property: 'createdOn', 
     decending: true 
   }
 }
 //@ts-ignore
 RuleSchema.queries('list', listSettings)
 
 /** @type {Model<Rule>} */
 module.exports = gstore.model('Rule', RuleSchema)
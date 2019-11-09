const gstore = require('../store').getInstance()

const { Schema } = gstore

const TemperatureRecord = new Schema({
  value: { type: Schema.Types.Double, required: true },
  createdOn: { type: Date, default: gstore.defaultValues.NOW },
  modifiedOn: { type: Date }
})

const listSettings = {
  limit: 100,
  order: { property: 'created_at' }
}
TemperatureRecord.queries('list', listSettings)

module.exports = gstore.model('TemperatureRecord', TemperatureRecord)
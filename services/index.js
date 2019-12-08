const Rule = require('./rule')
const TemperatureRecord = require('./temperature_record')
const Setting = require('./setting')

module.exports = {
  ...Rule,
  ...TemperatureRecord,
  ...Setting
}
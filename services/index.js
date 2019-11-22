const Rule = require('./rule')
const TemperatureRecord = require('./temperature_record')

module.exports = {
  ...Rule,
  ...TemperatureRecord,
}
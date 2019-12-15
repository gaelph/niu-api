const Rule = require('./rule')
const TemperatureRecord = require('./temperature_record')
const Setting = require('./setting')
const Override = require('./override')

module.exports = {
  ...Rule,
  ...TemperatureRecord,
  ...Setting,
  ...Override
}
const TemperatureRecord = require('../models/temperature_record')

function create(value) {
  let record = new TemperatureRecord(TemperatureRecord.sanitize(value))

  return record.save()
}

module.exports = {
  create
}
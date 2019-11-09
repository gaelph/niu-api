const TemperatureRecord = require('../models/temperature_record')

function create(value) {
  if (value.created_at) delete value.created_at
  
  let record = new TemperatureRecord(TemperatureRecord.sanitize(value))

  return record.save()
}

module.exports = {
  create
}
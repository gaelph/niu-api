//@ts-check
/**
 * @template T
 * @typedef {import("gstore-node/lib/types").EntityData<T>} EntityData
 */
/**
 * @template T
 * @typedef {import("../models/temperature_record").TemperatureRecord} TemperatureRecord
 */

class RequestError extends Error {
  constructor(status, message) {
    super(message);

    this.status = status;
  }
}

const TemperatureRecord = require('../models/temperature_record')

function create(value) {
  let record = new TemperatureRecord(TemperatureRecord.sanitize(value, undefined))

  return record.save()
}

/**
 * @return {Promise<TemperatureRecord, RequestError>}
 */
async function getLatest() {
  let { entities: records } = await TemperatureRecord.list({
    order: { 
      property: 'createdOn', descending: true
    },
    limit: 1
  })
  
  if (records.length === 0) {
    let error = new RequestError(404, 'No records found')
    
    throw error
  }
  
  //@ts-ignore
  return records[0]
}

async function list({ page = 1, pageSize = 100 }) {
  let { entities: records } = await TemperatureRecord.list({
    order: { 
      property: 'createdOn', descending: true
    },
    limit: pageSize,
    offset: (page - 1) * pageSize
  })

  if (records.length === 0) {
    let error = new RequestError(404, 'No records found')

    throw error
  }

  return records
}

module.exports = {
  create,
  getLatest,
  list
}
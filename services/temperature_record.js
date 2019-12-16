//@ts-check
/**
 * @template T
 * @typedef {import("gstore-node/lib/types").EntityData<T>} EntityData
 */
/**
 * @typedef {import("../models/temperature_record").TemperatureRecord} TemperatureRecord
 */

const { NotFound, RequestError } = require("../error")

const TemperatureRecord = require('../models/temperature_record')
const { BadRequest, ServerError } = require('../error')

async function create(value) {
  let saneValue
  try {
    saneValue = TemperatureRecord.sanitize(value, undefined)
  }
  catch (error) {
    throw new BadRequest(error.message)
  }

  try {
    let record = new TemperatureRecord(saneValue)

    const { entityKey, entityData } = await record.save()

    return {
      id: entityKey.id,
      ...entityData
    }
  }
  catch (error) {
    throw new ServerError(error.message)
  }
}

/**
 * @return {Promise<TemperatureRecord, RequestError>}
 */
async function getLatest() {
  try {
    let { entities: records } = await TemperatureRecord.list({
      order: { 
        property: 'createdOn', descending: true
      },
      limit: 1
    })
    
    if (records.length === 0) {
      let error = new NotFound('TemperatureRecord', 'latest')
      
      throw error
    }
    
    //@ts-ignore
    return records[0]
  }
  catch (error) {
    throw new ServerError(error.message)
  }
}

async function list({ page = 1, pageSize = 100 }) {
  try {
    let { entities: records } = await TemperatureRecord.list({
      order: { 
        property: 'createdOn', descending: true
      },
      limit: pageSize,
      offset: (page - 1) * pageSize
    })

    return records
  } catch (error) {
    throw new ServerError(error.message)
  }
}

module.exports = {
  createTemperatureRecord: create,
  getLatestTemperatureRecord: getLatest,
  listTemperatureRecords: list
}
//@ts-check
/**
 * @template T
 * @typedef {import("gstore-node/lib/types").EntityData<T>} EntityData
 */
/**
 * @typedef {import("./model").TemperatureRecord} TemperatureRecord
 */

const { NotFound, RequestError, BadRequest, ServerError } = require("../../error")

const TemperatureRecord = require('./model')

async function create(value) {
  let saneValue
  try {
    saneValue = TemperatureRecord.sanitize(value, undefined)
  }
  catch (error) {
    /* istanbul ignore next */
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
    
    /* istanbul ignore if */
    if (records.length === 0) {
      let error = new NotFound('TemperatureRecord', 'latest')
      
      throw error
    }
    
    //@ts-ignore
    return records[0]
  }
  catch (error) {
    /* istanbul ignore next */
    throw new ServerError(error.message)
  }
}

async function list({ page = 1, pageSize = 100 } = { page: 1, pageSize: 100 }) {
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
    /* istanbul ignore next */
    throw new ServerError(error.message)
  }
}

async function temperatureRecordsSince(date) {
  try {
    let { entities: records } = await TemperatureRecord.list({
      filters: [
        ['createdOn', '>', date]
      ],
      order: {
        property: 'createdOn', descending: true
      },
      limit: 300
    })

    return records
  } catch (error) {
    /* istanbul ignore next */
    throw new ServerError(error.message)
  }
}

module.exports = {
  createTemperatureRecord: create,
  getLatestTemperatureRecord: getLatest,
  listTemperatureRecords: list,
  temperatureRecordsSince
}
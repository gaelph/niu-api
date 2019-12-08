//@ts-check
/**
 * @template T
 * @typedef {import("gstore-node/lib/types").EntityData<T>} EntityData
 */
/**
 * @template T
 * @typedef {import("../models/temperature_record").TemperatureRecord} TemperatureRecord
 */

const { NotFound, RequestError, BadRequest, ServerError } = require("../error")

const Setting = require('../models/setting')
/** @typedef {import('../models/setting').Setting} Setting */

/**
 * @param {Object} value
 * @return {Promise<Setting>}
 */
async function create(value) {
  let id = value.id
  delete value.id
  let setting = new Setting(Setting.sanitize(value, undefined))

  //@ts-ignore
  setting.entityKey = Setting.key(id)

  console.log('create setting', id, value.value)
  const { entityKey, entityData } = await setting.save()

  // TODO: send settings update to device
  // Signal device(s)
  // no need to await the result
  send_settings_to_device()

  return {
    ...entityData,
    // @ts-ignore
    id: entityKey.name
  }
}

async function list() {
  let { entities: settings } = await Setting.list()

  console.log('entities', settings)

  return settings
}

async function update(value) {
  let id = value.id
  delete value.id

  console.log('patching setting', id)

  try {
    // let datastore = Rule.gstore.__ds
    // let key = datastore.key({ path: ['Rule', id] })
    // console.log('patching', JSON.stringify(key))
    // let [rule] = await datastore.get(key)
    let setting
    try {
      setting = await Setting.get(id)
    } catch (_) {
      return await create(value)
    }
    console.log("update setting", id, value.value)

    let { entityKey, entityData } = await Setting.update(id, value, null, null, null, { replace: false })

    // TODO: send settings update to device
    // Signal device(s)
    // no need to await the result
    send_settings_to_device()

    return {
      id: entityKey.name,
      ...entityData
    }
  } catch (error) {
    let message = error.message
    if (error.name && error.errors) {
      message = error.errors.map(({ message }) => message).join(' ')
    } 
    console.log(JSON.stringify(message))
    throw new BadRequest(message)
  }
}

async function send_settings_to_device() {
  let settings = await list()

  //@ts-ignore
  let response = await axios.post(
    `${process.env.DEVICE_URL}/settings`, 
    JSON.stringify({ settings }),
    {
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })

  if (response.status !== 200) {
    let text = response.data

    console.error(text)
  }
}

module.exports = {
  createSetting: create,
  listSettings: list,
  updateSetting: update
}
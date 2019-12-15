//@ts-check
/**
 * @template T
 * @typedef {import("gstore-node/lib/types").EntityData<T>} EntityData
 */
/**
 * @typedef {import("../models/override").Override} Override
 */

/** */
const axios = require('axios')
const { NotFound, BadRequest } = require('../error')

const Override = require('../models/override')
/**
 * @param {Object} value
 * @return {Promise<Override>}
 */
async function create(value) {
  let id = value.id
  delete value.id
  let override = new Override(Override.sanitize(value, undefined))

  //@ts-ignore
  override.entityKey = Override.key(id)

  console.log('create Override', id, value.value)
  const { entityKey, entityData } = await override.save()

  // TODO: send Overrides update to device
  // Signal device(s)
  // no need to await the result
  send_overrides_to_device()

  return {
    ...entityData,
    // @ts-ignore
    id: entityKey.name
  }
}

/**
 * @return {Promise<Override>}
 */
async function get() {
  let { entities: overrides } = await Override.list({
    order: {
      property: 'modifiedOn',
      descending: true
    },
    limit: 1
  })

  console.log('entities', overrides)

  return overrides[0]
}

async function update(value) {
  let id = value.id
  
  console.log('patching Override', id)
  
  try {
    // let datastore = Rule.gstore.__ds
    // let key = datastore.key({ path: ['Rule', id] })
    // console.log('patching', JSON.stringify(key))
    // let [rule] = await datastore.get(key)
    let override
    try {
      override = await Override.get(id)
    } catch (_) {
      return await create(value)
    }
    delete value.id
    console.log("update Override", id, value.value)

    let { entityKey, entityData } = await Override.update(id, value, null, null, null, { replace: false })

    // TODO: send Overrides update to device
    // Signal device(s)
    // no need to await the result
    send_overrides_to_device()

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

async function send_overrides_to_device() {
  let override = await get()

  //@ts-ignore
  let response = await axios.post(
    `${process.env.DEVICE_URL}/override`, 
    JSON.stringify({ override }),
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
  createOverride: create,
  getOverride: get,
  updateOverride: update
}
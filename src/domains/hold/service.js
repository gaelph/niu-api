//@ts-check
/**
 * @template T
 * @typedef {import("gstore-node/lib/types").EntityData<T>} EntityData
 */
/**
 * @typedef {import("./model").Override} Override
 */

/** */
const axios = require('axios')
const { NotFound, BadRequest } = require('../../error')

const Override = require('./model')
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

  return overrides[0]
}

async function update(value) {
  let id = value.id
  
  try {
    try {
      await Override.get(id)
    } catch (_) {
      return await create(value)
    }
    delete value.id

    let { entityKey, entityData } = await Override.update(id, value, null, null, null, { replace: false })

    // Signal device(s)
    // no need to await the result
    send_overrides_to_device()

    return {
      id: entityKey.name,
      ...entityData
    }
  } catch (error) {
    let message = error.message
    /* istanbul ignore else */
    if (error.name && error.errors) {
      message = error.errors.map(({ message }) => message).join(' ')
    } 
    throw new BadRequest(message)
  }
}

async function remove({ id }) {
  try {
    await Override.get(id)
  } catch (_) {
    throw new NotFound('Override', id)
  }
  
  await Override.delete(id)

  // Signal device(s)
  // no need to await the result
  send_empty_overrides_to_device()

  return
}

async function send_overrides_to_device() {
  let override = await get()

  try {
    //@ts-ignore
    await axios.post(
      `${process.env.DEVICE_URL}/holds`, 
      JSON.stringify({ holds: [override] }),
      {
        headers: {
          "Authorization": `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
  } catch (error) {
    console.error(error.message)
  }
}


async function send_empty_overrides_to_device() {
  try {
    //@ts-ignore
    await axios.post(
      `${process.env.DEVICE_URL}/holds`, 
      JSON.stringify({ holds: [] }),
      {
        headers: {
          "Authorization": `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
  } catch (error) {
    console.error(error.message)
  }
}

module.exports = {
  createOverride: create,
  getOverride: get,
  updateOverride: update,
  deleteOverride: remove,
}
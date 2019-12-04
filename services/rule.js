//@ts-check
/**
 * @template T
 * @typedef {import("gstore-node/lib/types").EntityData<T>} EntityData
 */
/**
 * @template T
 * @typedef {import("../models/temperature_record").TemperatureRecord} TemperatureRecord
 */

/** */
const axios = require('axios')
const { NotFound, BadRequest } = require('../error')

const Rule = require('../models/rule')

async function create(value) {
  let id = value.id
  delete value.id
  let rule = new Rule(Rule.sanitize(value, undefined))

  //@ts-ignore
  rule.entityKey = Rule.key(id)

  const { entityKey, entityData } = await rule.save()

  // Signal device(s)
  // no need to await the result
  send_rules_to_device()

  return {
    id: entityKey.name,
    ...entityData
  }
}

async function list({ page, pageSize } = { page: 1, pageSize: 100}) {
  let { entities: rules } = await Rule.list({
    limit: pageSize,
    offset: (page - 1) * pageSize
  })

  console.log('entities', rules)

  return rules
}

async function update(value) {
  let id = value.id
  delete value.id

  console.log('pathincg rule', id)

  try {
    // let datastore = Rule.gstore.__ds
    // let key = datastore.key({ path: ['Rule', id] })
    // console.log('patching', JSON.stringify(key))
    // let [rule] = await datastore.get(key)
    let rule = await Rule.get(id)

    if (rule == null) {
      throw new NotFound('Rule', id)
    }
    console.log("found entity with id", id, JSON.stringify(rule))

    let { entityKey, entityData } = await Rule.update(id, value, null, null, null, { replace: false })

    // Signal device(s)
    // no need to await the result
    send_rules_to_device()

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

async function remove({ id }) {
  let rule = await Rule.get(id)

  if (!rule) {
    throw new NotFound('Rule', id)
  }
  
  await Rule.delete(id)

  // Signal device(s)
  // no need to await the result
  send_rules_to_device()

  return
}

async function send_rules_to_device() {
  let rules = await list()

  //@ts-ignore
  let response = await axios.post(
    `${process.env.DEVICE_URL}/rules`, 
    JSON.stringify({ rules }),
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
  createRule: create,
  listRules: list,
  updateRule: update,
  deleteRule: remove
}
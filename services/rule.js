//@ts-check
/**
 * @template T
 * @typedef {import("gstore-node/lib/types").EntityData<T>} EntityData
 */
/**
 * @template T
 * @typedef {import("../models/temperature_record").TemperatureRecord} TemperatureRecord
 */


const { NotFound, BadRequest } = require('../error')

const Rule = require('../models/rule')

async function create(value) {
  let id = value.id
  delete value.id
  let rule = new Rule(Rule.sanitize(value, undefined))

  //@ts-ignore
  rule.entityKey = Rule.key(id)

  const { entityKey, entityData } = await rule.save()

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

  return
}


module.exports = {
  createRule: create,
  listRules: list,
  updateRule: update,
  deleteRule: remove
}
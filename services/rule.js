//@ts-check
/**
 * @template T
 * @typedef {import("gstore-node/lib/types").EntityData<T>} EntityData
 */
/**
 * @template T
 * @typedef {import("../models/temperature_record").TemperatureRecord} TemperatureRecord
 */

/**
 * @class RequestError
 * @extends Error
 * @property {number} RequestError.status
 */
class RequestError extends Error {
  /**
   * @param {number} status
   * @param {string} message
   */
  constructor(status, message) {
    super(message);

    this.status = status;
  }
}

const Rule = require('../models/rule')

function create(value) {
  let id = value.id
  delete value.id
  let rule = new Rule(Rule.sanitize(value, undefined))

  rule.entityKey = Rule.key(id)

  return rule.save()
}

async function list({ page = 1, pageSize = 100 }) {
  let { entities: rules } = await Rule.list({
    limit: pageSize,
    offset: (page - 1) * pageSize
  })

  if (rules.length === 0) {
    let error = new RequestError(404, 'No rules found')

    throw error
  }

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
      throw new RequestError(404, 'No rules found')
    }
    console.log("found entity with id", id, JSON.stringify(rule))

    let updated = await Rule.update(id, value, null, null, null, { replace: true })

    return updated
  } catch (error) {
    console.log(JSON.stringify(error))
    throw new RequestError(404, 'No rules found')
  }

}

async function remove(id) {
  let rule = await Rule.get(id)

  if (!rule) {
    throw new RequestError(404, 'No rules found')
  }

  await Rule.delete(id)

  return
}


module.exports = {
  create,
  list,
  update,
  remove
}
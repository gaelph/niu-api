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

const Rule = require('../models/rule')

function create(value) {
  let rule = new Rule(Rule.sanitize(value, undefined))

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
  let rule = await Rule.get(value.id)

  if (!rule) {
    throw new RequestError(404, 'No rules found')
  }

  let updated = await Rule.update(value.id, value)

  return updated
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
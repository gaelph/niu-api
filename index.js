//@ts-check
const CONFIG = require('./config.js')
require('./store').init(CONFIG.project)
const route = require('./routes')
const auth = require('./services/auth')
const { BadMethod } = require('./error')


const methodCheck = req => {
  if (req.method !== 'POST') {
    throw new BadMethod(req.method)
  }
}

/**
 * Responds to any HTTP request.
 *
 * @param {import('express').Request} req HTTP request context.
 * @param {import('express').Response} res HTTP response context.
 */
exports.niu = async (req, res) => {
  try {
    methodCheck(req)
    auth.check(req)
    let data = await route(req.body)

    res.send({ success: true, data })
  } catch (error) {
    res.status(error.status || 500).send({ success: false, error: error.message })
  }
};
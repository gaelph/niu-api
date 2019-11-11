//@ts-check
const CONFIG = require('./config.js')
require('./store').init(CONFIG.project)
const routes = require('./routes')
const auth = require('./services/auth')
/**
 * Responds to any HTTP request.
 *
 * @param {import('express').Request} req HTTP request context.
 * @param {import('express').Response} res HTTP response context.
 */
exports.nezh = (req, res) => {
  try {
    auth.check(req)
    let route = routes.findMatchingRoute(req)

    route(req, res)
  } catch (error) {
    res.send(error.status).send(error.message)
  }
};
//@ts-check
const CONFIG = require('./config.js')
require('./src/store').init(CONFIG.project)

const apiHandler = require('./src')


/**
 * Responds to any HTTP request.
 *
 * @param {import('express').Request} req HTTP request context.
 * @param {import('express').Response} res HTTP response context.
 */
exports.niu = apiHandler
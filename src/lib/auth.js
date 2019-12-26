//@ts-check
/** @typedef {import("express").Request} Request */

const process = require('process')

const { Unauthorized } = require('../error')

/**
 * 
 * @param {Request} req 
 * @throws {AuthError}
 */
function check(req) {
  let authHeader = req.headers.authorization

  if (!authHeader || authHeader !== `Bearer ${process.env.API_KEY}`) {
    console.log(`auh failed on ${req.path} with auth header ${authHeader}`)
    throw new Unauthorized()
  }
}

module.exports = { check }
//@ts-check
/** @typedef {import("express").Request} Request */

const process = require('process')

const { Unauthorized } = require('../error')

class AuthError extends Error {
  constructor() {
    super("Unauthorized")

    this.status = 401
  }
}

/**
 * 
 * @param {Request} req 
 * @throws {AuthError}
 */
function check(req) {
  let authHeader = req.header("authorization")

  if (!authHeader || authHeader !== `Bearer ${process.env.API_KEY}`) {
    throw new Unauthorized()
  }
}

module.exports = { check }
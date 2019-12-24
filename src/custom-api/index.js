//@ts-check
const { BadMethod } = require('../error')
const auth = require('../lib/auth')
const route = require('./routes')

const methodCheck = req => {
  if (req.method !== 'POST') {
    throw new BadMethod(req.method)
  }
}


module.exports = async (req, res) => {
  try {
    methodCheck(req)
    auth.check(req)
    
    let data = await route(req.body)

    res.send({ success: true, data })
  } catch (error) {
    res.status(error.status || 500).send({ success: false, error: error.message })
  }
}
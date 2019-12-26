//@ts-check
const customApiHandler = require('./custom-api')
const graphQLHandler = require('./graphql')

const auth = require('./lib/auth')

module.exports = async (req, res) => {
  try {
    auth.check(req)

    if (req.path.startsWith('/graphql')) {
      graphQLHandler(req, res)
    } else {
      await customApiHandler(req, res)
    }
  } catch (err) {
    console.error(err.status, err)
    res.status(err.status || 500).send(err.message)
  }
}
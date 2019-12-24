const customApiHandler = require('./custom-api')
const graphQLHandler = require('./graphql')

module.exports = (req, res) => {
  if (req.path.startsWith('/graphql')) {
    graphQLHandler(req, res)
  } else {
    customApiHandler(req, res)
  }
}
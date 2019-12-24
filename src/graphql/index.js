const ServerBuilder = require('./builder')
const auth = require('../lib/auth')

const GraphQLServer = ServerBuilder
  .new()
  .setContext((req, res) => {
    auth.check()

    return { req, res }
  })
  .addDomain('../domains/date')
  .addDomain('../domains/days')
  .addDomain('../domains/temperature-record')
  .addDomain('../domains/rule')
  .addDomain('../domains/event')
  .addDomain('../domains/hold')
  .addDomain('../domains/setting')
  .create()

module.exports = GraphQLServer

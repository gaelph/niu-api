require('./src/store').init()
const ServerBuilder = require('./src/graphql/builder')
const fs = require('fs')

const scehma = ServerBuilder
  .new()
  .setContext(({ req, res }) => {
    res.header('X-Api', 'GraphQL')

    return { req, res }
  })
  .addDomain('./src/domains/date')
  .addDomain('./src/domains/days')
  .addDomain('./src/domains/temperature-record')
  .addDomain('./src/domains/rule')
  .addDomain('./src/domains/event')
  .addDomain('./src/domains/hold')
  .addDomain('./src/domains/setting')
  .schema()

fs.writeFileSync('./schama.graphql', scehma)

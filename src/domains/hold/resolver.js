const Service = require('./service')

module.exports = {
  Query: {
    getHold: () => {
      return Service.getOverride()
    },
  },
  Mutation: {
    createHold: (_, { hold }) => {
      return Service.createOverride(hold)
    },
    updateHold: (_, { hold }) => {
      return Service.updateOverride(hold)
    },
    deleteHold: (_, { id }) => {
      return Service.deleteOverride({ id })
    },
  }
}
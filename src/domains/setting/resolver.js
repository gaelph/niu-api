const Service = require('./service')

module.exports = {
  Query: {
    listSettings: () => {
      return Service.listSettings()
    }
  },
  Mutation: {
    createSetting: (_, { setting }) => {
      return Service.createSetting(setting)
    },
    updateSetting: (_, { setting }) => {
      return Service.updateSetting(setting)
    }
  }
}
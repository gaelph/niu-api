//@ts-check
const Service = require('./service')

module.exports = {
  Query: {
    getLatestTemperatureRecord: () => {
      return Service.getLatestTemperatureRecord()
    },
    listTemperatureRecords: (_, arg) => {
      const page = arg.page || 1
      const pageSize = arg.pageSize || 100

      return Service.listTemperatureRecords({ page, pageSize })
    },
  },
  Mutation: {
    createTemperatureRecord: (_, { value }) => {
      return Service.createTemperatureRecord({ value })
    },
  }
}
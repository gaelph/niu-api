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
    temperatureRecordsSince: (_, arg) => {
      const ThreeDaysAgo = new Date()
      ThreeDaysAgo.setDate(ThreeDaysAgo.getDate() - 3)

      const timestamp = arg.after ? +new Date(arg.after) : +ThreeDaysAgo
      const date = new Date(timestamp)

      return Service.temperatureRecordsSince(date)
    }
  },
  Mutation: {
    createTemperatureRecord: (_, { value }) => {
      return Service.createTemperatureRecord({ value })
    },
  }
}
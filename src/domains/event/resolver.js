const Service = require('./service')

module.exports = {
  Query: {
    getLatestEvent: () => {
      return Service.getLatestEvent()
    },
    getLatestEventType: (_, { type }) => {
      return Service.getLatestEventType({ type })
    },
    getAllEvents: (_, { page = 1, pageSize = 100, after = new Date(0) }) => {
      return Service.getAllEvents({ page, pageSize, after })
    },
    getAllEventsType: (_, { type, page = 1, pageSize = 100, after = new Date(0) }) => {
      return Service.getAllEventsType({ type, page, pageSize, after })
    },
  },
  Mutation: {
    dispatchEvent: (_, { event: { type, value } }) => {
      return Service.dispatchEvent({ type, value })
    },
  },
  // Using custom enum value to comply with how rust handles things
  EventType: {
    BOILER_STATUS: "BoilerStatus"
  }
}
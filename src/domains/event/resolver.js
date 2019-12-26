const Service = require('./service')

module.exports = {
  Query: {
    getLatestEvent: () => {
      return Service.getLatestEvent()
    },
    getLatestEventType: (_, { type }) => {
      return Service.getLatestEventType({ type })
    },
    getAllEvents: (_, { page = 1, pageSize = 100 }) => {
      return Service.getAllEvents({ page, pageSize })
    },
    getAllEventsType: (_, { type, page = 1, pageSize = 100 }) => {
      return Service.getAllEventsType({ type, page, pageSize })
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
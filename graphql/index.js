//@ts-check
const { ApolloServer, gql } = require('apollo-server-cloud-functions')
const { importSchema } = require('graphql-import')
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

const typeDefs = gql(importSchema('graphql/schema/query.graphql'))

const auth = require('../services/auth')
const TemperatureRecord = require('../services/temperature_record')
const Event = require('../services/event')
const Rule = require('../services/rule')
const Hold = require('../services/override')
const Setting = require('../services/setting')

const resolvers = {
  Query: {

    // --------------------------------
    // TemperatureRecord Queries
    getLatestTemperatureRecord: () => {
      return TemperatureRecord.getLatestTemperatureRecord()
    },
    listTemperatureRecords: (_, arg) => {
      const page = arg.page || 1
      const pageSize = arg.pageSize || 100

      return TemperatureRecord.listTemperatureRecords({ page, pageSize })
    },

    // --------------------------------
    // Event Queries
    getLatestEvent: () => {
      return Event.getLatestEvent()
    },
    getLatestEventType: (_, { type }) => {
      return Event.getLatestEventType({ type })
    },
    getAllEvents: (_, { page = 1, pageSize = 100 }) => {
      return Event.getAllEvents({ page, pageSize })
    },
    getAllEventsType: (_, { type, page = 1, pageSize = 100 }) => {
      return Event.getAllEventsType({ type, page, pageSize })
    },

    // --------------------------------
    // Rule Queries
    listRules: (_, { page = 1, pageSize = 100 }) => {
      return Rule.listRules({ page, pageSize })
    },

    // --------------------------------
    // Hold Queries
    getHold: () => {
      return Hold.getOverride()
    },

    // --------------------------------
    listSettings: () => {
      return Setting.listSettings()
    }
  },
  Mutation: {
    // --------------------------------
    // TemperatureRecord Mutationa
    createTemperatureRecord: (_, { value }) => {
      return TemperatureRecord.createTemperatureRecord({ value })
    },

    // --------------------------------
    // Event Mutations
    dispatchEvent: (_, { type, value }) => {
      return Event.dispatchEvent({ type, value })
    },

    // --------------------------------
    // Rule Mutations
    createRule: (_, { rule }) => {
      return Rule.createRule(rule)
    },
    updateRule: (_, { rule }) => {
      return Rule.updateRule(rule)
    },
    deleteRule: (_, { rule: { id }}) => {
      return Rule.deleteRule({ id })
    },

    // -------------------------------
    // Hold Mutations
    createHold: (_, { hold }) => {
      return Hold.createOverride(hold)
    },
    updateHold: (_, { hold }) => {
      return Hold.updateOverride(hold)
    },
    deleteHold: (_, { id }) => {
      return Hold.deleteOverride({ id })
    },

    // -------------------------------
    // Setting Mutations
    createSetting: (_, { setting }) => {
      return Setting.createSetting(setting)
    },
    updateSetting: (_, { setting }) => {
      return Setting.updateSetting(setting)
    }
  },
  // Custom Date type to consistently use ISO date format
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date type using ISO string as serialized value',
    // deserialize
    parseValue: value => new Date(value),
    serialize: date => {
      if (typeof date === 'string') return date
      return date.toISOString()
    },
    parseLiteral: ast => {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value)
      }

      return null
    }
  }),
  // Custom Days type because of how Typescript handles enum, :-(
  Days: new GraphQLScalarType({
    name: 'Days',
    description: 'Days of the week a Rule is active for',
    parseValue: value => {
      return value
    },
    serialize: obj => {
      return obj
    },
  }),
  // Using custom enum value to comply with how rust handles things
  EventType: {
    BOILER_STATUS: "BoilerStatus"
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  context: ({ req, res }) => {
    console.log('gQL auth check')
    auth.check(req)
    console.log('gQL auth check PASS')
    return {
      req,
      res
    }
  }
})

module.exports = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
})
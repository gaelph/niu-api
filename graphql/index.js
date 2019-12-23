//@ts-check
const { ApolloServer, gql } = require('apollo-server-cloud-functions')
const { importSchema } = require('graphql-import')
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

const typeDefs = gql(importSchema('graphql/schema/query.graphql'))

const auth = require('../services/auth')
const TemperatureRecord = require('../services/temperature_record')

console.log('graphql Schema', typeDefs)

const resolvers = {
  Query: {
    hello: () => 'Hello',
    getLatestTemperatureRecord: () => {
      return TemperatureRecord.getLatestTemperatureRecord()
    },
    listTemperatureRecords: (_, arg) => {
      const page = arg.page || 1
      const pageSize = arg.pageSize || 100

      return TemperatureRecord.listTemperatureRecords({ page, pageSize })
    }
  },
  Mutation: {
    createTemperatureRecord: (_, { value }) => {
      return TemperatureRecord.createTemperatureRecord({ value })
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date type using ISO string as serialized value',
    // deserialize
    parseValue: value => new Date(value),
    serialize: date => date.toISOString(),
    parseLiteral: ast => {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value)
      }

      return null
    }
  })
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
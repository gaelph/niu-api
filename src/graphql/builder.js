//@ts-check
const path = require('path')
const fs = require('fs')
const callsites = require('callsites')

const { ApolloServer, gql } = require('apollo-server-cloud-functions')
const loader = require('./loader')

module.exports = class ServerBuilder {
  constructor() {

    this.gqlFiles = [
      path.resolve(__dirname, './base.graphql')
    ]

    this.resolvers = {
      Query: {},
      Mutation: {}
    }

    this.contextFunction = (_) => ({})
  }

  static new() {
    return new ServerBuilder()
  }

  setContext(contextFunction) {
    this.contextFunction = contextFunction

    return this
  }

  addDomain(pathToDomain) {
    const basePath = path.dirname(callsites()[1].getFileName())

    const absPath = path.resolve(basePath, pathToDomain)
  
    if (fs.existsSync(absPath)) {
      const Schema = path.join(absPath, 'schema.graphql')
      const Resolver = require(path.join(absPath, 'resolver'))

      if (!fs.existsSync(Schema)) {
        throw new Error(`Invalid domain. ${Schema} not found`)
      }

      if (!Resolver) {
        throw new Error(`Invalid domain. ${absPath}/resolver.js doesn't export a Resolver`)
      }
  
      this.gqlFiles.push(Schema)
  
      Object.keys(Resolver).forEach(key => {
        if (key === 'Query') {
          this.resolvers.Query = {
            ...this.resolvers.Query,
            ...Resolver.Query
          }
          return
        }
  
        if (key === 'Mutation') {
          this.resolvers.Mutation = {
            ...this.resolvers.Mutation,
            ...Resolver.Mutation
          }
          return
        }
  
        if (Object.prototype.hasOwnProperty.call(this.resolvers, key)) {
          console.warn(`${key} aleady registered`)
          return
        }
        
        this.resolvers = {
          ...this.resolvers,
          [key]: Resolver[key]
        }
      })
    } else {
      throw new Error(`Invalid domain. ${absPath} not found`)
    }

    return this
  }

  create() {
    const Schema = loader.load(this.gqlFiles)
    const typeDefs = gql(Schema)

    const server = new ApolloServer({
      typeDefs,
      resolvers: this.resolvers,
      playground: true,
      introspection: true,
      context: this.contextFunction
    })

    return server.createHandler({
      cors: {
        origin: '*',
        credentials: true,
        methods: ['POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }
    })
  }

}
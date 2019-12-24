const path = require('path');

const Resolver = require('./resolver')

const Schema = path.resolve(__dirname, './schema.graphql')

module.exports = {
  Resolver,
  Schema
}
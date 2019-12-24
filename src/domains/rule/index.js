const path = require('path');

const Schema = path.resolve(__dirname, './schema.graphql')
const Resolver = require('./resolver')

module.exports = {
  Schema,
  Resolver
}
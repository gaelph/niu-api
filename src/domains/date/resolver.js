//@ts-check
const path = require('path')
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

module.exports = {
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
}
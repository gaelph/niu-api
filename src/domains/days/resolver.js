//@ts-check
const path = require('path')
const { GraphQLScalarType } = require('graphql')

module.exports = {
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
}
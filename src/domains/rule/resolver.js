const Service = require('./service')

module.exports = {
  Query: {
    listRules: (_, { page = 1, pageSize = 100 }) => {
      return Service.listRules({ page, pageSize })
    },
  },
  Mutation: {
    createRule: (_, { rule }) => {
      return Service.createRule(rule)
    },
    updateRule: (_, { rule }) => {
      return Service.updateRule(rule)
    },
    deleteRule: (_, { rule: { id }}) => {
      return Service.deleteRule({ id })
    },

  }
}
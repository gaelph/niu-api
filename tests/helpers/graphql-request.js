const { mockRequest } = require('./request-response')

function gqlRequest(headers, gql, variables) {
  return mockRequest(
    'POST',
    '/graphql',
    headers,
    {
      query: gql,
      variables: variables
    }
  )
}

module.exports = (headers) => (gql, variables) => gqlRequest(headers, gql, variables)
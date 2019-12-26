const CONFIG = require('../../config.js')
require('../../src/store').init(CONFIG.project)

const apiHandler = require('../../src')

const { mockRequest, mockResponse } = require('../../tests/helpers/request-response')

const queries = {
  customApi: {
    getOverride: []
  },
  graphql: {
    query: `query {
      getHold {
        id
      }
    }`,
    variables: {}
  }
}

const requests = {
  customApi: {
    noHeader: () => ['POST', '/', {}, queries.customApi],
    badHeader: () => ['POST', '/', { authorization: 'Bearer bad-token'}, queries.customApi],
    getOverride: () => ['POST', '/', { authorization: `Bearer ${process.env.API_KEY}`}, queries.customApi]
  },
  graphql: {
    noHeader: () => ['POST', '/graphql', {}, queries.graphql],
    badHeader: () => ['POST', '/graphql', { authorization: 'Bearer bad-token'}, queries.graphql],
    getOverride: () => ['POST', '/graphql', { authorization: `Bearer ${process.env.API_KEY}`}, queries.graphql]
  }
}

describe('Authorization', () => {
  it('returns 401 if no authorization header is provided', () => {
    // Custom Api
    const reqCustomApi = mockRequest(...requests.customApi.noHeader())
    const resCustomApi = mockResponse()

    apiHandler(reqCustomApi, resCustomApi)

    expect(resCustomApi.status).toHaveBeenCalledWith(401)

    // GraphQL Api
    const reqGraphQL = mockRequest(...requests.graphql.noHeader())
    const resGraphQL = mockResponse()
    apiHandler(reqGraphQL, resGraphQL)

    expect(resGraphQL.status).toHaveBeenCalledWith(401)
  })

  it('returns 401 if authorization header is bad', () => {
    // Custom Api
    const reqCustomApi = mockRequest(...requests.customApi.badHeader())
    const resCustomApi = mockResponse()

    apiHandler(reqCustomApi, resCustomApi)

    expect(resCustomApi.status).toHaveBeenCalledWith(401)

    // GraphQL Api
    const reqGraphQL = mockRequest(...requests.graphql.badHeader())
    const resGraphQL = mockResponse()
    apiHandler(reqGraphQL, resGraphQL)

    expect(resGraphQL.status).toHaveBeenCalledWith(401)
  })

  it('works ok if a authorization header is good', () => {
    // Custom Api
    const reqCustomApi = mockRequest(...requests.customApi.getOverride())
    const resCustomApi = mockResponse()

    apiHandler(reqCustomApi, resCustomApi)

    expect(resCustomApi.status).not.toHaveBeenCalled()

    // GraphQL Api
    const reqGraphQL = mockRequest(...requests.graphql.getOverride())
    const resGraphQL = mockResponse()
    apiHandler(reqGraphQL, resGraphQL)

    expect(resGraphQL.status).not.toHaveBeenCalled()
  })
})

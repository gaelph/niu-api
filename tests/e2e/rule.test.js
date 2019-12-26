const CONFIG = require('../../config.js')
require('../../src/store').init(CONFIG.project)

const uuid = require('uuid/v4')

const headers = {
  authorization: 'Bearer ' + process.env.API_KEY,
  contentType: 'application/json'
}

const apiHandler = require('../../src')

const { mockRequest, mockResponse } = require('../../tests/helpers/request-response')
const graphQlRequestHelper = require('../../tests/helpers/graphql-request')
const gql = graphQlRequestHelper(headers)

const { waitUntilCalled } = require('../../tests/helpers/wait')
const { isISODate } = require('../../tests/helpers/iso-date')

describe('GraphQL Api Rule', () => {
  const INIITIAL_RULE_ID = uuid()

  async function createRule(id, name) {
    const response = mockResponse()
    const request = gql(`mutation($rule: CreateRuleInput) {
      createRule(rule: $rule) {
        id
        name
      }
    }`, {
      rule: {
        id: id,
        name: name,
        active: false,
        repeat: true,
        next_dates: [],
        days: {
          "0": false,
          "1": false,
          "2": false,
          "3": false,
          "4": false,
          "5": false,
          "6": false,
        },
        schedules: [{
          from: { hours: 8, minutes: 15 },
          to : { hours: 12, minutes: 15 },
          high: 23
        }]
      }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)
  
    return response
  }

  beforeAll(async (done) => {
    await createRule(INIITIAL_RULE_ID, 'Initial Rule')

    done()
  })

  it('creates a rule', async () => {
    const ruleId = uuid()
    const response = await createRule(ruleId, 'Created Rule')
    
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data: { createRule: rule } } = JSON.parse(response.send.mock.calls[0][0])

    expect(rule.id).toBe(ruleId)
    expect(rule.name).toBe('Created Rule')
  })

  it('lists rules', async () => {
    const response = mockResponse()
    const request = gql(`query {
      listRules {
        id
        name
      }
    }`, {})

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data: { listRules: rules } } = JSON.parse(response.send.mock.calls[0][0])

    expect(Array.isArray(rules)).toBe(true)
    expect(rules.length).toBeGreaterThan(0)
    expect(rules.every(rule => rule.hasOwnProperty('id'))).toBe(true)
    expect(rules.every(rule => rule.hasOwnProperty('name'))).toBe(true)
  })

  it('updates a rule', async () => {
    const response = mockResponse()
    const request = gql(`mutation($rule: UpdateRuleInput) {
      updateRule(rule: $rule) {
        id
        repeat
      }
    }`, {
      rule: {
        id: INIITIAL_RULE_ID,
        repeat: false
      }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data: { updateRule: { id, repeat } } } = JSON.parse(response.send.mock.calls[0][0])

    expect(id).toBe(INIITIAL_RULE_ID)
    expect(repeat).toBe(false)
  })

  it('fails update if rule does not exist', async () => {
    const response = mockResponse()
    const request = gql(`mutation($rule: UpdateRuleInput) {
      updateRule(rule: $rule) {
        id
        repeat
      }
    }`, {
      rule: {
        id: 'non-existing-rule',
        repeat: false
      }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { errors: [error, ..._] } = JSON.parse(response.send.mock.calls[0][0])

    expect(error.extensions.exception.status).toBe(404)
  })

  it('fails update if values are wrong', async () => {
    const response = mockResponse()
    const request = gql(`mutation($rule: UpdateRuleInput) {
      updateRule(rule: $rule) {
        id
        repeat
      }
    }`, {
      rule: {
        id: 'non-existing-rule',
        repeat: 'That is such a bad boolean'
      }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.send).toHaveBeenCalled()
  })

  it('removes a rule', async () => {
    const ruleId = uuid()
    await createRule(ruleId, 'Should be removed')

    const response = mockResponse()
    const request = gql(`mutation($rule: DeleteRuleInput) {
      deleteRule(rule: $rule) {
        id
      }
    }`, {
      rule: { id: ruleId }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()
  })

  it('fails remove rule if it does not exist', async () => {
    const ruleId = uuid()

    const response = mockResponse()
    const request = gql(`mutation($rule: DeleteRuleInput) {
      deleteRule(rule: $rule) {
        id
      }
    }`, {
      rule: { id: ruleId }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)
    
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { errors: [error, ..._] } = JSON.parse(response.send.mock.calls[0][0])

    expect(error.extensions.exception.status).toBe(404)
  })
})
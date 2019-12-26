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

describe('GraphQL API Setting', () => {
  async function createSetting(id, title, description, value) {
    const response = mockResponse()
    const request = gql(`mutation ($setting: CreateSettingInput) {
      createSetting(setting: $setting) {
        id
        title
        description
        value
        createdOn
        modifiedOn
      }
    }`, {
      setting: { id, title, description, value }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    return response
  }

  beforeAll(async (done) => {
    await createSetting(
      'test-setting',
      'Test Setting',
      'This is a setting only for automated test purposes',
      'A test value'
    )

    done()
  })

  it('creates a setting', async () => {
    const response = await createSetting(
      'create-test-setting',
      'Create Test Setting',
      'This is a setting only for automated test purposes',
      'A test value'
    )

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data: { createSetting: setting } } = JSON.parse(response.send.mock.calls[0][0])

    expect(setting.id).toBe('create-test-setting')
    expect(setting.title).toBe('Create Test Setting')
    expect(setting.description).toBe('This is a setting only for automated test purposes')
    expect(setting.value).toBe('A test value')
    expect(isISODate(setting.createdOn)).toBe(true)
    expect(isISODate(setting.modifiedOn)).toBe(true)
  })

  it('lists settings', async () => {
    const response = mockResponse()
    const request = gql(`query {
      listSettings {
        id
        value
      }
    }`, {})

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data: { listSettings: settings } } = JSON.parse(response.send.mock.calls[0][0])

    expect(Array.isArray(settings)).toBe(true)
    expect(settings.length).toBeGreaterThan(0)

    settings.forEach(setting => {
      expect(typeof setting.id).toBe('string')
      expect(typeof setting.value).toBe('string')
    })
  })

  it('updates a setting', async () => {
    const response = mockResponse()
    const request = gql(`mutation ($setting: UpdateSettingInput) {
      updateSetting(setting: $setting) {
        id
        value
      }
    }`, {
      setting: {
        id: 'test-setting',
        value: 'An updated Value'
      }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data: { updateSetting: setting } } = JSON.parse(response.send.mock.calls[0][0])

    expect(setting.id).toBe('test-setting')
    expect(setting.value).toBe('An updated Value')
  })

  it('fails at updating a setting if value is not a string', async () => {
    const response = mockResponse()
    const request = gql(`mutation ($setting: UpdateSettingInput) {
      updateSetting(setting: $setting) {
        id
        value
      }
    }`, {
      setting: {
        id: 'test-setting',
        value: 3402
      }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.send).toHaveBeenCalled()
  })
})
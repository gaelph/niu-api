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


describe('Custom Api Hold/Override', () => {
  beforeAll(async (done) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    await createHold('#test-override', 12, tomorrow)

    done()
  })

  async function createHold(id, v, date) {

    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        createOverride: {
          id: id,
          value: v,
          untilTime: date.toISOString()
        }
      }
    )

    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    return response
  }

  it('creates a hold/override', async () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const response = await createHold('test-create-hold', 12, tomorrow)

    expect(response.status).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalled()

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    expect(typeof data).toBe('object')

    expect(data.id).toBe('test-create-hold')
    expect(data.value).toBe(12)
    expect(data.untilTime).toEqual(tomorrow.toISOString())
  })

  it('gets a hold', async () => {
    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        getOverride: []
      }
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    expect(typeof data).toBe('object')

    expect(typeof data.id).toBe('string')
    expect(typeof data.value).toBe('number')
    expect(isISODate(data.untilTime)).toBe(true)
    expect(data.createdOn).toBeInstanceOf(Date)
    expect(data.modifiedOn).toBeInstanceOf(Date)
  })

  it('updates a hold', async () => {
    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        updateOverride: {
          id: '#test-override',
          value: 34
        }
      }
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    expect(typeof data).toBe('object')

    expect(data.id).toBe('#test-override')
    expect(data.value).toBe(34)
  })

  it('upserts a hold', async () => {
    tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const id = uuid()

    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        updateOverride: {
          id: id,
          value: 34,
          untilTime: tomorrow.toISOString()
        }
      }
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    expect(typeof data).toBe('object')

    expect(data.id).toBe(id)
    expect(data.value).toBe(34)
  })

  it('fails if input does not validate the schema', async () => {
    const id = uuid()

    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        updateOverride: {
          id: id,
          holdValue: "Very Bad Value"
        }
      }
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    const { success } = response.send.mock.calls[0][0]

    expect(response.status).toHaveBeenCalledWith(400)
    expect(success).toBe(false)
  })

  it('deletes a hold', async () => {
    tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    await createHold('#test-override-to-delete', 12, tomorrow)

    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        deleteOverride: {
          id: '#test-override-to-delete',
        }
      }
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    const { success } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
  })
})

describe('GraphQL Api Hold', () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  beforeAll(async (done) => {
    await createHold('#gql-test=hold', 15, tomorrow)

    done()
  })

  async function createHold (id, value, untilTime) {
    const response = mockResponse()

    const request = gql(`mutation($hold: CreateHoldInput) {
      createHold(hold: $hold) {
        id
        value
        untilTime
        createdOn
        modifiedOn
      }
    }`,
    {
      hold: {
        id: id,
        value: value,
        untilTime: untilTime.toISOString()
      }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    return response
  }

  it('creates a hold', async () => {
    const response = await createHold('#gql-test-create-hold', 15, tomorrow)

    expect(response.status).toHaveBeenCalledWith(200)

    const { data } = JSON.parse(response.send.mock.calls[0][0])
    const hold = data.createHold

    expect(typeof hold).toBe('object')
    expect(hold.id).toBe('#gql-test-create-hold')
    expect(hold.value).toBe(15)
    expect(hold.untilTime).toEqual(tomorrow.toISOString())
    expect(isISODate(hold.createdOn)).toBe(true)
    expect(isISODate(hold.modifiedOn)).toBe(true)
  })

  it('fails at creating a hold', async () => {
    const response = mockResponse()

    const request = gql(`mutation($hold: CreateHoldInput) {
      createHold(hold: $hold) {
        id
        value
        untilTime
        createdOn
        modifiedOn
      }
    }`,
    {
      hold: {
        value: "Very Bad Value",
      }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(400)
  })

  it('gets a hold', async () => {
    const response = mockResponse()
    const request = gql(`query {
      getHold {
        id
        value
        untilTime
        createdOn
        modifiedOn
      }
    }`, {})

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data: { getHold: hold } } = JSON.parse(response.send.mock.calls[0][0])

    expect(typeof hold).toBe('object')
    expect(typeof hold.id).toBe('string')
    expect(typeof hold.value).toBe('number')
    expect(isISODate(hold.untilTime)).toBe(true)
    expect(isISODate(hold.createdOn)).toBe(true)
    expect(isISODate(hold.modifiedOn)).toBe(true)
  })

  it('updates a hold', async () => {
    await createHold('#gql-hold-to-update', 0, tomorrow)
    const response = mockResponse()

    const request = gql(`mutation($hold: UpdateHoldInput) {
      updateHold(hold: $hold) {
        id
        value
        untilTime
        createdOn
        modifiedOn
      }
    }`, {
      hold: {
        id: '#gql-hold-to-update',
        value: 15
      }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data: { updateHold: hold } } = JSON.parse(response.send.mock.calls[0][0])

    expect(hold.id).toBe('#gql-hold-to-update')
    expect(hold.value).toBe(15)
    expect(hold.untilTime).toEqual(tomorrow.toISOString())
  })

  it('upserts a hold', async () => {
    const id = uuid()
    const response = mockResponse()

    const request = gql(`mutation($hold: UpdateHoldInput) {
      updateHold(hold: $hold) {
        id
        value
        untilTime
        createdOn
        modifiedOn
      }
    }`, {
      hold: {
        id: id,
        value: 15,
        untilTime: tomorrow.toISOString()
      }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data: { updateHold: hold } } = JSON.parse(response.send.mock.calls[0][0])

    expect(hold.id).toBe(id)
    expect(hold.value).toBe(15)
    expect(hold.untilTime).toEqual(tomorrow.toISOString())
  })

  it('fails updates/updsert with wrong valuse', async () => {
    await createHold('#gql-update-fail', 15, tomorrow)
    const response = mockResponse()

    const request = gql(`mutation($hold: UpdateHoldInput) {
      update(hold: $hold) 
    }`, {
      hold: {
        value: "Very Bad Value"
      }
    })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(400)
  })

  it('removes a hold', async () => {
    await createHold('#gql-hold-to-remove', 15, tomorrow)
    const response = mockResponse()
    const request = gql(`mutation($id: ID!) {
      deleteHold(id: $id) {
        id
      }
    }`, { id: '#gql-hold-to-remove' })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
  })

  it('fails at removing a hold that does not exist', async () => {
    const response = mockResponse()
    const request = gql(`mutation($id: ID!) {
      deleteHold(id: $id) {
        id
      }
    }`, { id: '#gql-hold-to-remove-that-does-not-exist' })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data, errors } = JSON.parse(response.send.mock.calls[0][0])

    expect(data.deleteHold).toBeNull()
    expect(errors.length).toBe(1)

    const { extensions: { exception } } = errors[0]
    expect(exception.status).toBe(404)
  })

})
const CONFIG = require('../../config.js')
require('../../src/store').init(CONFIG.project)

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

describe('Custom Api Event', () => {
  it('creates an event', async () => {
    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        dispatchEvent: {
          type: 'BoilerStatus',
          value: 'on'
        }
      }
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalled()

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    expect(typeof data).toBe('object')

    expect(typeof data.id).toBe('string')
    expect(data.value).toBe('on')
    expect(data.createdOn).toBeInstanceOf(Date)
    expect(data.modifiedOn).toBeInstanceOf(Date)
  })

  it('gets the latest event', async () => {
    const createRequest = mockRequest(
      'POST',
      '/',
      headers,
      {
        dispatchEvent: {
          type: 'BoilerStatus',
          value: 'on'
        }
      }
    )
    const createResponse = mockResponse()

    await apiHandler(createRequest, createResponse)
    await waitUntilCalled(createResponse.send)

    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        getLatestEvent: []
      }
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalled()

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    expect(typeof data).toBe('object')

    expect(typeof data.id).toBe('string')
    expect(typeof data.value).toBe('string')
    expect(data.createdOn).toBeInstanceOf(Date)
    expect(data.modifiedOn).toBeInstanceOf(Date)
  })

  it('gets events', async () => {
    const createRequest = mockRequest(
      'POST',
      '/',
      headers,
      {
        dispatchEvent: {
          type: 'BoilerStatus',
          value: 'on'
        }
      }
    )
    const createResponse = mockResponse()

    await apiHandler(createRequest, createResponse)
    await waitUntilCalled(createResponse.send)

    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        getAllEvents: []
      }
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalled()

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length > 0).toBe(true)

    data.forEach(event => {
      expect(typeof event.id).toBe('string')
      expect(typeof event.value).toBe('string')
      expect(event.createdOn).toBeInstanceOf(Date)
      expect(event.modifiedOn).toBeInstanceOf(Date)
    })
  })

  it('gets the latest event by type', async () => {
    const createRequest = mockRequest(
      'POST',
      '/',
      headers,
      {
        dispatchEvent: {
          type: 'BoilerStatus',
          value: 'on'
        }
      }
    )
    const createResponse = mockResponse()

    await apiHandler(createRequest, createResponse)
    await waitUntilCalled(createResponse.send)

    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        getLatestEventType: {
          type: 'BoilerStatus'
        }
      }
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalled()

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    
    expect(typeof data.id).toBe('string')
    expect(typeof data.value).toBe('string')
    expect(data.type).toBe('BoilerStatus')
    expect(data.createdOn).toBeInstanceOf(Date)
    expect(data.modifiedOn).toBeInstanceOf(Date)
  })

  it('gets events by type', async () => {
    const createRequest = mockRequest(
      'POST',
      '/',
      headers,
      {
        dispatchEvent: {
          type: 'BoilerStatus',
          value: 'on'
        }
      }
    )
    const createResponse = mockResponse()

    await apiHandler(createRequest, createResponse)
    await waitUntilCalled(createResponse.send)

    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        getAllEventsType: {
          type: 'BoilerStatus'
        }
      }
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalled()

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length > 0).toBe(true)

    data.forEach(event => {
      expect(typeof event.id).toBe('string')
      expect(typeof event.value).toBe('string')
      expect(event.createdOn).toBeInstanceOf(Date)
      expect(event.modifiedOn).toBeInstanceOf(Date)
    })

    expect(data.every(record => record.type === 'BoilerStatus')).toBe(true)
  })
})

async function createEvent() {
  const request = gql(`mutation($event: EventInput) {
        dispatchEvent(event: $event) {
          id
          type
          value
          createdOn
          modifiedOn
        }
      }`,
      {
        event: {
          type: "BOILER_STATUS",
          value: "on"
        }
      }
  )
  
  const response = mockResponse()

  await apiHandler(request, response)
  await waitUntilCalled(response.send)
}

describe('GraphQL Api Event', () => {
  it('creates an event', async () => {
    const request = gql( `mutation($event: EventInput) {
      dispatchEvent(event: $event) {
        id
        type
        value
        createdOn
        modifiedOn
      }
    }`,
    {
      event: {
        type: "BOILER_STATUS",
        value: "on"
      }
    })
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data } = JSON.parse(response.send.mock.calls[0][0])
    const result = data.dispatchEvent

    expect(result).not.toBeNull()

    expect(typeof result.id).toBe('string')
    expect(result.value).toBe('on')
    expect(isISODate(result.createdOn)).toBe(true)
    expect(isISODate(result.modifiedOn)).toBe(true)
  })

  it('gets the latest event', async () => {
    await createEvent()

    const request = gql(`query {
        getLatestEvent {
          id
          type
          value
          createdOn
          modifiedOn
        }
      }`,
      {}
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data } = JSON.parse(response.send.mock.calls[0][0])
    const result = data.getLatestEvent

    expect(typeof result).toBe('object')

    expect(typeof result.id).toBe('string')
    expect(typeof result.value).toBe('string')
    expect(isISODate(result.createdOn)).toBe(true)
    expect(isISODate(result.modifiedOn)).toBe(true)
  })

  it('gets events', async () => {
    await createEvent()

    const request = gql(`query {
        getAllEvents {
          id
          value
          type
          createdOn
          modifiedOn
        }
      }`,
      {}
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data } = JSON.parse(response.send.mock.calls[0][0])
    const result = data.getAllEvents

    expect(Array.isArray(result)).toBe(true)
    expect(result.length > 0).toBe(true)

    result.forEach(event => {
      expect(typeof event.id).toBe('string')
      expect(typeof event.value).toBe('string')
      expect(isISODate(event.createdOn)).toBe(true)
      expect(isISODate(event.modifiedOn)).toBe(true)
    })
  })

  it('gets the latest event by type', async () => {
    await createEvent()

    const request = gql(`query($type: EventType) {
        getLatestEventType(type: $type) {
          id
          type
          value
          createdOn
          modifiedOn
        }
      }`,
      {
        type: "BOILER_STATUS"
      }
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data } = JSON.parse(response.send.mock.calls[0][0])
    const result = data.getLatestEventType
    
    expect(typeof result.id).toBe('string')
    expect(typeof result.value).toBe('string')
    expect(result.type).toBe('BOILER_STATUS')
    expect(isISODate(result.createdOn)).toBe(true)
    expect(isISODate(result.modifiedOn)).toBe(true)
  })

  it('gets events by type', async () => {
    await createEvent()

    const request = gql(`query($type: EventType) {
        getAllEventsType(type: $type) {
          id
          type
          value
          createdOn
          modifiedOn
        }
      }`,
      {
        type: "BOILER_STATUS"
      }
      
    )
    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data: { getAllEventsType: result } } = JSON.parse(response.send.mock.calls[0][0])

    expect(Array.isArray(result)).toBe(true)
    expect(result.length > 0).toBe(true)

    result.forEach(event => {
      expect(typeof event.id).toBe('string')
      expect(typeof event.value).toBe('string')
      expect(isISODate(event.createdOn)).toBe(true)
      expect(isISODate(event.modifiedOn)).toBe(true)
    })

    expect(result.every(record => record.type === 'BOILER_STATUS')).toBe(true)
  })
})
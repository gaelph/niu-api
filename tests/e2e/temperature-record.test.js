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

describe('Custom API TemperatureRecord', () => {
  it('creates a TemperatureRecord', async () => {
    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        createTemperatureRecord: {
          value: 12.34503
        }
      }
    )

    const response = mockResponse()

    await apiHandler(request, response)

    expect(response.status).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalled()

    // The call result is the first argument of the first call
    const result = response.send.mock.calls[0][0]

    expect(result.success).toBe(true)
    expect(typeof result.data).toBe('object')

    expect(typeof result.data.id).toBe('string')
    expect(result.data.value).toBe(12.34503)
    expect(result.data.createdOn).toBeInstanceOf(Date)
    expect(result.data.modifiedOn).toBeInstanceOf(Date)
  })

  it('fails at createing a TemperatureRecord', async () => {
    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        createTemperatureRecord: {
          temperatureValue: "12.34503"
        }
      }
    )

    const response = mockResponse()

    await apiHandler(request, response)

    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.send).toHaveBeenCalled()
  })

  it('gets the latest temperature record', async () => {
    const createRequest = mockRequest(
      'POST',
      '/',
      headers,
      {
        createTemperatureRecord: {
          value: 12.34503
        }
      }
    )
    await apiHandler(createRequest, mockResponse())

    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        getLatestTemperatureRecord: []
      }
    )

    const response = mockResponse()

    await apiHandler(request, response)

    expect(response.status).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalled()

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    expect(typeof data).toBe('object')

    expect(typeof data.id).toBe('string')
    expect(data.value).toBe(12.34503)
    expect(data.createdOn).toBeInstanceOf(Date)
    expect(data.modifiedOn).toBeInstanceOf(Date)
  })

  it('lists all temperature records, page 1 by 3', async () => {
    const createRequest = mockRequest(
      'POST',
      '/',
      headers,
      {
        createTemperatureRecord: {
          value: 12.34503
        }
      }
    )
    await apiHandler(createRequest, mockResponse())

    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        listTemperatureRecords: {
          page: 1, pageSize: 3
        }
      }
    )

    const response = mockResponse()

    await apiHandler(request, response)

    expect(response.status).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalled()

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    expect(Array.isArray(data)).toBe(true)

    expect(data.length).toBe(3)

    data.forEach(record => {
      expect(typeof record.value).toBe('number')
      expect(record.createdOn).toBeInstanceOf(Date)
      expect(record.modifiedOn).toBeInstanceOf(Date)

    })
  })

  it('lists all temperature records with default page settings', async () => {
    const createRequest = mockRequest(
      'POST',
      '/',
      headers,
      {
        createTemperatureRecord: {
          value: 12.34503
        }
      }
    )
    await apiHandler(createRequest, mockResponse())

    const request = mockRequest(
      'POST',
      '/',
      headers,
      {
        listTemperatureRecords: []
      }
    )

    const response = mockResponse()

    await apiHandler(request, response)

    expect(response.status).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalled()

    const { success, data } = response.send.mock.calls[0][0]

    expect(success).toBe(true)
    expect(Array.isArray(data)).toBe(true)

    data.forEach(record => {
      expect(typeof record.value).toBe('number')
      expect(record.createdOn).toBeInstanceOf(Date)
      expect(record.modifiedOn).toBeInstanceOf(Date)

    })
  })
})


describe('GraphQL Api TemperatureRecord', () => {
  async function createTemperatureRecord() {
      const createRequest = gql(`mutation($value: Float) {
        createTemperatureRecord(value: $value)
      }`, { value: 12.5 }
    )
    const createResponse = mockResponse()

    await apiHandler(createRequest, createResponse)
    await waitUntilCalled(createResponse.send)

    return createResponse
  }

  beforeEach(async (done) => {
    await createTemperatureRecord()

    done()
  })

  it('creates a TemperatureRecord', async () => {
    const request = gql(`mutation($value: Float!) {
        createTemperatureRecord(value: $value) {
          id
          value
          createdOn
          modifiedOn
        }
      }`,
      { value: 12.5 }
    )

    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)
    
    // expect(response.status).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalled()
    
    // The call result is the first argument of the first call
    const result = JSON.parse(response.send.mock.calls[0][0])

    expect(typeof result.data).toBe('object')
    expect(typeof result.data.createTemperatureRecord).toBe('object')
    const record = result.data.createTemperatureRecord

    expect(typeof record.id).toBe('string')
    expect(record.value).toBe(12.5)
    expect(isISODate(record.createdOn)).toBe(true)
    expect(isISODate(record.modifiedOn)).toBe(true)
  })

  it('fails at createing a TemperatureRecord', async () => {
    const request = gql(`mutation ($value: Float) {
        createTemperatureRecord(value: $value)
      }`, "12.5"
    )

    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.send).toHaveBeenCalled()
  })

  it('gets the latest temperature record', async () => {
    const request = gql(`query {
        getLatestTemperatureRecord {
          id
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

    expect(typeof data).toBe('object')
    expect(typeof data.getLatestTemperatureRecord).toBe('object')

    const record = data.getLatestTemperatureRecord

    expect(typeof record.id).toBe('string')
    expect(typeof record.value).toBe('number')
    expect(isISODate(record.createdOn)).toBe(true)
    expect(isISODate(record.modifiedOn)).toBe(true)
  })

  it('lists all temperature records, page 1 by 3', async () => {
    const request = gql(`query {
        listTemperatureRecords(page: 1, pageSize: 3) {
          id
          value
          createdOn
          modifiedOn
        }
      }`, {}
    )

    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data } = JSON.parse(response.send.mock.calls[0][0])
    const records = data.listTemperatureRecords
    expect(Array.isArray(records)).toBe(true)

    expect(records.length).toBe(3)

    records.forEach(record => {
      expect(typeof record.value).toBe('number')
      expect(isISODate(record.createdOn)).toBe(true)
      expect(isISODate(record.modifiedOn)).toBe(true)
    })
  })

  it('lists all temperature records with default page settings', async () => {
    const request = gql(`query {
          listTemperatureRecords {
            id
            value
            createdOn
            modifiedOn
          }
        }`, {}
    )

    const response = mockResponse()

    await apiHandler(request, response)
    await waitUntilCalled(response.send)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    const { data } = JSON.parse(response.send.mock.calls[0][0])

    expect(Array.isArray(data.listTemperatureRecords)).toBe(true)
    const records = data.listTemperatureRecords

    records.forEach(record => {
      expect(typeof record.value).toBe('number')
      expect(isISODate(record.createdOn)).toBe(true)
      expect(isISODate(record.modifiedOn)).toBe(true)

    })
  })

  it('lists all temperature records after a date', async () => {
    const aMinuteAgo = new Date()
    aMinuteAgo.setMinutes(aMinuteAgo.getMinutes() - 1)

    const response = mockResponse()
    const request = gql(`query($after: Date) {
      temperatureRecordsSince(after: $after) {
        id
        value
        createdOn
      }
    }`, { after: aMinuteAgo.toISOString() })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)
    const { errors, data } = JSON.parse(response.send.mock.calls[0][0])

    if (errors) {
      errors.forEach(error => console.log(error.message))
    }
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    expect(errors).not.toBeDefined()
    expect(Array.isArray(data.temperatureRecordsSince)).toBe(true)

    const { temperatureRecordsSince: records } = data

    expect(records.every(record => {
      const createdOn = +new Date(record.createdOn)
      return createdOn > +aMinuteAgo
    })).toBe(true)
  })

  it('lists all records within the previous 3 days if no date is provided', async () => {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const response = mockResponse()
    const request = gql(`query {
      temperatureRecordsSince {
        id
        value
        createdOn
      }
    }`, { })

    await apiHandler(request, response)
    await waitUntilCalled(response.send)
    const { errors, data } = JSON.parse(response.send.mock.calls[0][0])

    if (errors) {
      errors.forEach(error => console.log(error.message))
    }
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalled()

    expect(errors).not.toBeDefined()
    expect(Array.isArray(data.temperatureRecordsSince)).toBe(true)

    const { temperatureRecordsSince: records } = data

    expect(records.every(record => {
      const createdOn = +new Date(record.createdOn)
      return createdOn > +threeDaysAgo
    })).toBe(true)

  })
})
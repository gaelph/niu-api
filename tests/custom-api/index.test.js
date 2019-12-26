const CONFIG = require('../../config')
require('../../src/store').init(CONFIG.project)

const { mockRequest, mockResponse } = require('../helpers/request-response')


describe('Custom API base', () => {
  it('exports a Custom API Handler', () => {
    const handler = require('../../src/custom-api')

    const req = mockRequest('POST', '/', {}, undefined)
    const res = mockResponse()

    try {
      handler(req, res)
    }
    catch(error) {}

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.header).toHaveBeenCalledWith('X-Api', 'Custom')
  })    
}) 

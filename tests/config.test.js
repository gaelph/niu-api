
describe('Config', () => {
  it('loads the config with GCP project', () => {
    const CONFIG = require('../config.js')
    
    expect(CONFIG).toMatchObject({
      project: '***REMOVED***'
    })
  })
}) 
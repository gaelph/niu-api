const { Gstore } = require('gstore-node');
const CONFIG = require('../config')

describe('Store', () => {
  it('initializes a GStore Node Instance', () => {
    require('../src/store').init(CONFIG.project)

    const store = require('../src/store').getInstance()

    expect(store).toBeInstanceOf(Gstore)
  })
})
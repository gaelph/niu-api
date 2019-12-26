require('../../config.js')

const auth = require('./auth')
const { Unauthorized } = require('../error')

describe('Auth', () => {
  it('does nothing if the token is right', () => {
    const fakeRequest = {
      headers: {
        authorization: `Bearer ${process.env.API_KEY}`
      }
    }

    try {
      const result = auth.check(fakeRequest)
      expect(result).toBeUndefined()
    } catch (err) {
      expect(err).toBeUndefined()
    }

  })

  it('throws if the token is not valid', () => {
    const fakeRequest = {
      headers: {
        authorization: `Bearer bad-token`
      }
    }

    try {
      auth.check(fakeRequest)
      expect(true).toBeUndefined()
    } catch (error) {
      expect(error).toBeInstanceOf(Unauthorized)
    }
  })

  it('throws if the header is not present', () => {
    const fakeRequest = {
      headers: {
        contentType: `application/json`
      }
    }

    try {
      auth.check(fakeRequest)
      expect(true).toBeUndefined()
    } catch (error) {
      expect(error).toBeInstanceOf(Unauthorized)
    }
  })
})
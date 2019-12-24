class RequestError extends Error {
  constructor(status, message) {
    super(message)

    this.status = status
  }
}

class NotFound extends RequestError {
  constructor(type, id) {
    super(404, `${type} {${id}} not found`)
  }
}

class Unauthorized extends RequestError {
  constructor() {
    super(401, 'Unauthorized')
  }
}

class BadMethod extends RequestError {
  constructor(method) {
    super(405, `Bad method ${method}`)
  }
}

class BadRequest extends RequestError {
  constructor(message) {
    super(400, message)
  }
}

class ServerError extends RequestError {
  constructor(message) {
    super(500, message)
  }
}

module.exports = {
  RequestError,
  NotFound,
  Unauthorized,
  BadMethod,
  BadRequest,
  ServerError,
}
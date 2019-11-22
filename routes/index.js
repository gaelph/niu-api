const services = require('../services')

const wrap = (maybeArray) => {
  let array;

  if (Array.isArray(maybeArray)) {
    array = maybeArray 
  } else {
    array = [maybeArray];
  }

  return array
}

module.exports = async (body) => {
  let func = Object.keys(body)[0]
  let args = wrap(body[func])

  let result = await services[func](...args)

  return result
}
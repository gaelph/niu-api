//@ts-check
const services = require('./services')

const wrap = (maybeArray) => {
  let array;

  if (Array.isArray(maybeArray)) {
    array = maybeArray 
  } else {
    array = [maybeArray];
  }

  return array
}

module.exports = (body) => {
  let func = Object.keys(body)[0]
  let args = wrap(body[func])

  return services[func](...args)
}
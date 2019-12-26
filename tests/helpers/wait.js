function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function waitUntilCalled(fn) {
  while (true) {
    if (fn.mock.calls.length === 0) {
      await wait(100)
    }
    else {
      break;
    }
  }
}

module.exports = {
  wait,
  waitUntilCalled
}
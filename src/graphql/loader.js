const fs = require('fs');

/**
 * Reads the content of a file
 * @param {String} path Path to the graphql file
 */
function read(path) {
  if (!path) {
    throw new Error("Cannot read a file without a path")
  }

  if (!path.endsWith('.graphql')) {
    throw new Error("Invalid file extension. Expected '.graphql'")
  }

  if (!fs.existsSync(path)) {
    throw new Error(`Invalid file path. ${path} not found`)
  }

  return fs.readFileSync(path, 'utf8').toString('utf8');
}

function load(paths) {
  return paths.map(read).join('\n');
}

module.exports = {
  load: load
}
const fs = require('fs');
const path = require('path');

function read(relativePath) {
  let absPath = path.resolve(__dirname, relativePath);

  return fs.readFileSync(absPath, 'utf8').toString('utf8');
}

function load(paths) {
  return paths.map(read).join('\n');
}

module.exports = {
  read: read,
  load: load
}
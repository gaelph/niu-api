const path = require('path');
const process = require('process');

require('dotenv').config(
  {
    path: path.resolve(process.cwd(), '.env')
  }
)

module.exports = {
  project: process.env.PROJECT
}
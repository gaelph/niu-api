//@ts-check
const path = require('path');
const process = require('process');

const envFileName = process.env.NODE_ENV === 'test' ? '.env-test': '.env'

require('dotenv').config(
  {
    path: path.resolve(process.cwd(), envFileName)
  }
)

module.exports = {
  project: process.env.PROJECT
}
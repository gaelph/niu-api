//@ts-check
const Rule = require('../domains/rule/service')
const TemperatureRecord = require('../domains/temperature-record/service')
const Setting = require('../domains/setting/service')
const Override = require('../domains/hold/service')
const Event = require('../domains/event/service')

module.exports = {
  ...Rule,
  ...TemperatureRecord,
  ...Setting,
  ...Override,
  ...Event
}
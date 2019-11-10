//@ts-check
const CONFIG = require('./config.js')
require('./store').init(CONFIG.project)
const TemperatureRecordService = require('./services/temperature_record')
/**
 * Responds to any HTTP request.
 *
 * @param {import('express').Request} req HTTP request context.
 * @param {import('express').Response} res HTTP response context.
 */
exports.nezh = (req, res) => {
  if (req.method == 'POST') {
    TemperatureRecordService.create(req.body)
    .then(entity => {
      res.status(201).send({ success: true, data: entity.entityData })
    })
    .catch(err => {
      res.status(400).send({ success: false, error: err.message, body: JSON.stringify(req.body) })
    })
  }
  else {
    res.status(405).send();
  }
};
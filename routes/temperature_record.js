const TemperatureRecordService = require('../services/temperature_record')
const { post, route } = require('./utils')

module.exports = route(
  post('/', (req, res) => {
    TemperatureRecordService.create(req.body)
    .then(entity => {
      res.status(201).send({ success: true, data: entity.entityData })
    })
    .catch(err => {
      res.status(400).send({ success: false, error: err.message, body: JSON.stringify(req.body) })
    })
  })
)
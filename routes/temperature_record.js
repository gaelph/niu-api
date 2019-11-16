const TemperatureRecordService = require('../services/temperature_record')
const { get, post, route } = require('./utils')

module.exports = route(
  post('/', (req, res) => {
    TemperatureRecordService.create(req.body)
    .then(entity => {
      res.status(201).send({ success: true, data: entity.entityData })
    })
    .catch(err => {
      res.status(400).send({ success: false, error: err.message, body: JSON.stringify(req.body) })
    })
  }),
  get('/latest', async (req, res) => {
    TemperatureRecordService.getLatest()
    .then((record) => {
      res.status(200).send({ success: true, data: record })
    })
    .catch(err => {
      res.status(err.status || 400).send({ success: false, error: err.message })
    })
  }),
  get('/', (req, res) => {
    let { page, pageSize } = req.query

    TemperatureRecordService.list({ page, pageSize }) 
    .then((records) => {
      res.status(200).send({ success: true, data: records })
    })
    .catch(err => {
      res.status(err.status || 400).send({ success: false, error: err.message })
    })
  })
)
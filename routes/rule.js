const Rule = require('../services/rule')
const { get, post, patch, del, route } = require('./utils')

module.exports = route(
  post('/rules', (req, res) => {
    Rule.create(req.body)
    .then(entity => {
      res.status(201).send({ success: true, data: entity.entityData })
    })
    .catch(err => {
      res.status(400).send({ success: false, error: err.message, body: JSON.stringify(req.body) })
    })
  }),
  get('/rules', (req, res) => {
    let { page, pageSize } = req.query

    Rule.list({ page, pageSize }) 
    .then((records) => {
      res.status(200).send({ success: true, data: records })
    })
    .catch(err => {
      res.status(err.status || 400).send({ success: false, error: err.message })
    })
  }),
  patch('/rules', (req, res) => {
    Rule.update(req.body)
    .then(updated => {
      res.status(200).send({ success: true, data: updated.entityData })
    })
    .catch(err => {
      res.status(err.status || 400).send({ success: false, error: err.message })
    })
  }),
  post('/rules/delete', (req, res) => {
    let { id } = req.query

    Rule.remove(id)
    .then(() => {
      res.status(204).send({ success: true })
    })
    .catch(err => {
      res.status(err.status || 400).send({ success: false })
    })
  })
)
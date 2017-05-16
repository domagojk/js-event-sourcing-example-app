import express from 'express'
import bodyParser from 'body-parser'
import customer from './api/customer'

const api = express()
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }))

customer(api)

api.listen(3000, function () {
  console.log('Api listening on port 3000!')
})

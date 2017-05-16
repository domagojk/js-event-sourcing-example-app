import express from 'express'
import bodyParser from 'body-parser'

import Application from './application'

import customer from './controllers/customer'

/**
 * Initiliaze api interface
 * 
 * @returns 
 */
function Api () {
  const { eventBus, commandBus, memDB } = Application()

  const api = express()
  api.use(bodyParser.json())
  api.use(bodyParser.urlencoded({ extended: true }))

  customer(api, eventBus, commandBus, memDB)

  return api
}

export default Api
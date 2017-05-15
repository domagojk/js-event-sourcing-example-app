import express from 'express'
import bodyParser from 'body-parser'

import Application from './application'

import customer from './controllers/customer'

/**
 * Initiliaze api interface
 * 
 * @param {CommandBus} commandBus Instance of CommandBus to handle commands
 * @returns 
 */
function Api (commandBus, memDB) {
  const application = Application()

  const api = express()
  api.use(bodyParser.json())
  api.use(bodyParser.urlencoded({ extended: true }))

  customer(api, application.eventBus, application.commandBus, application.memDB)

  return api
}

export default Api
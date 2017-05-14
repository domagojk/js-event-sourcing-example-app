import express from 'express'
import bodyParser from 'body-parser'

import customer from './customer'

/**
 * Initiliaze api interface
 * 
 * @param {CommandBus} commandBus Instance of CommandBus to handle commands
 * @returns 
 */
function Api (commandBus) {
  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  customer(app, commandBus)

  return app
}

export default Api
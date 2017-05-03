import CommandBus from '../lib/CommandBus'
import EventStore from '../lib/EventStore'

import { CREATE_CUSTOMER } from '../domain/constants/commands'
import CustomerCommandHandler from '../domain/commandHandlers/CustomerCommandHandler'

function Api () {

  const commandBus = CommandBus('localhost', '6020')

  const customerCommandHandler = CustomerCommandHandler(EventStore)

  async function init () {
    await commandBus.connect()
    //  register command handlers to command bus
    commandBus.registerHandler(CREATE_CUSTOMER, customerCommandHandler)
  }

  return {
    init
  }

}

export default Api
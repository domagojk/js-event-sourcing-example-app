import CommandBus from '../lib/CommandBus'
import EventBus from '../lib/EventBus'
import EventStore from '../lib/EventStore'
import MemDB from '../lib/MemDB'

import { CREATE_CUSTOMER, UPDATE_CUSTOMER, DEACTIVATE_CUSTOMER, REACTIVATE_CUSTOMER } from '../domain/constants/commands'
import CustomerCommandHandler from '../domain/commandHandlers/CustomerCommandHandler'

function Application () {

  const commandBus = CommandBus()
  const eventBus = EventBus()
  const eventStore = EventStore(eventBus)
  const memDB = MemDB()

  const customerCommandHandler = CustomerCommandHandler(eventStore)
  commandBus.registerHandler(CREATE_CUSTOMER, customerCommandHandler)
  commandBus.registerHandler(UPDATE_CUSTOMER, customerCommandHandler)
  commandBus.registerHandler(DEACTIVATE_CUSTOMER, customerCommandHandler)
  commandBus.registerHandler(REACTIVATE_CUSTOMER, customerCommandHandler)

  return {
    commandBus,
    eventBus
  }

}

export default Application
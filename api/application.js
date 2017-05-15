/**
 * This is where domain components are initialized. For this api service, all domain components are initialized here,
 * but we could easily separate our application into separate services. Then we could initiliaze only domain components
 * that are needed for each service (for example customer service would initialize only customer related components, and
 * order service would initilize shopping order components and only those customer components needed for shopping order validation)
 */

import CommandBus from '../lib/CommandBus'
import EventBus from '../lib/EventBus'
import EventStore from '../lib/EventStore'
import MemDB from '../lib/MemDB'

import MemDBReadModelPersistanceAdapter from '../lib/MemDBReadModelPersistanceAdapter'

import { EVENT } from '../domain/constants/eventTypes'
import { 
  REGISTER_CUSTOMER,
  CREATE_CUSTOMER, 
  UPDATE_CUSTOMER, 
  DEACTIVATE_CUSTOMER, 
  REACTIVATE_CUSTOMER 
} from '../domain/constants/commands'
import CustomerCommandHandler from '../domain/commandHandlers/CustomerCommandHandler'

import CustomerListReadModel from '../domain/readModels/CustomerListReadModel'

import CustomerCreateService from '../domain/services/CustomerCreateService'

/**
 * Application factory
 * Initialize all domain components needed for api application
 *  
 * @returns {Application}
 */
function Application () {

  const commandBus = CommandBus()
  const eventBus = EventBus()
  const eventStore = EventStore(eventBus, EVENT)
  const memDB = MemDB()

  const memDBReadModelPersistanceAdapter = MemDBReadModelPersistanceAdapter(memDB)

  const customerCommandHandler = CustomerCommandHandler(eventStore)
  commandBus.registerHandler(REGISTER_CUSTOMER, customerCommandHandler)
  commandBus.registerHandler(CREATE_CUSTOMER, customerCommandHandler)
  commandBus.registerHandler(UPDATE_CUSTOMER, customerCommandHandler)
  commandBus.registerHandler(DEACTIVATE_CUSTOMER, customerCommandHandler)
  commandBus.registerHandler(REACTIVATE_CUSTOMER, customerCommandHandler)

  const customerListReadModel = CustomerListReadModel(eventBus, eventStore, memDBReadModelPersistanceAdapter)

  const customerCreateService = CustomerCreateService(eventBus, commandBus, memDBReadModelPersistanceAdapter)

  return {
    commandBus,
    eventBus,
    memDB
  }

}

export default Application
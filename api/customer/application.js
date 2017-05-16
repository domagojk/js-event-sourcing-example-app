/**
 * This is where domain components are initialized. Since this is the only api service for this project,
 * all domain components are initialized here, but we could easily separate our application into multiple services.
 * Then we could initialize only those domain components needed for each service (for example customer service
 * would initialize only customer related components, and order service would initilize shopping order components and
 * only those customer components needed for shopping order validation)
 */

import CommandBus from '../../lib/CommandBus'
import EventBus from '../../lib/EventBus'
import EventStore from '../../lib/EventStore'
import MemDB from '../../lib/MemDB'

import MemDBReadModelPersistanceAdapter from '../../lib/MemDBReadModelPersistanceAdapter'

import { EVENT } from '../../domain/constants/eventTypes'
import {
  REGISTER_CUSTOMER,
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER,
  DEACTIVATE_CUSTOMER,
  REACTIVATE_CUSTOMER
} from '../../domain/constants/commands'

import CustomerCommandHandler from '../../domain/commandHandlers/CustomerCommandHandler'
import CustomerListReadModel from '../../domain/readModels/CustomerListReadModel'
import CustomerCreateService from '../../domain/services/CustomerCreateService'

/**
 * Application factory
 * Initialize all domain components needed for api application
 *
 * @returns {Application}
 */
function Application () {
  //  instantiate infrastructure services
  //  in real application we would use drivers for standalone database services such as mongo, mysql etc.
  //  or services like deepstream for event/command bus
  const commandBus = CommandBus()
  const eventBus = EventBus()
  const eventStore = EventStore(eventBus, EVENT)
  const memDB = MemDB()

  //  instantiate memdb persistance adapter
  //  to use mongo db for read model instead of memdb for example, we would just need to create persistance
  //  adapter for mongo and instantiate it here instead of this one
  const memDBReadModelPersistanceAdapter = MemDBReadModelPersistanceAdapter(memDB)

  //  register all command handlers to command bus instance
  //  we can then use the command bus to allow domain services to send commands to command handlers
  const customerCommandHandler = CustomerCommandHandler(eventStore)
  commandBus.registerHandler(REGISTER_CUSTOMER, customerCommandHandler)
  commandBus.registerHandler(CREATE_CUSTOMER, customerCommandHandler)
  commandBus.registerHandler(UPDATE_CUSTOMER, customerCommandHandler)
  commandBus.registerHandler(DEACTIVATE_CUSTOMER, customerCommandHandler)
  commandBus.registerHandler(REACTIVATE_CUSTOMER, customerCommandHandler)

  //  instantiate read models
  //  read models are listening for events from event bus and project them to a view

  //  CustomerListReadModel creates and maintains a list of customers in a single collection.
  //  We'll provide instance of MemDBReadModelPersistanceAdapter to customer read model that will
  //  persist view data to MemDB instance. If we'd pass a different persistance adapter then data
  //  could be stored inside mongo collection or sql table.
  CustomerListReadModel(eventBus, eventStore, memDBReadModelPersistanceAdapter)

  //  instantiate domain services
  //  domain services are listening for events from event bus and can act upon them by creating
  //  commands that are sent to command bus, or can dispach error events to event bus

  //  CustomerCreateService listens for CUSTOMER_REGISTERED event and checks email uniquness for
  //  registering customer by querying customer list read model view.
  //  If email is unique, CREATE_CUSTOMER command will be sent to command bus, or CUSTOMER_EXISTING_EMAIL_FOUND
  //  error event will be emitted to event bus if email is not unique
  CustomerCreateService(eventBus, commandBus, memDBReadModelPersistanceAdapter)

  return {
    commandBus,
    eventBus,
    memDB
  }
}

export default Application

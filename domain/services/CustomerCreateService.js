import sleep from 'sleep-promise'

import { EVENT, ERROR } from '../constants/eventTypes'
import { CUSTOMER_REGISTERED, CUSTOMER_CREATED } from '../constants/events'
import { CUSTOMERS } from '../constants/collections'
import { CreateCustomer } from '../commands/CustomerCommands'
import { CustomerExistingEmailFound } from '../events/CustomerEvents'

/**
 * Customer create service factory
 * This service listens for CUSTOMER_REGISTERED events and validates email uniquness.
 * If email is unique then CreateCustomer command is executed, or duplicate email event is emited
 * 
 * @param {EventBus} eventBus Instance of EventBus to subscribe event handler to
 * @param {CommandBus} commandBus Instance of CommandBus for sending commands
 * @param {ReadModelPersistenceAdapter} adapter  Instance of ReadModelPersistenceAdapter to handle data persistance
 */
function CustomerCreateService (eventBus, commandBus, adapter) {
  /**
   * Handle customer registered event
   * 
   * @param {CustomerRegistered} event 
   */
  async function onCustomerRegisteredEvent (event) {
    //  wait for 300 ms to ensure readmodel is consistent relative to registered event
    //  then check if email has been already taken
    //  this is very simplified validation for showcase purpose
    //  in real application we would at least want to check read model consistency compared to this event
    await sleep(300)
    const customerExists = await adapter.find(CUSTOMERS, 'email', event.email)
    if (!customerExists.length) {
      const createCustomerCommand = CreateCustomer(event.customerId, event.name, event.email, event.password)
      commandBus.handle(createCustomerCommand)
    } else {
      const customerExistingEmailFound = CustomerExistingEmailFound(event.customerId)
      eventBus.emit(ERROR, customerExistingEmailFound)
    }
  }

  /**
   * Event handler for emited events
   * Listens for 'event' from `repository` event emitter that should emit every event that is stored into repository
   * 
   * @param {any} event 
   * @returns 
   */
  function onEvent (event) {
    switch (event.__name) {
      case CUSTOMER_REGISTERED:
        return onCustomerRegisteredEvent(event)
    }
  }
  eventBus.on(EVENT, onEvent)
}

export default CustomerCreateService
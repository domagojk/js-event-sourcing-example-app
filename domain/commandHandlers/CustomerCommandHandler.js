import { CREATE_CUSTOMER } from '../constants/commands'

import CustomerAggregate from '../aggregates/CustomerAggregate'

/**
 * Create customer command handler
 * 
 * @param {Object} repository Instance of EventStore
 * @returns 
 */
function CustomerCommandHandler (repository) {

  if (!repository) {
    throw new Error('missing repository param')
  }
  
  async function createCustomer (command) {
    const customerId = command.customerId
    const customerName = command.name
    const events = await repository.readEvents(customerId)
    //  now that we got event history for customer we can instatiate aggregate root
    //  and recreate its state
    const customer = CustomerAggregate()
    const state = customer.loadFromHistory(events)
    //  when we have current state we can execute command on aggregate
    const newState = customer.create(state, customerId, customerName)
    //  if command is successful we can store uncommited events to event store
    const uncomitedEvents = customer.getUncommittedChanges(newState)
    const expectedVersion = customer.getCurrentVersion(newState)
    await repository.storeEvents(customerId, uncomitedEvents, expectedVersion)
  }

  async function handle(command) {
    switch (command.__name) {
      case CREATE_CUSTOMER:
        return await createCustomer(command)
    }
    throw new Error('unrecognised command')
  }

  return {
    handle
  }

}

export default CustomerCommandHandler
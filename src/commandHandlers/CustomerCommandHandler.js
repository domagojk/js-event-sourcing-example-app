import { CREATE_CUSTOMER } from '../constants/commands'

import EventStore from '../lib/EventStore'
import CustomerAggregate from '../aggregates/CustomerAggregate'

function CustomerCommandHandler () {
  
  async function createCustomer (command) {
    const customerId = command.customerId
    const customerEmail = command.email
    const events = await EventStore.readEvents(customerId)
    //  now that we got event history for customer we can instatiate aggregate root
    //  and recreate its state
    const customer = CustomerAggregate()
    const state = customer.loadFromHistory(events)
    //  when we have current state we can execute command on aggregate
    const newState = customer.create(state, customerId, customerEmail)
    //  if command is successful we can store uncommited events to event store
    const uncomitedEvents = customer.getUncommittedChanges(newState)
    const expectedVersion = customer.getCurrentVersion(newState)
    await EventStore.storeEvents(customerId, uncomitedEvents, expectedVersion)
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
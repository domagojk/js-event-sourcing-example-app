import {
  REGISTER_CUSTOMER,
  CREATE_CUSTOMER, 
  UPDATE_CUSTOMER, 
  DEACTIVATE_CUSTOMER, 
  REACTIVATE_CUSTOMER 
} from '../constants/commands'

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

  async function registerCustomer (command) {
    const customerId = command.customerId
    const customerName = command.name
    const customerEmail = command.email
    const customerPassword = command.password
    const events = await repository.readEvents(customerId)
    //  now that we got event history for customer we can instatiate aggregate root
    //  and recreate its state
    const customer = CustomerAggregate()
    const state = customer.loadFromHistory(events)
    //  when we have current state we can execute command on aggregate
    const newState = customer.register(state, customerId, customerName, customerEmail, customerPassword)
    //  if command is successful we can store uncommited events to event store
    const uncomitedEvents = customer.getUncommittedChanges(newState)
    const expectedVersion = customer.getCurrentVersion(newState)
    await repository.storeEvents(customerId, uncomitedEvents, expectedVersion)
  }
  
  async function createCustomer (command) {
    const customerId = command.customerId
    const customerName = command.name
    const customerEmail = command.email
    const customerPassword = command.password
    const events = await repository.readEvents(customerId)
    //  now that we got event history for customer we can instatiate aggregate root
    //  and recreate its state
    const customer = CustomerAggregate()
    const state = customer.loadFromHistory(events)
    //  when we have current state we can execute command on aggregate
    const newState = customer.create(state, customerId, customerName, customerEmail, customerPassword)
    //  if command is successful we can store uncommited events to event store
    const uncomitedEvents = customer.getUncommittedChanges(newState)
    const expectedVersion = customer.getCurrentVersion(newState)
    await repository.storeEvents(customerId, uncomitedEvents, expectedVersion)
  }

  async function updateCustomer (command) {
    const customerId = command.customerId
    const customerName = command.name
    const events = await repository.readEvents(customerId)
    //  now that we got event history for customer we can instatiate aggregate root
    //  and recreate its state
    const customer = CustomerAggregate()
    const state = customer.loadFromHistory(events)
    //  when we have current state we can execute command on aggregate
    const newState = customer.update(state, customerName)
    //  if command is successful we can store uncommited events to event store
    const uncomitedEvents = customer.getUncommittedChanges(newState)
    const expectedVersion = customer.getCurrentVersion(newState)
    await repository.storeEvents(customerId, uncomitedEvents, expectedVersion)
  }

  async function deactivateCustomer (command) {
    const customerId = command.customerId
    const events = await repository.readEvents(customerId)
    //  now that we got event history for customer we can instatiate aggregate root
    //  and recreate its state
    const customer = CustomerAggregate()
    const state = customer.loadFromHistory(events)
    //  when we have current state we can execute command on aggregate
    const newState = customer.deactivate(state)
    //  if command is successful we can store uncommited events to event store
    const uncomitedEvents = customer.getUncommittedChanges(newState)
    const expectedVersion = customer.getCurrentVersion(newState)
    await repository.storeEvents(customerId, uncomitedEvents, expectedVersion)
  }

  async function reactivateCustomer (command) {
    const customerId = command.customerId
    const events = await repository.readEvents(customerId)
    //  now that we got event history for customer we can instatiate aggregate root
    //  and recreate its state
    const customer = CustomerAggregate()
    const state = customer.loadFromHistory(events)
    //  when we have current state we can execute command on aggregate
    const newState = customer.reactivate(state)
    //  if command is successful we can store uncommited events to event store
    const uncomitedEvents = customer.getUncommittedChanges(newState)
    const expectedVersion = customer.getCurrentVersion(newState)
    await repository.storeEvents(customerId, uncomitedEvents, expectedVersion)
  }

  async function handle(command) {
    switch (command.__name) {
      case REGISTER_CUSTOMER:
        return await registerCustomer(command)
      case CREATE_CUSTOMER:
        return await createCustomer(command)
      case UPDATE_CUSTOMER:
        return await updateCustomer(command)
      case DEACTIVATE_CUSTOMER:
        return await deactivateCustomer(command)
      case REACTIVATE_CUSTOMER:
        return await reactivateCustomer(command)
    }
    throw new Error('unrecognised command')
  }

  return {
    handle
  }

}

export default CustomerCommandHandler
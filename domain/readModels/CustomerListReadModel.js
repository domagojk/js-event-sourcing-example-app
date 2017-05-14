import { CUSTOMER_CREATED, CUSTOMER_UPDATED, CUSTOMER_DEACTIVATED, CUSTOMER_REACTIVATED } from '../constants/events'
import { CUSTOMERS } from '../constants/collections'

/**
 * Customer list read model factory
 * 
 * @param {EventBus} bus Instance of EventBus to subscribe event handler to
 * @param {Repository} repository Instance of Repository for rebuilding initial read model state
 * @param {MemDB} db  Instance of MemDB where this read model will store data
 */
function CustomerListReadModel (bus, repository, db) {
  /**
   * Handle customer created event
   * 
   * @param {CustomerCreated} event 
   */
  function onCustomerCreatedEvent (event) {
    //  check if customer exists in read model and throw an exception if true
    //  this should never happend but if it does, it indicates that we have serious problem with our domain model
    if (db.get(CUSTOMERS, event.customerId)) {
      throw new Error('Customer already exists')
    }
    db.insert(CUSTOMERS, event.customerId, {
      name: event.name,
      email: event.email,
      password: event.password,
      active: 1
    })
  }

  /**
   * Handle customer updated event
   * 
   * @param {CustomerUpdated} event 
   */
  function onCustomerUpdatedEvent (event) {
    const customer = db.get(CUSTOMERS, event.customerId)
    //  check if customer does not exist in read model and throw an exception if true
    //  this should never happend but if it does, it indicates that we have serious problem with our domain model
    //  or that our read model has not been rebuilt properly
    if (!customer) {
      throw new Error('Customer not found')
    }
    customer.name = event.name
    db.update(CUSTOMERS, event.customerId, customer)
  }

  /**
   * Handle customer deactivated event
   * 
   * @param {CustomerDeactivated} event 
   */
  function onCustomerDeactivatedEvent (event) {
    const customer = db.get(CUSTOMERS, event.customerId)
    //  check if customer does not exist in read model and throw an exception if true
    //  this should never happend but if it does, it indicates that we have serious problem with our domain model
    //  or that our read model has not been rebuilt properly
    if (!customer) {
      throw new Error('Customer not found')
    }
    customer.active = 0
    db.update(CUSTOMERS, event.customerId, customer)
  }

  /**
   * Handle customer reactivated event
   * 
   * @param {CustomerReactivated} event 
   */
  function onCustomerReactivatedEvent (event) {
    const customer = db.get(CUSTOMERS, event.customerId)
    //  check if customer does not exist in read model and throw an exception if true
    //  this should never happend but if it does, it indicates that we have serious problem with our domain model
    //  or that our read model has not been rebuilt properly
    if (!customer) {
      throw new Error('Customer not found')
    }
    customer.active = 1
    db.update(CUSTOMERS, event.customerId, customer)
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
      case CUSTOMER_CREATED:
        return onCustomerCreatedEvent(event)
      case CUSTOMER_UPDATED:
        return onCustomerUpdatedEvent(event)
      case CUSTOMER_DEACTIVATED:
        return onCustomerDeactivatedEvent(event)
      case CUSTOMER_REACTIVATED:
        return onCustomerReactivatedEvent(event)
    }
  }
  bus.on('event', onEvent)

  // Rebuild read model from event store. Process all events from event store to catchup with the current state.
  // This is very simplified rebuild process just to showcase how read model can be rebuilt from existing event store.
  // In practice we would however at least compare the state of read model with event store to process only those events
  // that occured during the downtime of read model.
  repository.store.forEach(onEvent)
}

export default CustomerListReadModel
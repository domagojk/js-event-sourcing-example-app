import { CUSTOMER_CREATED, CUSTOMER_UPDATED, CUSTOMER_DEACTIVATED, CUSTOMER_REACTIVATED } from '../constants/events'

import { CustomerCreated, CustomerUpdated, CustomerDeactivated, CustomerReactivated } from '../events/CustomerEvents'

import AggregateRoot from './AggregateRoot'

/**
 * CustomerAggregate factory
 * 
 * @returns {CustomerAggregate}
 */
function CustomerAggregate () {

  const aggregateRoot = AggregateRoot(applyEvent)

  /**
   * Create new customer
   * 
   * @param {Object} state Current customer aggregate state
   * @param {String} id Customer aggregate Id
   * @param {String} name Customer name
   * @returns {Object} newState New customer aggregate state
   */
  function create (state, customerId, name) {
    if (!customerId) {
      throw new Error('customerId param is required')
    }
    if (!name) {
      throw new Error('name param is required')
    }
    if (aggregateRoot.getCurrentVersion(state)) {
      throw new Error('can not create same customer more than once')
    }
    return applyEvent(state, CustomerCreated(customerId, name), true)
  }

  /**
   * Update contact details
   * 
   * @param {Object} state Current customer aggregate state
   * @param {String} name Customer name
   * @returns {Object} newState New customer aggregate state
   */
  function update (state, name) {
    if (!name) {
      throw new Error('name param is required')
    }
    if (!aggregateRoot.getCurrentVersion(state)) {
      throw new Error("can not update customer that doesn't exist")
    }
    if (state.deactivated) {
      throw new Error("can not update customer that has been deactivated")
    }
    return applyEvent(state, CustomerUpdated(state.customerId, name), true)
  }

  /**
   * Deactivate customer. Adds `deactivated` flag to aggregate state
   * 
   * @param {Object} state Current customer aggregate state
   * @returns {Object} newState New customer aggregate state
   */
  function deactivate (state) {
    if (!aggregateRoot.getCurrentVersion(state)) {
      throw new Error("can not deactivate customer that doesn't exist")
    }
    return applyEvent(state, CustomerDeactivated(state.customerId), true)
  }

  /**
   * Reactivate customer. Removes `deactivated` flag from aggregate state
   * 
   * @param {Object} state Current customer aggregate state
   * @returns {Object} newState New customer aggregate state
   */
  function reactivate (state) {
    if (!aggregateRoot.getCurrentVersion(state)) {
      throw new Error("can not deactivate customer that doesn't exist")
    }
    return applyEvent(state, CustomerReactivated(state.customerId), true)
  }

  //  Event handlers

  /**
   * Apply customer created event to current aggregate state
   * 
   * @private
   * @param {Object} state Current customer aggregate state
   * @param {Object} event Event to apply
   * @param {Boolean} isNewEvent Adds event to list of uncommited events if true
   * @returns {Object} newState New customer aggregate state
   */
  function applyCustomerCreated(state, event, isNewEvent) {
    state.customerId = event.customerId
    state.name = event.name
    //  when recreating aggregate form a list of stored events, when applied those events
    //  are kept in commitedEvents set (needed to calc current version)
    //  if event is applied by a command then isNewEvent is set to true and event is added to
    //  uncommitedChanges to track changes that are to be written to event store
    if (isNewEvent) {
      state.uncommitedChanges.add(event)
    } else {
      state.commitedEvents.add(event)
    }
    return state
  }

  /**
   * Apply customer updated event to current aggregate state
   * 
   * @private
   * @param {Object} state Current customer aggregate state
   * @param {Object} event Event to apply
   * @param {Boolean} isNewEvent Adds event to list of uncommited events if true
   * @returns {Object} newState New customer aggregate state
   */
  function applyCustomerUpdated(state, event, isNewEvent) {
    if (!aggregateRoot.getCurrentVersion(state)) {
      throw new Error("can not update customer that doesn't exist")
    }
    state.name = event.name
    if (isNewEvent) {
      state.uncommitedChanges.add(event)
    } else {
      state.commitedEvents.add(event)
    }
    return state
  }

  /**
   * Apply customer deactivated event to current aggregate state
   * 
   * @private
   * @param {Object} state Current customer aggregate state
   * @param {Object} event Event to apply
   * @param {Boolean} isNewEvent Adds event to list of uncommited events if true
   * @returns {Object} newState New customer aggregate state
   */
  function applyCustomerDeactivated(state, event, isNewEvent) {
    if (!aggregateRoot.getCurrentVersion(state)) {
      throw new Error("can not deactivate customer that doesn't exist")
    }
    if (state.deactivated) {
      throw new Error("can not deactivate customer that is already deactivated")
    }
    state.deactivated = 1
    if (isNewEvent) {
      state.uncommitedChanges.add(event)
    } else {
      state.commitedEvents.add(event)
    }
    return state
  }

  /**
   * Apply customer reactivated event to current aggregate state
   * 
   * @private
   * @param {Object} state Current customer aggregate state
   * @param {Object} event Event to apply
   * @param {Boolean} isNewEvent Adds event to list of uncommited events if true
   * @returns {Object} newState New customer aggregate state
   */
  function applyCustomerReactivated(state, event, isNewEvent) {
    if (!aggregateRoot.getCurrentVersion(state)) {
      throw new Error("can not reactivate customer that doesn't exist")
    }
    if (!state.deactivated) {
      throw new Error("can not reactivate customer that is not deactivated")
    }
    delete state.deactivated
    if (isNewEvent) {
      state.uncommitedChanges.add(event)
    } else {
      state.commitedEvents.add(event)
    }
    return state
  }

  /**
   * Aggregate event handler. Sends event to a valid event handler for specific event type.
   * 
   * @private
   * @param {Object} state Current customer aggregate state 
   * @param {Object} event Event to apply
   * @param {Boolean} isNewEvent Adds event to list of uncommited events if true
   * @returns {Object} newState New customer aggregate state
   */
  function applyEvent(state, event, isNewEvent) {
    switch (event.__name) {
      case CUSTOMER_CREATED:
        return applyCustomerCreated(state, event, isNewEvent)
      case CUSTOMER_UPDATED:
        return applyCustomerUpdated(state, event, isNewEvent)
      case CUSTOMER_DEACTIVATED:
        return applyCustomerDeactivated(state, event, isNewEvent)
      case CUSTOMER_REACTIVATED:
        return applyCustomerReactivated(state, event, isNewEvent)
    }
    throw new Error('unhandled event type')
  }

  return Object.assign(
    {}, 
    {
      create,
      update,
      deactivate,
      reactivate
    }, 
    aggregateRoot
  )

}

export default CustomerAggregate 

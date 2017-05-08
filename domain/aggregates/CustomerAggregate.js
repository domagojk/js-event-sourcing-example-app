import { CUSTOMER_CREATED, CUSTOMER_UPDATED, CUSTOMER_DEACTIVATED } from '../constants/events'

import { CustomerCreated, CustomerUpdated, CustomerDeactivated } from '../events/CustomerEvents'

function CustomerAggregate () {

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
    if (getCurrentVersion(state)) {
      throw new Error('can not create same customer more than once')
    }
    return applyEvent(state, CustomerCreated(customerId, name), true)
  }

  /**
   * Update contact details
   * 
   * @param {Object} state Current customer aggregate state
   * @param {String} customerId Customer aggregate Id
   * @param {String} name Customer name
   * @returns {Object} newState New customer aggregate state
   */
  function update (state, customerId, name) {
    if (!customerId) {
      throw new Error('customerId param is required')
    }
    if (!name) {
      throw new Error('name param is required')
    }
    if (!getCurrentVersion(state)) {
      throw new Error("can not update customer that doesn't exist")
    }
    if (state.deactivated) {
      throw new Error("can not update customer that has been deactivated")
    }
    return applyEvent(state, CustomerUpdated(customerId, name), true)
  }

  /**
   * Deactivate customer. Adds `deactivated` flag to aggregate state
   * 
   * @param {Object} state Current customer aggregate state
   * @param {String} customerId Customer aggregate Id
   * @returns {Object} newState New customer aggregate state
   */
  function deactivate (state, customerId) {
    if (!customerId) {
      throw new Error('customerId param is required')
    }
    if (!getCurrentVersion(state)) {
      throw new Error("can not deactivate customer that doesn't exist")
    }
    return applyEvent(state, CustomerDeactivated(customerId), true)
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
    state.customerId = event.customerId
    state.name = event.name
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
    }
    throw new Error('unhandled event type')
  }

  /**
   * Returns current aggregate version - commited events list count
   * 
   * @param {Object} state Current customer aggregate state 
   * @returns {Number} Aggregate version
   */
  function getCurrentVersion (state) {
    return state.commitedEvents.size
  }

  /**
   * Returns list of uncommited events. These events are product of executed commands on aggregate that are yet to be commited.
   * 
   * @param {Object} state 
   * @returns {Set} Uncommited events list
   */
  function getUncommittedChanges (state) {
    return state.uncommitedChanges
  }

  /**
   * Apply commited events to restore current aggregate state
   * 
   * @param {Set} events List of commited events
   * @returns {Object} state Current aggregate state
   */
  function loadFromHistory (events) {
    //  since we'll always load aggregate from history before applying new commands
    //  this seems a good place to create initial state before reducing stored events
    //  every aggregate needs to track commited events to know its current version
    //  and uncommited events that are ready to be written to event store
    const state = {
      commitedEvents: new Set(),
      uncommitedChanges: new Set()
    }
    return [...events].reduce(applyEvent, state)
  }

  return {
    create,
    update,
    loadFromHistory,
    getCurrentVersion,
    getUncommittedChanges
  }

}

export default CustomerAggregate 

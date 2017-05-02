import { CUSTOMER_CREATED } from '../constants/events'

import { CustomerCreated } from '../events/CustomerEvents'

function CustomerAggregate () {

  /**
   * Create new customer
   * 
   * @param {Object} state 
   * @param {String} id 
   * @param {String} email 
   * @returns {Object} newState
   */
  function create (state, customerId, email) {
    if (!customerId) {
      throw new Error('customerId param is required')
    }
    if (!email) {
      throw new Error('email param is required')
    }
    if (getCurrentVersion(state)) {
      throw new Error('can not create same customer more than once')
    }
    return applyEvent(state, CustomerCreated(customerId, email), true)
  }

  /**
   * Update contact details
   * 
   * @param {Object} state 
   * @param {String} customerId 
   * @param {String} email 
   * @returns {Object} newState
   */
  function updateContactDetails () {
    //  TODO: implement
  }

  //  Event handlers

  function applyCustomerCreated(state, event, isNewEvent) {
    state.customerId = event.customerId
    state.email = event.email
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

  function applyEvent(state, event, isNewEvent) {
    switch (event.__name) {
      case CUSTOMER_CREATED:
        return applyCustomerCreated(state, event, isNewEvent)
        break
    }
    throw new Error('unhandled event type')
  }

  function getCurrentVersion (state) {
    return state.commitedEvents.size
  }

  function getUncommittedChanges (state) {
    return state.uncommitedChanges
  }

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
    loadFromHistory,
    getCurrentVersion,
    getUncommittedChanges
  }

}

export default CustomerAggregate 
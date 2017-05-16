import { 
  CUSTOMER_REGISTERED, 
  CUSTOMER_CREATED, 
  CUSTOMER_UPDATED, 
  CUSTOMER_DEACTIVATED, 
  CUSTOMER_REACTIVATED 
} from '../constants/events'

import { 
  CustomerRegistered, 
  CustomerCreated, 
  CustomerUpdated, 
  CustomerDeactivated, 
  CustomerReactivated 
} from '../events/CustomerEvents'

import {
  CustomerNotFoundError,
  CustomerAlreadyRegisteredError,
  CustomerAlreadyCreatedError,
  CustomerNotActiveError,
  CustomerIsActiveError
} from '../errors/customerErrors'

import AggregateRoot from './AggregateRoot'

/**
 * CustomerAggregate factory
 * 
 * @returns {CustomerAggregate}
 */
function CustomerAggregate () {

  const aggregateRoot = AggregateRoot(applyEvent)

  /**
   * Register new customer
   * 
   * @param {Object} state Current customer aggregate state
   * @param {String} id Customer aggregate Id
   * @param {String} name Customer name
   * @param {String} email Customer email
   * @param {String} password Customer password
   * @returns {Object} newState New customer aggregate state
   */
  function register (state, customerId, name, email, password) {
    if (!customerId) {
      throw new Error('customerId param is required')
    }
    if (!name) {
      throw new Error('name param is required')
    }
    if (!email) {
      throw new Error('email param is required')
    }
    if (!password) {
      throw new Error('password param is required')
    }
    if (aggregateRoot.getCurrentVersion(state)) {
      throw new CustomerAlreadyRegisteredError('can not register same customer more than once')
    }
    return applyEvent(state, CustomerRegistered(customerId, name, email, password), true)
  }

  /**
   * Create new customer
   * 
   * Should never be called directly from public command handler!
   * To maintain email uniquness this command can be executed only by "create customer" domain service
   * 
   * @param {Object} state Current customer aggregate state
   * @param {String} id Customer aggregate Id
   * @param {String} name Customer name
   * @param {String} email Customer email
   * @param {String} password Customer password
   * @returns {Object} newState New customer aggregate state
   */
  function create (state, customerId, name, email, password) {
    if (!customerId) {
      throw new Error('customerId param is required')
    }
    if (!name) {
      throw new Error('name param is required')
    }
    if (!email) {
      throw new Error('email param is required')
    }
    if (!password) {
      throw new Error('password param is required')
    }
    if (state.created) {
      throw new CustomerAlreadyCreatedError('can not create same customer more than once')
    }
    return applyEvent(state, CustomerCreated(customerId, name, email, password), true)
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
      throw new CustomerNotFoundError("can not update customer that doesn't exist")
    }
    if (state.deactivated) {
      throw new CustomerNotActiveError("can not update customer that has been deactivated")
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
      throw new CustomerNotFoundError("can not deactivate customer that doesn't exist")
    }
    if (state.deactivated) {
      throw new CustomerNotActiveError("can not deactivate customer that is not active")
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
      throw new CustomerNotFoundError("can not deactivate customer that doesn't exist")
    }
    if (!state.deactivated) {
      throw new CustomerIsActiveError("can not reactivate customer that is already active")
    }
    return applyEvent(state, CustomerReactivated(state.customerId), true)
  }

  //  Event handlers

  /**
   * Apply customer registered event to current aggregate state
   * 
   * @private
   * @param {Object} state Current customer aggregate state
   * @param {Object} event Event to apply
   * @param {Boolean} isNewEvent Adds event to list of uncommited events if true
   * @returns {Object} newState New customer aggregate state
   */
  function applyCustomerRegistered(state, event, isNewEvent) {
    state.created = 0
    state.active = 0
    state.customerId = event.customerId
    state.name = event.name
    state.email = event.email
    state.password = event.password
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
   * Apply customer created event to current aggregate state
   * 
   * @private
   * @param {Object} state Current customer aggregate state
   * @param {Object} event Event to apply
   * @param {Boolean} isNewEvent Adds event to list of uncommited events if true
   * @returns {Object} newState New customer aggregate state
   */
  function applyCustomerCreated(state, event, isNewEvent) {
    state.created = 1
    state.active = 1
    state.customerId = event.customerId
    state.name = event.name
    state.email = event.email
    state.password = event.password
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
      case CUSTOMER_REGISTERED:
        return applyCustomerRegistered(state, event, isNewEvent)
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
      register,
      create,
      update,
      deactivate,
      reactivate
    }, 
    aggregateRoot
  )

}

export default CustomerAggregate 

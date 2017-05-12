import { CUSTOMER_CREATED, CUSTOMER_UPDATED, CUSTOMER_DEACTIVATED, CUSTOMER_REACTIVATED } from '../constants/events'

function CustomerCreated (customerId, name) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  if (!name) {
    throw new Error('invalid name param')
  }
  
  //  TODO: rethink on event serialization structure
  const __name = CUSTOMER_CREATED

  return {
    __name,
    customerId,
    name
  }
}

function CustomerUpdated (customerId, name) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  if (!name) {
    throw new Error('invalid name param')
  }
  
  //  TODO: rethink on event serialization structure
  const __name = CUSTOMER_UPDATED

  return {
    __name,
    customerId,
    name
  }
}

function CustomerDeactivated (customerId) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  
  //  TODO: rethink on event serialization structure
  const __name = CUSTOMER_DEACTIVATED

  return {
    __name,
    customerId
  }
}

function CustomerReactivated (customerId) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  
  //  TODO: rethink on event serialization structure
  const __name = CUSTOMER_REACTIVATED

  return {
    __name,
    customerId
  }
}

export {
  CustomerCreated,
  CustomerUpdated,
  CustomerDeactivated,
  CustomerReactivated
}
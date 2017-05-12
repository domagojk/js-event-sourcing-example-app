import { CREATE_CUSTOMER, UPDATE_CUSTOMER, DEACTIVATE_CUSTOMER, REACTIVATE_CUSTOMER } from '../constants/commands'

function CreateCustomer (customerId, name) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  if (!name) {
    throw new Error('invalid name param')
  }
  
  //  TODO: rethink on event serialization structure
  const __name = CREATE_CUSTOMER

  return {
    __name,
    customerId,
    name
  }
}

function UpdateCustomer (customerId, name) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  if (!name) {
    throw new Error('invalid name param')
  }

  const __name = UPDATE_CUSTOMER

  return {
    __name,
    customerId,
    name
  }
}

function DeactivateCustomer (customerId) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }

  const __name = DEACTIVATE_CUSTOMER

  return {
    __name,
    customerId
  }
}

function ReactivateCustomer (customerId) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }

  const __name = REACTIVATE_CUSTOMER

  return {
    __name,
    customerId
  }
}

export {
  CreateCustomer,
  UpdateCustomer,
  DeactivateCustomer,
  ReactivateCustomer
}
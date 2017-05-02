import { CREATE_CUSTOMER } from '../constants/commands'

function CreateCustomer (customerId, email) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  if (!email) {
    throw new Error('invalid email param')
  }
  
  //  TODO: rethink on event serialization structure
  const __name = CREATE_CUSTOMER

  return {
    __name,
    customerId,
    email
  }
}

export {
  CreateCustomer
}
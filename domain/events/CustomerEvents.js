import { CUSTOMER_CREATED } from '../constants/events'

function CustomerCreated (customerId, email) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  if (!email) {
    throw new Error('invalid email param')
  }
  
  //  TODO: rethink on event serialization structure
  const __name = CUSTOMER_CREATED

  return {
    __name,
    customerId,
    email
  }
}

export {
  CustomerCreated
}
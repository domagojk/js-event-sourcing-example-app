import { CUSTOMER_CREATED } from '../constants/events'

function CustomerCreatedEvent (uuid, email) {
  if (!uuid) {
    throw new Error('invalid uuid param')
  }
  if (!email) {
    throw new Error('invalid email param')
  }
  
  //  TODO: rethink on event serialization structure
  const __name = CUSTOMER_CREATED

  return {
    __name,
    uuid,
    email
  }
}

export {
  CustomerCreatedEvent
}
import { CREATE_CUSTOMER } from '../constants/commands'

function CreateCustomer (uuid, email) {
  if (!uuid) {
    throw new Error('invalid uuid param')
  }
  if (!email) {
    throw new Error('invalid email param')
  }
  
  //  TODO: rethink on event serialization structure
  const __name = CREATE_CUSTOMER

  return {
    __name,
    uuid,
    email
  }
}

export {
  CreateCustomer
}
import { 
  CUSTOMER_REGISTERED, 
  CUSTOMER_CREATED, 
  CUSTOMER_UPDATED, 
  CUSTOMER_DEACTIVATED, 
  CUSTOMER_REACTIVATED,
  CUSTOMER_EXISTING_EMAIL_FOUND
} from '../constants/events'

function CustomerRegistered (customerId, name, email, password) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  if (!name) {
    throw new Error('invalid name param')
  }
  if (!email) {
    throw new Error('invalid email param')
  }
  if (!password) {
    throw new Error('invalid password param')
  }
  
  const __name = CUSTOMER_REGISTERED

  return {
    __name,
    customerId,
    name,
    email,
    password
  }
}

function CustomerCreated (customerId, name, email, password) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  if (!name) {
    throw new Error('invalid name param')
  }
  if (!email) {
    throw new Error('invalid email param')
  }
  if (!password) {
    throw new Error('invalid password param')
  }

  const __name = CUSTOMER_CREATED

  return {
    __name,
    customerId,
    name,
    email,
    password
  }
}

function CustomerUpdated (customerId, name) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  if (!name) {
    throw new Error('invalid name param')
  }
  
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
  
  const __name = CUSTOMER_REACTIVATED

  return {
    __name,
    customerId
  }
}

function CustomerExistingEmailFound (customerId) {
  if (!customerId) {
    throw new Error('invalid customerId param')
  }
  
  const __name = CUSTOMER_EXISTING_EMAIL_FOUND

  return {
    __name,
    customerId
  }
}

export {
  CustomerRegistered,
  CustomerCreated,
  CustomerUpdated,
  CustomerDeactivated,
  CustomerReactivated,
  CustomerExistingEmailFound
}
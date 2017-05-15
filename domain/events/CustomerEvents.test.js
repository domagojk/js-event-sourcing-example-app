import { 
  CustomerRegistered, 
  CustomerCreated, 
  CustomerUpdated, 
  CustomerDeactivated, 
  CustomerReactivated,
  CustomerExistingEmailFound
} from './CustomerEvents'

const customerRegisteredEvent = CustomerRegistered('1234567890', 'Test Customer', 'test@mail.com', 'test1234')
const customerCreatedEvent = CustomerCreated('1234567890', 'Test Customer', 'test@mail.com', 'test1234')
const customerUpdatedEvent = CustomerUpdated('1234567890', 'Test Customer Updated')
const customerDeactivatedEvent = CustomerDeactivated('1234567890')
const customerReactivatedEvent = CustomerReactivated('1234567890')
const customerExistingEmailFound = CustomerExistingEmailFound('1234567890')

it('should serialize registered event', () => {
  expect(JSON.stringify(customerRegisteredEvent)).toBe('{"__name":"CUSTOMER_REGISTERED","customerId":"1234567890","name":"Test Customer","email":"test@mail.com","password":"test1234"}')
})

it('should serialize created event', () => {
  expect(JSON.stringify(customerCreatedEvent)).toBe('{"__name":"CUSTOMER_CREATED","customerId":"1234567890","name":"Test Customer","email":"test@mail.com","password":"test1234"}')
})

it('should serialize updated event', () => {
  expect(JSON.stringify(customerUpdatedEvent)).toBe('{"__name":"CUSTOMER_UPDATED","customerId":"1234567890","name":"Test Customer Updated"}')
})

it('should serialize deactivated event', () => {
  expect(JSON.stringify(customerDeactivatedEvent)).toBe('{"__name":"CUSTOMER_DEACTIVATED","customerId":"1234567890"}')
})

it('should serialize reactivated event', () => {
  expect(JSON.stringify(customerReactivatedEvent)).toBe('{"__name":"CUSTOMER_REACTIVATED","customerId":"1234567890"}')
})

it('should serialize existing email found event', () => {
  expect(JSON.stringify(customerExistingEmailFound)).toBe('{"__name":"CUSTOMER_EXISTING_EMAIL_FOUND","customerId":"1234567890"}')
})
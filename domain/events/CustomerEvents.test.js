import { CustomerCreated, CustomerUpdated, CustomerDeactivated, CustomerReactivated } from './CustomerEvents'

const customerCreatedEvent = CustomerCreated('1234567890', 'Test Customer')

const customerUpdatedEvent = CustomerUpdated('1234567890', 'Test Customer Updated')

const customerDeactivatedEvent = CustomerDeactivated('1234567890')

const customerReactivatedEvent = CustomerReactivated('1234567890')

it('should serialize created event', () => {
  expect(JSON.stringify(customerCreatedEvent)).toBe('{"__name":"CUSTOMER_CREATED","customerId":"1234567890","name":"Test Customer"}')
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
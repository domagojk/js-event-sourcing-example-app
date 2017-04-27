import { CustomerCreatedEvent } from './CustomerEvents'

const customerCreatedEvent = CustomerCreatedEvent('1234567890', 'test@mail.com')

it('should serialize', () => {
  expect(JSON.stringify(customerCreatedEvent)).toBe('{"__name":"CUSTOMER_CREATED","uuid":"1234567890","email":"test@mail.com"}')
})
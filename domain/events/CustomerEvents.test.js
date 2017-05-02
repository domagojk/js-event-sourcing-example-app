import { CustomerCreated } from './CustomerEvents'

const customerCreatedEvent = CustomerCreated('1234567890', 'test@mail.com')

it('should serialize', () => {
  expect(JSON.stringify(customerCreatedEvent)).toBe('{"__name":"CUSTOMER_CREATED","customerId":"1234567890","email":"test@mail.com"}')
})
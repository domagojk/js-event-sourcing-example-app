import { CreateCustomer } from './CustomerCommands'

const customerCreateCommand = CreateCustomer('1234567890', 'test@mail.com')

it('should serialize', () => {
  expect(JSON.stringify(customerCreateCommand)).toBe('{"__name":"CREATE_CUSTOMER","uuid":"1234567890","email":"test@mail.com"}')
})
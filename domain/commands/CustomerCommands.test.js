import { CreateCustomer, UpdateCustomer, DeactivateCustomer } from './CustomerCommands'

const customerCreateCommand = CreateCustomer('1234567890', 'Test Customer')
const customerUpdateCommand = UpdateCustomer('1234567890', 'Test Customer')
const customerDeactivateCommand = DeactivateCustomer('1234567890')

it('should serialize create command', () => {
  expect(JSON.stringify(customerCreateCommand)).toBe('{"__name":"CREATE_CUSTOMER","customerId":"1234567890","name":"Test Customer"}')
})

it('should serialize update command', () => {
  expect(JSON.stringify(customerUpdateCommand)).toBe('{"__name":"UPDATE_CUSTOMER","customerId":"1234567890","name":"Test Customer"}')
})

it('should serialize deactivate command', () => {
  expect(JSON.stringify(customerDeactivateCommand)).toBe('{"__name":"DEACTIVATE_CUSTOMER","customerId":"1234567890"}')
})
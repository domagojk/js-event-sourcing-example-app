import { RegisterCustomer, CreateCustomer, UpdateCustomer, DeactivateCustomer, ReactivateCustomer } from './CustomerCommands'

const customerRegisterCommand = RegisterCustomer('1234567890', 'Test Customer', 'test@mail.com', 'test1234')
const customerCreateCommand = CreateCustomer('1234567890', 'Test Customer', 'test@mail.com', 'test1234')
const customerUpdateCommand = UpdateCustomer('1234567890', 'Test Customer Updated')
const customerDeactivateCommand = DeactivateCustomer('1234567890')
const customerReactivateCommand = ReactivateCustomer('1234567890')

it('should serialize register command', () => {
  expect(JSON.stringify(customerRegisterCommand)).toBe('{"__name":"REGISTER_CUSTOMER","customerId":"1234567890","name":"Test Customer","email":"test@mail.com","password":"test1234"}')
})

it('should serialize update command', () => {
  expect(JSON.stringify(customerUpdateCommand)).toBe('{"__name":"UPDATE_CUSTOMER","customerId":"1234567890","name":"Test Customer Updated"}')
})

it('should serialize deactivate command', () => {
  expect(JSON.stringify(customerDeactivateCommand)).toBe('{"__name":"DEACTIVATE_CUSTOMER","customerId":"1234567890"}')
})

it('should serialize reactivate command', () => {
  expect(JSON.stringify(customerReactivateCommand)).toBe('{"__name":"REACTIVATE_CUSTOMER","customerId":"1234567890"}')
})
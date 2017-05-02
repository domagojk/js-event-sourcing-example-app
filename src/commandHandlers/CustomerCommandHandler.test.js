import CustomerCommandHandler from './CustomerCommandHandler'
import {CreateCustomer} from '../commands/CustomerCommands'

const handler = CustomerCommandHandler()

const CUSTOMER_1_ID = '1234-5678-9012-3456'
const CUSTOMER_1_EMAIL = 'test@mail.com'

const createCustomerCommand = CreateCustomer(CUSTOMER_1_ID, CUSTOMER_1_EMAIL)

it('should handle CreateCustomer command', async () => {
  await handler.handle(createCustomerCommand)
})

it('shoud throw an exception on another CreateCustomer command for same customer', async () => {
  try {
    await handler.handle(createCustomerCommand)
  } catch (error) {
    expect(error.toString()).toBe('Error: can not create same customer more than once')
  }
})

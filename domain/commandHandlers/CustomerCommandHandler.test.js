import CustomerCommandHandler from './CustomerCommandHandler'
import {CreateCustomer} from '../commands/CustomerCommands'

import EventStore from '../../lib/EventStore'

const handler = CustomerCommandHandler(EventStore)

const CUSTOMER_1_ID = '1234-5678-9012-3456'
const CUSTOMER_1_NAME = 'Test Customer'
const CUSTOMER_1_EMAIL = 'test@mail.com'
const CUSTOMER_1_PASSWORD = 'test1234'

const createCustomerCommand = CreateCustomer(CUSTOMER_1_ID, CUSTOMER_1_NAME, CUSTOMER_1_EMAIL, CUSTOMER_1_PASSWORD)

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

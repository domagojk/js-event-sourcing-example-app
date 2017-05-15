import CustomerCommandHandler from './CustomerCommandHandler'
import { 
  RegisterCustomer,
  CreateCustomer
} from '../commands/CustomerCommands'

import EventBus from '../../lib/EventBus'
import EventStore from '../../lib/EventStore'

const eventBus = EventBus()
const eventStore = EventStore(eventBus, 'event')

const handler = CustomerCommandHandler(eventStore)

const CUSTOMER_1_ID = '1234-5678-9012-3456'
const CUSTOMER_1_NAME = 'Test Customer'
const CUSTOMER_1_EMAIL = 'test@mail.com'
const CUSTOMER_1_PASSWORD = 'test1234'

const registerCustomerCommand = RegisterCustomer(CUSTOMER_1_ID, CUSTOMER_1_NAME, CUSTOMER_1_EMAIL, CUSTOMER_1_PASSWORD)
const createCustomerCommand = CreateCustomer(CUSTOMER_1_ID, CUSTOMER_1_NAME, CUSTOMER_1_EMAIL, CUSTOMER_1_PASSWORD)

it('should handle RegisterCustomer command', async () => {
  await handler.handle(registerCustomerCommand)
})

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

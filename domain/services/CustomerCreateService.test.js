import CustomerCreateService from './CustomerCreateService'

import MemDB from '../../lib/MemDB'
import MemDBReadModelPersistanceAdapter from '../../lib/MemDBReadModelPersistanceAdapter'

import CommandBus from '../../lib/CommandBus'
import EventBus from '../../lib/EventBus'
import EventStore from '../../lib/EventStore'

import { EVENT, ERROR } from '../constants/eventTypes'
import { CUSTOMER_CREATED, CUSTOMER_EXISTING_EMAIL_FOUND } from '../constants/events'
import { REGISTER_CUSTOMER, CREATE_CUSTOMER } from '../constants/commands'
import { RegisterCustomer } from '../commands/CustomerCommands'

import CustomerCommandHandler from '../commandHandlers/CustomerCommandHandler'
import CustomerListReadModel from '../readModels/CustomerListReadModel'

const memDB = MemDB()
const memDBReadModelPersistanceAdapter = MemDBReadModelPersistanceAdapter(memDB)

const commandBus = CommandBus()
const eventBus = EventBus()
const eventStore = EventStore(eventBus, 'event')

CustomerListReadModel(eventBus, eventStore, memDBReadModelPersistanceAdapter)

const customerCommandHandler = CustomerCommandHandler(eventStore)

const CUSTOMER_1_ID = '1234-5678-9012-3456'
const CUSTOMER_1_NAME = 'Test Customer'
const CUSTOMER_1_EMAIL = 'test@mail.com'
const CUSTOMER_1_PASSWORD = 'test1234'

const CUSTOMER_2_ID = '0000-5678-9012-3456'
const CUSTOMER_2_NAME = 'Test Customer #2'
const CUSTOMER_2_EMAIL = 'test@mail.com'
const CUSTOMER_2_PASSWORD = 'test1234'

commandBus.registerHandler(REGISTER_CUSTOMER, customerCommandHandler)
commandBus.registerHandler(CREATE_CUSTOMER, customerCommandHandler)

CustomerCreateService(eventBus, commandBus, memDBReadModelPersistanceAdapter)

it('should issue CreateCustomer command on CustomerRegistered event', done => {
  eventBus.on(EVENT, event => {
    if (event.__name === CUSTOMER_CREATED && event.customerId === CUSTOMER_1_ID) {
      done()
    }
  })
  const registerCustomer = RegisterCustomer(CUSTOMER_1_ID, CUSTOMER_1_NAME, CUSTOMER_1_EMAIL, CUSTOMER_1_PASSWORD)
  commandBus.handle(registerCustomer)
})

it('should emit customerExistingEmailFound event on duplicate user register', done => {
  eventBus.on(ERROR, event => {
    if (event.__name === CUSTOMER_EXISTING_EMAIL_FOUND && event.customerId === CUSTOMER_2_ID) {
      done()
    }
  })
  const registerCustomer = RegisterCustomer(CUSTOMER_2_ID, CUSTOMER_2_NAME, CUSTOMER_2_EMAIL, CUSTOMER_2_PASSWORD)
  commandBus.handle(registerCustomer)
})
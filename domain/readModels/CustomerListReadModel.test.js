import sleep from 'sleep-promise'

import CustomerListReadModel from './CustomerListReadModel'

import { CUSTOMERS } from '../constants/collections'
import { CustomerCreated, CustomerUpdated, CustomerDeactivated, CustomerReactivated } from '../events/CustomerEvents'

import MemDB from '../../lib/MemDB'
import MemDBReadModelPersistanceAdapter from '../../lib/MemDBReadModelPersistanceAdapter'

import EventBus from '../../lib/EventBus'
import EventStore from '../../lib/EventStore'

const memDB = MemDB()
const memDBReadModelPersistanceAdapter = MemDBReadModelPersistanceAdapter(memDB)

const eventBus = EventBus()
const eventStore = EventStore(eventBus, 'event')

const customerListReadModel = CustomerListReadModel(eventBus, eventStore, memDBReadModelPersistanceAdapter)

const CUSTOMER_1_ID = '1234-5678-9012-3456'
const CUSTOMER_1_NAME = 'Test Customer'
const CUSTOMER_1_EMAIL = 'test@mail.com'
const CUSTOMER_1_PASSWORD = 'test1234'

const CUSTOMER_1_NAME_UPDATED = 'Test Customer Updated'

const EXPECTED_READMODEL_RECORD = { 
  name: CUSTOMER_1_NAME,
  email: CUSTOMER_1_EMAIL,
  password: CUSTOMER_1_PASSWORD,
  active: 1,
  _key: CUSTOMER_1_ID
}

const EXPECTED_READMODEL_RECORD_UPDATED = { 
  name: CUSTOMER_1_NAME_UPDATED,
  email: CUSTOMER_1_EMAIL,
  password: CUSTOMER_1_PASSWORD,
  active: 1,
  _key: CUSTOMER_1_ID
}

const EXPECTED_READMODEL_RECORD_DEACTIVATED = { 
  name: CUSTOMER_1_NAME_UPDATED,
  email: CUSTOMER_1_EMAIL,
  password: CUSTOMER_1_PASSWORD,
  active: 0,
  _key: CUSTOMER_1_ID
}

const EXPECTED_READMODEL_RECORD_REACTIVATED = { 
  name: CUSTOMER_1_NAME_UPDATED,
  email: CUSTOMER_1_EMAIL,
  password: CUSTOMER_1_PASSWORD,
  active: 1,
  _key: CUSTOMER_1_ID
}

it('should handle create customer event', async () => {
  const events = []
  events.push(CustomerCreated(CUSTOMER_1_ID, CUSTOMER_1_NAME, CUSTOMER_1_EMAIL, CUSTOMER_1_PASSWORD))
  eventStore.storeEvents(CUSTOMER_1_ID, events, 0)
  //  wait for event store to emit event and customerListReadModel to handle it
  await sleep(1)
  const readRecord = memDB.get(CUSTOMERS, CUSTOMER_1_ID)
  expect(readRecord).toEqual(EXPECTED_READMODEL_RECORD)
})

it('should handle update customer event', async () => {
  const events = []
  events.push(CustomerUpdated(CUSTOMER_1_ID, CUSTOMER_1_NAME_UPDATED))
  eventStore.storeEvents(CUSTOMER_1_ID, events, 1)
  //  wait for event store to emit event and customerListReadModel to handle it
  await sleep(1)
  const readRecord = memDB.get(CUSTOMERS, CUSTOMER_1_ID)
  expect(readRecord).toEqual(EXPECTED_READMODEL_RECORD_UPDATED)
})

it('should handle deactivate customer event', async () => {
  const events = []
  events.push(CustomerDeactivated(CUSTOMER_1_ID))
  eventStore.storeEvents(CUSTOMER_1_ID, events, 2)
  //  wait for event store to emit event and customerListReadModel to handle it
  await sleep(1)
  const readRecord = memDB.get(CUSTOMERS, CUSTOMER_1_ID)
  expect(readRecord).toEqual(EXPECTED_READMODEL_RECORD_DEACTIVATED)
})

it('should handle reactivate customer event', async () => {
  const events = []
  events.push(CustomerReactivated(CUSTOMER_1_ID))
  eventStore.storeEvents(CUSTOMER_1_ID, events, 3)
  //  wait for event store to emit event and customerListReadModel to handle it
  await sleep(1)
  const readRecord = memDB.get(CUSTOMERS, CUSTOMER_1_ID)
  expect(readRecord).toEqual(EXPECTED_READMODEL_RECORD_REACTIVATED)
})

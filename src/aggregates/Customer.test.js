import Customer from './Customer'
import { CUSTOMER_CREATED } from '../constants/events'
import { CustomerCreatedEvent } from '../events/CustomerEvents'

const customer = new Customer()

it('should return state with version 0', () => {
  //  we want no event history to test this case
  const storedEvents = new Set()
  let state = customer.loadFromHistory(storedEvents)
  let version = customer.getCurrentVersion(state)
  expect(version).toBe(0)
})

it('should create a new customer', () => {
  //  we want no event history to test this case
  const storedEvents = new Set()
  //  prepare aggregate with no event history (new aggregate)
  let state = customer.loadFromHistory(storedEvents)
  let version = customer.getCurrentVersion(state)
  let uncommittedChanges = customer.getUncommittedChanges(state)
  expect(version).toBe(0)
  expect(uncommittedChanges.size).toBe(0)
  //  create new customer
  state = customer.create(state, '1234-5678-9012-3456', 'test@mail.com')
  version = customer.getCurrentVersion(state)
  expect(state.uuid).toBe('1234-5678-9012-3456')
  expect(state.email).toBe('test@mail.com')
  //  new changes are yet to be written to Event Store
  //  therefore aggreagate version must not change
  //  and applied change must be added to uncommittedChanges set
  expect(version).toBe(0)
  expect(uncommittedChanges.size).toBe(1)
})

it('should throw an error on create for an existing customer aggregate', () => {
  //  create event history (that would be loaded from event store in real application)
  const storedEvents = new Set()
  storedEvents.add(CustomerCreatedEvent('1234-5678-9012-3456', 'test@mail.com'))
  //  prepare aggregate with no event history (new aggregate)
  let state = customer.loadFromHistory(storedEvents)
  let version = customer.getCurrentVersion(state)
  let uncommittedChanges = customer.getUncommittedChanges(state)
  expect(version).toBe(1)
  expect(uncommittedChanges.size).toBe(0)
  //  create new customer method on existing customer should throw an error
  expect(() => {
    customer.create(state, '1234-5678-9012-3456', 'test@mail.com')
  }).toThrow('can not create same customer more than once')
})
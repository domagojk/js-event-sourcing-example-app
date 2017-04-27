import Customer from './Customer'

const customer = new Customer()

const storedEvents = new Set()

it('should return state with version 0', () => {
  let state = customer.loadFromHistory(storedEvents)
  let version = customer.getCurrentVersion(state)
  expect(version).toBe(0)
})

it('should create a new customer', () => {
  //  prepare aggregate with no event history (new aggregate)
  let state = customer.loadFromHistory(storedEvents)
  let version = customer.getCurrentVersion(state)
  let uncommittedChanges = customer.getUncommittedChanges()
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

//  TODO: test load aggregate from existing event history
import EventStore from './EventStore'

const eventStore = EventStore()
const firstAggregateUUID = '1234-5678-9012-3456'

const firstEvent = {
  event: 'CREATED_TEST_EVENT',
  value: 'test'
}

const secondEvent = {
  event: 'RENAMED_TEST_EVENT',
  value: 'test2'
}

const thirdEvent = {
  event: 'DELETED_TEST_EVENT'
}

it('should add event set to store', () => {
  const events = new Set()
  events.add(firstEvent)
  events.add(secondEvent)
  eventStore.storeEvents(firstAggregateUUID, events, 0)
})

it('should read event set from store', () => {
  const events = eventStore.readEvents(firstAggregateUUID)
  expect(events).toContainEqual(firstEvent)
  expect(events).toContainEqual(secondEvent)
})

it('should get latest version for aggregate', () => {
  expect(eventStore.getCurrentVersion(firstAggregateUUID)).toBe(2)
})

it('should fail if incorrect expected version is provided', () => {
  const events = new Set()
  events.add(thirdEvent)
  expect(() => {
    eventStore.storeEvents(firstAggregateUUID, events, 1)
  }).toThrow('Expected version was 1 but last commited version was 2')
})

it('should add event set to store with correct expected version', () => {
  const events = new Set()
  events.add(thirdEvent)
  eventStore.storeEvents(firstAggregateUUID, events, 2)
})
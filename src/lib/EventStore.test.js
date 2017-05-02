import EventStore from './EventStore'

const firstAggregateId = '1234-5678-9012-3456'

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

it('should add event set to store', async () => {
  const events = new Set()
  events.add(firstEvent)
  events.add(secondEvent)
  await EventStore.storeEvents(firstAggregateId, events, 0)
})

it('should read event set from store', async () => {
  const events = await EventStore.readEvents(firstAggregateId)
  expect(events).toContainEqual(firstEvent)
  expect(events).toContainEqual(secondEvent)
})

it('should get latest version for aggregate', async () => {
  expect(await EventStore.getCurrentVersion(firstAggregateId)).toBe(2)
})

it('should fail if incorrect expected version is provided', async () => {
  const events = new Set()
  events.add(thirdEvent)
  try {
    await EventStore.storeEvents(firstAggregateId, events, 1)
  } catch (e) {
    expect(e.toString()).toEqual('Error: Expected version was 1 but last commited version was 2')
  }
})

it('should add event set to store with correct expected version', async () => {
  const events = new Set()
  events.add(thirdEvent)
  await EventStore.storeEvents(firstAggregateId, events, 2)
})
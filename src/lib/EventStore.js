/**
 * (very) Simple in-memory event store
 *
 * Supports adding set of events to an aggreagate with optimistic concurrency model
 */
function EventStore () {

  const store = new Map()

  /**
   * Loads all the events for a given aggregate uuid 
   * 
   * @param {any} uuid 
   */
  function readEvents (uuid) {
    let storedEvents = new Set()
    if (store.has(uuid)) {
      storedEvents = store.get(uuid)
    }
    const events = new Set()
    storedEvents.forEach(function (storedEvent) {
      events.add(storedEvent.event)
    })
    return events
  }

  /**
   * Store uncommited events from aggregate
   * 
   * @param {String} uuid Aggregate UUID
   * @param {Set} events Set of uncommited events
   * @param {Number} expectedVersion the version of the aggregate prior to committing new events
   */
  function storeEvents (uuid, events, expectedVersion) {
    //  get stored events set for given aggregate or create one if does not exists yet
    let storedEvents = new Set()
    if (store.has(uuid)) {
      storedEvents = store.get(uuid)
    }
    //  version check
    const currentVersion = getCurrentVersion(uuid)
    if (currentVersion !== expectedVersion) {
      throw new Error(`Expected version was ${expectedVersion} but last commited version was ${currentVersion}`)
    }
    //  store new events
    let version = expectedVersion
    events.forEach(function (event) {
      version++
      storedEvents.add({
        event,
        version
      })
    })
    store.set(uuid, storedEvents)
  }

  /**
   * Get last version for given aggregate
   * 
   * @param {String} uuid Aggregate UUID
   * @returns 
   */
  function getCurrentVersion (uuid) {
    if (store.has(uuid)) {
      const storedEvents = store.get(uuid)
      const lastStoredEvent = Array.from(storedEvents).pop()
      return lastStoredEvent.version
    } else {
      return 0
    }
  }

  return {
    readEvents,
    storeEvents,
    getCurrentVersion
  }

}

export default EventStore

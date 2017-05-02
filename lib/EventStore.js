/**
 * (very) Simple in-memory event store
 *
 * Supports adding set of events to an aggreagate with optimistic concurrency model
 */
function EventStore () {

  //  since this is a very simple event store that uses memory sets reading and writing events is syncronous operation
  //  but in real world this would be asyncronous operation and we'll make them async to mimic real world

  const store = new Map()

  /**
   * Loads all the events for a given aggregate Id 
   * 
   * @param {any} id 
   */
  async function readEvents (id) {
    let storedEvents = new Set()
    if (store.has(id)) {
      storedEvents = store.get(id)
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
   * @param {String} id Aggregate Id
   * @param {Set} events Set of uncommited events
   * @param {Number} expectedVersion the version of the aggregate prior to committing new events
   */
  async function storeEvents (id, events, expectedVersion) {
    //  get stored events set for given aggregate or create one if does not exists yet
    let storedEvents = new Set()
    if (store.has(id)) {
      storedEvents = store.get(id)
    }
    //  version check
    const currentVersion = await getCurrentVersion(id)
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
    store.set(id, storedEvents)
  }

  /**
   * Get last version for given aggregate
   * 
   * @param {String} id Aggregate Id
   * @returns 
   */
  async function getCurrentVersion (id) {
    if (store.has(id)) {
      const storedEvents = store.get(id)
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

export default EventStore()

import Events from 'events'

/**
 * Initialize event bus instance
 * 
 * @returns {EventEmitter}
 */
function EventBus () {
  return new Events.EventEmitter()
}

export default EventBus
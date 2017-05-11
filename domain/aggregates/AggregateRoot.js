/**
 * Root Aggregate functions
 * 
 * @param {Function} applyEvent Aggregate applyEvent function reference
 * @returns 
 */
function AggregateRoot (applyEvent) {
  /**
   * Returns current aggregate version - commited events list count
   * 
   * @param {Object} state Current customer aggregate state 
   * @returns {Number} Aggregate version
   */
  function getCurrentVersion (state) {
    return state.commitedEvents.size
  }

  /**
   * Returns list of uncommited events. These events are product of executed commands on aggregate that are yet to be commited.
   * 
   * @param {Object} state 
   * @returns {Set} Uncommited events list
   */
  function getUncommittedChanges (state) {
    return state.uncommitedChanges
  }

  /**
   * Apply commited events to restore current aggregate state
   * 
   * @param {Set} events List of commited events
   * @returns {Object} state Current aggregate state
   */
  function loadFromHistory (events) {
    //  since we'll always load aggregate from history before applying new commands
    //  this seems a good place to create initial state before reducing stored events
    //  every aggregate needs to track commited events to know its current version
    //  and uncommited events that are ready to be written to event store
    const state = {
      commitedEvents: new Set(),
      uncommitedChanges: new Set()
    }
    return [...events].reduce(applyEvent, state)
  }
  
  return {
    getCurrentVersion,
    getUncommittedChanges,
    loadFromHistory
  }
}

export default AggregateRoot
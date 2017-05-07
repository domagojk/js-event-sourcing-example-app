function CommandBus () {

  const registeredHandlers = new Map()

  /**
   * Returns true if handler for a command is registered
   * 
   * @param {String} commandName 
   * @returns Boolean
   */
  function isHandlerRegistered (commandName) {
    return registeredHandlers.has(commandName)
  }

  /**
   * Register command handler
   * 
   * @param {String} commandName 
   * @param {Function} handler 
   */
  function registerHandler (commandName, handler) {
    if (registeredHandlers.has(commandName)) {
      throw new Error('handler already registered')
    }
    registeredHandlers.set(commandName, handler)
  }

  function unregisterHandler (commandName) {
    if (!registeredHandlers.has(commandName)) {
      throw new Error('handler not registered')
    }
    registeredHandlers.delete(commandName)
  }

  /**
   * Invoke command handler for given command
   * 
   * @param {Object} command 
   * @returns {Promise}
   */
  async function handle (command) {
    const commandName = command.__name
    if (!registeredHandlers.has(commandName)) {
      throw new Error('handler not registered')
    }
    const handler = registeredHandlers.get(commandName)
    return await handler(command)
  }

  return {
    isHandlerRegistered,
    registerHandler,
    unregisterHandler,
    handle
  }
}

export default CommandBus()

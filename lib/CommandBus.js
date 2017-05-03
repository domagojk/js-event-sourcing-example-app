import DeepstreamClient from 'deepstream.io-client-js'

let client

function CommandBus (host = 'localhost', port = '6020') {

  /**
   * Register command handler
   * 
   * @param {String} commandName 
   * @param {Function} handler 
   */
  function registerHandler (commandName, handler) {
    client.rpc.provide(commandName, async function (command, res) {
      let result
      try {
        result = await handler(command)
        res.send(result)
      } catch (ex) {
        res.error(ex)
      }
    })
  }

  /**
   * Unregister command handler
   * 
   * @param {any} commandName
   */
  function unregisterHandler (commandName) {
    client.rpc.unprovide(commandName)
  }

  /**
   * Invoke command handler for given command
   * 
   * @param {Object} command 
   * @returns {Promise}
   */
  function handle (command) {
    const commandName = command.__name

    return new Promise((resolve, reject) => {
      client.rpc.make(commandName, command, function response (error, data) {
        if (error) {
          return reject(error)
        }
        resolve(data)
      })
    })
  }

  /**
   * Connect deepstream client
   * 
   * @returns {Promise}
   */
  function connect() {
    return new Promise((resolve, reject) => {
      client = DeepstreamClient(host + ':' + port)
      client.login({}, (success, data) => {
        if (!success) {
          return reject(data)
        }
        resolve(data)
      })
    })
  }

  return {
    handle,
    registerHandler,
    unregisterHandler,
    connect
  }
}

export default CommandBus

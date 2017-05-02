import DeepstreamServer from 'deepstream.io'
import DeepstreamClient from 'deepstream.io-client-js'

const server = new DeepstreamServer({
  host: 'localhost',
  port: 6020
})

let client

function CommandBus () {

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

  function start() {
    return new Promise((resolve, reject) => {
      server.on('started', () => {
        client = DeepstreamClient('localhost:6020')
        client.login()
        resolve()
      })
      server.start()
    })
  }

  return {
    registerHandler,
    start
  }
}

export default CommandBus

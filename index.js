import CommandBus from './lib/CommandBus'
import EventStore from './lib/EventStore'

import Api from './api'

const commandBus = CommandBus()

commandBus.start()
.then(() => {
  Api(commandBus, EventStore)
})
.catch(console.error)
import DeepstreamServer from 'deepstream.io'

import Api from './api'

const server = new DeepstreamServer({
  host: 'localhost',
  port: 6020
})

const api = Api()

server.on('started', () => {
  api.init()
})

server.start()
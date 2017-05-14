import DeepstreamServer from 'deepstream.io'

import Application from './application'
import Api from './api'

const application = Application()
const api = Api(application.commandBus)

api.listen(3000, function () {
  console.log('Api listening on port 3000!')
})
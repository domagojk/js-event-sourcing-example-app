import DeepstreamServer from 'deepstream.io'

import Api from './api'

const api = Api()

api.listen(3000, function () {
  console.log('Api listening on port 3000!')
})
import Events from 'events'
import CustomerListReadModel from './CustomerListReadModel'

const fakeRepo = {
  events: new Events.EventEmitter()
}

const fakeDb = {}

const customerListReadModel = CustomerListReadModel(fakeRepo, fakeDb)

it('should register command handler', () => {
  fakeRepo.events.emit('stored', {event:'TEST'})
})

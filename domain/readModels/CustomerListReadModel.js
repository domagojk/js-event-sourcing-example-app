import Rx from 'rxjs'

function CustomerListReadModel (repository, db) {
  const event$ = Rx.Observable.fromEvent(repository.events, 'stored')
  event$.subscribe(console.log)
}
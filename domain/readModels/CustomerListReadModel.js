function CustomerListReadModel (repository, db) {
  function onCustomerCreatedEvent (event) {
    //  TODO: check if customer exists in read model and throw an exception if true
    //  TODO: insert customer into db
  }
  function onEventStored (event) {
    switch (event.__name) {
      case 'CUSTOMER_CREATED':
        return onCustomerCreatedEvent(event)
    }
  }
  repository.events.on('stored', onEventStored)
}

export default CustomerListReadModel
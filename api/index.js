import { CREATE_CUSTOMER } from '../domain/constants/commands'

import CustomerCommandHandler from '../domain/commandHandlers/CustomerCommandHandler'

function Api (commandBus, repository) {

  const customerCommandHandler = CustomerCommandHandler(repository)

  commandBus.registerHandler(CREATE_CUSTOMER, customerCommandHandler)

}

export default Api
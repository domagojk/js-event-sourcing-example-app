import passwordHash from 'password-hash'
import handleException from '../lib/handleException'

import { RegisterCustomer } from '../../../domain/commands/CustomerCommands'
import { EVENT, ERROR } from '../../../domain/constants/eventTypes'
import { CUSTOMER_CREATED, CUSTOMER_EXISTING_EMAIL_FOUND } from '../../../domain/constants/events'

/**
 * Create customer request handler
 *
 * @param {any} req
 * @param {any} res
 */
export default ({ eventBus, commandBus }) => async (req, res) => {
  const customerId = req.body.customerId
  const name = req.body.name
  const email = req.body.email
  const password = passwordHash.generate(req.body.password)

  //  As it was stated in application README, when using event sourcing paradigm it must
  //  be taken into account that this system is not immediately consistent but eventualy consistent.
  //  We don't actualy create customer at this point, but rather register user instead.
  //  Then we'll wait for CustomerCreateService instance to validate email uniquness
  //  and if email is unique the service will create user or dispach error event.

  //  NOTE:
  //  This could be even more simplified on api side if we would write our client app
  //  to listen for events from application service (via websocket for example).
  //  In that case we could just issue RegisterCustomer command and let the client app handle
  //  the success and error events. But as we want rest like api interface in this example app,
  //  we'll handle those events here and send success response if user has been created or
  //  error response if user has not been created.

  //  subscribe to EVENT (emitted when model event is commited to event store)
  //  to listen for CUSTOMER_CREATED event
  function eventHandler (event) {
    if (event.__name === CUSTOMER_CREATED && event.customerId === customerId) {
      res.status(200).send()
      //  clean up to avoid memory leaks
      clearTimeout(reqTimeout)
      eventBus.removeListener(EVENT, eventHandler)
      eventBus.removeListener(ERROR, errorHandler)
    }
  }
  eventBus.on(EVENT, eventHandler)

  //  subscribe to ERROR (emitted when CustomerCreateService instance detects that
  //  email has already been taken by another customer)
  function errorHandler (event) {
    if (event.__name === CUSTOMER_EXISTING_EMAIL_FOUND && event.customerId === customerId) {
      res.status(400).send('email already registered')
      //  clean up to avoid memory leaks
      clearTimeout(reqTimeout)
      eventBus.removeListener(EVENT, eventHandler)
      eventBus.removeListener(ERROR, errorHandler)
    }
  }
  eventBus.on(ERROR, errorHandler)

  //  create very simple timeout handler in case CustomerCreateService fails to process USER_REGISTERED event
  //  if timeout completes, notify user that the request has failed
  //  in a real app we would also at least dispach notification to system admin that something is wrong
  const reqTimeout = setTimeout(() => {
    res.status(408).send('service timeout')
    //  clean up to avoid memory leaks
    eventBus.removeListener(EVENT, eventHandler)
    eventBus.removeListener(ERROR, errorHandler)
  }, 30000)

  try {
    const registerCustomerCommand = RegisterCustomer(customerId, name, email, password)
    await commandBus.handle(registerCustomerCommand)
  } catch (ex) {
    handleException(ex, res)
    //  clean up to avoid memory leaks
    clearTimeout(reqTimeout)
    eventBus.removeListener(EVENT, eventHandler)
    eventBus.removeListener(ERROR, errorHandler)
  }
}

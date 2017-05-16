/**
 * Customer controller is where all customer related api requests are validated against customer domain model.
 */
import passwordHash from 'password-hash'

import { EVENT, ERROR } from '../../domain/constants/eventTypes'
import { CUSTOMERS } from '../../domain/constants/collections'

import {
  CustomerNotFound,
  CustomerAlreadyRegisteredError,
  CustomerAlreadyCreatedError,
  CustomerNotActiveError,
  CustomerIsActiveError,
  CustomerEmailExists
} from '../../domain/errors/customerErrors'

import { 
  CUSTOMER_CREATED, 
  CUSTOMER_EXISTING_EMAIL_FOUND 
} from '../../domain/constants/events'

import { 
  RegisterCustomer, 
  CreateCustomer, 
  UpdateCustomer, 
  DeactivateCustomer, 
  ReactivateCustomer 
} from '../../domain/commands/CustomerCommands'

/**
 * Initialize customer controller
 * 
 * @param {any} app Instance of express app
 * @param {EventBus} eventBus Instance of EventBus to subscribe event listeners to
 * @param {CommandBus} commandBus Instance of CommandBus to handle commands
 * @param {MemDB} memDB Instance of MemDB for projections
 */
function CustomerController (app, eventBus, commandBus, memDB) {
  /**
   * Create customer request handler
   * 
   * @param {any} req 
   * @param {any} res 
   */
  async function createCustomer (req, res) {
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

  /**
   * Update customer request handler
   * 
   * @param {any} req 
   * @param {any} res 
   */
  async function updateCustomer (req, res) {
    try {
      const customerId = req.body.customerId
      const name = req.body.name

      const updateCustomerCommand = UpdateCustomer(customerId, name)
      await commandBus.handle(updateCustomerCommand)
      res.status(200).send()
    } catch (ex) {
      handleException(ex, res)
    }
  }

  /**
   * Deactivate customer request handler
   * 
   * @param {any} req 
   * @param {any} res 
   */
  async function deactivateCustomer (req, res) {
    try {
      const customerId = req.body.customerId
      const name = req.body.name

      const deactivateCustomerCommand = DeactivateCustomer(customerId, name)
      await commandBus.handle(deactivateCustomerCommand)
      res.status(200).send()
    } catch (ex) {
      handleException(ex, res)
    }
  }

  /**
   * Reactivate customer request handler
   * 
   * @param {any} req 
   * @param {any} res 
   */
  async function reactivateCustomer (req, res) {
    try {
      const customerId = req.body.customerId
      const name = req.body.name

      const reactivateCustomerCommand = ReactivateCustomer(customerId, name)
      await commandBus.handle(reactivateCustomerCommand)
      res.status(200).send()
    } catch (ex) {
      handleException(ex, res)
    }
  }

  /**
   * List customers request handler
   * 
   * @param {any} req 
   * @param {any} res 
   */
  async function listCustomers (req, res) {
    try {
      res.json(await memDB.list(CUSTOMERS))
    } catch (ex) {
      handleException(ex, res)
    }
  }

  /**
   * Customer request exception handler
   * 
   * @param {any} ex 
   * @param {any} res
   */
  function handleException (ex, res) {
    switch (ex.constructor) {
      case CustomerNotFound:
        res.status(404).send('Customer not found')
        break
      case CustomerAlreadyRegisteredError:
        res.status(400).send('Customer already registered')
        break
      case CustomerNotActiveError:
        res.status(400).send('Customer already deactivated')
        break
      case CustomerIsActiveError:
        res.status(400).send('Customer already active')
        break
      default:
        console.error(ex)
        res.status(500).send('Ooops, something went wrong...')
    }
  }

  app.get('/customers', listCustomers)

  app.post('/customer/create', createCustomer)
  app.post('/customer/update', updateCustomer)
  app.post('/customer/deactivate', deactivateCustomer)
  app.post('/customer/reactivate', reactivateCustomer)
}

export default CustomerController
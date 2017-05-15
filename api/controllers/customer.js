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
 * Initialize customer controller routes
 * 
 * @param {any} app Instance of express app
 * @param {EventBus} eventBus Instance of EventBus to subscribe event listeners to
 * @param {CommandBus} commandBus Instance of CommandBus to handle commands
 * @param {MemDB} memDB Instance of MemDB for projections
 */
function CustomerController (app, eventBus, commandBus, memDB) {

  async function createCustomer (req, res) {

    const customerId = req.body.customerId
    const name = req.body.name
    const email = req.body.email
    const password = passwordHash.generate(req.body.password)

    //  as it was stated in application README, when using CQRS paradigm it must
    //  be taken into account that this system is not immediately consistent but eventualy consistent
    //  we don't actualy create customer at this point, but rather register user instead
    //  then we'll wait for CustomerCreateService instance to validate email uniquness
    //  and if email is unique service will create user or dispach error event

    //  NOTE:
    //  this could be even more simplified on api side if we would write our client app 
    //  to listen for events from application service (via websocket for example)
    //  in that case we could just issue RegisterCustomer command and let the client handle the success/error events
    //  but since in this example app, we want rest like api interface, we'll handle events in this controller

    //  subscribe to EVENT (emitted when model event is commited to event store)
    //  to listen for CUSTOMER_CREATED event
    function eventHandler (event) {
      if (event.__name === CUSTOMER_CREATED && event.customerId === customerId) {
        res.status(200).send()
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
        clearTimeout(reqTimeout)
        eventBus.removeListener(EVENT, eventHandler)
        eventBus.removeListener(ERROR, errorHandler)
      }
    }
    eventBus.on(ERROR, errorHandler)

    //  create very simple timeout handler (read ahead for why timeout handler is needed)
    //  in a real app we would at least dispach notification to system admin that something is wrong
    const reqTimeout = setTimeout(() => {
      eventBus.removeListener(EVENT, eventHandler)
      eventBus.removeListener(ERROR, errorHandler)
      res.status(408).send('service timeout')
    }, 30000)

    try {
      const registerCustomerCommand = RegisterCustomer(customerId, name, email, password)
      await commandBus.handle(registerCustomerCommand)
    } catch (ex) {
      clearTimeout(reqTimeout)
      eventBus.removeListener(EVENT, eventHandler)
      eventBus.removeListener(ERROR, errorHandler)
      handleException(ex, res)
    }
  }

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

  async function listCustomers (req, res) {
    try {
      res.json(await memDB.list(CUSTOMERS))
    } catch (ex) {
      handleException(ex, res)
    }
  }

  function handleException (ex, res) {
    switch (ex.constructor) {
      case CustomerNotFound:
        return res.status(404).send('Customer not found')
      case CustomerAlreadyRegisteredError:
        return res.status(400).send('Customer already registered')
      case CustomerNotActiveError:
        return res.status(400).send('Customer already deactivated')
      case CustomerIsActiveError:
        return res.status(400).send('Customer already active')
      default:
        console.error(ex)
        return res.status(500).send('Ooops, something went wrong...')
    }
  }

  app.get('/customers', listCustomers)

  app.post('/customer/create', createCustomer)
  app.post('/customer/update', updateCustomer)
  app.post('/customer/deactivate', deactivateCustomer)
  app.post('/customer/reactivate', reactivateCustomer)
}

export default CustomerController
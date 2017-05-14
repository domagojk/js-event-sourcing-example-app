import passwordHash from 'password-hash'

import { CreateCustomer, UpdateCustomer, DeactivateCustomer, ReactivateCustomer } from '../domain/commands/CustomerCommands'

/**
 * Initialize customer api routes
 * 
 * @param {any} app Instance of express app
 * @param {CommandBus} commandBus Instance of CommandBus to handle commands
 */
function CustomerApi (app, commandBus) {
  async function createCustomer (req, res) {
    try {
      const customerId = req.body.customerId
      const name = req.body.name
      const email = req.body.email
      const password = passwordHash.generate(req.body.password)

      const createCustomerCommand = CreateCustomer(customerId, name, email, password)
      await commandBus.handle(createCustomerCommand)
      res.status(200).send()
    } catch (ex) {
      if (ex instanceof TypeError) {
        console.error(ex)
        return res.status(500).send('ooops, something went wrong...')
      }
      res.status(400).send(ex.toString())
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
      if (ex instanceof TypeError) {
        console.error(ex)
        return res.status(500).send('ooops, something went wrong...')
      }
      res.status(400).send(ex.toString())
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
      if (ex instanceof TypeError) {
        console.error(ex)
        return res.status(500).send('ooops, something went wrong...')
      }
      res.status(400).send(ex.toString())
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
      if (ex instanceof TypeError) {
        console.error(ex)
        return res.status(500).send('ooops, something went wrong...')
      }
      res.status(400).send(ex.toString())
    }
  }

  app.post('/customer/create', createCustomer)
  app.post('/customer/update', updateCustomer)
  app.post('/customer/deactivate', deactivateCustomer)
  app.post('/customer/reactivate', reactivateCustomer)
}

export default CustomerApi
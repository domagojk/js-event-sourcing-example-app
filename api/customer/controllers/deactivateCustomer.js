import handleException from '../lib/handleException'
import { DeactivateCustomer } from '../../../domain/commands/CustomerCommands'

/**
 * Create customer request handler
 *
 * @param {any} req
 * @param {any} res
 */
export default ({ commandBus }) => async (req, res) => {
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

import handleException from '../lib/handleException'
import { ReactivateCustomer } from '../../../domain/commands/CustomerCommands'

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

    const reactivateCustomerCommand = ReactivateCustomer(customerId, name)
    await commandBus.handle(reactivateCustomerCommand)
    res.status(200).send()
  } catch (ex) {
    handleException(ex, res)
  }
}

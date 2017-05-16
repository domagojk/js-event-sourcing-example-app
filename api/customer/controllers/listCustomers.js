import handleException from '../lib/handleException'
import { CUSTOMERS } from '../../../domain/constants/collections'

/**
 * Create customer request handler
 *
 * @param {any} req
 * @param {any} res
 */
export default ({ memDB }) => async (req, res) => {
  try {
    res.json(await memDB.list(CUSTOMERS))
  } catch (ex) {
    handleException(ex, res)
  }
}

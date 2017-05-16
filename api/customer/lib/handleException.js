import {
  CustomerNotFoundError,
  CustomerAlreadyRegisteredError,
  CustomerNotActiveError,
  CustomerIsActiveError
} from '../../../domain/errors/customerErrors'

/**
 * Customer request exception handler
 *
 * @param {any} ex
 * @param {any} res
 */
function handleException (ex, res) {
  switch (ex.constructor) {
    case CustomerNotFoundError:
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

export default handleException

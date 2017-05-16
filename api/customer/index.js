import Application from './application'
import listCustomers from './controllers/listCustomers'
import createCustomer from './controllers/createCustomer'
import updateCustomer from './controllers/updateCustomer'
import deactivateCustomer from './controllers/deactivateCustomer'
import reactivateCustomer from './controllers/reactivateCustomer'

export default api => {
  const { eventBus, commandBus, memDB } = Application()

  api.get('/customers', listCustomers({ memDB }))
  api.post('/customer/create', createCustomer({ eventBus, commandBus }))
  api.post('/customer/update', updateCustomer({ commandBus }))
  api.post('/customer/deactivate', deactivateCustomer({ commandBus }))
  api.post('/customer/reactivate', reactivateCustomer({ commandBus }))
}

class CustomerEmailExists extends Error {}
class CustomerNotFound extends Error {}
class CustomerAlreadyRegisteredError extends Error {}
class CustomerAlreadyCreatedError extends Error {}
class CustomerNotActiveError extends Error {}
class CustomerIsActiveError extends Error {}

export {
  CustomerNotFound,
  CustomerAlreadyRegisteredError,
  CustomerAlreadyCreatedError,
  CustomerNotActiveError,
  CustomerIsActiveError,
  CustomerEmailExists
}
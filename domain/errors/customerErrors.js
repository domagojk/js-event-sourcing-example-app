class CustomerEmailExists extends Error {}
class CustomerNotFoundError extends Error {}
class CustomerAlreadyRegisteredError extends Error {}
class CustomerAlreadyCreatedError extends Error {}
class CustomerNotActiveError extends Error {}
class CustomerIsActiveError extends Error {}

export {
  CustomerNotFoundError,
  CustomerAlreadyRegisteredError,
  CustomerAlreadyCreatedError,
  CustomerNotActiveError,
  CustomerIsActiveError,
  CustomerEmailExists
}
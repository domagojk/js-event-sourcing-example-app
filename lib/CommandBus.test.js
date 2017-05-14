import CommandBus from './CommandBus'

const commandBus = CommandBus()

const testCommand = {
  __name: 'TEST_COMMAND',
  val: 'test'
}

const testCommandHandler = {
  handle: command => command.val
}

it('should register command handler', () => {
  commandBus.registerHandler('TEST_COMMAND', testCommandHandler)
})

it('should handle command', async () => {
  const commandResponse = await commandBus.handle(testCommand)
  expect(commandResponse).toBe('test')
})

it('should throw an error on duplicate handler register', async () => {
  try {
    await commandBus.registerHandler('TEST_COMMAND', testCommandHandler)
  } catch (err) {
    expect(err.toString()).toBe('Error: handler already registered')
  }
})

it('should uregister command handler', async () => {
  await commandBus.unregisterHandler('TEST_COMMAND')
})

it('should throw an error on unregistered handler', async () => {
  try {
    await commandBus.handle(testCommand)
  } catch (err) {
    expect(err.toString()).toBe('Error: handler not registered')
  }
})
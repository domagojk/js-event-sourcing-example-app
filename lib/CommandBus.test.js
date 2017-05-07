import CommandBus from './CommandBus'

const testCommand = {
  __name: 'TEST_COMMAND',
  val: 'test'
}

const testCommandHandler = function (command) {
  return command.val
}

it('should register command handler', () => {
  CommandBus.registerHandler('TEST_COMMAND', testCommandHandler)
})

it('should handle command', async () => {
  const commandResponse = await CommandBus.handle(testCommand)
  expect(commandResponse).toBe('test')
})

it('should throw an error on duplicate handler register', async () => {
  try {
    await CommandBus.registerHandler('TEST_COMMAND', testCommandHandler)
  } catch (err) {
    expect(err.toString()).toBe('Error: handler already registered')
  }
})

it('should uregister command handler', async () => {
  await CommandBus.unregisterHandler('TEST_COMMAND')
})

it('should throw an error on unregistered handler', async () => {
  try {
    await CommandBus.handle(testCommand)
  } catch (err) {
    expect(err.toString()).toBe('Error: handler not registered')
  }
})
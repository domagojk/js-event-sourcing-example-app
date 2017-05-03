import DeepstreamServer from 'deepstream.io'
import CommandBus from './CommandBus'

const bus = CommandBus('localhost', 6025)

const server = new DeepstreamServer({
  host: 'localhost',
  port: 6025
})

const testCommand = {
  __name: 'TEST_COMMAND',
  val: 'test'
}

const testCommandHandler = function (command) {
  return command.val
}

beforeAll(done => {
  server.on('started', () => {
    done()
  })
  server.start()
});

afterAll(done => {
  server.on('stopped', done)
  server.stop()
})

it('should connect bus to server', async () => {
  await bus.connect()
})

it('should register command handler', async () => {
  await bus.registerHandler('TEST_COMMAND', testCommandHandler)
})

it('should handle command', async () => {
  const commandResponse = await bus.handle(testCommand)
  expect(commandResponse).toBe('test')
})

it('should throw an error on duplicate handler register', async () => {
  try {
    await bus.registerHandler('TEST_COMMAND', testCommandHandler)
  } catch (err) {
    expect(err.toString()).toBe('Error: RPC TEST_COMMAND already registered')
  }
})

it('should uregister command handler', async () => {
  await bus.unregisterHandler('TEST_COMMAND')
})

it('should throw an error on unregistered handler', async () => {
  try {
    await bus.handle(command)
  } catch (err) {
    expect(err.toString()).toBe('ReferenceError: command is not defined')
  }
})
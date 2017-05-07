# javascript-ddd-cqrs-event-sourcing-example

## Motivation

This is my first attempt to write an application based on Command Query Responsibility Segregation (CQRS) + Event Sourcing.
Throughout the application development I'll try to sum up best explanations I came across in the process of learning and trying to understand this topic. While learning about CQRS and Event Sourcing I found out that practical code examples are very scarce and especially those for JavaScript which is not a common language for developing applications based on this architecture. While JavaScript might not be the best choice for this type of architecture, trying to figure it out while having to understand examples in other programming languages makes it a lot harder. That was my main motivation for creating this project.

There are lot of books and articles that explain benefits of using this approach when designing a software architecture and I don't intend to go into deep theory here, but rather provide a starting point to help one to understand what is all about and how it can be done in JavaScript.

This project is also intended to serve as playground for testing ideas and showcasing to other developers. Criticism is highly welcomed! :)

## Goal

  - Design a simple model of online store business
  - Implement that model using CQRS + Event Sourcing architecture
  - Create a public api interface that will consume this model
  - Create a simple web shop client app that will consume that public api

Our application will implement very simple online store business model. We'll work with customers that will create shopping orders (shopping carts). Each customer can have multiple agents (operators) that can use our application simultaneously (that deliberately adds a layer of complexity that we'll need to take care of). Each order will have its simple life cycle (create, modify, complete and cancel). We'll stop there to keep business model very simple and will not cover shipping, payment, etc.
Every order has an product list (order items), that can be added from our product catalog. Product catalog will be static, again to keep business model very simple (there will be no price or available quantity changes).
We will implement email notification functionality when order is completed to showcase how to deal with side-effects (application functionality that is not part of domain logic). There will be no interaction with remote systems or long running transactions here, as they are not important for basic understanding how this architecture works.

## Domain Driven Design (DDD)

Learning about CQRS and Event Sourcing, we will often stumble upon terms like Domain or Domain Driven Design. This is a very broad topic but in essence the focus of DDD is on language and making the implicit explicit. In DDD, language is the most important factor. What you want to have is the problem domain explicitly expressed inside your code. As a developer, you want to speak the same language as your business. That's enough theory for now. If found Vaughn Vernon's book "Implementing Domain-Driven Design" very good at covering this topic.

## Eventual consistency

If we have worked with a "classic" N tier/layer architecture with a relational database, we often think that we need to have full system consistency. We trick ourselves into thinking that if we have a single source of truth (the database), we always have immediate consistency. But the thing is, as soon as we need to scale beyond one database server immediate consistency is not possible. Let's look at the simplest example where we have one master database and one or more read replicas. Replication slave is always lagging behind at least a fraction of a second, because the master doesn't write changes to its binary log until the transaction commits, then the slave has to download the binary log and relay the event. Database replication has mechanism to prevent us from reading inconsistent data, but we might temporarily read old data in a replication system that lags. That puts us in a state of eventual consistency whether we like it or not.

That is where CQRS and Event Sourcing offer much better approach.

## Command Query Responsibility Segregation (CQRS)

CQRS stands for "Command Query Responsibility Segregation". That means that reading and writing are separated into two different parts of application. In this application we'll implement CQRS architecture in combination with event sourcing, although there are also other ways to implement CQRS without using event sourcing.

In a "classic" N tier/layer architecture objects are transformed through the same layers when reading from and writing to database. When performing write, we map from a view model to a domain model and then map the model to a database table. When reading, we do the same transformations in opposite way.

With CQRS, write and read are completely separate parts of application. When performing write, the view creates command and passes it to the command handler. The command handler then applies that command to a domain model. The domain model sends out an event with what happened and an event handler catches these events and persists the changes. On the read side each view has a dedicated "source" (this could be a simple table or a view).

The idea behind this concept is that the domain layer prepares the data. When the event handler receives the changes in the data, it can handle that in different ways. One way would be to just save the values in the database. However, it could also decide to save a view optimized form of that same data to a secondary storage. That way, when the view gets it, it’s already processed.

This allows us to scale the system in more efficient way. In most systems the number of read and write operations is not nearly identical and in most cases read operations are many times more heavily used than write operations. We can now have a separate application infrastructure to handle just read operations. We can then deploy read only database clusters or different types of databases for different purposes (sql, nosql). Having prepared data for the read side reduces the cost of reading operations to a minimum, thus allowing us to avoid creating dedicated caching algorithms.

## Event sourcing

In a typical CRUD model, we store data directly to database and when applying changes to that data, previous data gets lost. We are only saving the latest snapshot. What that means is that we are not only updating data but we are deleting previously stored data as well.

When using Event Sourcing we never delete data, but rather store events on what happened in the past and rebuild our application state from those events. Nothing gets lost and we are only doing insert operation.

This may seem complicated and inefficient at first, but the fact that our data model is immutable has a lot more advantages over classical CRUD model. Storing events instead of mutating data we can recreate application state in any given moment just by iterating those events and applying transformations on them.

Let's see a quick example of rebuilding state for a shopping order. First we need to create an order to work on, than we need to add some products, define shipping address and confirm the order. If we log an event for each action our event log for that order would look like this:

```javascript
const events = [
  {event: "ORDER_CREATED", orderId: 101, customerId: 20}
  {event: "ORDER_ITEM_ADDED", orderId: 101, productId: 320, quantity: 10}
  {event: "ORDER_SHIPPING_ADDRESS CHANGED", recipient: "Some company", address: "Some street", town: "London", country: "UK"}
  {event: "ORDER_ITEM_REMOVED", orderId: 101, productId: 320, quantity: 2}
  {event: "ORDER_CONFIRMED", orderId: 101}
]
```

Note that events must be stored and iterated in order they were created. In practice we don't really need to worry about it unless we are writing our own event store. We can now reduce this array to calculate current shopping order state:

```javascript
const initialState = {
  items: []
}
const currentState = events.reduce(applyEvent, initialState)
```

Each event in order they are created will be passed to `applyEvent` handler along with a transient state value from last `applyEvent` invocation (previous event). As described, we always calculate the state based on previous state and current event. This is what makes this concept very powerful and easy to maintain. We never mutate the state directly, what makes testing and debugging a lot easier.

A lot of examples we find on the net are written using object instances where they mutate the state of the object using private variables while applying events instead of using reducers, but the concept is the same (although, in my opinion, using functional paradigm produces cleaner code).

Not going into details on how `applyEvent` works (basically calls different handlers for different events, check [aggregate](domain/aggregates/README.md)), reduced state would look like this:

```javascript
{
  orderId: 101,
  customerId: 20,
  items: [
    {
      productId: 320,
      quantity: 8
    }
  ]
}
```

If you look at event names, they are all in past tense. Although we can technically name them anyway we want to, "event" is always something that has already happened and it should therefore reflect this in it’s name being in the past tense. Good event naming allows domain expert (or a system architect) to infer from the event names alone. It also makes it easier to debug your application. There are many good articles on event naming best practices and going into details would be off scope for this project.

## Commands

So where do events come from? **Commands** are the only way we can produce events. *Commands* can be created by user or by application services (process managers or sagas, for example) and they instruct app to do something. It is a combination of expressed intent (which describes what you want done) as well as the information required to undertake action based on that intent. *Command* is passed to **command handler** that applies *command* to a domain model that will produce events on changes that happened to state of the data (or throw an error if *command* is invalid or requirements for the *command* are not met).
Note that requests to fetch data are not commands but queries. If a *command* unintentionally does not change the state of the data it is *improper command*.

For those who are coming from a "classic" N tier/layer architecture this can be confusing at first. For example if a user wants to send an email from within our application, we don't actually send the email from the *command handler*, but only validate a *command* against a *domain model* (are requirements for sending an email met - for example is recipient email address provided and valid, did user exceeded his send email quota, etc).
*Domain model* will then create an *event* that user has requested sending an email. That *event* will be picked up by an appropriate *event handler* that will attempt to send an email. That attempt can be a success of a failure and the *event handler* must report to the *domain model* by calling an appropriate *command* (for example, "CONFIRM_EMAIL_SENT" command, or some other command in case of failure to send the email).
*Event handler* must not create *events* on its own outside of *domain model*. Only *domain model* can be responsible for creating *events*, because all business logic is defined there (domain model can reject "confirm email sent" command if it is not in state of "pending email send" for example).

Now, lets define a simple **command** to create a shopping order and a **command handler** for it.

```javascript
function CreateOrder (uuid, customerId) {
  if (!uuid) {
    throw new Error('invalid uuid param')
  }
  if (!customerId) {
    throw new Error('invalid customerId param')
  }

  return {
    command: 'CREATE_ORDER',
    uuid,
    email
  }
}
```

This factory function will validate command parameters requirements and throw exception in case invalid parameters are provided or will return a **command object**. When serialized this *command object* would look like this:

```javascript
{command: "CREATE_ORDER", orderId: 101, customerId: 20}
```

## Command Handlers

As said, *command* does nothing on its own. *Command* must be sent to appropriate *command handler* to get executed. The *command handler* is the object that receives a *command* of a pre-defined type and takes action based on its contents.

Let's create *command handler* for shopping order commands.

```javascript
function CustomerCommandHandler (repository) {

  async function createOrder (command) {
    const orderId = command.orderId
    const customerId = command.customerId
    const events = await repository.readEvents(orderId)
    const order = OrderAggregate()
    const state = order.loadFromHistory(events)
    const newState = order.create(state, orderId, customerId)
    const uncomitedEvents = order.getUncommittedChanges(newState)
    const expectedVersion = order.getCurrentVersion(newState)
    await repository.storeEvents(orderId, uncomitedEvents, expectedVersion)
  }

  //  ... more handlers would go here

  async function handle(command) {
    switch (command.__name) {
      case CREATE_ORDER:
        return await createOrder(command)
      case UPDATE_SHIPPING_ADDRESS_ORDER:
        return await updateShippingAddress(command)
      //  ...other commands
    }
    throw new Error('unrecognised command')
  }

  return {
    handle
  }

}
```

*Command handler* is invoked by passing a *command* to its handle method. Since JavaScript does not support function overloading (it is untyped language) we must write a single `handle` method that will check the command type and call specific handler function. Command is then passed to that specific command handler function (like `createOrder` in above example).
But before we can execute command against domain model, we must first recreate the current state of domain model form the event history so we can validate business rules against it (for example our model must throw an error if CreateOrder is trying to get executed on already created shopping order, or if we try to confirm an order without any products added to it). If command is executed successfuly, we must create events on what happened. That is a domain of an aggregate. Aggregate will handle commands, apply events, and have a state model encapsulated within it that allows it to implement the required command validation, thus upholding the business rules of the aggregate. Aggregate is complex topic and covering it in details would be off scope for this project. There is a lot literature available covering the topic. How aggregates are implemented in this project is covered on [aggregate](domain/aggregates/README.md) page.

## Repository

Our command handler factory function has `repository` parameter. The *repository* is the mechanism that provides access to aggregates. The repository acts as a gateway to the actual storage mechanism used to persist the data. In some cases we may want different *repository* implementations for different aggregates (for example we may decide to store customers to some nosql database, and orders to sql database). *Repository* should support only reading and storing events for a single aggregate. Any other types of queries should be performed against the query database, not the *repository*.
In this application we will use our own implementation of [event store](lib/EventStore.js) as a *repository* for all aggregate types. This very simple in-memory event store can return events for given aggregateId (for example customerId, orderId, etc.) It can also return current version of aggregate (total number of stored events for given aggregate), and can store new events while performing version check (to prevent storing uncommitted events if the state of the aggregate has changed while executing command).
Another important feature of our event store is to serve as *event bus*. *Event bus* allows publish-subscribe style communication between components without requiring the components to explicitly register with one another (and thus be aware of each other).
Every event that is committed to event store will also be emitted to all subscribers. Services that are subscribed can then react upon those events.

## Command Bus

Let's get back to command handlers. We can consume handlers directly (by instantiating them directly from an api for example), or we can implement *command bus*. The role of the *command bus* is to ensure the transport of a *command* to its *handler*. The *command bus* receives a *command*, which is nothing more than a message describing intent, and passes this onto a *handler* which is then responsible for performing the expected behavior.
Although *command bus* and *event bus* may look similar at first, they are very different. While *event bus* uses publish/subscribe pattern (when event is emitted, all event listeners subscribed to that emitter will receive that event), *command bus* must deliver command to exactly one command handler. Using event bus and command bus architecture is great for application scalability as we can distribute command and event handlers across network (horizontal scaling).
There is lot of articles available on the net about command bus as an infrastructure service, but in this project, however, we'll keep it simple and integrated inside this application.

Each command handler must be registered on a command bus to allow the command bus to pass commands to appropriate handlers. To register command handler to command bus we need to instantiate command handler and register handle method on command bus.

```javascript
const orderCommandHandler = OrderCommandHandler(repository)
commandBus.registerHandler(CREATE_ORDER, orderCommandHandler)
```

Let's examine how command bus is implemented in this application. As briefly explained above, the responsibility of a command bus is to pass a command onto its handler. The simplest command bus could just be an object that can register handlers to appropriate command types and can invoke those handlers on specific commands. It does not have to support distributed application architecture. Even then using command bus is convenient because it allows us to decouple our application modules, since passing a command does not require any dependency other than command bus. We can rewire our architecture without ever worrying about dependencies among modules.

Command bus interface should have at minimum methods for registering command handler and handling commands (routing commands to registered handlers). It should also have methods to unregister handler or to check is handler registered.

```javascript
function CommandBus () {
  function handle (command) {
    //  ...
  }
  function registerHandler (commandName, handler) {
    //  ...
  }
  function unregisterHandler (commandName) {
    //  ...
  }
  function isHandlerRegistered (commandName) {
    //  ...
  }
  return {
    handle,
    registerHandler,
    unregisterHandler,
    isHandlerRegistered
  }
}

export default CommandBus()
```

For actual implementation details check [CommandBus.js](lib/CommandBus.js). This will create a single instance of *CommandBus* for entire application and we can import it our modules and use it to transport commands to appropriate command handlers. 

## Read model

As said before, CQRS architecture separates write from read side. Up to this point we have only covered write side implementation. But we should not rely on our repositories for serving application state to outside world. Depending on needs our data should be already prepared in a read only database (or databases) that we can query.
Read model is responsible for listening events produced by domain model and transforming them to a model suitable for client's queries. It can transform data to database (sql, nosql, graph etc.), file (csv, xml, etc.), or any other readable format. What client will do that data is up to the client.
As multiple read models can be built using same events, we can prepare the same data in multiple ways allowing our clients to choose the data model that best suits the needs for specific operation. For example, we can create two read models that will listen for bank account transactions events. First read model will create sql table with a list of transactions and second read model will create simple document with just account totals. Then client can decide which view will use for certain operations (on account overview page will fetch data from account totals view for example).
This shows a clear benefit from traditional CRUD systems. We only pay once per write operation, unlike in CRUD system where we have to prepare data for each read request. It also makes horizontal scaling easy because we can have as many identical read models as we need (we can distribute our read models across different regions for example). And if we need to create new read model for any future client requirements, we don't need to make any changes to our application but rather create new read model that will listen for events from our domain model.

//  TODO: implementation

## Api

Now we can create public api for our application that will implement our domain model, initialize command handlers and register them on the command bus. We can then create api methods that will create commands and pass them to the command bus. This will be our interface to the outside world, one the users of our application will consume.
# Aggregate

## What is an aggregate?

To help us understand what the term aggregate represents let's try to rethink how to address misconception that a <b>shopping order</b> is somehow "inherently mutable". In a "real world" <b>shopping order</b> is a piece of paper that everyone can write on and we can't really know for sure in which order the <b>shopping order</b> items have been appended. When building software systems we don't really need to limit our design to mimic the real world.
To make the implicit notion of “change over time” (mutability) explicit in our model we'll need to model all state changes of the <b>shopping order</b> explicitly as an event. Using events to model all state changes the event becomes our explicit notion of change. We call this principle journaling, transaction logging or event sourcing.

Let's describe our <b>shopping order</b> model, and let's use just term <b>order</b> from now on.

TODO: describe using ubiqutous language

For our simple <b>order</b> model we can define the following events:

```
OrderCreated (orderId)
OrderCustomerChanged (orderId, customerId)
OrderItemAdded (orderId, item, quantity)
OrderItemRemoved(orderId, item, quantity)
OrderConfirmed(orderId, date)
OrderCanceled(orderId, date)
OrderDelivered(orderId, date)
```

Using these events and only these events we are describing any valid <b>order</b> in our system. What is very important to understand is that these events represent the results of behaviors that have already happened, not the behaviors themselves. That is why these events are all named using past tense. By defining these events we have limited the number of possible mutations. This makes it a lot easier for business domain experts to understand our model.

Since events are immutable and never deleted, no important information is ever lost, unlike in mutable model where every change will overwrite previous one.
Watch Greg Young [talk](https://skillsmatter.com/skillscasts/1354-greg-young-cqrs-event-sourcing-the-business-perspective) about business related benefits of this prinicple.

Every <b>order</b> in our system with all of its event history is a single aggregate. <b>Order</b> aggregates need to:

  1. Use aggregate's event history to rebuild it to it's current state instead of mutating the state directly
  2. Define commands that will validate command parameters against current state
  3. Implement commands in a way that they will either generate a new event or throw an exception - but <b>never</b> mutate the state directly!
  4. Use generated events to rebuild the state before executing next command
  5. Keep track of event history and new events that have yet to be stored (uncommited events)

This has another important aspect when thinking about aggregates. When rebuilding aggregate's state from its event history we are only concerned to track the state necessary to fulfill the behavioral contract. What that means is that we should never need to worry on reporting needs. When talking about <b>order</b> aggregate we don't need to calculate <b>order</b> totals for example as that is a part of the read model that is separated from aggregates logic. What we need to take care of is that an <b>order item</b> that has never been added can not be removed (specifically when calling `removeItem` method an exception needs to be thrown if trying to remove an item that has not been added yet to order items).

<b>Order</b> has to hold the information on <b>Customer</b> that it relates to and a list of <b>OrderItems</b>. From a domain perspective <b>Customer</b> is a separate aggregate as it can exists on its own. What that means is that we can build a domain model that defines customers but not orders. For example, if our business model only provides consulting services, we don't really need orders as we can charge our customers by hourly rate. In our current model <b>Customer</b> is reference to a <b>Order</b> and therefore any transaction that is performed within <b>Order</b> context should not affect related <b>Customer</b>.
This is called <b>bounded context</b> and is a central pattern in Domain-Driven Design. 

We can now try to answer the question on what is aggregate. Let's start with http://cqrs.nu/Faq

> A larger unit of encapsulation than just a class. Every transaction is scoped to a single aggregate. The lifetimes of the components of an aggregate are bounded by the lifetime of the entire aggregate.
> Concretely, an aggregate will handle commands, apply events, and have a state model encapsulated within it that allows it to implement the required command validation, thus upholding the invariants (business rules) of the aggregate.

In the book Domain-Driven Design by Eric Evans aggregate is described as **a collection of objects that are bound together by a root entity, otherwise known as an aggregate root. The aggregate root guarantees the consistency of changes being made within the aggregate by forbidding external objects from holding references to its members**.

### What is the difference between an aggregate and an aggregate root?

This term is used a lot when reading about aggregates. This has nothing to do with a class inheritance in OOP (what was my initial perception when looking at some event sourcing example projects).

Again, a really nice answer from http://cqrs.nu/Faq

> The aggregate forms a tree or graph of object relations. The aggregate root is the "top" one, which speaks for the whole and may delegates down to the rest. It is important because it is the one that the rest of the world communicates with.

In this example that would make <b>Order</b> an aggregate root and <b>OrderItem</b> a child object. Every change for any of <b>OrderItems</b> in an <b>Order</b> must be handled by the <b>Order</b> aggregate.

TODO: bounded context, aggregate size, value object and entity
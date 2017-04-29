# javascript-ddd-cqrs-event-sourcing-example

## Motivation

This is my first attempt to write an application based on Domain Driven Design (DDD) approach using Command Query Responsibility Segregation (CQRS) + Event Sourcing.
Throughout the application development I'll try to sum up important information on understating the topic that will cover every aspect of this sample application. While learning about DDD, CQRS and ES I found out that practical code examples are very scarce and especially for JavaScript which is not a common language to develop this kind of applications in. That was my main motivation for creating this repository.

There are lot of books and articles that explain benefits of using this approach when designing a software architecture and I don't intend to cover deep theory here, but rather help one to understand what is all about and how it can be done in JavaScript.

This project is also intended to serve as playground for testing ideas and showcasing to other developers. Criticism is highly welcomed! :)

## Goal

  - Design a simple model of online store business
  - Implement that model using domain-driven design (DDD) approach
  - Create a public api interface that will consume this model
  - Create a simple web shop client app that will consume this api

Our application will implement very simple online store business model. We'll work with customers that will create shopping orders (shopping cart). Each customer can have multiple agents (operators) that can use our application simultaneously (that adds a layer of complexity that we'll need to take care of). Each order will have its simple life cycle (create, modify, complete and cancel). We'll stop there to keep business model very simple and will not cover shipping, payment, etc.
Every order has an product list (order items), that can be added from our product catalog. Product catalog will be static, again to keep business model very simple (there will be no price or available quantity changes).

## Domain Driven Desing (DDD)



## Eventual consistency

If you have worked with a "classic" N tier/layer architecture with a relational database, we often think that we need to have full system consistency. We trick ourselves into thinking that if we have a single source of truth (the database), we always have immediate consistency. When multiple users are working on the same database, immediate consistency is not possible. For example, two customer agents are putting up a large order of products. If you allow both of them to work together on the same order both can try to edit shipping details in the same time. Or even one can cancel order while other agent is still adding products to order. As a result one operation will fail. As much as we try to build a consistent system, the reality is, we are already in a state of eventual consistency.
That is where CQRS and Event Sourcing offer much better approach.

## Command Query Responsibility Segregation (CQRS)


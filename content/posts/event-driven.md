---
title:  "Event Driven"
date:   2018-11-09 21:22:37 +0200
categories: ["microservices"]
---

I spent all day today fiddling around with PowerPoint. I am doing a presentation soon(ish) around "Event Driven Microservices" (a lightning talk) which is made hard because of the time limit.

The goal is to introduce events and derivatives of events. Why events are the _source of truth_ for all software. Below I dump my thoughts so I can come back to them later.

## Final Example
(11-11-2018) Today, discussing with a friend, I think I came up with the case-study I'm gonna go with.

### Advantages of Microservices
Explain the advantages of microservices.
- Programming language independence
- Scale the bottlenecks 

### Advantages of Event Triggered Architectures
Explain the advantages of event-triggered systems.
- Fire and forget type of architecture
- IoT is like that
  - Publish/Subscribe
  - Any component can pick up the data it needs

### Final story
I'll start with a brief overview of Microservices and event triggered systems.
- A recommendation engine with a broken algorithm.
- Events are used to recommend the next video to play.
- The algo is messed up and recommends a certain medicine to all the male viewers OR there's an update that we think the customers will be more happy with.
- In an event triggered system
  - deploy new recommendation service
  - events get replayed in the new service and better recommendations come up
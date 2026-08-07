---
title:  "Unidirectional Dataflow"
---

Unidirectional dataflow is a pattern in which data flows only in one direction. Unidirectional dataflow was introduced by Facebook in Flux architecture. Although flux is meant for client-side UI apps, such an architecture is also very interesting for constrained embedded firmware systems.

This is why the Flux architecture intrigues me: a restriction (one-way data flow) liberates you from a world of spaghetti. The coder is _forced_ (or at least, strongly tempted) to create abstractions, dispatchers, stores and queues so that he can meet this criteria. Uni-directional dataflow also has the advantage of inherently suggesting the developer that he should make abstractions based on functionality. 

Embedded systems can also benefit from flux designs: events generate information and dispatchers are responsible for broadcast events. This should make embedded systems more modular in design and possible to be extended. I look forward to experimenting with flux-designs in backends or embedded systems in the days ahead.
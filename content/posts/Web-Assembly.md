---
title:  "On WebAssembly"
date:   2020-03-17 21:22:37 +0200
categories: ["rants", "python"]
---

This blog is not going to define what WebAssembly is, how it interacts with JS or other languages; there are too many blogs and posts available on the internet already.

If you're not familiar with WebAssembly, I would suggest you start here:
- [A cartoon intro to WebAssembly](https://hacks.mozilla.org/2017/02/a-cartoon-intro-to-webassembly/)
- [WebAssembly Concepts](https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts)

This blog post is about wondering what WebAssembly can look like for some usecases.

## Run Everywhere
WebAssembly can run everywhere - atleast that's the goal. It's performant - as performant as C/C++ and it's secure.

>WebAssembly is a type of code that can be run in modern web browsers and provides new features and major gains in performance.

_https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts_

### Open Questions
Although designed for the web, WebAssembly is able to run portably across architectures. This can be a nice way to distribute applications. Some day perhaps WebAssembly runtimes will be a part of _all_ OSes.

What needs to be determined IMO is:

- Realtime capabilities

    Can WebAssembly modules written in C/C++ provide any RT capabilities? If so, then it'll be interesting to evaluate whether a WebAssembly runtime is all that a PLC should be. Apps running the PLC would be delivered like software. Less stickiness for everybody.

- Recompile all the things

    Can WebAssembly runtimes replace native programs? How about message queues, brokers implemented in WebAssembly? I know it's not possible to compile all complicated software to WebAssembly today - but is that the future too?

- UI

    Will Slack and it's likes re-implement significant portions of their code to WebAssembly? Should work, right?

- Edge

    Fastly has already done lots of work with their CDN running WebAssembly-isolated workloads. Can we bring this down to the Edge where we're running containers today?


## Conclusion
There're so many things I'm looking an answer for. This year is going to be awesome!

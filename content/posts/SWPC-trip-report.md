---
title:  "SWPC Trip Report"
date:   2018-11-30 21:22:37 +0200
categories: ["rants"]
---

My company has frequent internal "Software Professionals Conferences (SWPC)". I was honored to be a part of the conference yesterday in Munich where I presented a lightning talk and did a demo.

### Lightning Talk
I did a lightning talk around Event Driven Microservices. Event driven architectures are becoming fairly common these days and IoT is a natural and easily understandable use-case. I presented the architecture we developed but without going into too much detail.

One question I had some trouble answering was around the "infinite-length" event streams. What if the queues get filled up.. How do we save state? The answers to these questions is it depends most of the time but usually you don't run out of space at all :). And I refer to Martin Fowler for these questions.

### Demo
I did an "Fearless Systems Programming with Rust" tutorial/demo as well. It was all going well... I presented a PowerPoint slide deck with some introductory stuff. And then "let me switch to a REAL OPERATING SYSTEM" said I. And I realized that I had a 13" Dell XPS. D'oh!! It only had a Thunderbolt connection and it wouldn't be able to connect to the projector.

Then, I braved up.. Went unprepared into my Lab machine somewhere else and starting setting up a new project that did my `container-demo` style version of containers in Rust. Basically, going through the basics of containers/docker and writing those in Rust. (Thanks again Liz!)

Because I was now doing live coding without a prepared machine over ssh across Germany (lag and all ..), the demo didn't go too smooth! But in the end I was proud that we did get the final product right and in the process we _did_ (literally) demonstrate the power of the Rust compiler, and the Cargo toolchain.

### Conclusions
- Take all the adapters with you. 
- Lightning talks _must_ be anecdotal.

I would do this again if I could!!


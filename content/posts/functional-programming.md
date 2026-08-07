---
title:  "Functional Programming"
date:   2019-01-23 21:22:37 +0200
categories: ["rants", "programming", "functional"]
---

So I was just reading about Functinal programming and this is a summary of what I understand about it as of today.. (might change in the future; to err after all, is human.)

## Benefits
- The "environment" you're programming against are the function arguments
- Reuse is imminent. Composition is what everyone calls it.
- Functions' results can be cached (memoization)

There must be many more benefits.. These three are the ones I can think of and the ones that get the most marks from my side.

## Main Concepts
Functional programming is a technique that depends on the programmer adhering to some principles (it helps if the programming language forces him as well):

### Purity
A pure function has no side effects i.e. it depends only on its arguments.

```clj
(defn pure-function [input]
  (if input output-1 output-2))
```

In this example, if the `pure-function` is really pure, then depending on the input, the return value always remains the same. This _also_ means that the `output-1` and `output-2` data are _immutable_ i.e. they're unchangable! 

### Referential Transparency
In the example above, we might just have replaced the output of `pure-funtion` with either `output-1` or `output-2` thus avoiding the call to a function. Many languages can optimize this behavior by caching the result. It's called _memoization._ This also means that you could parallelize stuff i.e. functions can be independently evaluated on different machines/cores/nodes whatevers.

### Persistence
Immutability is key. You never mutate. An operation on data doesn't change the data, it just returns new data. This naive approach is memory hungry I suppose but platforms and languages find ways to optimize stuff.

### Laziness
Since I'm learning Clojure, there might be a bias because `seq` are everywhere and they're laaaaaaaaaaazy! That is, you only evaluate stuff when it's required and never before. This enables infinite length sequences. Also, we pay for operations only when required.

## Conclusion
I'm still a Functional Programming newbie but Clojure is opening my eyes! I am intrigued.

Fin!

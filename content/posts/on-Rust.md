---
title:  "Error Handling"
date:   2018-10-03 21:22:37 +0200
categories: ["rants"]
---

I started learning Rust almost about two months ago. Even though initially, it's really frustrating, getting code to compile usually means that you've agreed explicitly with the compiler on what errors would look like. This is actually awesome.

My usual error checking function while writing Golang looks something like:

```golang
func check(err error) {
    if err != nil {
        panic(err)
    }
}
```
([read this rant for an idea of Go's error management](https://bluxte.net/musings/2018/04/10/go-good-bad-ugly/#noisy-error-management))

This is what I have cluttered around my code and until now, I have been a big fan of Golang's error propagation. Rust just does it better with it's `?` propagation operator!

```rust
let file = File::open(filename)?;    // propagate error to caller
```

Exceptions in C++ are just a mess. They're unreadable and really do not encourage fine-grained handling of errors. They're also very `goto`-ish. Combined with the `match` keyword, the propagation operator is a powerful tool. Code looks elegant and readable as well.

I only seriously started learning Rust recently. But the journey has been enjoyable. I expect more rants to come on Rust.

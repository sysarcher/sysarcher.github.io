---
title:  "Rust Lifetimes"
date:   2020-04-15 21:22:37 +0200
categories: ["rust"]
---

Coming from a background in C/C++ and other programming languages doesn't help with understanding this one fundamental concept in Rust. Here, I'll try to break it down so it becomes a bit more palatable (and a reference to my future self.)

A simple example:

```rust
fn main() {
    let list = vec![100, 34, 72, 55];               // list is created
    let first_two = &list[0..2];                    // reference is created (first_two)
    println!("first two are {:?}", first_two);      // first_two is referred
    println!("list is {:?}", list);                 // list is referred
    println!("again, first two: {:?}", first_two);  // first_two is referred
}                                                   // first_two is dropped, then, list is dropped
```

A complicated (yet valid) example:

```rust
fn return_first_two(borrowed_list: &[i32]) -> &[i32] {      // borrowed_list is a reference
    &borrowed_list[0..2]
}                                                           // borrowed_list is not dropped because it references something outside of its scope

fn main() {
    let list = vec![100, 34, 72, 55];               // list is created
    let first_two = return_first_two(&list);        // reference is returned (first_two)
    println!("first two are {:?}", first_two);      // first_two is referred
    println!("list is {:?}", list);                 // list is referred
    println!("again, first two: {:?}", first_two);  // first_two is referred
}
```

The main takeaways from the above two examples is:
- _the lifetime of values should outlive any of it's references_
- _a reference's lifetime must be completely contained within the lifetime of the value being referenced_


Generic Lifetimes:

_the following won't compile_

```rust
extern crate rand;
fn simulate_game(home: &str, away: &str) -> &str {
    if rand::random() {
        home
    } else {
        away
    }
}
```

Rust can not know the lifetime of the return value. It knows that return is valid when _both_ references are valid!!

Adding a generic lifetime param:
```rust
extern crate rand;
fn simulate_game<'a>(home: &'a str, away: &'a str) -> &'a str {
    if rand::random() {
        home
    } else {
        away
    }
}
```
This syntax expresses intent in signature

**Lifetime Elision:**

Lifetimes are a part of the language but the language can create some common lifetimes so we don't have to specify them all the time in our programs. This is called Lifetime Elision. The three rules of elided lifetimes:

- Each parameter gets its own lifetime
- One lifetime in parameters => return
- Self reference's lifetime => return

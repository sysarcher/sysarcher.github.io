---
title:  "runc and Friends"
date:   2018-10-20 21:22:37 +0200
categories: ["kubernetes", "docker"]
---

Had to dig a bit into Kubernetes' friends recently. Here's a TL;DR of what's missing from the internet today:

- `runc` is the **CLI tool** for running containers (create/run/delete/~~manage~~)
  - `docker` uses `runc` as its runtime.
  - Kubernetes uses `runc` as its runtime through `cri-o` (those "unsupported Docker version detected" errors you've probably seen.. yeah!) There's no guarantee that `runc` will remain `cri-o` compatible.
- `cri-o` is an interface for container runtimes. Any compatible runtime can be used. `runc` is one of those others being `rkt` (never tested it), Kata containers and I guess many more.
- `containerd` - runtime manager created by docker and later contributed to CNCF. It's the daemon that's running in the background doing your bidding that you pass through `runc`.

---
title:  "VM Optimizations for RT"
date:   2020-11-10 21:22:37 +0200
categories: ["openstack", "qemu", "kvm", "k8s"]
---

QEMU/KVM are a popular backend for OpenStack. In StarlingX Openstack (`stx-openstack`) this is also the case. I'll try to describe various techniques that I used to optimize RT behavior on an STX 4.0.1 cluster with worker nodes.

#### Terminology

**Bare-Metal** is a a physical computer and it's base OS

**Host** is a bare-metal machine that runs VMs

**Thread** is a core of a CPU

**CPU thread** refers to the thread on the host system CPU

**vCPU thread** is a thread on a VM's virtualized CPU

_Note: I borrowed terminology heavily from [this article on `null-src`](https://null-src.com/posts/qemu-optimization/post.php)_

### Isolating CPUs
[My last article covers this topic](https://shrmrf.github.io/rants/stx/2020/11/09/STX-for-RT.html). Isolating a VM's vCPU threads from the host system ensures that host's processes don't interfere with the VM.


### Scheduling Openstack VMs on isolated cores

### CPU Affinity

#### using `taskset`

### Linux Process Scheduler Tuning

### GRUB cmdline
Okay... don't delete the `console` entries in your command line... the entries below are for isolated cpu 1. This is not a comprehensive list... Just append whatever makes sense to you.
```
GRUB_CMDLINE_LINUX_DEFAULT="threadirqs rcu_nocbs=1 rcu_nocb_poll isolcpus=1 nohz_full=1 nohz=off intel_pstate=disable nosoftlockup nohalt"
```
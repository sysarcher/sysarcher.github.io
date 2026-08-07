---
title:  "Kubernetes Pod Networks and Plugins"
date:   2018-10-22 21:22:37 +0200
categories: ["kubernetes", "docker"]
---

### Pod Networks
It is natural that to get your first `k8s` cluster running you'd want to remove the taint from the master node and use it as the cluster (i.e. a single-node cluster). The first thing that a person would do is not set the [kubelet network plugin (--network-plugin=cni)](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#installation). It's certainly what I did wrong.

The problem is you don't see the problem until later because the orchestrator will use docker's default networking which would quickly fail in a more-than-one node cluster. So, it's best practice to immediately apply a pod network!!

### Device Sharing
What if you want to orchestrate the usage of resources (like GPU, audio, crypto) using Kubernetes? Its best practice to create a device plugin. NVIDIA has a [`k8s-device-plugin`](https://github.com/NVIDIA/k8s-device-plugin) for it's GPUs. If this plugin isn't used, you basically end up having to install NVIDIA drivers inside the docker container and hope the host's version of the driver is _exactly_ the same and share the devices with the container.

This is more elegant. Do it!
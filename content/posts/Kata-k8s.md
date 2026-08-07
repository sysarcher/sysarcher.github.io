---
title:  "Kata and Kubernetes"
date:   2019-05-19 21:22:37 +0200
categories: ["rants", "kata-containers", "k8s", "linux"]
---

### Setting up Kata using Docker
This is documented here: https://github.com/kata-containers/packaging/blob/master/kata-deploy/README.md#docker-quick-start

### Using Minikube and Kata
[This PR](https://github.com/kata-containers/documentation/pull/445#) is adding the documentation to get started with `minikube`: https://github.com/kata-containers/documentation/pull/445#

### Using `kubeadm`
- First, set up a Kubernetes cluster using `kubeadm`: https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/
- then, https://github.com/kata-containers/packaging/blob/master/kata-deploy/README.md#kubernetes-quick-start

### Conclusion
Using the new `kata-deploy` method, it is very easy to set up a Kubernetes cluster that uses Kata Containers.
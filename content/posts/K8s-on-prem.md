---
title:  "On-prem Kubernetes"
date:   2020-06-14 21:22:37 +0200
categories: ["k8s"]
---

I have spent time looking at edge deployments of kubernetes, especially, those that are managed by the Ops team in an industry 4.0 setting. Here are my candidates:

- KubeEdge
- k3s and k3os
- StarlingX

I present my brief impressions of each below. This post will need updates as my research goes on.

### Background

_Edge_ is often used as a vague term for either one of CDN, factory network or IT data center. There is a fair amount of confusion where cloud transforms into "Edge".

_Fog_ apparently is used to describe the same concepts and maintains the vaporous water analogue that is so popular in this space (think about it: data lake, fog, clouds ...) Usage of the term "Fog" has been tainted by Cisco. [They make a poor attempt](https://www.cisco.com/c/en/us/solutions/enterprise-networks/edge-computing.html) to show the difference. Meh.

_kubernetes_ is a container orchestrator that has become extremely popular in the last few years. It provides a common API to manage all containers running in your system.

_Cloud native_ is used to describe container-first and container-based systems. (my own definition)

_CNCF_ is the cloud native computing foundation. It manages projects that specifically target cloud native systems. It does not manage all cloud-native projects. To the contrary, there is a small list of projects that are managed by CNCF.

_Linux Foundation_ maintains a set of open source projects. LF Edge is the subgroup that does this for projects targeting Edge deployments. LF projects are of all types.

_OpenStack Foundation_ is another foundation that was originally formed for OpenStack's projects (next item) but it seems to now be accepting projects related to other systems.

_OpenStack_ is the most popular open source cloud. It's the OG thing: was popular before docker, k8s or anything container-related was mainstream. There are still many users of OpenStack in the wild and it's not going anywhere soon.


### KubeEdge
KubeEdge is a CNCF sandbox project designed to extend Kubernetes from cloud to edge. The IoT Edge has unique challenges that no one solution can provide a complete solution for. KubeEdge is designed to meet the challenge of:
- Network Reliability
- Resource constraint; and
- Scalability

KubeEdge has agents running on the Edge. The control plane resides on the Cloud and if there's a network failure/disconnect, the agents keep on doing the necessary control operations. Metadata is synchronized as soon as the connection is restored.

KubeEdge is an opinionated take on the Edge: it provides services and frameworks for messaging and networking. And, since it's opinionated, everyone might not agree with it.

My opinion is that KubeEdge will keep on serving a large userbase but it might not be extremely well suited to the 20% market that wants extra flexibility. How it pans out long-term is yet to be seen.

KubeEdge is bringing edge-edge communication which will be interesting combined with newer enhancements in the Linux kernel (read: Wireguard.) This is an extremely interesting project but for the Industry I'm working in, might not be the first choice - atleast for me.

### k3s
K3s is a take on Kubernetes that removes lot's of stuff off of standard kubernetes.

#### k3os
_benefits of not maintaining your OS and it's downsides_

### StarlingX
StarlingX is an integration project centered around Kubernetes. StarlingX makes an opinionated set of decisions for people looking to use Kubernetes for their infrastructure. StarlingX (STX) is part of the OpenStack foundation which is a testament to it's high quality.
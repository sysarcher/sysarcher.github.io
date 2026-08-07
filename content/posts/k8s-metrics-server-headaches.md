---
title:  "Metrics Server headache"
date:   2023-12-13 20:05:37 +0200
categories: ["rants"]
---
One of the pains of playing around with Metrics server is that it sometimes doesn't connect to the node. In my case it was unhealthy and complaining about `x509` certs.

Not for prod but here's a resolution:

### Install Metrics Server

```
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.6.4/components.yaml
```

Apply the patch:

```
kubectl -n kube-system patch deployment metrics-server --type=json \
-p='[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--kubelet-insecure-tls"}]]'
```

[thanks to @awalker125](https://github.com/kubernetes-sigs/metrics-server/issues/196#issuecomment-1311356441)
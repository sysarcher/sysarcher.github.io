---
title:  "Kata annotations"
date:   2019-06-11 21:22:37 +0200
categories: ["rants", "kata-containers", "k8s", "linux"]
---

_Annotations are a great feature in Kubernetes and a means for communicating to kata some options. [They are being documented as of the time of this writing](https://github.com/kata-containers/documentation/issues/486)_

Using annotations, you can:
- Customize the Kernel that is used (see `KernelPath` example below) 
- Change the guest image (`ImagePath`)
- Hypervisor (`HypervisorPath`)
- Firmware (`FirmwarePath`)
- etc. etc. (All of the annotations are listed in [`annotations.go`](https://github.com/kata-containers/runtime/blob/master/virtcontainers/pkg/annotations/annotations.go))
### Using a Custom Kernel
Here is the `yaml` file I used to apply a custom kernel:

```yaml
apiVersion: v1
kind: Pod
metadata:
    annotations:
        com.github.containers.virtcontainers.KernelPath: "/usr/share/kata-containers/vmlinuz-4.19.31-40"
    name: kata-example
spec:
  runtimeClassName: kata-qemu

  containers:
  - name: nginx-container
    image: nginx
```

The `metadata` key contains the `annotations` map. All of the annotations are listed in [`annotations.go`](https://github.com/kata-containers/runtime/blob/master/virtcontainers/pkg/annotations/annotations.go) on the main repo.
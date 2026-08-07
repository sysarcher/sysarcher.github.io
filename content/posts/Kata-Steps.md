---
title:  "Taking Kata Steps"
date:   2019-04-28 21:22:37 +0200
categories: ["rants", "kata-containers", "kernel", "linux"]
---

So I thought that it might be a great idea to run an RT kernel inside Kata containers. This is a usecase because I soon hope to see Kata containers running on real-time capable hypervisors and also being used in scenarios where real-time is a thing. Soon!

For now, let's look at how I went about doing what I did..

1. You need to `go get github.com/kata-containers/packaging` repository. (or, git clone if you so prefer.) Be sure to have your `$GOPATH` properly set!!
1. cd into `packaging/kernel` directory.
1. I chose the `4.19.31` version of the kernel. Primarily because it was a newer kernel (not too different from the kernel version that comes with the current kata release.) and because it had the [RT patches available](https://cdn.kernel.org/pub/linux/kernel/projects/rt/4.19/patch-4.19.31-rt18.patch.xz)
1. I changed [the `kernel_version=""` line](https://github.com/kata-containers/packaging/blob/dce0558ec6d8329e81fa59c809351170f6741a7a/kernel/build-kernel.sh#L25) to `kernel_version="4.19.31"`

That's it. We are ready to (1) apply the necessary patches from Kata maintainers to our Kernel of choosing and (2) apply the RT patches:
```bash
# download and apply the kata patches to the kernel
./build-kernel.sh setup

cd kata-linux-4.19.31-36
patch -p1<../path-to-extracted-patch/patch-4.19.31-rt18.patch
```

Wait... we need to first, `make menuconfig` and enable `RT` capabilities
```
General Setup 
  --> Preemption Model
    --> Fully Preemptible Kernel (RT)
```

Now, we're ready to build the Kernel and install it\*:
```
./build-kernel.sh setup
sudo ./build-kernel.sh install
```

### Drum Roll please
```console
$ docker run -it --runtime kata-runtime ubuntu bash
root@77cf04fd8290:/# uname -r
4.19.31-rt18
root@77cf04fd8290:/# uname -a
Linux 77cf04fd8290 4.19.31-rt18 #2 SMP PREEMPT RT Mon Apr 29 09:06:08 CEST 2019 x86_64 x86_64 x86_64 GNU/Linux
root@77cf04fd8290:/# 
```

So proud!!!

Happy Building!!

### Note on Kernel Files
`vmlinux`: uncompressed kernel. |
`vmlinuz`: compressed kernel. |
`bzImage`: located under `arch/x86_64/boot/bzImage`. Big Zimage. Compressed kernel image.

More info: [https://stackoverflow.com/a/22338835/3760442](https://stackoverflow.com/a/22338835/3760442)

### Acknowledgements
Special thanks to @egernst, @rico and the great team on Slack!! Though this was my first foray into Kata Containers, I must say the folks were very welcoming. Thank you all!!

_\* I built the kernel (as of the time of writing) using `make build -j4` instead of using the `build-kernel.sh` script but it shouldn't matter. Just FYI._
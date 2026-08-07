---
title:  "Benchmarking DPDK"
date:   2019-07-08 21:22:37 +0200
categories: ["rants", "dpdk", "linux"]
---
_My reference: https://software.intel.com/en-us/articles/set-up-open-vswitch-with-dpdk-on-ubuntu-server_

So I got to play with the Data Plane Development Kit (DPDK) from Intel recently. I planned on replicating the PVP benchmark for my use-case. I set up the following environment:

- Ubuntu 18.04 (bionic) host with:
    - KVM
    - QEMU
- Debian 10 guest images downloaded from: https://cdimage.debian.org/cdimage/openstack/current/

A useful tool is `numactl` (use `apt` to install it). On my non-server system, I don't have multiple socks and multiple cores per sock etc.
```console
root@machine:~# numactl  -s
policy: default
preferred node: current
physcpubind: 2 3 4 5 6 7 
cpubind: 0 
nodebind: 0 
membind: 0 
```
## Setting up (OVS+DPDK)
First of all set install OVS-dpdk using `apt`
```bash
sudo apt-get install openvswitch-switch-dpdk 
sudo update-alternatives --set ovs-vswitchd /usr/lib/openvswitch-switch-dpdk/ovs-vswitchd-dpdk
```

Restart the systemd service: `sudo systemctl restart openvswitch-switch.service`

Hugepages will need to be set up. But we need to tell DPDK about that.
```console
root@machine:~# cat /etc/dpdk/dpdk.conf
   ...
NR_1G_PAGES=4
   ...
```

### Isolate some CPUs
Edit the value of `GRUB_CMDLINE_LINUX_DEFAULT` to:
```ini
GRUB_CMDLINE_LINUX_DEFAULT="default_hugepagesz=1G hugepagesz=1G hugepages=4 hugepagesz=2M hugepages=2048 iommu=pt intel_iommu=on isolcpus=0,1"
```

And run `sudo update-grub`.

_this setting will not need to change afterwards. A reboot of the machine is required. See if the parameters got passed correctly by doing `cat /proc/cmdline`_


### Set up Hugepages
```bash
sudo mkdir -p /mnt/huge
sudo mkdir -p /mnt/huge_2mb
sudo mount -t hugetlbfs none /mnt/huge
sudo mount -t hugetlbfs none /mnt/huge_2mb -o pagesize=2MB
sudo mount -t hugetlbfs none /dev/hugepages
```

```console
root@machine:~# grep HugePages_ /proc/meminfo 
HugePages_Total:       4
HugePages_Free:        1
HugePages_Rsvd:        0
HugePages_Surp:        0
```

## Configure OVS-DPDK
The database needs to be set up only once (`sudo ovs-vsctl --no-wait init`)

```bash
sudo ovs-vsctl --no-wait set Open_vSwitch . other_config:dpdk-lcore-mask=0x03  # hopefully: cores, 0,1 
sudo ovs-vsctl --no-wait set Open_vSwitch . other_config:dpdk-socket-mem="1024"
sudo ovs-vsctl set Open_vSwitch . other_config:pmd-cpu-mask=0x0C # we have just one NUMA node
```

### Create OVS-DPDK Bridge and Ports
`dpdkvhostuser` is a predefined type. `vhost-user` is understood by Qemu 2.2 and above.
```bash
sudo ovs-vsctl add-br br0 -- set bridge br0 datapath_type=netdev
sudo ovs-vsctl add-port br0 vhost-user1 -- set Interface vhost-user1 type=dpdkvhostuser
sudo ovs-vsctl add-port br0 vhost-user2 -- set Interface vhost-user2 type=dpdkvhostuser
```

```console
root@machine:~# ovs-vsctl show
c3459670-39b8-43f7-bc57-569672ed79c6
    Bridge "br0"
        Port "br0"
            Interface "br0"
                type: internal
        Port "vhost-user2"
            Interface "vhost-user2"
                type: dpdkvhostuser
        Port "vhost-user1"
            Interface "vhost-user1"
                type: dpdkvhostuser
    ovs_version: "2.9.2"
```

### Binding Devices to DPDK
_We should check [whether the NIC is compatible](https://core.dpdk.org/supported/) with DPDK first. The [list](https://core.dpdk.org/supported/) on DPDK doesn't seem to have been updated e.g. the [documentation itself for newer versions](https://doc.dpdk.org/guides-18.11/nics/igb.html?highlight=i210#supported-chipsets-and-nics) states that the I210 is supported._

```bash
sudo modprobe vfio-pci
sudo dpdk-devbind --bind=vfio-pci eno1 # eno1 is the interface I want to bind to DPDK
```

`dpdk-devbind --status` can be used to check whether the NIC is now using the DPDK compatible driver.
```console
root@machine:~# dpdk-devbind --status

Network devices using DPDK-compatible driver
============================================
0000:00:19.0 'Ethernet Connection I217-V 153b' drv=vfio-pci unused=e1000e

Network devices using kernel driver
===================================
0000:02:00.0 'Killer E220x Gigabit Ethernet Controller e091' if=enp2s0 drv=alx unused=vfio-pci *Active*

    ...
```
## VMs Quick Start
[Download Debian 10 (buster)](https://cdimage.debian.org/cdimage/openstack/current/debian-10.0.1-20190708-openstack-amd64.qcow2) and change the password for `root` using `guestfish`. (Debian was an arbitrary choice here.)

Add anything to the images at this point. I downloaded `qperf` with all it's dependencies and added it:
```bash
PACKAGES="qperf iperf"
apt-get download $(apt-cache depends --recurse --no-recommends --no-suggests \
  --no-conflicts --no-breaks --no-replaces --no-enhances \
  --no-pre-depends ${PACKAGES} | grep "^\w")

virt-copy-in -a ./debian-10.0.0-openstack-amd64-2.qcow2  *.deb  /home/
```

`openssl passwd -1 <password>` can be used to generate a password entry, and this can be added to the guest image using:
```bash
guestfish --rw --add ../debian-10.0.0-openstack-amd64.qcow2 --mount /dev/sda1:/ vi /etc/shadow
```

And make 2 copies of the `debian-10.0.1-20190708-openstack-amd64.qcow2` file. We'll use it as our hard drives for guests.

#### Some resources to read
- File-sharing: `https://www.linux-kvm.org/page/9p_virtio`
- OVS+KVM: `https://docs.paloaltonetworks.com/vm-series/8-1/vm-series-deployment/set-up-the-vm-series-firewall-on-kvm/performance-tuning-of-the-vm-series-for-kvm/enable-open-vswitch-on-kvm.html#`
- Using `testpmd` to test DPDK Performance: `https://software.intel.com/en-us/articles/testing-dpdk-performance-and-features-with-testpmd`
- Vhost/Virtio in DPDK: `https://software.intel.com/en-us/articles/configuration-and-performance-of-vhost-virtio-in-data-plane-development-kit-dpdk`

### Launching the Guests
I launched the guests in two separate terminal windows (i.e., copy-paste instead of executing).
```console
root@machine:~# cat ./launch-os.sh 
# Launch OS1
qemu-system-x86_64 -m 1024 -smp 4 -cpu host -hda ./debian-10.0.0-openstack-amd64.qcow2 -boot c -enable-kvm -no-reboot -net none -nographic -chardev socket,id=char1,path=/run/openvswitch/vhost-user1 -netdev type=vhost-user,id=mynet1,chardev=char1,vhostforce -device virtio-net-pci,mac=00:00:00:00:00:01,netdev=mynet1 -object memory-backend-file,id=mem,size=1G,mem-path=/dev/hugepages,share=on -numa node,memdev=mem -mem-prealloc

# Launch OS2
qemu-system-x86_64 -m 1024 -smp 4 -cpu host -hda ./debian-10.0.0-openstack-amd64-2.qcow2 -boot c -enable-kvm -no-reboot -net none -nographic -chardev socket,id=char2,path=/run/openvswitch/vhost-user2 -netdev type=vhost-user,id=mynet2,chardev=char2,vhostforce -device virtio-net-pci,mac=00:00:00:00:00:02,netdev=mynet2 -object memory-backend-file,id=mem,size=1G,mem-path=/dev/hugepages,share=on -numa node,memdev=mem -mem-prealloc -fsdev local,security_model=passthrough,id=fsdev0,path=/tmp/share -device virtio-9p-pci,id=fs0,fsdev=fsdev0,mount_tag=hostshare
```

Godspeed!
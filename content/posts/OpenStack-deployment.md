---
title:  "First Steps With OpenStack"
date:   2019-04-26 21:22:37 +0200
categories: ["rants", "openstack", "ops"]
---

I recently tried to set up OpenStack on a single-node development environment using devstack. This blog is _not_ meant as a tutorial or getting started guide. However, I hope that Google will send someone crying tears of sorrow this way so he can benefit from my experience.

### Conclusion
What I concluded from the documentations is that we don't get something ready-to-go from the official docs. And you should consider yourself lucky if everything worked for you out-of-the-box.

## Setup Ideas
- Start from a clean installation of Ubuntu 18.04.
- The `local.conf` goes into the top-level directory of the `devstack` checkout.

### Setup
My setup already provided the DNS and DHCP servers as illustrated below.
```
        (DNS Server)              (DHCP Server)
             |                          |
             |                          |
             +------------+-------------+
                          |
                          |
                        (OpenStack)
```

So, my `local.conf` looks like the following:
```ini
[[local|localrc]]
ADMIN_PASSWORD=safeandsecure
DATABASE_PASSWORD=$ADMIN_PASSWORD
RABBIT_PASSWORD=$ADMIN_PASSWORD
SERVICE_PASSWORD=$ADMIN_PASSWORD

HOST_IP=<HOST_IP>

FLOATING_RANGE=<HOST_IP>/24
Q_FLOATING_ALLOCATION_POOL=start=<HOST_IP>.150,end=<HOST_IP>.200
FIXED_RANGE=10.11.12.0/24
FIXED_NETWORK_SIZE=256
PUBLIC_INTERFACE=eno1
PUBLIC_NETWORK_GATEWAY=<HOST_IP>.1

LOGFILE=$DEST/logs/stack.sh.log
LOGDAYS=2

SWIFT_HASH=66a3d6b56c1f479c8b4e70ab5c2000f5
SWIFT_REPLICAS=1
SWIFT_DATA_DIR=$DEST/data
```
(The `<HOST_IP>.XXX` numbers are obviously replacing the last part of the IP address.)

What I'm telling OpenStack is that I ...
- already have a Gateway in the network, use it!
- Already know what the IP allocation pool looks like

### Next
With that, hopefully you can go do OpenStack stuff and not have to worry about networking being the biggest issue in your life. Good luck!!!

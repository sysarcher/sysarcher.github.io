---
title:  "Some nice Hacks"
date:   2021-02-24 21:22:37 +0200
categories: ["lifehack", "vpn", "linux"]
---

_Linux only_

_DISCLAIMER: THE FOLLOWING CAN LEAD TO CREATING SECURITY HOLES IN THE VPN-PROTECTED NETWORK... BE VERY CAREFUL. MAKE SURE YOU KNOW WHAT YOU'RE DOING. IF YOU DON'T UNDERSTAND WHAT YOU'RE DOING, **DO NOT PROCEED**_

VPNs are a pain in the neck. I managed to find a way to have VPN traffic limited to some sites instead of routing everything through your corporate network.

Routing everything through corporate network is also a cause of load on the company's servers. Imagine a ton of people watching Youtube over VPN. Now, I'm talking about traditional VPN here, not p2p stuff.

## Use `vpn-slice`

[`vpn-slice`](https://github.com/dlenski/vpn-slice) is an awesome tool that allows you to use the VPN for only a certain few websites. I used `vpn-slice` along with `openconnect`.

Installation is pretty straightforward if you follow the documentation. Just make sure the `root` user sees the binary. I installed `pyenv` seperately for the `root` user and configured the global python env to be 3.9.2 (`pyenv global 3.9.2`).

That's it. Now install `vpn-slice`:

```console
$ pyenv global 3.9.2  # or whatever version you want
$ pip install --upgrade pip
$ pip install dnspython  # recommended in project README
$ pip install vpn-slice
```

## Usage with `openconnect`
```bash
# Source: https://docs.microsoft.com/en-us/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide#skype-for-business-online-and-microsoft-teams
MSFT="teams.microsoft.com login.microsoftonline.com microsoftstreams.com 13.107.64.0/18, 52.112.0.0/14, 52.120.0.0/14"
MYCOMPANY=""  # Your company's domains, IP addr etc.

openconnect \
  -c /home/$USER/.cert/CERT.crt \
  -k /home/$USER/.cert/private.key --key-password-from-fsid \
  -s "vpn-slice $MSFT $MYCOMPANY" \
  vpn.company.com
```

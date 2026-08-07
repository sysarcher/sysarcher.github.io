---
title:  "Getting Started with Clojure[script] Behind Corporate Proxy"
date:   2019-10-14 21:22:37 +0200
categories: ["rants", "architecture", "DDD"]
---

So on my Clojurescript journey, the first roadblock I hit was corporate proxy. I don't know why Java, maven, clojure (everybody?) doesn't respect the environment variables but this is a real pain.

### Getting started
Clojurescript is written in Clojure which requires Java. So we need to get all three up and running.

#### Java
To get Java JDK and JRE, run:
```console
$ sudo apt install openjdk-11-jre
$ sudo apt install openjdk-11-jdk
```

For proxy settings, edit `/etc/java-11-openjdk/net.properties`.

Example for `http` proxy in the file:
```ini
http.proxyHost="proxy-addr.company.com"
http.proxyPort=8080
http.nonProxyHosts=localhost|127.*|[::1]
```

#### Maven
This was the hardest to figure out. And it's crazy (coming from a newbie perspective) that maven doesn't make it easy to just reuse Java or System proxies or respect the `http_proxy` variable. Madness. Moreover, you _need_ to create the configuration file at `~/.m2/settings.xml` with the following contents:

```xml
<settings>
<proxies>
    <proxy>
        <id>httpproxy</id>
        <active>true</active>
        <protocol>http</protocol>
        <host>proxy-addr.company.com</host>
        <port>8080</port>
        <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
    </proxy>
    <proxy>
        <id>httpsproxy</id>
        <active>true</active>
        <protocol>https</protocol>
        <host>proxy-addr.company.com</host>
        <port>8080</port>
        <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
    </proxy>
</proxies>
</settings>
```

#### Clojure
_make sure `rlwrap` is installed (`sudo apt install rlwrap`)_

Download and install clojure using the following commands:

```console
$ curl -O https://download.clojure.org/install/linux-install-1.10.1.469.sh  # This is the current version as of writing
$ chmod +x linux-install-1.10.1.469.sh
$ sudo ./linux-install-1.10.1.469.sh
```

Using the command `clj` launches the repl. Thankfully!

#### Leiningen
Follow the steps on https://leiningen.org/

```console
curl -O "https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein"
chmod a+x lein
mv lein ~/bin/
```

### Create a Test Project
To test `lein` and `figwheel`+`reagent`:

```console
$ lein new figwheel some-name -- --reagent
```

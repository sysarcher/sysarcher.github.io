---
title:  "Build, Test and Deploy are Developer Concerns"
date:   2018-10-01 21:22:37 +0200
categories: ["rants", "agile", "scrum"]
---

All too often our repos here do not (actually, none) contain the definition of what code compilation and build look like. They exist in separate scripts hosted somewhere on the "Integration Team"'s servers and are very inflexible!

Travis CI and services like it, have shown us that the steps to build/test/deploy code should also exist in the code repo. I'm gonna try to find some time to explore the possibility of having a Travis CI style service for in-house repositories. I want to mandate the existance of a `Dockerfile` in every repository so we can at least tell Jenkins to go do a `docker build .` in every repo in the list. But this is only temporary. The long-term goal is to definitely be able to hook into Jenkins CI from the Github web interface (like Travis CI in the open source world.)


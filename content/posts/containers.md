---
title:  "An intro from containers!"
date:   2018-09-27 20:05:37 +0200
categories: ["rants"]
---
I recently got the chance to explain what containers are to colleagues of mine. I could've chosen the normal path of showing off `docker run` commands, how to create a `Dockerfile` and then go about creating a Docker container. I understand that this was the common intro to containers for most people but for me, it makes Linux containers somewhat holy. I instead did a session on writing some golang code to explain what containers really are. I used `asciinema` to record the whole session and replay it at a fast speed which I screen-recorded using Kazam on Ubuntu. The presentation on the bottom-right of the screen was done using `mdp`

Behold the vid: [https://youtu.be/NK1z3095YvM](https://youtu.be/NK1z3095YvM)

... and the code: [https://github.com/shrmrf/container-demo](https://github.com/shrmrf/container-demo)

Although the first thing you'll note is that I didn't write a proper test. I just find it more pleasurable to go ahead with the code but with a specification at the top. While presenting, I was arguing where the `syscall.SysProcAttr` configurations could be placed and forgot to actually call the `child()` function. This caused me to move into the wrong direction and I was about to reel off under pressure (remember, this was a live session). But luckily I figured out what I was doing wrong (I had actually practised the code the day before, so that might've helped.)

Its a 7 minute video, but I think it gives you a nice idea of what goes behind-the-scenes in docker's magic.

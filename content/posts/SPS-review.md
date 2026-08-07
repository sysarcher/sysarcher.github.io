---
title:  "Answering Questions on SPS 2019 Demo"
date:   2019-12-01 21:22:37 +0200
categories: ["rants", "architecture", "SPS"]
---

SPS Nuremberg is one of the largest gatherings of the Industry. This year was no different.

I was part of a team that presented the concept of OT/IT consolidation. I got quite a few comments and questions about the [demo video (in Urdu here)](https://www.facebook.com/ziakhan/videos/10156612828352623/). So here's a shot at answering some of the questions I got forwarded:

The demo was (in oversimplified terms) showing PLC compute moved to software which can be orchestrated using Kubernetes.

**Q/A**

- _Nice move.  But how sensor data is being processed without PLC or a microcontroller?_

There are "dumb" IO devices connected over Profinet in this case (but it can really be any fieldbus e.g. Ethercat etc.)

Some people had a comment about ADCs being involved. YES, but we need to think at a higher level in this case. Analog and Digital IOs are obviously involved under-the-hood.


- _So what is difference between an arduino microcontroller and program able logical controller_

This is a strange question. Arduino is not a microcontroller, it's a prototyping platform (and a company as well.) This prototyping platform _has_ a microcontroller. A PLC is a digital computer made for the industry. Follows many industrial IEC standards. It is a part of many things. For our demo, we were using ADAM PLCs from Advantech.

Arduino can also be programmed to become a PLC (see the OpenPLC project: [https://www.openplcproject.com/](https://www.openplcproject.com/))

- _Ok good step so what precautions u take if ur factory text file or source code get hack??_

If you get hacked, "precautions" are irrelevant. The word precaution means that it ought to prevent the hack. I'm assuming this was the question as well. Although this was not a security demo, but k8s brings with it good security practices (certs, https etc.). "Hack" is too open-ended of a word.

Security practices are a whole different topic. Perhaps not relevant for the discussion here.

- _So can we apply machine learning and Ai codes in PLC??_

I would read my answer above and conclude: NO. PLCs are meant for other things, Google is your friend!

- _We get machine learning codes in Python mostly some standard c language so what u suggest??_

Great attempt at moving off-topic! (Always one person in the team!!)

- _Using structure text and block diagrams and ladder diagrams??_

Yup

- _One more thing can u tell me PLC have a capability of processing i mean controller and processor r 2 different things so can u guide me ?_

They are computers in the end! The scope of their work is a bit limited to their application. Check out the OpenPLC project I linked to above.

- _No. That is why I am designing machines and control systems using hybrid model. Means using PLCs, Microcontrollers and Computers to accomplish all kind of customization which include AI and custom GUIs in python and VueJs_

Interesting... But we should not convolute so many things in one sentence. Everything you mentioned has its place. And they work together. We ought to avoid the use of the words "Hybrid Model" which sounds like formalism.

- _Recently I have designed Pakistan's first industrial Artificially intelligent sorting robotic conveyor using this hybrid model._

Tall claims!! I saw the video and one comment for now is that it might not meet some safety standards we have in the EU and US. Best of luck my friend!! Bring us laurels.

Also, I would tone down on Artificial intelligence and use specifics when talking to more technical folk (e.g. Computer Vision, OpenVINO, Inference, Learning etc.)

- _So its coslty???_

Yes, it's supposed to run for many years so, there's a lot of hardening.


**Conclusion**

I'm surprised by the interest people showed in the project. It's still a concept and we want to work with the Industry leaders to bring about more mature products.
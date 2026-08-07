---
title:  "RegEx Search for Youtube Ads"
date:   2021-03-30 21:22:37 +0200
categories: ["lifehack", "pihole", "regex"]
---
_Strategy:_ What I'm doing is unblock/whitelist any domain that causes video playback issues.

_(Credits for the original list @beshrkayali)_

I have started to add to a blacklist here:

<script src="https://gist.github.com/sysarcher/aea195d78f6ed5e3ca815a999f8707a7.js"></script>

I also created a regex which I'm experimenting with: `^r[0-9]{1,2}-{3}sn-h0je[a-z0-9]*.googlevideo.com`

I tested this RegEx on [regex101.com](https://regex101.com) with the following data:

```
r4---sn-h0jeener.googlevideo.com
r4---sn-h0jeener.googlevideo.com
r4---sn-h0jeln7l.googlevideo.com
r1---sn-h0jelne7.googlevideo.com
r2---sn-h0jeln7e.googlevideo.com
r1---sn-h0jeln7e.googlevideo.com
r3---sn-h0jeenle.googlevideo.com
r1---sn-h0jeenle.googlevideo.com
r5---sn-h0jeened.googlevideo.com
r1---sn-h0jeenek.googlevideo.com
r5---sn-h0jeln7l.googlevideo.com
r2---sn-h0jeenle.googlevideo.com
r1---sn-h0jeln7e.googlevideo.com
r5---sn-h0jeen76.googlevideo.com
r5---sn-h0jeln7y.googlevideo.com
r5---sn-h0jeenek.googlevideo.com
r5---sn-h0jeened.googlevideo.com
r5---sn-h0jelne7.googlevideo.com
r1---sn-h0jeener.googlevideo.com
r4---sn-h0jeln7l.googlevideo.com
r1---sn-h0jelne7.googlevideo.com
r4---sn-h0jeln7r.googlevideo.com
r2---sn-h0jeenek.googlevideo.com
r6---sn-h0jeen76.googlevideo.com
r3---sn-h0jeener.googlevideo.com
r1---sn-h0jelne7.googlevideo.com
```

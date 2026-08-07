---
title:  "Remapping Keys"
date:   2020-07-15 21:22:37 +0200
categories: ["rants"]
---

I use Vim a lot. And if you're a productive user of Vim, you will definitely appreciate the following remaps:

- ESC: I have remapped the Escape key to CAPSLOCK. Who uses CapsLock? ESC on the other hand is a Vim user's go-to reflex. So keep it close-by.
- ESC+HJKL: For navigation. Why would you use muscles to move over to the arrow keys when you have them under your fingers.

### How-to
[`xmodmap`](http://manpages.ubuntu.com/manpages/trusty/man1/xmodmap.1.html) can be used to modify these key settings. But I think it will only work for X-sessions.

I found [`dconf/org/gnome/desktop/input-sources/xkb-options`](https://wiki.gnome.org/Projects/dconf) to be a much more solid solution.

Under `xkb-options` you can put a "Custom value" like: `['caps:swapescape']` (note: syntax is important!!)

#### Windows Note
By far the best and most reliable key remapper on Windows is [sharpkeys (`randyrants/sharpkeys`)](https://github.com/randyrants/sharpkeys).
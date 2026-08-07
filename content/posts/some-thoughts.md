---
title:  "Right after I joined this new job.."
date:   2018-10-01 21:22:37 +0200
categories: ["rants", "agile", "scrum"]
---


_Do I scrum-master (is that a verb?) automagically agile?_

Many people talk about cross-functional teams, developers getting hit by buses (poor us!) and CI/CD. I am not one to disagree here but I think these other tools are important as well as using the tools available to best effect.

### Git
I am having to use Gerrit with a Gitweb frontend all maintained by a local team on servers somewhere upstairs. You want a new repo? Please write an email to this guy.. Private repository? No.

The first thing I did when I joined was to set up my own Gitlab instance. This enabled me to do the best practices again (check-in code daily, write markdown README.md files etc. etc. Yes, our repo doesn't understand README.md) We're now moving to Github Enterprise which is definitely awesome.

### Slack
Skype for business should be banned! I have missed slack since day 1. Slack let you create channels for different stuff going on like `#github` and `#pull-requests` etc. It was a place where different people from different teams could `#discuss` `#everything`. This revolution of hashtags somehow missed out on people here. No more.

Mattermost and RocketChat are great alternatives to Slack. I set up Mattermost for my team and that's where we plan our Kicker tournaments. (I don't like the `~` that RocketChat uses for it's channels.) I have not tried Zulip yet but one of my cousins works on it.. It looks really nice too.

The org however still runs on Email and Skype for business. Something needs to change! Perhaps Microsoft Teams is a good idea?

### RTC
RTC stands for Rational Team Concert (Whatever That Means). Its the crappiest tool I've ever had to deal with but it's mandated across the organization. It's meant to be another tool from IBM that is your enterprise agile management system with strange compliance certifications.

I'd rather use Jira or something. I have a Trello-like server (wekan) which I use as a Kanban board. Otherwise, I'm stuck with RTC.

Github has cool project boards. I should probably start using that since we _are_ moving to Github anyways.

### CI and CD
I am a huge fan of having a `Jenkinsfile`, `.travis.yml` file or something of this sort as part of your repository. Why we don't have this now is beyond me. This is something I'm working on evangelising:

Every repo must contain:
- `Jenkinsfile` (even if it's empty!)
- `Dockerfile` (to at least build the app)

I'm also a big fan of having your CI/CD servers automated. Working on this, one-thing, one best-practice at a time!

### Conclusion
This is all for today. But I have noticed that your enthusiasm for change is often never reciprocated. Keep chugging! I have been able to achieve some of the things I mentioned above but only after loads of frustration. I still see people having long-winded discussions on email threads though. Bad habits aren't easily lost.

Skunkworks are healthy. I'm a proud revolutionary (for the better) from the underground. I hope I'll look back at these frustrations and be proud :) Get people around you that are as enthusiastic for change and march forth!

# Leonida Trophy Guide — GTA VI Platinum Roadmap & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Febri44/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Febri44/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

The best GTA 6 trophy guide and tracker for all **55 PS5 trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze (28 hidden, 27 visible). An entry for [make.fun's gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- **A guide for every trophy, in plain words** — each with a cited source beside it (PowerPyx, Push Square, Planet GTA 6, GTA Zone, U7BUY). The guide was re-verified against the released game (19 Nov 2026): three trophies that had no confirmed method at launch are now confirmed with steps — In The Beginning… (Ocean View Rooftop Bar, Apple Martini), Capital Offense (the blue Banshee showroom smash-out) and The Truth Is Out There (the Kelly County UFO encounter). The two still unconfirmed (Bad Luck, I Guess; Ten Pin) say so honestly instead of inventing a location or a step, with the best lead each guide offers.
- **Platinum roadmap in three stages** — play the story, grind the 100% checklist, then strangers, side chains and clean-up. About 200 hours, difficulty 4/10 (PowerPyx).
- **The one missable trophy, flagged loud** — Positive Mental Attitude: meditate with Lucia on the balcony at Jason's house in Chapter 1, the morning after “Down to Earth”. Gone after Chapter 1, and there is no mission replay.
- **Tracker** — tick trophies off (saved in localStorage), with export/import of your progress as JSON.
- **Filters** — story, missable, collectibles, activities, crime, misc, method-unconfirmed, by grade, by search, earned only / not yet earned, and sort by roadmap order, name or grade.
- **Next up** — the first trophy you have not earned yet, in roadmap order, with its guide one click away (hidden story trophies stay hidden while spoiler mode is on).
- **Spoiler setting** — hidden (story) trophies stay hidden until you earn them, so the guide never spoils the campaign.

## Run it

Open `app/index.html` in desktop Chrome. It is fully offline — no network requests, no images, no Rockstar artwork or logos; the look is its own (Vice City sunset palette, pure CSS).

```sh
# serve locally (optional)
node serve.ts   # then open http://localhost:8080

# build the hand-in (copies app/ + screenshots/ to out/ and writes dossier.json)
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

- Official trophy list (names, descriptions, grades, hidden flags): [Planet GTA 6 — GTA 6 Trophies](https://www.planetgta6.com/en/gta-6-trophies/), cross-checked against Exophase and PSNProfiles.
- Methods and roadmap: [PowerPyx — GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/).
- 100% completion thresholds: [Push Square — GTA 6 Trophy Guide & Roadmap](https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap).

Unofficial fan guide. Not affiliated with Rockstar Games, Take-Two Interactive or Sony Interactive Entertainment.

# SwimTrack

Plan and log swim workouts fast. See simple trends that help you train smarter. Works offline; syncs when online.

## What it is
A mobile app (React Native + Expo) for swimmers who want zero-friction planning and reliable logging on the pool deck.

## Why
Typing sets in notes is slow. Generic fitness apps don’t understand intervals, reps, or swim pacing. SwimTrack is built for real swim sessions.

## Key features (v0.1)
- **Quick session logger** — date, pool type, distance, duration, RPE, notes.
- **Set builder** — reps × distance, interval/send-off, stroke, equipment, targets.
- **Templates** — save blocks or full sessions; reuse with one tap.
- **Weekly planner** — simple A/B routines, mark planned vs logged.
- **Progress** — weekly totals, 4-week rolling distance, streaks.
- **Pace tools** — pace per 50/100, send-off helper, SCY/SCM/LCM conversions.
- **Offline-first** — everything works without internet.
- **Export** — share your sessions as CSV.

## Who it’s for
- Swimmers training solo who want speed and clarity.
- Coaches or friends planning simple weekly routines.
- Anyone who values offline reliability on deck.

## How it works (at a glance)
1. Build a session from reusable blocks or templates.  
2. Log reps quickly with an interval keypad and copy/fill-down.  
3. Check weekly totals and a simple trend to adjust next week’s plan.  
4. Export if you need a backup or to share.

## Screens (v0.1)
- **Home** — today’s plan + quick log button.  
- **Plan** — 7-day grid with routine A/B.  
- **Build** — session header + blocks + reps.  
- **Pool Mode** — big timer, large tap targets, high contrast.  
- **Progress** — weekly totals and trend.  
- **Tools** — pace + conversions.  
- **Settings** — export / delete my data.

## Roadmap
- v0.2: test sets (10×100/CSS), zones, wellness + load.  
- v1.0: season planner, small polish.

## Install (dev)
```bash
git clone https://github.com/Ismaeldlr/SwimTrack.git && cd SwimTrack
npm install
npx expo start
# press i for iOS or a for Android

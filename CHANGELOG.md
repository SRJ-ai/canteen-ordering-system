# Changelog

## 2026-08-19 — Steel & Marigold redesign

Full visual redesign of the app, replacing the previous dark-slate + orange-gradient
glassmorphism look (a generic AI-SaaS aesthetic unrelated to the product) with **Steel &
Marigold** — a warm South Indian campus-canteen system built specifically for GPREC Food
Court. See [`DESIGN.md`](./DESIGN.md) for the full token, type, and component reference.

### What changed
- New token foundation: warm off-white ground, marigold primary, chutney red for
  urgency/destructive, banana-leaf green reserved for veg marks and ready states
  (`src/app/globals.css`, `tailwind.config.ts`).
- New type system: Bricolage Grotesque (display), Hanken Grotesk (body), JetBrains Mono
  (every price, order token, timer, and KPI number) (`src/app/layout.tsx`).
- Landing page (`src/app/page.tsx`) rebuilt from scratch as an asymmetric-split, real-food
  Persuade page — real South Indian food photography, mono-numeral stat ribbon, a single
  department marquee, no glassmorphism, no gradient text.
- Every customer surface restyled: header, menu browsing, item customization, cart
  drawer/page, checkout, order tracker, floating active-order tracker, table QR landing,
  payment sandbox modal.
- Every admin surface restyled: dashboard, live orders, menu editor, table/QR manager.
- Kitchen KDS restyled as the one deliberately dark surface (warm near-black ground, high
  contrast, large mono tokens/timers) — logic, timers, and audio untouched.
- Auth pages (login/signup) restyled, demo-login buttons kept prominent with palette-
  consistent role colors.
- Demo portal switcher dock restyled to match.

### What did not change
- All business logic, server actions, data fetching, Supabase queries, cart/session
  state, FCFS kitchen ordering, and analytics-relevant handlers are unchanged. This was a
  restyle, not a rewrite.

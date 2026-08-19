---
version: 1.0.0
name: steel-and-marigold
description: GPREC Food Court's design system — a warm South Indian campus-canteen world built for a real ordering, kitchen, and admin product. Warm off-white "steel-tray" ground, one committed marigold primary, chutney red for heat and alerts, banana-leaf green reserved for veg marks and ready states. Bricolage Grotesque display, Hanken Grotesk body, JetBrains Mono for every price, token, and timer. Zero glassmorphism, zero gradient text.
---

# DESIGN.md — Steel & Marigold

This replaces the project's previous "Supabase Design System" reference, which was a
generic dark-slate + orange-gradient SaaS look with no connection to the product. GPREC
Food Court is a canteen ordering system — the redesign leads with real food, real prices,
and a menu-board sensibility instead of dashboard chrome.

## Why this system

- **Mode split.** The landing page (`/`) is Persuade — it has to make someone hungry and
  confident enough to scan a table. Every other surface (menu, cart, checkout, orders,
  admin, kitchen) is Operate — clarity and speed beat decoration.
- **One deliberately dark surface.** The Kitchen KDS (`/kitchen`) is a back-of-house wall
  display, glanced at from a few feet away between orders. It gets a warm near-black
  ground and oversized mono numerals. Every other surface stays on the warm light ground.
  This is intentional, not a theme-flip bug — see Section "Kitchen KDS" below.

## Tokens

Defined in `src/app/globals.css` as HSL CSS variables (shadcn-compatible) and exposed as
Tailwind utilities in `tailwind.config.ts`.

| Role | Token | Hex | Usage |
|---|---|---|---|
| Ground | `--background` / `bg-background` | `#FAF6EF` | Page ground on every light surface |
| Ink | `--foreground` / `text-ink` | `#1A1613` | Primary text, footers, KDS ground |
| Card | `--card` / `bg-card`, `.tray-card` | `#FFFDF9` | Panels, menu cards, dialogs |
| Primary | `--primary` / `bg-primary`, `.btn-marigold` | `#F5A312` | The one signature accent — CTAs, active states, prices |
| Primary deep | `--primary-deep` | `#E1830B` | Hover/pressed marigold, marigold-on-light text |
| Primary soft | `--primary-soft` | `#FBC13F` | Marigold text on dark (KDS, footer, ink bands) |
| Chutney | `text-chutney` / `bg-chutney` | `#D6402A` | Urgency, destructive, cancelled, overdue KDS tickets |
| Leaf | `text-leaf` / `bg-leaf` | `#2E7D32` | **Veg mark only**, and "ready" completion states |
| Steel | `text-steel` | `#7A736C` | Tertiary icons/text, neutral KDS lane |
| Muted | `text-muted-foreground` | `#5C534A` | Secondary copy, AA on the warm ground |
| Border | `border-border` | `#E4DACA` | Hairlines everywhere |

Radius is fixed at `--radius: 0.625rem` (10px). One scale: `rounded-lg` / `rounded-xl` /
`rounded-2xl` only — never `rounded-3xl`, never mixed with pill buttons.

## Type

- **Display** (`font-display`): Bricolage Grotesque — all headings, prices' labels, brand
  wordmark. `font-extrabold` / `font-bold`, `tracking-tight`.
- **Body** (`font-sans`, default): Hanken Grotesk.
- **Numerals** (`.numeric` or `font-mono`): JetBrains Mono, tabular figures. Applied to
  every price (`₹45`), order token, table number, countdown timer, and KPI stat. This is
  the detail that makes the canteen feel like a real point-of-sale system rather than a
  marketing mockup.

## Components

- Buttons: shadcn `<Button>`, now token-driven — `default` variant is marigold, `outline`
  is warm card + ink text, `ghost` for nav. `.btn-marigold` is available for raw markup
  that doesn't use the component.
- Cards: `.tray-card` (hairline + soft warm shadow) or the token-driven shadcn `<Card>`.
  Add `.tray-card-hover` for interactive items (menu cards, order history rows).
- Veg / non-veg marks: `.veg-indicator` (green square + dot, FSSAI convention) and
  `.nonveg-indicator` (red square + triangle). Used on every dish, cart line, and receipt.
- Status color mapping (orders, KDS, admin): pending/new = steel or ink, cooking = marigold,
  ready/completed = leaf, cancelled/overdue = chutney.

## Imagery

Real South Indian food photography (Unsplash, license-clear), not div-based fake UI. The
landing page and menu preview use a verified set: idli-vada-sambar, masala dosa, paneer
butter masala, paneer tikka, samosa, pav bhaji. See `src/app/page.tsx` for the URL pattern.

## Kitchen KDS (the one dark surface)

`src/app/kitchen/` and `src/components/kitchen/KitchenKDSClient.tsx` run on a warm
near-black ground (`bg-ink`, `#17130F`-class) with cream text, for wall-mounted, glance-
from-a-distance legibility. Lane colors: New = steel/neutral, Cooking = marigold,
Ready = leaf, overdue/urgent = chutney. Token numbers, timers, and table numbers are large
and mono. No glassmorphism even here — solid panels, hairline borders.

## Hard bans (carried over from the redesign, keep enforcing on new work)

- No glassmorphism (`backdrop-blur` on cards, frosted panels).
- No gradient text or large gradient fills.
- No em dash or en dash in visible copy.
- No `rounded-3xl`; no mixed corner-radius scales.
- No emerald/teal, orange/amber, or dark `slate-*` tokens — those belonged to the old
  Supabase-style world and have been fully removed.

## Reference implementations

- `src/app/page.tsx` — landing (Persuade), the canonical example of the full system.
- `src/components/customer/CustomerHeader.tsx` — shared customer nav.
- `src/components/kitchen/KitchenKDSClient.tsx` — the dark KDS surface.
- `src/app/globals.css` + `tailwind.config.ts` — token source of truth.

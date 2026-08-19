'use client';

/*
  ============================================================
  STEEL & MARIGOLD — Landing (Persuade)
  ------------------------------------------------------------
  THESIS: A campus canteen menu-board made digital. Refuses the
    dark-glass SaaS hero; leads with real food and real prices.
  OWN-WORLD: Warm steel-tray ground, one marigold accent, chutney
    red for heat, banana-leaf green for veg. Bricolage display,
    Hanken body, JetBrains mono for every price/token/timer.
  STORY: Student/faculty sees hot food + a table QR path, believes
    it is fast and real, scans a table or opens the menu.
  FIRST VIEWPORT: Split hero. Left ink headline + two CTAs; right a
    bright idli-vada-sambar plate framed as a steel tray. Primary
    action (Scan Table 01) top-left, visible without scroll.
  FORM: Menu board / steel tiffin tray. Zero glassmorphism.
  ============================================================
*/

import React from 'react';
import Link from 'next/link';
import {
  QrCode,
  ChefHat,
  ShieldCheck,
  GraduationCap,
  Volume2,
  Zap,
  Star,
  ArrowRight,
  Soup,
  Clock,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const IMG = {
  hero: '1630383249896-424e482df921', // idli, vada, sambar, chutneys
  dosa: '1668236543090-82eba5ee5976', // masala dosa
  idli: '1589301760014-d929f3979dbc', // idli on banana leaf
  paneer: '1631452180519-c014fe946bc7', // paneer butter masala
  tikka: '1567188040759-fb8a883dc6d8', // paneer tikka
  samosa: '1601050690597-df0568f70950', // samosa
  pav: '1596797038530-2c107229654b', // pav bhaji
};

const MENU_PREVIEW = [
  { name: 'Masala Dosa', price: 60, img: IMG.dosa, tag: 'Tiffins', note: 'Crisp, potato masala, 3 chutneys' },
  { name: 'Idli Vada Combo', price: 45, img: IMG.hero, tag: 'Breakfast', note: 'Two idli, one vada, hot sambar' },
  { name: 'Paneer Butter Masala', price: 110, img: IMG.paneer, tag: 'Meals', note: 'Copper kadai, jeera rice, papad' },
  { name: 'Paneer Tikka', price: 120, img: IMG.tikka, tag: 'Grill', note: 'Char-grilled, sizzler plate' },
  { name: 'Samosa (2 pc)', price: 30, img: IMG.samosa, tag: 'Snacks', note: 'Fresh fried, mint chutney' },
  { name: 'Pav Bhaji', price: 70, img: IMG.pav, tag: 'Chaat', note: 'Buttered pav, spiced bhaji' },
];

const DEPARTMENTS = [
  'Computer Science', 'Electronics & Communication', 'Electrical & Electronics',
  'Mechanical', 'Civil', 'Faculty Lounge', 'Central Kitchen',
  'Campus Bakery', 'Science & Humanities', 'Student Council',
];

const CAPABILITIES = [
  { icon: QrCode, title: 'Table QR sessions', body: 'Scan the tent card to bind to Table 01 to 10. No app install, works in any phone browser.' },
  { icon: GraduationCap, title: 'Faculty fast-track', body: 'A priority lane lets staff jump the general queue during short lecture breaks.' },
  { icon: ChefHat, title: 'FCFS kitchen board', body: 'A strict first-come-first-serve Kanban with wait timers and audio chimes, built for a wall tablet.' },
  { icon: Zap, title: 'UPI in seconds', body: 'A sandbox UPI QR with a five-minute countdown and one-tap success or decline.' },
  { icon: Volume2, title: 'Voice pickup calls', body: 'The board speaks ready token numbers aloud, so nobody crowds the counter.' },
  { icon: ShieldCheck, title: 'Admin price controls', body: 'Add dishes, flip out-of-stock, and audit cancellations from one hub in real time.' },
];

const STEPS = [
  { verb: 'Scan', body: 'Point your camera at the QR tent card on any food-court table.' },
  { verb: 'Order & pay', body: 'Add toppings, pick faculty priority if staff, settle over UPI.' },
  { verb: 'Kitchen cooks', body: 'Your token joins the FCFS board and chefs cook in strict order.' },
  { verb: 'Pickup call', body: 'The board calls your number aloud. Collect a hot plate, rate it.' },
];

const TESTIMONIALS = [
  {
    quote: 'The faculty fast-track lets our professors eat a fresh hot meal between lectures without losing prep time.',
    author: 'Dr. R. K. Sharma', role: 'Head of CSE',
  },
  {
    quote: 'Ordering from Table 04 with UPI and watching the live prep timer changed our whole lunch break.',
    author: 'Sneha Reddy', role: 'Final Year, ECE',
  },
  {
    quote: 'The voice-calling board ended the shouting at the counter and keeps every cooking lane in order.',
    author: 'Chef Murthy', role: 'Central Kitchen',
  },
];

function VegDot() {
  return (
    <span className="veg-indicator" aria-label="Vegetarian" title="Vegetarian">
      <span className="veg-indicator-dot" />
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* NAV — single line, solid warm-white, hairline */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Soup className="h-5 w-5" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-[17px] font-extrabold tracking-tight text-ink">
                GPREC Food Court
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Kurnool Campus
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/menu" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="font-semibold text-ink">Menu</Button>
            </Link>
            <Link href="/kitchen" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="font-semibold text-ink">Kitchen</Button>
            </Link>
            <Link href="/admin/dashboard" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm" className="font-semibold text-ink">Admin</Button>
            </Link>
            <Link href="/t/qr_tbl_01_8fK29xQm7P7wL9a1">
              <Button size="sm" className="btn-marigold h-9 px-4 text-sm">
                <QrCode className="mr-1.5 h-4 w-4" /> Scan a table
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO — asymmetric split */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-16 lg:pb-20">
          <div className="max-w-xl">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-chutney">
              G. Pulla Reddy Engineering College
            </p>
            <h1 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem]">
              Hot campus meals, ordered from your table.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Scan the tent card, pay by UPI, and track your token on the live kitchen board. Ready in under seven minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/t/qr_tbl_01_8fK29xQm7P7wL9a1">
                <Button size="lg" className="btn-marigold h-12 px-6 text-base">
                  <QrCode className="mr-2 h-5 w-5" /> Scan Table 01
                </Button>
              </Link>
              <Link href="/menu">
                <Button size="lg" variant="outline" className="h-12 border-ink/20 bg-card px-5 text-base font-semibold text-ink hover:bg-secondary">
                  See today&rsquo;s menu <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Steel-tray framed hero plate */}
          <div className="relative">
            <div className="tray-card overflow-hidden p-2.5">
              <img
                src={U(IMG.hero, 900)}
                alt="Idli, medu vada and sambar with fresh chutneys on a plate"
                width={900}
                height={640}
                loading="eager"
                className="aspect-[7/5] w-full rounded-md object-cover"
              />
            </div>
            {/* Honest product content, not a fake screenshot */}
            <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg sm:-left-6">
              <VegDot />
              <div className="leading-tight">
                <p className="font-display text-sm font-bold text-ink">Idli Vada Combo</p>
                <p className="text-[11px] text-muted-foreground">Table 01 &middot; ready in <span className="numeric font-semibold text-leaf">6:12</span></p>
              </div>
              <span className="numeric ml-1 text-lg font-bold text-ink">₹45</span>
            </div>
          </div>
        </section>

        {/* STAT RIBBON — plain, hairline-divided, mono numerals */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border sm:grid-cols-4">
            {[
              { n: '< 7 min', l: 'Average prep time' },
              { n: '10', l: 'Live QR tables' },
              { n: '1,200+', l: 'Meals served daily' },
              { n: '₹20', l: 'Filter coffee, still' },
            ].map((s, i) => (
              <div key={i} className="px-5 py-6 text-center sm:py-7">
                <div className="numeric text-2xl font-extrabold text-ink sm:text-3xl">{s.n}</div>
                <div className="mt-1 text-[12px] font-medium text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* DEPARTMENTS — single marquee */}
        <section aria-label="Departments served" className="overflow-hidden py-6">
          <p className="mb-3 text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Serving every department on campus
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max items-center gap-10 whitespace-nowrap animate-marquee motion-reduce:animate-none">
              {[...DEPARTMENTS, ...DEPARTMENTS].map((d, i) => (
                <span key={i} className="font-display text-lg font-semibold text-ink/45">{d}</span>
              ))}
            </div>
          </div>
        </section>

        {/* MENU PREVIEW — the appetite section, bento rhythm */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                On the board today
              </h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Fresh South Indian tiffins, hot meals and chaat. Priced for students, cooked to order.
              </p>
            </div>
            <Link href="/menu">
              <Button variant="outline" className="border-ink/20 bg-card font-semibold text-ink hover:bg-secondary">
                Full menu <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MENU_PREVIEW.map((item, i) => (
              <article
                key={item.name}
                className={`tray-card tray-card-hover group flex flex-col overflow-hidden ${
                  i === 0 ? 'sm:col-span-2 sm:flex-row lg:col-span-2' : ''
                }`}
              >
                <div className={i === 0 ? 'sm:w-1/2' : ''}>
                  <img
                    src={U(item.img, i === 0 ? 800 : 500)}
                    alt={item.name}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
                      i === 0 ? 'h-48 sm:h-full' : 'h-40'
                    }`}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <VegDot />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-chutney">{item.tag}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-ink">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="numeric text-xl font-extrabold text-ink">₹{item.price}</span>
                    <span className="text-xs font-semibold text-primary-deep opacity-0 transition-opacity group-hover:opacity-100">
                      Add to tray
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS — numbered timeline, verb labels */}
        <section className="border-y border-border bg-secondary/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
            <h2 className="max-w-xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              From table to hot plate in four moves.
            </h2>
            <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.verb} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="numeric grid h-9 w-9 place-items-center rounded-lg bg-ink text-sm font-bold text-background">
                      {i + 1}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-ink">{s.verb}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CAPABILITIES — asymmetric, image-anchored */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-chutney">The full stack</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Everything a busy canteen needs, nothing it doesn&rsquo;t.
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Built from scratch to kill lunch-hour queues, lost paper tokens and mixed-up orders.
              </p>
              <div className="mt-6 overflow-hidden rounded-lg border border-border">
                <img src={U(IMG.paneer, 800)} alt="Paneer butter masala in a copper kadai with rice and papad" loading="lazy" className="h-56 w-full object-cover" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CAPABILITIES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="tray-card p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary-deep">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FACULTY FAST-TRACK — full-width ink band, breaks rhythm */}
        <section className="bg-ink text-background">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-16">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-primary-soft">
                <GraduationCap className="h-5 w-5" />
                <span className="text-[13px] font-bold uppercase tracking-[0.16em]">Faculty priority</span>
              </div>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ten minutes between lectures? That&rsquo;s enough.
              </h2>
              <p className="mt-3 text-background/70">
                Staff orders take a dedicated lane on the kitchen board and jump the general queue, so a hot lunch fits the break.
              </p>
            </div>
            <Link href="/auth/login">
              <Button size="lg" className="btn-marigold h-12 px-6 text-base">
                Sign in as faculty <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h2 className="mb-8 max-w-lg font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Students, faculty and chefs already run on it.
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.author} className="tray-card flex flex-col justify-between p-6">
                <div>
                  <div className="flex gap-0.5 text-primary">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary" />)}
                  </div>
                  <blockquote className="mt-3 text-[15px] leading-relaxed text-ink/85">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <div className="font-display text-sm font-bold text-ink">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FINAL CTA — marigold band */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="overflow-hidden rounded-2xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl">
              Sit down, scan, and let the kitchen do the running.
            </h2>
            <p className="mx-auto mt-3 max-w-lg font-medium text-ink/70">
              Try a live dine-in order from Table 01, or open the kitchen board to watch tokens move.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/t/qr_tbl_01_8fK29xQm7P7wL9a1">
                <Button size="lg" className="h-12 bg-ink px-6 text-base font-bold text-background hover:bg-ink/90">
                  <QrCode className="mr-2 h-5 w-5" /> Start a dine-in order
                </Button>
              </Link>
              <Link href="/kitchen">
                <Button size="lg" variant="outline" className="h-12 border-ink/25 bg-transparent px-5 text-base font-semibold text-ink hover:bg-ink/10">
                  <ChefHat className="mr-2 h-5 w-5" /> Open kitchen board
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER — warm ink close */}
      <footer className="bg-ink text-background/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-10 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Soup className="h-4 w-4" />
            </span>
            <span className="font-display text-sm font-bold text-background">G. Pulla Reddy Engineering College</span>
          </div>
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link href="/menu" className="hover:text-background">Menu</Link>
            <Link href="/kitchen" className="hover:text-background">Kitchen</Link>
            <Link href="/admin/dashboard" className="hover:text-background">Admin</Link>
            <Link href="/admin/tables" className="hover:text-background">QR tables</Link>
          </nav>
          <p className="text-xs text-background/50">
            &copy; {new Date().getFullYear()} GPREC Food Court &middot; Kurnool
          </p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  QrCode,
  ChefHat,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Star,
  Zap,
  GraduationCap,
  Volume2,
  Receipt,
  Printer,
  ChevronRight,
  Flame,
  Layers,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const CAMPUS_PARTNERS = [
  'GPREC Computer Science',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Faculty Lounge VIP',
  'GPREC Main Food Court',
  'Campus Bakery & Cafe',
  'Science & Humanities',
  'GPREC Student Council',
];

const TESTIMONIALS = [
  {
    quote:
      'The VIP Faculty fast-track queue allows our department professors to enjoy a fresh hot meal between lecture periods without losing precious prep time.',
    author: 'Dr. R. K. Sharma',
    role: 'Professor & Head of CSE',
    dept: 'Computer Science Department',
    rating: 5,
  },
  {
    quote:
      'Ordering straight from Table 04 with instant UPI payment and tracking the live prep timer on my phone completely changed our canteen experience during peak lunch break.',
    author: 'Sneha Reddy',
    role: 'Final Year Student',
    dept: 'B.Tech ECE',
    rating: 5,
  },
  {
    quote:
      'The First-Come-First-Serve KDS terminal with voice announcements eliminated chaotic shouting at the pickup counter and keeps all our cooking lanes organized.',
    author: 'Chef Murthy',
    role: 'Head Culinary Chef',
    dept: 'GPREC Central Kitchen',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white font-sans">
      {/* 1. Floating Glass Navigation Bar */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <nav className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-slate-950 p-2 rounded-2xl font-bold shadow-md shadow-orange-500/20">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white block leading-none">
                GPREC <span className="text-orange-400">Food Court</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Campus Dining System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/kitchen" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-white rounded-xl">
                <ChefHat className="h-4 w-4 mr-1.5 text-amber-400" /> Kitchen KDS
              </Button>
            </Link>

            <Link href="/admin/dashboard" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-white rounded-xl">
                <ShieldCheck className="h-4 w-4 mr-1.5 text-emerald-400" /> Admin
              </Button>
            </Link>

            <Link href="/menu">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold rounded-2xl text-xs px-4 sm:px-5 h-9 shadow-lg shadow-orange-500/20">
                Browse Menu &rarr;
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section with Cinematic Editorial Layout */}
      <main className="container mx-auto px-4 max-w-6xl pt-12 sm:pt-20 pb-16 space-y-24">
        <section className="relative text-center sm:text-left max-w-5xl mx-auto space-y-8">
          {/* Proof Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 border border-slate-950 flex items-center justify-center text-[9px] font-black text-slate-950"
                >
                  ★
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-200">
              Trusted by 1,200+ GPREC Students &amp; Faculty Daily
            </span>
          </div>

          {/* Editorial Display Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Next-Generation{' '}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">
                Campus Dining &amp; Culinary
              </span>{' '}
              Operations.
            </h1>
            <p className="text-slate-400 text-base sm:text-xl max-w-2xl leading-relaxed">
              Dine from physical campus tables with instant QR sessions, fast-track faculty orders, track tickets live on kitchen displays, and settle bills seamlessly via UPI.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
            <Link href="/t/qr_tbl_01_8fK29xQm7P7wL9a1">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black rounded-2xl px-7 h-14 shadow-2xl shadow-orange-500/25 text-sm sm:text-base flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95"
              >
                <QrCode className="h-5 w-5" /> Simulate Table 01 Scan
              </Button>
            </Link>

            <Link href="/kitchen">
              <Button
                size="lg"
                variant="outline"
                className="bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800/90 rounded-2xl px-6 h-14 font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-lg backdrop-blur-md"
              >
                <ChefHat className="h-5 w-5 text-amber-400" /> Open Kitchen KDS Board
              </Button>
            </Link>
          </div>

          {/* Glass Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-3xl backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-white block">0 ms</span>
              <span className="text-[11px] text-slate-400 font-medium">Optimistic Ticket Sync</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-3xl backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">&lt; 7 mins</span>
              <span className="text-[11px] text-slate-400 font-medium">Average Kitchen Prep</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-3xl backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 block">100%</span>
              <span className="text-[11px] text-slate-400 font-medium">FCFS Queue Integrity</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-3xl backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 block">10 Tables</span>
              <span className="text-[11px] text-slate-400 font-medium">Vector QR Tent Cards</span>
            </div>
          </div>
        </section>

        {/* 3. Continuously Sliding Campus Collaboration Rail */}
        <section aria-label="Campus Departments" className="space-y-3 overflow-hidden py-4 border-y border-slate-800/60">
          <p className="text-[11px] font-bold text-center text-slate-500 uppercase tracking-widest">
            Serving All G. Pulla Reddy Engineering College Departments
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex items-center gap-8 w-max animate-marquee whitespace-nowrap">
              {[...CAMPUS_PARTNERS, ...CAMPUS_PARTNERS].map((partner, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <span>{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Core Architecture Value Propositions (6 Refined Panels) */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5 mr-1" /> Complete Digital Dining Stack
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed for Campus Scale &amp; Speed
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built from scratch to eliminate long lunch lines, lost paper tokens, and order mixups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Panel 1: QR Dine-in */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-4 hover:border-orange-500/40 transition-all group backdrop-blur-md">
              <div className="bg-orange-500/15 text-orange-400 p-3.5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                Instant Table QR Sessions
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Students scan the table tent card to automatically bind to Table 01–10. No native mobile app install required.
              </p>
            </div>

            {/* Panel 2: Faculty Priority */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-4 hover:border-amber-500/40 transition-all group backdrop-blur-md">
              <div className="bg-amber-500/15 text-amber-400 p-3.5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                Faculty Priority Fast-Track
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated priority queue algorithm allowing professors to jump ahead of general tickets during short lecture breaks.
              </p>
            </div>

            {/* Panel 3: Kitchen KDS */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-4 hover:border-blue-500/40 transition-all group backdrop-blur-md">
              <div className="bg-blue-500/15 text-blue-400 p-3.5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <ChefHat className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                Strict FCFS Kitchen Terminal
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                3-stage Kanban display with urgent wait timers, synthesized dual-tone audio chimes, and fullscreen tablet mode.
              </p>
            </div>

            {/* Panel 4: PayCat Sandbox */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-4 hover:border-emerald-500/40 transition-all group backdrop-blur-md">
              <div className="bg-emerald-500/15 text-emerald-400 p-3.5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                PayCat &amp; UPI Sandbox
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dynamic UPI QR code simulator with 5-minute countdown and 1-click Success / Decline bank failure triggers.
              </p>
            </div>

            {/* Panel 5: Voice Announcer & WhatsApp */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-4 hover:border-cyan-500/40 transition-all group backdrop-blur-md">
              <div className="bg-cyan-500/15 text-cyan-400 p-3.5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <Volume2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                Speech Calling &amp; WhatsApp Bills
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Web Speech synthesizer speaks ready order numbers over speakers, and students can share receipts on WhatsApp with 1 tap.
              </p>
            </div>

            {/* Panel 6: Admin Menu & Analytics */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-4 hover:border-rose-500/40 transition-all group backdrop-blur-md">
              <div className="bg-rose-500/15 text-rose-400 p-3.5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                Admin Hub &amp; Price Controls
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add new dishes, manage food categories, toggle out-of-stock items, and audit authoritative cancellations in real time.
              </p>
            </div>
          </div>
        </section>

        {/* 5. 4-Step Interactive Dining Pipeline */}
        <section className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-8 sm:p-12 space-y-8 backdrop-blur-xl">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How Students &amp; Faculty Dine
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              From scanning the table tent to picking up a piping-hot meal in under 8 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 font-extrabold flex items-center justify-center border border-orange-500/40 mx-auto sm:mx-0">
                1
              </div>
              <h4 className="font-bold text-base text-white">Scan Table QR</h4>
              <p className="text-xs text-slate-400">
                Sit down at any table in the food court and point your camera at the QR tent card.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center border border-amber-500/40 mx-auto sm:mx-0">
                2
              </div>
              <h4 className="font-bold text-base text-white">Customize &amp; Pay</h4>
              <p className="text-xs text-slate-400">
                Add toppings (Extra Ghee, Cheese), select Faculty Priority if staff, and pay via UPI.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 font-extrabold flex items-center justify-center border border-blue-500/40 mx-auto sm:mx-0">
                3
              </div>
              <h4 className="font-bold text-base text-white">FCFS Kitchen Cooking</h4>
              <p className="text-xs text-slate-400">
                Kitchen Chefs prepare food in strict First-Come-First-Serve order with zero token loss.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center border border-emerald-500/40 mx-auto sm:mx-0">
                4
              </div>
              <h4 className="font-bold text-base text-white">Voice Call &amp; Savor</h4>
              <p className="text-xs text-slate-400">
                Receive live status pulse &amp; audio call when ready. Pick up and submit a 5-star rating!
              </p>
            </div>
          </div>
        </section>

        {/* 6. Testimonials Section */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Campus Testimonials
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Loved by Students, Faculty &amp; Kitchen Staff
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <Card
                key={idx}
                className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all backdrop-blur-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                    {t.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">{t.author}</h5>
                    <p className="text-[10px] text-slate-400">{t.role} &bull; {t.dept}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 7. High-Impact Final CTA */}
        <section className="relative rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 p-8 sm:p-14 text-slate-950 shadow-2xl overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
              Ready to experience modern campus dining?
            </h2>
            <p className="text-sm sm:text-base font-semibold text-slate-900/90 max-w-xl mx-auto">
              Scan Table 01 or jump straight to the live kitchen terminal to watch real-time order progression.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/t/qr_tbl_01_8fK29xQm7P7wL9a1">
              <Button
                size="lg"
                className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold rounded-2xl px-8 h-14 shadow-xl text-sm sm:text-base flex items-center gap-2"
              >
                <QrCode className="h-5 w-5 text-orange-400" /> Start Dine-In Order
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-slate-950 border-slate-950/20 font-bold rounded-2xl px-6 h-14 text-sm sm:text-base"
              >
                Sign In to Portal &rarr;
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* 8. Refined Premium Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 text-xs text-slate-500 font-sans">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-orange-500 text-slate-950 p-1.5 rounded-xl font-bold">
              <Utensils className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-white">G. Pulla Reddy Engineering College</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
            <Link href="/menu" className="hover:text-white transition-colors">Menu</Link>
            <Link href="/kitchen" className="hover:text-white transition-colors">Kitchen KDS</Link>
            <Link href="/admin/dashboard" className="hover:text-white transition-colors">Admin Dashboard</Link>
            <Link href="/admin/tables" className="hover:text-white transition-colors">QR Tables</Link>
          </div>

          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} GPREC Food Court &bull; Built with Next.js 14 &amp; Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}

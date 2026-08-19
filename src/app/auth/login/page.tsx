'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Utensils,
  ShieldCheck,
  ChefHat,
  GraduationCap,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLogin, user, role } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'STAFF'>('STUDENT');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Invalid credentials. Please check your email and password.');
    } else {
      if (email.includes('admin')) {
        router.push('/admin/dashboard');
      } else if (email.includes('kitchen')) {
        router.push('/kitchen');
      } else {
        router.push('/menu');
      }
    }
  };

  const handleQuickDemo = async (type: 'ADMIN' | 'KITCHEN' | 'STUDENT') => {
    setLoading(true);
    setError(null);
    const res = await quickLogin(type);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Quick login failed.');
    } else {
      if (type === 'ADMIN') router.push('/admin/dashboard');
      else if (type === 'KITCHEN') router.push('/kitchen');
      else router.push('/menu');
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-12 font-sans text-foreground sm:px-6 lg:px-8">
      <div className="space-y-3 text-center sm:mx-auto sm:w-full sm:max-w-md">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Utensils className="h-7 w-7" />
        </span>
        <Badge
          variant="outline"
          className="border-border bg-secondary text-[10px] font-bold uppercase tracking-wider text-chutney"
        >
          G. Pulla Reddy Engineering College
        </Badge>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          GPREC Food Court Login
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your student meal portal or staff canteen terminal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="tray-card overflow-hidden rounded-xl">
          {/* Top Demo Accounts Quick Pick */}
          <div className="space-y-3 border-b border-border bg-secondary/50 p-5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary-deep" /> One-Click GPREC Demo Logins:
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                disabled={loading}
                className="group flex flex-col justify-between rounded-lg border border-border bg-card p-2.5 text-left transition hover:border-ink hover:bg-secondary disabled:opacity-50"
              >
                <div className="flex w-full items-center justify-between">
                  <ShieldCheck className="h-4 w-4 text-ink" />
                  <span className="rounded bg-ink px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-background">ADMIN</span>
                </div>
                <div className="mt-1.5 font-display text-[13px] font-bold text-ink">Admin</div>
                <div className="truncate text-[10px] font-medium text-muted-foreground">admin@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('KITCHEN')}
                disabled={loading}
                className="group flex flex-col justify-between rounded-lg border border-border bg-card p-2.5 text-left transition hover:border-primary hover:bg-secondary disabled:opacity-50"
              >
                <div className="flex w-full items-center justify-between">
                  <ChefHat className="h-4 w-4 text-primary-deep" />
                  <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-primary-foreground">KDS</span>
                </div>
                <div className="mt-1.5 font-display text-[13px] font-bold text-ink">Kitchen</div>
                <div className="truncate text-[10px] font-medium text-muted-foreground">kitchen@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('STUDENT')}
                disabled={loading}
                className="group flex flex-col justify-between rounded-lg border border-border bg-card p-2.5 text-left transition hover:border-leaf hover:bg-secondary disabled:opacity-50"
              >
                <div className="flex w-full items-center justify-between">
                  <GraduationCap className="h-4 w-4 text-leaf" />
                  <span className="rounded bg-leaf px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-background">STUDENT</span>
                </div>
                <div className="mt-1.5 font-display text-[13px] font-bold text-ink">Student</div>
                <div className="truncate text-[10px] font-medium text-muted-foreground">student@...</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {error && (
              <div className="rounded-lg border border-chutney/30 bg-chutney/10 p-3 text-xs font-semibold text-chutney">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-ink">
                <Mail className="h-3.5 w-3.5 text-steel" /> GPREC Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="rollno@gprec.ac.in or admin@gprec.ac.in"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-ink">
                  <Lock className="h-3.5 w-3.5 text-steel" /> Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="btn-marigold mt-2 h-11 w-full text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In to GPREC Account <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>New student?</span>
              <Link href="/auth/signup" className="font-bold text-primary-deep hover:underline">
                Register Student ID &rarr;
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

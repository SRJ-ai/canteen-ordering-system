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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 font-sans text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto border border-primary/30 shadow-lg">
          <Utensils className="h-7 w-7" />
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] uppercase font-mono tracking-wider">
          G. Pulla Reddy Engineering College
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          GPREC Food Court Login
        </h1>
        <p className="text-xs text-slate-400">
          Sign in to access your student meal portal or staff canteen terminal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl text-slate-200">
          {/* Top Demo Accounts Quick Pick */}
          <div className="p-5 bg-slate-900/90 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> One-Click GPREC Demo Logins:
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                disabled={loading}
                className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/50 text-left transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-mono font-bold">ADMIN</span>
                </div>
                <div className="text-[11px] font-bold text-white mt-1 group-hover:text-emerald-300">Admin</div>
                <div className="text-[9px] text-slate-400 truncate">admin@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('KITCHEN')}
                disabled={loading}
                className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-amber-950/60 border border-slate-700 hover:border-amber-500/50 text-left transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full">
                  <ChefHat className="h-4 w-4 text-amber-400" />
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-mono font-bold">KDS</span>
                </div>
                <div className="text-[11px] font-bold text-white mt-1 group-hover:text-amber-300">Kitchen</div>
                <div className="text-[9px] text-slate-400 truncate">kitchen@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('STUDENT')}
                disabled={loading}
                className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-blue-950/60 border border-slate-700 hover:border-blue-500/50 text-left transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full">
                  <GraduationCap className="h-4 w-4 text-blue-400" />
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 rounded font-mono font-bold">STUDENT</span>
                </div>
                <div className="text-[11px] font-bold text-white mt-1 group-hover:text-blue-300">Student</div>
                <div className="text-[9px] text-slate-400 truncate">student@...</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="rounded-2xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-300 font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> GPREC Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="rollno@gprec.ac.in or admin@gprec.ac.in"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white rounded-xl text-xs h-10 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" /> Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white rounded-xl text-xs h-10 focus:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold h-11 mt-2 shadow-lg"
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

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>New student?</span>
              <Link href="/auth/signup" className="text-primary hover:underline font-bold">
                Register Student ID &rarr;
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

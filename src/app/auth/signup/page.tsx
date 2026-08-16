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
  GraduationCap,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signup({
      email,
      password,
      firstName,
      lastName,
      phone,
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Registration failed. Please check your information.');
    } else {
      setSuccess(true);
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
          Student Registration
        </h1>
        <p className="text-xs text-slate-400">
          Create your GPREC dining account for fast campus ordering and history tracking.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl text-slate-200">
          {success ? (
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Registration Successful!</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Your GPREC student profile has been created. You can now start ordering meals right from your table.
              </p>
              <div className="pt-2">
                <Link href="/menu">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs h-11 shadow-lg">
                    Continue to Food Court Menu &rarr;
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="rounded-2xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-300 font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-semibold text-slate-300">First Name</Label>
                  <Input
                    id="firstName"
                    required
                    placeholder="Priya"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-slate-900 border-slate-800 text-white rounded-xl text-xs h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-semibold text-slate-300">Last Name</Label>
                  <Input
                    id="lastName"
                    required
                    placeholder="Reddy"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-slate-900 border-slate-800 text-white rounded-xl text-xs h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> College Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="rollno@gprec.ac.in"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-white rounded-xl text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> Mobile (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-white rounded-xl text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" /> Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-white rounded-xl text-xs h-10"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold h-11 mt-2 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating Profile...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Register Student Account <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Already registered?</span>
                <Link href="/auth/login" className="text-primary hover:underline font-bold">
                  Sign In &rarr;
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

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
          Student Registration
        </h1>
        <p className="text-sm text-muted-foreground">
          Create your GPREC dining account for fast campus ordering and history tracking.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="tray-card overflow-hidden rounded-xl">
          {success ? (
            <CardContent className="space-y-4 p-8 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-leaf/15 text-leaf">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">Registration Successful!</h3>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                Your GPREC student profile has been created. You can now start ordering meals right from your table.
              </p>
              <div className="pt-2">
                <Link href="/menu">
                  <Button className="btn-marigold h-11 w-full text-sm">
                    Continue to Food Court Menu &rarr;
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {error && (
                <div className="rounded-lg border border-chutney/30 bg-chutney/10 p-3 text-xs font-semibold text-chutney">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm font-medium text-ink">First Name</Label>
                  <Input
                    id="firstName"
                    required
                    placeholder="Priya"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm font-medium text-ink">Last Name</Label>
                  <Input
                    id="lastName"
                    required
                    placeholder="Reddy"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-ink">
                  <Mail className="h-3.5 w-3.5 text-steel" /> College Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="rollno@gprec.ac.in"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-ink">
                  <Phone className="h-3.5 w-3.5 text-steel" /> Mobile (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-ink">
                  <Lock className="h-3.5 w-3.5 text-steel" /> Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
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
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating Profile...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Register Student Account <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>Already registered?</span>
                <Link href="/auth/login" className="font-bold text-primary-deep hover:underline">
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

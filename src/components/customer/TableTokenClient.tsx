'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Utensils, RotateCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function TableTokenClient({ initialToken }: { initialToken?: string }) {
  const params = useParams();
  const router = useRouter();
  const token = (params?.token as string) || initialToken;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initSession() {
      if (!token) return;
      try {
        const supabase = createClient();
        
        // Find table
        const { data: table, error: tableErr } = await supabase
          .from('tables')
          .select('id, table_number, qr_code, canteen_id, canteens(name)')
          .eq('qr_code', token)
          .single();

        if (tableErr || !table) {
          setError('Invalid or expired table QR code.');
          return;
        }

        // Record QR event
        await supabase.from('table_qr_events').insert({ table_id: table.id });

        // Create table session
        const { data: session } = await supabase
          .from('table_sessions')
          .insert({
            table_id: table.id,
            is_active: true,
          })
          .select('id')
          .single();

        // Save table session to localStorage
        const tableInfo = {
          id: table.id,
          tableNumber: table.table_number,
          canteenName: (table.canteens as any)?.name || 'Central Food Court',
          sessionId: session?.id || null,
        };
        localStorage.setItem('canteen_table_info', JSON.stringify(tableInfo));

        // Set session cookie for server components if supported
        document.cookie = `canteen_table_session=${session?.id || ''}; path=/; max-age=86400; SameSite=Lax`;

        // Redirect to menu
        router.push('/menu');
      } catch (err: any) {
        setError(err.message || 'Failed to initialize table session');
      }
    }

    initSession();
  }, [token, router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="bg-rose-50 text-destructive p-4 rounded-full mb-3">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">QR Code Error</h1>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">{error}</p>
        <Link href="/menu" className="mt-4">
          <Button className="bg-primary text-white rounded-xl">Continue to Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
      <div className="bg-primary/20 text-primary p-4 rounded-2xl animate-bounce mb-4">
        <Utensils className="h-10 w-10" />
      </div>
      <h2 className="text-xl font-bold">Connecting to your table...</h2>
      <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
        <RotateCw className="h-3.5 w-3.5 animate-spin text-primary" /> Initializing dine-in session
      </p>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Soup, RotateCw, AlertTriangle } from 'lucide-react';
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

        const { data: table, error: tableErr } = await supabase
          .from('tables')
          .select('id, table_number, qr_code, canteen_id, canteens(name)')
          .eq('qr_code', token)
          .single();

        if (tableErr || !table) {
          setError('Invalid or expired table QR code.');
          return;
        }

        await supabase.from('table_qr_events').insert({ table_id: table.id });

        const { data: session } = await supabase
          .from('table_sessions')
          .insert({
            table_id: table.id,
            is_active: true,
          })
          .select('id')
          .single();

        const tableInfo = {
          id: table.id,
          tableNumber: table.table_number,
          canteenName: (table.canteens as any)?.name || 'Central Food Court',
          sessionId: session?.id || null,
        };
        localStorage.setItem('canteen_table_info', JSON.stringify(tableInfo));

        document.cookie = `canteen_table_session=${session?.id || ''}; path=/; max-age=86400; SameSite=Lax`;

        router.push('/menu');
      } catch (err: any) {
        setError(err.message || 'Failed to initialize table session');
      }
    }

    initSession();
  }, [token, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
        <div className="mb-3 rounded-full border border-chutney/25 bg-chutney/10 p-4 text-chutney">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="font-display text-xl font-bold text-ink">QR code error</h1>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">{error}</p>
        <Link href="/menu" className="mt-4">
          <Button className="rounded-lg font-bold">Continue to menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink p-6 text-center text-background">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground motion-safe:animate-bounce">
        <Soup className="h-8 w-8" />
      </div>
      <h2 className="font-display text-xl font-bold">Connecting to your table</h2>
      <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-background/60">
        <RotateCw className="h-3.5 w-3.5 animate-spin text-primary-soft" /> Initializing dine-in session
      </p>
    </div>
  );
}

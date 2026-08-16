import { createClient } from '@/lib/supabase/server';
import { AdminTablesClient } from '@/components/admin/AdminTablesClient';

export const dynamic = 'force-dynamic';

export default async function AdminTablesPage() {
  const supabase = createClient();

  const { data: tables } = await supabase
    .from('tables')
    .select('*, canteens(name)')
    .order('table_number', { ascending: true });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <AdminTablesClient initialTables={(tables as any) || []} appUrl={appUrl} />
  );
}

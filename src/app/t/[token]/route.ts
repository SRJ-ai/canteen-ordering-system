import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  const token = params.token;
  
  if (!token) {
    return NextResponse.json({ error: 'Token missing' }, { status: 400 });
  }

  const supabase = createClient();

  // Find the table by the QR token
  const { data: table, error } = await supabase
    .from('tables')
    .select('id, canteen_id, table_number, qr_code')
    .eq('qr_code', token)
    .single();

  if (error || !table) {
    return NextResponse.json({ error: 'Invalid or expired QR code' }, { status: 404 });
  }

  // TODO: we should check canteens(is_active) if that column existed, but we didn't add it in schema.
  // Actually, we should check if table is active (if we add is_active to tables, we didn't in the schema, wait. 
  // Wait, I need to check the schema to see if is_active exists on tables).
  
  // Record QR event
  await supabase.from('table_qr_events').insert({ table_id: table.id });

  // Create table session
  const { data: session, error: sessionError } = await supabase
    .from('table_sessions')
    .insert({
      table_id: table.id,
      is_active: true
    })
    .select('id')
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Could not create session' }, { status: 500 });
  }

  // Redirect to menu page and set session cookie
  const response = NextResponse.redirect(new URL(`/menu`, request.url));
  
  // Set secure HTTP-only cookie
  response.cookies.set('canteen_table_session', session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  });

  return response;
}

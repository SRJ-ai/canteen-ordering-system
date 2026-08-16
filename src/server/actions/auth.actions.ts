'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthService } from '../services/auth.service';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const phone = formData.get('phone') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.user) {
    // Insert into profiles
    await supabase.from('profiles').upsert({
      id: data.user.id,
      first_name: firstName || '',
      last_name: lastName || '',
      phone: phone || null,
    });

    // Fetch customer role ID
    const { data: roleData } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'CUSTOMER')
      .single();

    if (roleData) {
      await supabase.from('user_roles').upsert({
        user_id: data.user.id,
        role_id: roleData.id,
      });
    }
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

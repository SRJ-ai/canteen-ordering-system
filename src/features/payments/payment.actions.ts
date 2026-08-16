'use server';

import { PaymentService } from './payment.service';
import { createClient } from '@/lib/supabase/server';

async function requireUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user;
}

export async function createPaymentAction(orderId: string, providerName?: string) {
  try {
    await requireUser();
    const result = await PaymentService.createPayment(orderId, providerName);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

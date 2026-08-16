'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function toggleMenuItemAvailabilityAction(itemId: string, isAvailable: boolean) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('menu_items')
      .update({ is_available: isAvailable })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/menu');
    revalidatePath('/admin/menu');
    return { success: true, item: data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update item availability' };
  }
}

export async function updateMenuItemPriceAction(itemId: string, newPrice: number) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('menu_items')
      .update({ base_price: newPrice })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/menu');
    revalidatePath('/admin/menu');
    return { success: true, item: data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update price' };
  }
}

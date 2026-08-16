'use server';

import { revalidatePath } from 'next/cache';
import { CartService } from './cart.service';

// Assuming we have some way to get the current user in server actions
import { createClient } from '@/lib/supabase/server';

async function requireUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user;
}

export async function getCartAction() {
  try {
    const user = await requireUser();
    const cart = await CartService.getCart(user.id);
    return { success: true, data: cart };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addToCartAction(menuItemId: string, quantity: number = 1) {
  try {
    const user = await requireUser();
    await CartService.addToCart(user.id, menuItemId, quantity);
    revalidatePath('/cart'); // adjust path based on app structure
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeFromCartAction(cartItemId: string) {
  try {
    const user = await requireUser();
    await CartService.removeFromCart(user.id, cartItemId);
    revalidatePath('/cart');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function clearCartAction() {
  try {
    const user = await requireUser();
    await CartService.clearCart(user.id);
    revalidatePath('/cart');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

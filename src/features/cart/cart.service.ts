import { createClient } from '@/lib/supabase/server';

export interface CartItem {
  id: string;
  cart_id: string;
  menu_item_id: string;
  quantity: number;
  menu_item?: any;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
}

export class CartService {
  /**
   * Retrieves the current user's cart from the database.
   * If a cart does not exist, it will optionally create one.
   */
  static async getCart(userId: string): Promise<Cart | null> {
    const supabase = createClient();
    
    // Fetch cart with items and menu item details
    const { data: cart, error } = await supabase
      .from('carts')
      .select('id, user_id, items:cart_items(id, cart_id, menu_item_id, quantity, menu_item:menu_items(id, name, price, is_available))')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No cart found, create one
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert({ user_id: userId })
          .select('id, user_id')
          .single();
          
        if (createError) throw createError;
        return { ...newCart, items: [] };
      }
      throw error;
    }

    return cart as Cart;
  }

  static async addToCart(userId: string, menuItemId: string, quantity: number = 1): Promise<void> {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');
    
    const supabase = createClient();
    
    // Robust checks: verify menu item exists and is available
    const { data: menuItem, error: menuError } = await supabase
      .from('menu_items')
      .select('id, is_available')
      .eq('id', menuItemId)
      .single();

    if (menuError || !menuItem) throw new Error('Menu item not found');
    if (!menuItem.is_available) throw new Error('Menu item is currently not available');

    // Get or create cart
    const cart = await this.getCart(userId);
    if (!cart) throw new Error('Failed to retrieve cart');

    // Check if item already in cart
    const existingItem = cart.items?.find((item: CartItem) => item.menu_item_id === menuItemId);

    if (existingItem) {
      // Update quantity
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);
        
      if (updateError) throw updateError;
    } else {
      // Insert new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({ cart_id: cart.id, menu_item_id: menuItemId, quantity });
        
      if (insertError) throw insertError;
    }
  }

  static async removeFromCart(userId: string, cartItemId: string): Promise<void> {
    const supabase = createClient();
    
    // Ensure the cart item belongs to the user's cart (Anti-IDOR)
    const cart = await this.getCart(userId);
    if (!cart) throw new Error('Cart not found');
    
    const itemBelongsToUser = cart.items?.some((item: CartItem) => item.id === cartItemId);
    if (!itemBelongsToUser) {
      throw new Error('Unauthorized or item not found in cart');
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
  }

  static async clearCart(userId: string): Promise<void> {
    const supabase = createClient();
    
    const cart = await this.getCart(userId);
    if (!cart) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    if (error) throw error;
  }
}

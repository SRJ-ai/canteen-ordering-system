import { createClient } from '@/lib/supabase/server';
import { OrderStatus, Role } from '@/types';

export interface OrderItemAddonInput {
  addon_option_id: string;
  name?: string;
  price_adjustment?: number;
}

export interface OrderItemInput {
  menu_item_id: string;
  quantity: number;
  addons?: OrderItemAddonInput[];
  notes?: string;
}

export interface CreateOrderParams {
  userId?: string | null;
  tableSessionId?: string | null;
  canteenId?: string | null;
  items: OrderItemInput[];
  paymentMethod?: string;
  customerName?: string;
  customerPhone?: string;
}

export class OrderService {
  /**
   * Generates a unique human-readable order number format: CAN-YYYY-XXXX
   */
  private static async generateOrderNumber(supabase: any): Promise<string> {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `CAN-${year}-${randomSuffix}`;
  }

  static async createOrder({
    userId = null,
    tableSessionId = null,
    canteenId = null,
    items,
    paymentMethod = 'UPI',
    customerName = '',
    customerPhone = '',
  }: CreateOrderParams) {
    const supabase = createClient();

    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // 1. Verify and sanitize user_id against profiles table (to avoid FK constraint violations)
    let validUserId: string | null = null;
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      if (profile) {
        validUserId = profile.id;
      }
    }

    // 2. Verify and sanitize table_session_id
    let validSessionId: string | null = null;
    if (tableSessionId) {
      const { data: session } = await supabase
        .from('table_sessions')
        .select('id')
        .eq('id', tableSessionId)
        .maybeSingle();
      if (session) {
        validSessionId = session.id;
      }
    }

    // 3. Resolve default canteen
    let effectiveCanteenId = canteenId;
    if (effectiveCanteenId) {
      const { data: canteen } = await supabase
        .from('canteens')
        .select('id')
        .eq('id', effectiveCanteenId)
        .maybeSingle();
      if (!canteen) {
        effectiveCanteenId = null;
      }
    }
    if (!effectiveCanteenId) {
      const { data: defaultCanteen } = await supabase
        .from('canteens')
        .select('id')
        .limit(1)
        .maybeSingle();
      effectiveCanteenId = defaultCanteen?.id || 'cb000000-0000-0000-0000-000000000001';
    }

    // 4. Fetch authoritative menu items from database to prevent price tampering
    const itemIds = items.map((i) => i.menu_item_id);
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, name, base_price, is_available')
      .in('id', itemIds);

    if (menuError || !menuItems) {
      throw new Error('Failed to retrieve menu items');
    }

    let subtotalAmount = 0;
    const validatedItems = items.map((inputItem) => {
      const dbItem = menuItems.find((m) => m.id === inputItem.menu_item_id);
      if (!dbItem) throw new Error(`Menu item not found: ${inputItem.menu_item_id}`);
      if (!dbItem.is_available) throw new Error(`"${dbItem.name}" is currently sold out`);

      const basePrice = Number(dbItem.base_price);
      let addonsTotal = 0;
      if (inputItem.addons && inputItem.addons.length > 0) {
        addonsTotal = inputItem.addons.reduce((sum, a) => sum + (Number(a.price_adjustment) || 0), 0);
      }

      const unitPrice = basePrice + addonsTotal;
      const itemSubtotal = unitPrice * inputItem.quantity;
      subtotalAmount += itemSubtotal;

      return {
        menu_item_id: dbItem.id,
        quantity: inputItem.quantity,
        unit_price: unitPrice,
        subtotal: itemSubtotal,
        addons: inputItem.addons || [],
      };
    });

    // Calculate 5% GST
    const gstTax = Math.round(subtotalAmount * 0.05 * 100) / 100;
    const totalAmount = Math.round((subtotalAmount + gstTax) * 100) / 100;

    const orderNumber = await this.generateOrderNumber(supabase);

    // 5. Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: validUserId,
        session_id: validSessionId,
        canteen_id: effectiveCanteenId,
        order_number: orderNumber,
        total_amount: totalAmount,
        status: 'PENDING',
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error('Failed to create order: ' + (orderError?.message || 'Unknown database error'));
    }

    // 6. Insert order items
    for (const item of validatedItems) {
      const { data: insertedItem, error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        })
        .select()
        .single();

      if (!itemError && insertedItem && item.addons.length > 0) {
        // Insert order item addons
        const addonRows = item.addons.map((a) => ({
          order_item_id: insertedItem.id,
          addon_option_id: a.addon_option_id,
          price_adjustment: a.price_adjustment || 0,
        }));
        await supabase.from('order_item_addons').insert(addonRows);
      }
    }

    // 7. Record initial order status history
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      status: 'PENDING',
      changed_by: validUserId,
    });

    // 8. Record payment row
    await supabase.from('payments').insert({
      order_id: order.id,
      amount: totalAmount,
      status: paymentMethod === 'CASH' ? 'PENDING' : 'PAID',
    });

    // 9. If customer added note / contact
    if (customerName || customerPhone) {
      await supabase.from('order_notes').insert({
        order_id: order.id,
        note: `Customer: ${customerName || 'Guest'} (${customerPhone || 'N/A'}) - Paid via ${paymentMethod}`,
        created_by: validUserId,
      });
    }

    return order;
  }

  static async getOrders(userId?: string, userRole?: Role) {
    const supabase = createClient();
    let query = supabase
      .from('orders')
      .select(`
        *,
        table_sessions (
          id,
          table_id,
          tables (
            table_number
          )
        ),
        order_items (
          id,
          quantity,
          unit_price,
          subtotal,
          menu_items (
            name,
            base_price
          ),
          order_item_addons (
            id,
            price_adjustment,
            menu_item_addon_options (
              name
            )
          )
        )
      `)
      .order('created_at', { ascending: false });

    // If role is CUSTOMER and userId provided, only return user's orders
    if (userRole === 'CUSTOMER' && userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getOrderById(orderId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        table_sessions (
          id,
          table_id,
          tables (
            table_number,
            qr_code
          )
        ),
        order_items (
          id,
          quantity,
          unit_price,
          subtotal,
          menu_items (
            name,
            base_price,
            description
          ),
          order_item_addons (
            id,
            price_adjustment,
            menu_item_addon_options (
              name
            )
          )
        ),
        payments (
          id,
          status,
          amount
        ),
        order_notes (
          id,
          note,
          created_at
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    performedBy?: string,
    role?: Role,
    cancellationReason?: string
  ) {
    const supabase = createClient();
    const order = await this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    const currentStatus = order.status as OrderStatus;

    // Strict cancellation rules
    if (newStatus === 'CANCELLED') {
      if (role === 'CUSTOMER') {
        if (currentStatus !== 'PENDING' && currentStatus !== 'CONFIRMED') {
          throw new Error('Orders cannot be cancelled once accepted or preparing by the kitchen.');
        }
      } else {
        if (!cancellationReason) {
          throw new Error('A cancellation reason is required.');
        }
      }
    }

    // Verify performedBy against profiles table
    let validPerformedBy: string | null = null;
    if (performedBy) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', performedBy)
        .maybeSingle();
      if (profile) {
        validPerformedBy = profile.id;
      }
    }

    // Update status
    const { data: updated, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    // Insert history
    await supabase.from('order_status_history').insert({
      order_id: orderId,
      status: newStatus,
      changed_by: validPerformedBy,
    });

    // Insert audit log
    await supabase.from('audit_logs').insert({
      table_name: 'orders',
      record_id: orderId,
      action: `STATUS_CHANGE_TO_${newStatus}`,
      old_data: { status: currentStatus },
      new_data: { status: newStatus, reason: cancellationReason || null },
      performed_by: validPerformedBy,
    });

    return updated;
  }
}

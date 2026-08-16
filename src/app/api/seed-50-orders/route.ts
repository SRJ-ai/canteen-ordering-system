import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const CUSTOMER_NAMES = [
  'Aarav Sharma', 'Diya Patel', 'Vivaan Gupta', 'Ananya Iyer', 'Aditya Verma',
  'Ishaan Mukherjee', 'Saanvi Joshi', 'Reyansh Rao', 'Aanya Reddy', 'Arjun Nair',
  'Myra Sengupta', 'Kabir Choudhury', 'Meera Bhattacharya', 'Rohan Kapoor', 'Anika Deshmukh',
  'Vihaan Agarwal', 'Pooja Kulkarni', 'Dhruv Menon', 'Kavya Pillai', 'Siddharth Hegde',
  'Sneha Nambiar', 'Aditi Trivedi', 'Karan Johar', 'Neha Bhat', 'Manish Pandey',
  'Priyanka Roy', 'Harsh Vardhan', 'Shreya Ghoshal', 'Naveen Kumar', 'Divya Suresh',
  'Rahul Dravid', 'Tanvi Shah', 'Abhishek Bachchan', 'Rhea Chakraborty', 'Gautam Gambhir',
  'Anupam Kher', 'Tara Sutaria', 'Varun Dhawan', 'Kriti Sanon', 'Ayushmann Khurrana',
  'Shraddha Kapoor', 'Rajkummar Rao', 'Bhumi Pednekar', 'Kartik Aaryan', 'Janhvi Kapoor',
  'Vicky Kaushal', 'Sara Ali Khan', 'Ishaan Khatter', 'Radhika Madan', 'Rohit Saraf'
];

const MENU_ITEMS = [
  { id: '10000001-0000-0000-0000-000000000001', name: 'Crispy Masala Dosa', price: 70, addons: [{ id: 'bb000001-0000-0000-0000-000000000001', name: 'Extra Desi Ghee', price: 15 }] },
  { id: '10000002-0000-0000-0000-000000000002', name: 'Idli Vada Combo', price: 55, addons: [{ id: 'bb000003-0000-0000-0000-000000000001', name: 'Extra Sambar', price: 15 }] },
  { id: '10000003-0000-0000-0000-000000000003', name: 'Ghee Podi Thatte Idli', price: 60, addons: [] },
  { id: '10000006-0000-0000-0000-000000000006', name: 'Deluxe Executive Thali', price: 160, addons: [{ id: 'bb000005-0000-0000-0000-000000000001', name: 'Extra Butter Roti', price: 12 }] },
  { id: '10000007-0000-0000-0000-000000000007', name: 'Amritsari Chole Bhature', price: 95, addons: [] },
  { id: '10000008-0000-0000-0000-000000000008', name: 'Paneer Butter Masala Combo', price: 140, addons: [{ id: 'bb000002-0000-0000-0000-000000000001', name: 'Grated Amul Cheese', price: 25 }] },
  { id: '10000010-0000-0000-0000-000000000010', name: 'Hyderabadi Veg Dum Biryani', price: 120, addons: [] },
  { id: '10000011-0000-0000-0000-000000000011', name: 'Butter Pav Bhaji', price: 80, addons: [{ id: 'bb000004-0000-0000-0000-000000000001', name: 'Extra Butter Pav', price: 20 }] },
  { id: '10000012-0000-0000-0000-000000000012', name: 'Mumbai Vada Pav', price: 45, addons: [] },
  { id: '10000016-0000-0000-0000-000000000016', name: 'Special Adrak Elaichi Chai', price: 20, addons: [] },
  { id: '10000017-0000-0000-0000-000000000017', name: 'South Indian Filter Coffee', price: 25, addons: [] },
  { id: '10000021-0000-0000-0000-000000000021', name: 'Warm Gulab Jamun', price: 45, addons: [] },
  { id: '10000022-0000-0000-0000-000000000022', name: 'Kesar Pista Rasmalai', price: 65, addons: [] },
];

const PAYMENT_METHODS = ['UPI', 'CASH', 'CARD'];
const STATUSES = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];

export async function GET() {
  try {
    const supabase = createAdminClient();

    // 1. Fetch tables
    const { data: tables } = await supabase.from('tables').select('id, table_number');
    const tableList = tables || [];

    const results: any[] = [];
    const year = new Date().getFullYear();

    for (let i = 0; i < 50; i++) {
      const customerName = CUSTOMER_NAMES[i % CUSTOMER_NAMES.length];
      const customerPhone = `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`;
      const assignedTable = tableList[i % tableList.length];
      const paymentMethod = PAYMENT_METHODS[i % PAYMENT_METHODS.length];
      
      // Random status distribution: realistic kitchen traffic
      let status = 'PENDING';
      if (i < 10) status = 'PENDING';
      else if (i < 20) status = 'ACCEPTED';
      else if (i < 30) status = 'PREPARING';
      else if (i < 40) status = 'READY';
      else if (i < 47) status = 'COMPLETED';
      else status = 'CANCELLED';

      // 2. Create Table Session
      let sessionId: string | null = null;
      if (assignedTable) {
        const { data: session } = await supabase
          .from('table_sessions')
          .insert({
            table_id: assignedTable.id,
            is_active: status !== 'COMPLETED' && status !== 'CANCELLED',
          })
          .select('id')
          .single();
        if (session) sessionId = session.id;
      }

      // 3. Pick 1 to 3 items
      const numItems = (i % 3) + 1;
      const selectedItems: any[] = [];
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        const menuItem = MENU_ITEMS[(i + j * 3) % MENU_ITEMS.length];
        const qty = (j === 0 ? (i % 2) + 1 : 1);
        const itemAddon = menuItem.addons.length > 0 && i % 2 === 0 ? menuItem.addons[0] : null;
        const addonPrice = itemAddon ? itemAddon.price : 0;
        const unitPrice = menuItem.price + addonPrice;
        const itemSubtotal = unitPrice * qty;
        subtotal += itemSubtotal;

        selectedItems.push({
          menu_item_id: menuItem.id,
          quantity: qty,
          unit_price: unitPrice,
          subtotal: itemSubtotal,
          addon: itemAddon,
        });
      }

      const tax = Math.round(subtotal * 0.05 * 100) / 100;
      const totalAmount = Math.round((subtotal + tax) * 100) / 100;
      const orderNumber = `CAN-${year}-${(5000 + i).toString().padStart(4, '0')}`;

      // 4. Insert Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          session_id: sessionId,
          canteen_id: 'cb000000-0000-0000-0000-000000000001',
          status: status as any,
          total_amount: totalAmount,
        })
        .select('id, order_number, status, total_amount')
        .single();

      if (orderError || !order) {
        throw new Error(`Error on user ${i + 1}: ${orderError?.message}`);
      }

      // 5. Insert Order Items & Addons
      for (const item of selectedItems) {
        const { data: insertedItem } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal,
          })
          .select('id')
          .single();

        if (insertedItem && item.addon) {
          await supabase.from('order_item_addons').insert({
            order_item_id: insertedItem.id,
            addon_option_id: item.addon.id,
            price_adjustment: item.addon.price,
          });
        }
      }

      // 6. Insert Payment
      await supabase.from('payments').insert({
        order_id: order.id,
        amount: totalAmount,
        status: status === 'CANCELLED' ? 'CANCELLED' : paymentMethod === 'CASH' && status === 'PENDING' ? 'PENDING' : 'PAID',
      });

      // 7. Insert Order Status History
      await supabase.from('order_status_history').insert({
        order_id: order.id,
        status: status as any,
      });

      // 8. Insert Order Notes / Customer Identity
      await supabase.from('order_notes').insert({
        order_id: order.id,
        note: `User #${i + 1}: ${customerName} (${customerPhone}) - Table: ${assignedTable?.table_number || 'Takeaway'} - Paid via ${paymentMethod}`,
      });

      results.push({
        index: i + 1,
        orderId: order.id,
        orderNumber: order.order_number,
        customerName,
        table: assignedTable?.table_number || 'Takeaway',
        itemsCount: selectedItems.length,
        total: totalAmount,
        status,
        paymentMethod,
      });
    }

    return NextResponse.json({
      success: true,
      totalOrdersCreated: results.length,
      orders: results,
    });
  } catch (error: any) {
    console.error('50 USERS LOAD TEST ERROR:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

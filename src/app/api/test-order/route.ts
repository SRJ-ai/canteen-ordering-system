import { NextResponse } from 'next/server';
import { OrderService } from '@/features/orders/order.service';

export async function GET() {
  try {
    const order = await OrderService.createOrder({
      userId: null,
      tableSessionId: null,
      canteenId: null,
      items: [
        {
          menu_item_id: '10000001-0000-0000-0000-000000000001', // Crispy Masala Dosa
          quantity: 2,
          addons: [
            {
              addon_option_id: 'bb000001-0000-0000-0000-000000000001', // Extra Desi Ghee
              name: 'Extra Desi Ghee',
              price_adjustment: 15,
            },
          ],
          notes: 'Crispy and hot',
        },
      ],
      paymentMethod: 'UPI',
      customerName: 'Rahul Verma',
      customerPhone: '+919876543210',
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('TEST ORDER ERROR:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

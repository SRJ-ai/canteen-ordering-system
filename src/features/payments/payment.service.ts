import { PaymentStatus } from '@/types';
import { createClient } from '@/lib/supabase/server';

export interface PaymentIntent {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  provider: string;
  client_secret?: string;
  status: PaymentStatus;
}

export interface PaymentProvider {
  name: string;
  createPaymentIntent(orderId: string, amount: number, currency: string): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string): Promise<boolean>;
  refundPayment(paymentIntentId: string, amount?: number): Promise<boolean>;
}

export class DummyPaymentProvider implements PaymentProvider {
  name = 'dummy';

  async createPaymentIntent(orderId: string, amount: number, currency: string): Promise<PaymentIntent> {
    const id = `pi_dummy_${Math.random().toString(36).substring(7)}`;
    return {
      id,
      order_id: orderId,
      amount,
      currency,
      provider: this.name,
      client_secret: `secret_${id}`,
      status: 'CREATED'
    };
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    // Dummy always succeeds
    return true;
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<boolean> {
    return true;
  }
}

// Service to interact with PaymentProvider and DB
export class PaymentService {
  private static providers: Record<string, PaymentProvider> = {
    dummy: new DummyPaymentProvider(),
    // stripe: new StripePaymentProvider(),
    // razorpay: new RazorpayPaymentProvider()
  };

  static async createPayment(orderId: string, providerName: string = 'dummy') {
    const supabase = createClient();
    
    // Validate order exists and belongs to correct status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
      
    if (orderError || !order) throw new Error('Order not found');
    if (order.status === 'CANCELLED') throw new Error('Cannot pay for a cancelled order');
    
    const provider = this.providers[providerName];
    if (!provider) throw new Error(`Payment provider ${providerName} not found`);

    const intent = await provider.createPaymentIntent(order.id, order.total_amount, 'USD');

    // Save payment record
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        amount: intent.amount,
        status: intent.status,
        provider: intent.provider,
        provider_id: intent.id
      })
      .select()
      .single();

    if (paymentError) {
      throw new Error('Failed to save payment record: ' + paymentError.message);
    }

    return { intent, paymentRecord };
  }

  static async processPaymentWebhook(providerId: string, status: PaymentStatus) {
    const supabase = createClient();
    
    const { data: payment, error } = await supabase
      .from('payments')
      .update({ status })
      .eq('provider_id', providerId)
      .select('order_id')
      .single();

    if (error || !payment) throw new Error('Payment record not found to update');

    // If paid, transition order status if necessary, e.g. CONFIRMED
    if (status === 'PAID') {
      await supabase.from('orders').update({ status: 'CONFIRMED' }).eq('id', payment.order_id);
    }

    return payment;
  }
}

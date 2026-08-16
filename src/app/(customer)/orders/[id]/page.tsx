import React from 'react';
import { OrderTrackerClient } from '@/components/customer/OrderTrackerClient';

export async function generateStaticParams() {
  return [{ id: 'sample-order' }];
}

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  return <OrderTrackerClient initialOrderId={params.id} />;
}

import React, { Suspense } from 'react';
import { OrderTrackerClient } from '@/components/customer/OrderTrackerClient';
import { Loader2 } from 'lucide-react';

export async function generateStaticParams() {
  return [{ id: 'sample-order' }];
}

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-24 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground font-semibold">Loading live tracker...</p>
        </div>
      }
    >
      <OrderTrackerClient initialOrderId={params.id} />
    </Suspense>
  );
}

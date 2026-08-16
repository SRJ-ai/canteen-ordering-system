import React from 'react';
import { TableTokenClient } from '@/components/customer/TableTokenClient';

export async function generateStaticParams() {
  return [
    { token: 'qr_tbl_01_8fK29xQm7P7wL9a1' },
    { token: 'qr_tbl_02_9gL30yRn8Q8xM0b2' },
    { token: 'qr_tbl_03_0hM41zSo9R9yN1c3' },
    { token: 'qr_tbl_04_1iN52aTp0S0zO2d4' },
    { token: 'qr_tbl_05_2jO63bUq1T1aP3e5' },
    { token: 'qr_tbl_06_3kP74cVr2U2bQ4f6' },
    { token: 'qr_tbl_07_4lQ85dWs3V3cR5g7' },
    { token: 'qr_tbl_08_5mR96eXt4W4dS6h8' },
    { token: 'qr_tbl_09_6nS07fYu5X5eT7i9' },
    { token: 'qr_tbl_10_7oT18gZv6Y6fU8j0' },
  ];
}

export default function TableTokenPage({ params }: { params: { token: string } }) {
  return <TableTokenClient initialToken={params.token} />;
}

'use client';

import React from 'react';
import { AdminTablesClient } from '@/components/admin/AdminTablesClient';

export default function AdminTablesPage() {
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  return <AdminTablesClient initialTables={[]} appUrl={appUrl} />;
}

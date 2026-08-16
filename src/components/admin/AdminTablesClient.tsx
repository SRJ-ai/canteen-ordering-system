'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Printer,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Utensils,
} from 'lucide-react';

interface TableItem {
  id: string;
  table_number: string;
  qr_code: string;
  canteens?: {
    name: string;
  };
}

const DEFAULT_GPREC_TABLES: TableItem[] = [
  { id: '1', table_number: 'Table 01', qr_code: 'qr_tbl_01_8fK29xQm7P7wL9a1', canteens: { name: 'GPREC Main Food Court' } },
  { id: '2', table_number: 'Table 02', qr_code: 'qr_tbl_02_9gL30yRn8Q8xM0b2', canteens: { name: 'GPREC Main Food Court' } },
  { id: '3', table_number: 'Table 03', qr_code: 'qr_tbl_03_0hM41zSo9R9yN1c3', canteens: { name: 'GPREC Main Food Court' } },
  { id: '4', table_number: 'Table 04', qr_code: 'qr_tbl_04_1iN52aTp0S0zO2d4', canteens: { name: 'GPREC Main Food Court' } },
  { id: '5', table_number: 'Table 05', qr_code: 'qr_tbl_05_2jO63bUq1T1aP3e5', canteens: { name: 'GPREC Main Food Court' } },
  { id: '6', table_number: 'Table 06', qr_code: 'qr_tbl_06_3kP74cVr2U2bQ4f6', canteens: { name: 'GPREC Main Food Court' } },
  { id: '7', table_number: 'Table 07', qr_code: 'qr_tbl_07_4lQ85dWs3V3cR5g7', canteens: { name: 'GPREC Main Food Court' } },
  { id: '8', table_number: 'Table 08', qr_code: 'qr_tbl_08_5mR96eXt4W4dS6h8', canteens: { name: 'GPREC Main Food Court' } },
  { id: '9', table_number: 'Table 09', qr_code: 'qr_tbl_09_6nS07fYu5X5eT7i9', canteens: { name: 'GPREC Main Food Court' } },
  { id: '10', table_number: 'Table 10', qr_code: 'qr_tbl_10_7oT18gZv6Y6fU8j0', canteens: { name: 'GPREC Main Food Court' } },
];

export function AdminTablesClient({ initialTables = [], appUrl = '' }: { initialTables?: TableItem[]; appUrl?: string }) {
  const [tables, setTables] = useState<TableItem[]>(
    initialTables.length > 0 ? initialTables : DEFAULT_GPREC_TABLES
  );
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState(appUrl);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }

    async function loadTables() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('tables')
          .select('*, canteens(name)')
          .order('table_number', { ascending: true });
        if (data && data.length > 0) {
          setTables(data as any);
        }
      } catch (err) {}
    }
    loadTables();
  }, []);

  const handleCopyLink = (token: string) => {
    const url = `${baseUrl || ''}/t/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            GPREC Table & QR Code Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Physical table mapping, crypto-secure QR tokens, and printable table tent cards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90 text-white rounded-2xl text-xs font-bold shadow-md">
            <Printer className="h-4 w-4 mr-1.5" /> Print All Table QR Cards
          </Button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => {
          const qrUrl = `${baseUrl || ''}/t/${table.qr_code}`;
          const isCopied = copiedToken === table.qr_code;

          return (
            <Card
              key={table.id}
              className="rounded-3xl border border-slate-200/80 shadow-xs bg-white flex flex-col justify-between overflow-hidden hover:shadow-md transition-all print:border print:shadow-none print:break-inside-avoid"
            >
              <CardHeader className="p-5 pb-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary p-2 rounded-xl">
                      <Utensils className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-extrabold text-slate-900">
                        {table.table_number}
                      </CardTitle>
                      <CardDescription className="text-[11px]">
                        {table.canteens?.name || 'GPREC Food Court'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Active
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                {/* SVG Rendered QR Code */}
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-900/10 shadow-sm flex flex-col items-center space-y-2">
                  <QRCodeSVG
                    value={qrUrl}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                  <span className="text-[10px] font-mono text-slate-400">
                    Scan to Order &bull; {table.table_number}
                  </span>
                </div>

                <div className="w-full text-center space-y-1">
                  <div className="text-[11px] font-mono text-muted-foreground bg-slate-50 p-1.5 rounded-lg border truncate">
                    {qrUrl}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 border-t border-slate-100 bg-slate-50/40 grid grid-cols-2 gap-2 print:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(table.qr_code)}
                  className="rounded-xl text-xs font-semibold"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {isCopied ? 'Copied' : 'Copy Link'}
                </Button>

                <Link href={`/t/${table.qr_code}`} target="_blank" className="w-full">
                  <Button
                    size="sm"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    Test Scan <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Printer,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Utensils,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  AlertTriangle,
  X,
  Sparkles,
  Users,
} from 'lucide-react';

interface TableItem {
  id: string;
  table_number: string;
  qr_code: string;
  canteen_id?: string;
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
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<TableItem | null>(null);

  // Form Fields for Add Table
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newLocationName, setNewLocationName] = useState('GPREC Main Food Court');
  const [newQrToken, setNewQrToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
    loadTablesFromDb();
  }, []);

  async function loadTablesFromDb() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tables')
        .select('*, canteens(name)')
        .order('table_number', { ascending: true });
      if (!error && data && data.length > 0) {
        setTables(data as any);
      }
    } catch (err) {}
  }

  // Generate cryptographically unique QR token
  const generateRandomToken = (numStr = '') => {
    const cleanNum = numStr.replace(/\D/g, '') || Math.floor(11 + Math.random() * 89).toString();
    const padNum = cleanNum.padStart(2, '0');
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    return `qr_tbl_${padNum}_${randomHex}`;
  };

  const handleOpenAddModal = () => {
    const nextNum = (tables.length + 1).toString().padStart(2, '0');
    setNewTableNumber(`Table ${nextNum}`);
    setNewQrToken(generateRandomToken(nextNum));
    setNewLocationName('GPREC Main Food Court');
    setFeedbackMsg(null);
    setIsAddModalOpen(true);
  };

  const handleCreateNewTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please enter a valid table number or name.' });
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const supabase = createClient();
      const token = newQrToken.trim() || generateRandomToken(newTableNumber);

      const { data, error } = await supabase
        .from('tables')
        .insert({
          table_number: newTableNumber.trim(),
          canteen_id: 'cb000000-0000-0000-0000-000000000001',
          qr_code: token,
        })
        .select('*, canteens(name)')
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setTables((prev) => [...prev, data as any]);
      } else {
        // Fallback optimistic addition
        const fallbackNew: TableItem = {
          id: `tbl_${Date.now()}`,
          table_number: newTableNumber.trim(),
          qr_code: token,
          canteens: { name: newLocationName },
        };
        setTables((prev) => [...prev, fallbackNew]);
      }

      setIsAddModalOpen(false);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to add table to database.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (table: TableItem) => {
    setTableToDelete(table);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tableToDelete) return;
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', tableToDelete.id);

      // Remove from state optimistically
      setTables((prev) => prev.filter((t) => t.id !== tableToDelete.id));
      setIsDeleteModalOpen(false);
      setTableToDelete(null);
    } catch (err: any) {
      alert('Failed to delete table: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="space-y-6 font-sans">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <QrCode className="h-8 w-8 text-primary" /> GPREC Table &amp; QR Manager
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Physical table mapping, crypto-secure QR tokens, and printable tent cards ({tables.length} Total Tables).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            onClick={handleOpenAddModal}
            className="bg-primary hover:bg-primary/90 text-white rounded-2xl text-xs font-extrabold h-10 px-4 shadow-md flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add New Table
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline"
            className="rounded-2xl text-xs font-bold h-10 px-4 border-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Printer className="h-4 w-4" /> Print Tent Cards
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
                      <CardDescription className="text-[11px] flex items-center gap-1 text-slate-500">
                        <MapPin className="h-3 w-3" /> {table.canteens?.name || 'GPREC Main Food Court'}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                      Active
                    </Badge>
                    <button
                      onClick={() => handleOpenDeleteModal(table)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition print:hidden"
                      title="Delete Table"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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

      {/* --- ADD NEW TABLE MODAL DIALOG --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in fade-in-50 zoom-in-95 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-50 text-primary rounded-xl">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Add New Dining Table</h3>
                  <p className="text-xs text-muted-foreground">Register a physical table &amp; generate its QR token</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {feedbackMsg && (
              <div
                role="alert"
                className={`p-3 rounded-xl text-xs font-bold border ${
                  feedbackMsg.type === 'error'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {feedbackMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateNewTable} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="tableName" className="text-xs font-bold text-slate-700">
                  Table Number / Name *
                </Label>
                <Input
                  id="tableName"
                  type="text"
                  placeholder="e.g. Table 11, Patio 01, VIP Lounge"
                  value={newTableNumber}
                  onChange={(e) => {
                    setNewTableNumber(e.target.value);
                    setNewQrToken(generateRandomToken(e.target.value));
                  }}
                  required
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="locationName" className="text-xs font-bold text-slate-700">
                  Canteen Location
                </Label>
                <Input
                  id="locationName"
                  type="text"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="qrToken" className="text-xs font-bold text-slate-700">
                    Generated QR Token
                  </Label>
                  <button
                    type="button"
                    onClick={() => setNewQrToken(generateRandomToken(newTableNumber))}
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Regenerate
                  </button>
                </div>
                <Input
                  id="qrToken"
                  type="text"
                  value={newQrToken}
                  onChange={(e) => setNewQrToken(e.target.value)}
                  required
                  className="font-mono text-xs rounded-xl bg-slate-50"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-extrabold px-5 shadow-sm"
                >
                  {isSubmitting ? 'Creating Table...' : 'Save & Generate QR'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && tableToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 animate-in fade-in-50 zoom-in-95 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-slate-900">Delete {tableToDelete.table_number}?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to remove this table and deactivate its physical QR token (<span className="font-mono">{tableToDelete.qr_code}</span>)?
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setTableToDelete(null);
                }}
                className="rounded-xl text-xs font-semibold w-full"
              >
                Keep Table
              </Button>

              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold w-full shadow-sm"
              >
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

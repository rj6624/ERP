import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Bill } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RecordPaymentModal } from './RecordPaymentModal';
import { Clock, AlertCircle, CreditCard, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PromiseDatePendingPage: React.FC = () => {
  const { bills, navigateToBill, navigateToCustomer } = useERP();
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<string | null>(null);

  // Filter bills marked as Promise Date Due or having active promise notes
  const promiseBills = bills.filter(
    (b) => b.paymentStatus === 'Promise Date Due' || (b.remarks && b.remarks.toLowerCase().includes('promise'))
  );

  const columns: ColumnDef<Bill>[] = [
    {
      header: 'Customer',
      accessorKey: 'customerName',
      sortable: true,
      cell: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            navigateToCustomer(row.customerId);
          }}
          className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer"
        >
          {row.customerName}
        </span>
      ),
    },
    {
      header: 'Bill Number',
      accessorKey: 'billNumber',
      sortable: true,
      cell: (row) => <span className="font-mono font-bold text-slate-900">{row.billNumber}</span>,
    },
    {
      header: 'Bill Amount',
      accessorKey: 'totalAmount',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900">
          {formatCurrency(row.totalAmount, true)}
        </span>
      ),
    },
    {
      header: 'Amount Paid',
      accessorKey: 'amountPaid',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-semibold text-emerald-700">
          {formatCurrency(row.amountPaid, true)}
        </span>
      ),
    },
    {
      header: 'Pending Balance',
      accessorKey: 'pendingAmount',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-orange-700">
          {formatCurrency(row.pendingAmount, true)}
        </span>
      ),
    },
    {
      header: 'Promise Commitment',
      accessorKey: 'remarks',
      cell: (row) => (
        <span className="text-slate-800 text-xs font-medium bg-orange-50 px-2 py-0.5 rounded border border-orange-200 block">
          {row.remarks || 'Promised for clearance today'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'paymentStatus',
      cell: (row) => <StatusBadge type="payment" value={row.paymentStatus} />,
    },
    {
      header: 'Action',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigateToBill(row.id)}
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            title="View Bill"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSelectedBillForPayment(row.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-700 text-white hover:bg-emerald-800 text-2xs font-semibold"
          >
            <CreditCard className="w-3 h-3" /> Settle
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-orange-500/10 border border-orange-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-orange-950 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" /> Promise Date Pending Tracker ({promiseBills.length} Due Commitments)
          </h2>
          <p className="text-xs text-orange-800">
            Customer payment promises committed for specific calendar dates. Auto-flagged for daily collection follow-up.
          </p>
        </div>
      </div>

      <DataTable
        data={promiseBills}
        columns={columns}
        onRowClick={(row) => navigateToBill(row.id)}
        searchPlaceholder="Search promise date commitments..."
        exportFilename="promise_date_pending"
      />

      {selectedBillForPayment && (
        <RecordPaymentModal
          isOpen={!!selectedBillForPayment}
          onClose={() => setSelectedBillForPayment(null)}
          defaultBillId={selectedBillForPayment}
        />
      )}
    </div>
  );
};

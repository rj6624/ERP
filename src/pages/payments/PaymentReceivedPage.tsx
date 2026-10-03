import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Payment } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { RecordPaymentModal } from './RecordPaymentModal';
import { CreditCard, Plus, ArrowLeft } from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

export const PaymentReceivedPage: React.FC = () => {
  const { payments, navigateToCustomer, navigateToBill } = useERP();
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const columns: ColumnDef<Payment>[] = [
    {
      header: 'Payment Number',
      accessorKey: 'paymentNumber',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.paymentNumber}
        </span>
      ),
    },
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
      header: 'Bill Ref',
      accessorKey: 'billNumber',
      sortable: true,
      cell: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            navigateToBill(row.billId);
          }}
          className="font-mono text-slate-700 hover:underline cursor-pointer"
        >
          {row.billNumber}
        </span>
      ),
    },
    {
      header: 'Amount Received (₹)',
      accessorKey: 'amountReceived',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-extrabold text-emerald-800 text-sm">
          {formatCurrency(row.amountReceived, true)}
        </span>
      ),
    },
    {
      header: 'Payment Mode',
      accessorKey: 'paymentMode',
      sortable: true,
      cell: (row) => (
        <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
          {row.paymentMode}
        </span>
      ),
    },
    {
      header: 'Reference Number / UTR',
      accessorKey: 'referenceNumber',
      cell: (row) => <span className="font-mono text-2xs text-slate-600">{row.referenceNumber}</span>,
    },
    {
      header: 'Payment Date',
      accessorKey: 'paymentDate',
      sortable: true,
      cell: (row) => <span className="text-slate-600 text-xs">{formatDate(row.paymentDate)}</span>,
    },
    {
      header: 'Remarks',
      accessorKey: 'remarks',
      cell: (row) => <span className="text-slate-500 text-2xs italic truncate max-w-xs">{row.remarks}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Received Register (Admin Only)
          </h2>
          <p className="text-xs text-slate-500">
            Audit register of all funds deposited via Bank Transfer, Cash, UPI, and Cheque clearances.
          </p>
        </div>
        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="erp-btn-brand self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Record Payment
        </button>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        searchPlaceholder="Search payments by No, Customer, Ref..."
        exportFilename="payment_received_ledger"
      />

      {isRecordModalOpen && (
        <RecordPaymentModal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
        />
      )}
    </div>
  );
};

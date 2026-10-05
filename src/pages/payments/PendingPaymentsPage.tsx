import { Button } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Bill } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RecordPaymentModal } from './RecordPaymentModal';
import { CreditCard, AlertTriangle, Eye } from 'lucide-react';
import { formatWeight, formatCurrency, formatDate } from '../../utils/formatters';

export const PendingPaymentsPage: React.FC = () => {
  const { bills, navigateToBill, navigateToCustomer } = useERP();
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<string | null>(null);

  // Filter bills with pending balance > 0
  const pendingBills = bills.filter((b) => b.pendingAmount > 0);
  const totalPendingReceivables = pendingBills.reduce((s, b) => s + b.pendingAmount, 0);

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
      header: 'Bill Date',
      accessorKey: 'billDate',
      sortable: true,
      cell: (row) => <span className="text-slate-600 text-xs">{formatDate(row.billDate)}</span>,
    },
    {
      header: 'Inward Weight',
      accessorKey: 'inwardWeight',
      align: 'right',
      cell: (row) => <span className="font-mono text-slate-700">{formatWeight(row.inwardWeight)}</span>,
    },
    {
      header: 'Total Invoiced',
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
      header: 'Pending Balance (To Collect)',
      accessorKey: 'pendingAmount',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-extrabold text-red-600 text-sm">
          {formatCurrency(row.pendingAmount, true)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'paymentStatus',
      sortable: true,
      cell: (row) => <StatusBadge type="payment" value={row.paymentStatus} />,
    },
    {
      header: 'Action',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => navigateToBill(row.id)}
            className="!min-h-[28px] !h-7 !w-7 p-0 shrink-0 cursor-pointer"
            title="View Bill"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSelectedBillForPayment(row.id)}
            className="!min-h-[28px] h-7 px-2.5 text-xs font-semibold inline-flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 shrink-0" /> Settle
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Pending Customer Receivables ({pendingBills.length} Unsettled Bills)
          </h2>
          <p className="text-xs text-slate-500">
            Uncollected manufacturing invoices requiring customer follow-up.
          </p>
        </div>

        <div className="text-right p-2.5 rounded bg-red-50/60 border border-red-200 self-start sm:self-auto">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Outstanding</span>
          <span className="font-mono text-base font-extrabold text-red-600">
            {formatCurrency(totalPendingReceivables, true)}
          </span>
        </div>
      </div>

      <DataTable
        data={pendingBills}
        columns={columns}
        onRowClick={(row) => navigateToBill(row.id)}
        searchPlaceholder="Search pending bills..."
        exportFilename="pending_payments"
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

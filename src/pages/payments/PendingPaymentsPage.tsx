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
          <Button variant="secondary" size="icon"
            onClick={() => navigateToBill(row.id)}
            className=""
            title="View Bill"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button variant="primary"
            onClick={() => setSelectedBillForPayment(row.id)}
            className="inline-flex items-center gap-1 text-2xs"
          >
            <CreditCard className="w-3 h-3" /> Settle
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-red-500/10 border border-red-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-red-950 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" /> Pending Customer Receivables ({pendingBills.length} Unsettled Bills)
          </h2>
          <p className="text-xs text-red-800">
            Uncollected manufacturing invoices requiring customer follow-up.
          </p>
        </div>

        <div className="text-right p-2.5 rounded bg-white border border-red-200">
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

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Bill } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreateBillModal } from './CreateBillModal';
import { RecordPaymentModal } from '../payments/RecordPaymentModal';
import { FileText, Plus, Eye, CreditCard } from 'lucide-react';
import { formatWeight, formatCurrency, formatDate } from '../../utils/formatters';

export const BillsListPage: React.FC = () => {
  const { bills, setCurrentPage, navigateToBill, navigateToCustomer } = useERP();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<string | null>(null);

  const columns: ColumnDef<Bill>[] = [
    {
      header: 'Bill Number',
      accessorKey: 'billNumber',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.billNumber}
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
      header: 'Job ID',
      accessorKey: 'jobId',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-600">{row.jobId}</span>,
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
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-slate-900 font-medium">
          {formatWeight(row.inwardWeight)}
        </span>
      ),
    },
    {
      header: 'Price / KG',
      accessorKey: 'pricePerKg',
      sortable: true,
      align: 'right',
      cell: (row) => <span className="font-mono text-slate-700">₹{row.pricePerKg.toFixed(2)}</span>,
    },
    {
      header: 'Total Amount (₹)',
      accessorKey: 'totalAmount',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-slate-950 text-sm">
          {formatCurrency(row.totalAmount, true)}
        </span>
      ),
    },
    {
      header: 'Pending Balance',
      accessorKey: 'pendingAmount',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span
          className={`font-mono font-semibold ${
            row.pendingAmount > 0 ? 'text-red-600' : 'text-slate-400'
          }`}
        >
          {formatCurrency(row.pendingAmount, true)}
        </span>
      ),
    },
    {
      header: 'Payment Status',
      accessorKey: 'paymentStatus',
      sortable: true,
      cell: (row) => <StatusBadge type="payment" value={row.paymentStatus} />,
    },
    {
      header: 'Actions',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigateToBill(row.id)}
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            title="View Invoice"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {row.pendingAmount > 0 && (
            <button
              onClick={() => setSelectedBillForPayment(row.id)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-2xs font-semibold hover:bg-emerald-100"
            >
              <CreditCard className="w-3 h-3" /> Pay
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" /> Manufacturing Bills & Invoicing
          </h2>
          <p className="text-xs text-slate-500">
            Automated invoices calculated on Inward Weight × Price per KG with integrated payment balance tracking.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="erp-btn-brand self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Generate New Bill
        </button>
      </div>

      <DataTable
        data={bills}
        columns={columns}
        onRowClick={(row) => navigateToBill(row.id)}
        searchPlaceholder="Search bills by Number, Customer, Job ID..."
        exportFilename="bills_invoices"
      />

      <CreateBillModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
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

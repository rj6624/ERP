import { Button } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { StatCard } from '../../components/common/StatCard';
import { PaymentAnalyticsChart } from '../../components/charts/PaymentAnalyticsChart';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RecordPaymentModal } from './RecordPaymentModal';
import {
  CreditCard,
  Plus,
  DollarSign,
  TrendingUp,
  Clock,
  Calendar,
  AlertCircle,
  Eye,
  Download,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportTableToCSV } from '../../utils/exportUtils';
import { Bill } from '../../types/erp';

export const PaymentDashboardPage: React.FC = () => {
  const { bills, payments, setCurrentPage, navigateToBill, navigateToCustomer } = useERP();
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const totalInvoiced = bills.reduce((s, b) => s + b.totalAmount, 0) || 542000;
  const totalReceived = payments.reduce((s, p) => s + p.amountReceived, 0) || 81245;
  const totalPending = bills.reduce((s, b) => s + b.pendingAmount, 0) || 342800;
  const promiseDateDueBills = bills.filter((b) => b.paymentStatus === 'Promise Date Due');

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
      header: 'Received',
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
        <span
          className={`font-mono font-bold ${
            row.pendingAmount > 0 ? 'text-red-600' : 'text-slate-400'
          }`}
        >
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
      header: 'Actions',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <Button
          variant="secondary"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            navigateToBill(row.id);
          }}
          className="!min-h-[28px] !h-7 !w-7 p-0 shrink-0 cursor-pointer"
          title="View Invoice"
        >
          <Eye className="w-3.5 h-3.5 text-slate-600" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* List Header */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Admin Payment Analytics & Collections Control</h2>
          <p className="text-xs text-slate-500">
            Complete financial visibility over cash, bank transfers, UPI receipts, pending receivables, and promised date obligations.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="secondary"
            onClick={() => exportTableToCSV('payment_receivables_summary', columns, bills)}
            className="flex items-center gap-1.5"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export</span>
          </Button>
          <Button variant="primary"
            onClick={() => setIsRecordModalOpen(true)}
            className=""
          >
            <Plus className="w-3.5 h-3.5" /> Record Payment Receipt
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Today's Payment"
          value="₹76,500"
          subtitle="Collected today"
          icon={TrendingUp}
          badgeText="Received"
          badgeVariant="success"
          onClick={() => setCurrentPage('payments_received')}
        />
        <StatCard
          title="This Month"
          value={formatCurrency(totalReceived)}
          subtitle="Cumulative month collections"
          icon={DollarSign}
          trend="+18.4% vs last month"
        />
        <StatCard
          title="Pending Receivables"
          value={formatCurrency(totalPending)}
          subtitle="Outstanding invoices"
          icon={CreditCard}
          badgeText="To Collect"
          badgeVariant="danger"
          onClick={() => setCurrentPage('payments_pending')}
        />
        <StatCard
          title="Promise Date Pending"
          value={`${promiseDateDueBills.length || 7} Parties`}
          subtitle="Committed for clearance"
          icon={Clock}
          badgeText="Due Today"
          badgeVariant="warning"
          urgent={true}
          onClick={() => setCurrentPage('payments_promise_date')}
        />
      </div>

      {/* Charts Row */}
      <PaymentAnalyticsChart />

      {/* Accounts Receivables Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          All Customer Accounts & Billing Status
        </h3>
        <DataTable
          data={bills}
          columns={columns}
          onRowClick={(row) => navigateToBill(row.id)}
          searchPlaceholder="Search customer payment balances..."
          exportFilename="payment_receivables_summary"
        />
      </div>

      {isRecordModalOpen && (
        <RecordPaymentModal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
        />
      )}
    </div>
  );
};

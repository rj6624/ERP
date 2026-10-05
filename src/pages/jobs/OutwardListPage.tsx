import { Button } from '../../components/ui/Primitives';
import React from 'react';
import { useERP } from '../../context/ERPContext';
import { JewelleryJob } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ArrowUpRight, Plus, Eye } from 'lucide-react';
import { formatWeight, formatPlating, formatDateTime } from '../../utils/formatters';

export const OutwardListPage: React.FC = () => {
  const { jobs, setCurrentPage, navigateToJob, navigateToCustomer } = useERP();

  const outwardCompletedJobs = jobs.filter((j) => j.status === 'Outward Completed');

  const columns: ColumnDef<JewelleryJob>[] = [
    {
      header: 'Job ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.id}
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
      header: 'Inward Weight',
      accessorKey: 'inwardWeight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-slate-600">{formatWeight(row.inwardWeight)}</span>
      ),
    },
    {
      header: 'Outward Weight',
      accessorKey: 'outwardWeight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-emerald-800">
          {formatWeight(row.outwardWeight)}
        </span>
      ),
    },
    {
      header: 'Plating per KG',
      accessorKey: 'platingPerKg',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
          {formatPlating(row.platingPerKg)}
        </span>
      ),
    },
    {
      header: 'Plating Type',
      accessorKey: 'platingType',
      sortable: true,
      cell: (row) => <span className="font-medium text-slate-700">{row.platingType}</span>,
    },
    {
      header: 'Outward Date & Time',
      accessorKey: 'outwardDate',
      sortable: true,
      cell: (row) => <span className="text-slate-600">{formatDateTime(row.outwardDate)}</span>,
    },
    {
      header: 'Billing Status',
      accessorKey: 'billNumber',
      cell: (row) =>
        row.billNumber ? (
          <span className="font-mono text-xs text-slate-800 font-semibold">{row.billNumber}</span>
        ) : (
          <span className="text-amber-700 text-2xs bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            Pending Bill
          </span>
        ),
    },
    {
      header: 'Actions',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <Button variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            navigateToJob(row.id);
          }}
          className="inline-flex items-center gap-1 text-2xs"
          title="View Job Lifecycle"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Customer Outward Dispatches</h2>
          <p className="text-xs text-slate-500">
            Finished goods dispatch record with verified scale weight and automatically calculated Plating per KG.
          </p>
        </div>
        <Button variant="primary"
          onClick={() => setCurrentPage('create_outward')}
          className="self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Process Outward
        </Button>
      </div>

      {/* Outward Table */}
      <DataTable
        data={outwardCompletedJobs}
        columns={columns}
        onRowClick={(row) => navigateToJob(row.id)}
        searchPlaceholder="Search Outward by Job ID, Customer, Plating..."
        exportFilename="outward_dispatches"
      />
    </div>
  );
};

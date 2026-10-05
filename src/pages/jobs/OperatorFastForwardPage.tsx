import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { Button } from '../../components/ui/Primitives';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JewelleryJob } from '../../types/erp';
import { formatWeight, formatDate } from '../../utils/formatters';
import { calculateAgeDays } from '../../utils/calculations';
import {
  Zap,
  ArrowUpRight,
  Eye,
  Plus,
} from 'lucide-react';

export const OperatorFastForwardPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, navigateToCustomer } = useERP();

  // Fast Forward jobs that are NOT outward completed
  const pendingFastForwardJobs = useMemo(
    () => jobs.filter((j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed'),
    [jobs]
  );

  const columns: ColumnDef<JewelleryJob>[] = [
    {
      header: 'Job ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      sortable: true,
      cell: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateToCustomer(row.customerId);
          }}
          className="text-left font-bold text-xs text-slate-800 hover:text-blue-600 hover:underline"
        >
          {row.customerName}
        </button>
      ),
    },
    {
      header: 'Plating Type',
      accessorKey: 'platingType',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-700">
          {row.platingType}
        </span>
      ),
    },
    {
      header: 'Inward Weight',
      accessorKey: 'inwardWeight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          {formatWeight(row.inwardWeight)}
        </span>
      ),
    },
    {
      header: 'Inward Date',
      accessorKey: 'inwardDate',
      sortable: true,
      cell: (row) => (
        <span className="text-2xs text-slate-600">
          {formatDate(row.inwardDate)}
        </span>
      ),
    },
    {
      header: 'Aging',
      accessorKey: 'inwardDate',
      cell: (row) => {
        const age = calculateAgeDays(row.inwardDate);
        return (
          <span
            className={`text-2xs font-extrabold font-mono px-2 py-0.5 rounded ${
              age > 2 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-800'
            }`}
          >
            {age} {age === 1 ? 'day' : 'days'}
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge type="job" value={row.status} size="sm" />,
    },
    {
      header: 'Action',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/jobs/${row.id}`)}
            className="text-xs"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/outward/new?jobId=${row.id}`)}
            className="text-xs"
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Outward
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
            Fast Forward Priority Queue ({pendingFastForwardJobs.length} Urgent Jobs)
          </h2>
          <p className="text-xs text-slate-500">
            These jobs require accelerated processing. Complete outward immediately once electroplating is ready.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/inward/new')}
          className="self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> New Fast Forward
        </Button>
      </div>

      {/* Priority Queue DataTable */}
      <DataTable
        data={pendingFastForwardJobs}
        columns={columns}
        onRowClick={(row) => navigate(`/jobs/${row.id}`)}
        searchPlaceholder="Search urgent priority jobs..."
        exportFilename="fast_forward_queue"
      />
    </div>
  );
};

import { Button } from '../../components/ui/Primitives';
import React from 'react';
import { useERP } from '../../context/ERPContext';
import { JewelleryJob } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { calculateAgeDays } from '../../utils/calculations';
import { formatWeight, formatDate } from '../../utils/formatters';
import { Zap, ArrowUpRight, Eye, AlertCircle, Clock, Plus } from 'lucide-react';

export const FastForwardQueuePage: React.FC = () => {
  const { jobs, setCurrentPage, navigateToJob, navigateToCustomer } = useERP();

  // Show only Priority = Fast Forward AND Status != Outward Completed
  const fastForwardPendingJobs = jobs.filter(
    (j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed'
  );

  const columns: ColumnDef<JewelleryJob>[] = [
    {
      header: 'Job ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-extrabold text-xs bg-amber-100 text-amber-950 border border-amber-300 px-2 py-0.5 rounded shadow-sm">
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
        <span className="font-mono font-bold text-slate-900">
          {formatWeight(row.inwardWeight)}
        </span>
      ),
    },
    {
      header: 'Plating Type',
      accessorKey: 'platingType',
      sortable: true,
      cell: (row) => <span className="font-semibold text-slate-800">{row.platingType}</span>,
    },
    {
      header: 'Received Date',
      accessorKey: 'inwardDate',
      sortable: true,
      cell: (row) => <span className="text-slate-600">{formatDate(row.inwardDate)}</span>,
    },
    {
      header: 'Queue Age',
      accessorKey: 'inwardDate',
      sortable: true,
      align: 'center',
      cell: (row) => {
        const age = calculateAgeDays(row.inwardDate);
        return (
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${
              age >= 2
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {age === 0 ? 'Today (<24h)' : `${age} day${age > 1 ? 's' : ''}`}
          </span>
        );
      },
    },
    {
      header: 'Processing Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge type="job" value={row.status} />,
    },
    {
      header: 'Action',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button variant="secondary" size="icon"
            onClick={() => navigateToJob(row.id)}
            className=""
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button variant="primary" size="sm"
            onClick={() => setCurrentPage('create_outward')}
            className="inline-flex items-center gap-1"
          >
            <ArrowUpRight className="w-3 h-3" /> Process Outward
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
            Fast Forward Priority Queue ({fastForwardPendingJobs.length} Urgent Jobs)
          </h2>
          <p className="text-xs text-slate-500">
            Active priority queue. Jobs auto-clear from this queue as soon as Outward dispatch is recorded.
          </p>
        </div>

        <Button variant="primary"
          onClick={() => setCurrentPage('create_inward')}
          className="self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> New Fast Forward
        </Button>
      </div>

      {/* Fast Forward Table */}
      <DataTable
        data={fastForwardPendingJobs}
        columns={columns}
        onRowClick={(row) => navigateToJob(row.id)}
        searchPlaceholder="Search urgent queue..."
        emptyTitle="No Pending Fast Forward Jobs"
        emptyDescription="All priority expedited batches have been successfully processed and dispatched."
        exportFilename="fast_forward_queue"
      />
    </div>
  );
};

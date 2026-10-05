import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { Button } from '../../components/ui/Primitives';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JewelleryJob } from '../../types/erp';
import { formatWeight, formatPlating, formatDateTime } from '../../utils/formatters';
import {
  ArrowUpRight,
  Zap,
  Eye,
  Plus,
} from 'lucide-react';

export const OperatorOutwardPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, navigateToCustomer } = useERP();

  const [activeFilterTab, setActiveFilterTab] = useState<'READY' | 'FAST_FORWARD' | 'COMPLETED' | 'ALL'>('READY');

  const readyJobs = useMemo(() => jobs.filter((j) => j.status !== 'Outward Completed'), [jobs]);
  const fastForwardJobs = useMemo(
    () => jobs.filter((j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed'),
    [jobs]
  );
  const completedJobs = useMemo(() => jobs.filter((j) => j.status === 'Outward Completed'), [jobs]);

  const filteredJobs = useMemo(() => {
    switch (activeFilterTab) {
      case 'READY':
        return readyJobs;
      case 'FAST_FORWARD':
        return fastForwardJobs;
      case 'COMPLETED':
        return completedJobs;
      case 'ALL':
      default:
        return jobs;
    }
  }, [activeFilterTab, readyJobs, fastForwardJobs, completedJobs, jobs]);

  const columns: ColumnDef<JewelleryJob>[] = [
    {
      header: 'Job ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded">
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
      header: 'Outward Weight',
      accessorKey: 'outwardWeight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {row.outwardWeight ? formatWeight(row.outwardWeight) : '—'}
        </span>
      ),
    },
    {
      header: 'Plating / KG',
      accessorKey: 'platingPerKg',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
          {row.platingPerKg ? formatPlating(row.platingPerKg) : '—'}
        </span>
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-bold ${
            row.priority === 'Fast Forward'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {row.priority === 'Fast Forward' && <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />}
          {row.priority}
        </span>
      ),
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
          {row.status !== 'Outward Completed' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/outward/new?jobId=${row.id}`)}
              className="text-xs"
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Process Outward
            </Button>
          ) : (
            <span className="text-2xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              Dispatched
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner - Standard Application Theme */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Customer Outward Queue
          </h2>
          <p className="text-xs text-slate-500">
            Verify finished jewellery, capture verified outward weight, calculate Plating per KG automatically, and record dispatches.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/outward/new')}
          className="self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Process Outward Directly
        </Button>
      </div>

      {/* Unified DataTable with Filter Tabs next to Export */}
      <DataTable
        data={filteredJobs}
        columns={columns}
        onRowClick={(row) => navigate(`/jobs/${row.id}`)}
        searchPlaceholder="Search Outward by Job ID, Customer, Plating..."
        exportFilename="customer_outward_queue"
        actions={
          <div className="erp-toolbar-control inline-flex items-center p-1 bg-slate-100 border border-slate-200 shrink-0 gap-1">
            <button
              type="button"
              onClick={() => setActiveFilterTab('READY')}
              className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                activeFilterTab === 'READY'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ready for Outward ({readyJobs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilterTab('FAST_FORWARD')}
              className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeFilterTab === 'FAST_FORWARD'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              Fast Forward ({fastForwardJobs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilterTab('COMPLETED')}
              className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                activeFilterTab === 'COMPLETED'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed Outward ({completedJobs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilterTab('ALL')}
              className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                activeFilterTab === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Jobs ({jobs.length})
            </button>
          </div>
        }
      />
    </div>
  );
};

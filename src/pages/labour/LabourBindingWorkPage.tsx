import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import { Button, Badge } from '../../components/ui/Primitives';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LabourBindingTask } from '../../types/erp';
import { CompleteWorkModal } from '../../components/labour/CompleteWorkModal';
import { formatWeight, formatDateTime } from '../../utils/formatters';
import {
  Layers,
  Play,
  CheckCircle,
  Download,
} from 'lucide-react';
import { exportTableToCSV } from '../../utils/exportUtils';

export const LabourBindingWorkPage: React.FC = () => {
  const {
    labourBindingTasks,
    startLabourBindingTask,
    completeLabourBindingTask,
    currentUser,
    navigateToJob,
  } = useERP();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [completeModalTask, setCompleteModalTask] = useState<LabourBindingTask | null>(null);

  const isMyTask = (labourName: string) => {
    if (!currentUser?.name) return true;
    return labourName === currentUser.name || labourName.toLowerCase().includes('suresh');
  };

  const myBindingTasks = labourBindingTasks.filter((t) => isMyTask(t.labourName));

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'All') return myBindingTasks;
    return myBindingTasks.filter((task) => task.status === statusFilter);
  }, [myBindingTasks, statusFilter]);

  const handleStartWork = (taskId: string) => {
    startLabourBindingTask(taskId);
  };

  const handleConfirmComplete = (tarUsed: number, remarks: string) => {
    if (!completeModalTask) return;
    completeLabourBindingTask(completeModalTask.id, tarUsed, remarks);
    setCompleteModalTask(null);
  };

  const columns: ColumnDef<LabourBindingTask>[] = [
    {
      header: 'Task ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Job ID',
      accessorKey: 'jobId',
      sortable: true,
      cell: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            navigateToJob(row.jobId);
          }}
          className="font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded hover:text-emerald-700 cursor-pointer"
        >
          {row.jobId}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      sortable: true,
      cell: (row) => <span className="font-semibold text-xs text-slate-800">{row.customerName}</span>,
    },
    {
      header: 'Weight',
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
      header: 'Tar Used',
      accessorKey: 'tarUsed',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-700">
          {row.tarUsed > 0 ? `${row.tarUsed} ${row.tarUnit || 'g'}` : '—'}
        </span>
      ),
    },
    {
      header: 'Rate (₹/kg)',
      accessorKey: 'chargeRate',
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-700">
          ₹{row.chargeRate ? row.chargeRate.toFixed(2) : '12.50'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge type="labour" value={row.status} size="sm" />,
    },
    {
      header: 'Start Date & Time',
      accessorKey: 'startDate',
      sortable: true,
      cell: (row) => (
        <span className="text-2xs text-slate-600">
          {row.startDate ? formatDateTime(row.startDate) : '—'}
        </span>
      ),
    },
    {
      header: 'Action',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {row.status === 'Pending' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStartWork(row.id)}
              className="text-xs inline-flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Start Work
            </Button>
          )}

          {row.status === 'In Progress' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCompleteModalTask(row)}
              className="text-xs inline-flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Complete Work
            </Button>
          )}

          {row.status === 'Completed' && (
            <Badge tone="success" size="sm">
              Completed
            </Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Labour Binding Operations
          </h2>
          <p className="text-xs text-slate-500">
            Pre-electroplating copper wire stringing, fixture assembly, and sealing tar application queue.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="secondary"
            onClick={() => exportTableToCSV('labour_binding_queue', columns, filteredTasks)}
            className="flex items-center gap-1.5"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export</span>
          </Button>
          <div className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            {myBindingTasks.length} Total Binding Tasks
          </div>
        </div>
      </div>

      {/* 2. Unified DataTable */}
      <DataTable
        data={filteredTasks}
        columns={columns}
        searchPlaceholder="Search binding tasks by Job ID, Customer, or Task ID..."
        exportFilename="labour_binding_queue"
        actions={
          <div className="erp-toolbar-control inline-flex items-center p-1 bg-slate-100 border border-slate-200 shrink-0 gap-1">
            <button
              type="button"
              onClick={() => setStatusFilter('All')}
              className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                statusFilter === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({myBindingTasks.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Pending')}
              className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                statusFilter === 'Pending'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({myBindingTasks.filter((t) => t.status === 'Pending').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('In Progress')}
              className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                statusFilter === 'In Progress'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress ({myBindingTasks.filter((t) => t.status === 'In Progress').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Completed')}
              className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                statusFilter === 'Completed'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({myBindingTasks.filter((t) => t.status === 'Completed').length})
            </button>
          </div>
        }
      />

      {/* Complete Work Modal */}
      {completeModalTask && (
        <CompleteWorkModal
          isOpen={!!completeModalTask}
          onClose={() => setCompleteModalTask(null)}
          onConfirm={handleConfirmComplete}
          jobId={completeModalTask.jobId}
          customerName={completeModalTask.customerName}
          weight={completeModalTask.inwardWeight}
          workType="Binding"
          initialTarUsed={completeModalTask.tarUsed}
          initialRemarks={completeModalTask.remarks}
        />
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import { Button } from '../../components/ui/Primitives';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CompleteWorkModal } from '../../components/labour/CompleteWorkModal';
import { formatWeight, formatDateTime } from '../../utils/formatters';
import {
  Briefcase,
  Layers,
  Sparkles,
  Play,
  CheckCircle,
} from 'lucide-react';

interface UnifiedTask {
  id: string;
  jobId: string;
  customerName: string;
  workType: 'Binding' | 'Open';
  weight: number;
  startDate?: string;
  endDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  tarUsed: number;
  remarks?: string;
  createdAt?: string;
}

export const LabourMyWorkPage: React.FC = () => {
  const {
    labourBindingTasks,
    labourOpenTasks,
    startLabourBindingTask,
    completeLabourBindingTask,
    startLabourOpenTask,
    completeLabourOpenTask,
    currentUser,
    navigateToJob,
  } = useERP();

  const [typeFilter, setTypeFilter] = useState<'All' | 'Binding' | 'Open'>('All');
  const [completeModalTask, setCompleteModalTask] = useState<UnifiedTask | null>(null);

  const isMyTask = (labourName: string) => {
    if (!currentUser?.name) return true;
    return labourName === currentUser.name || labourName.toLowerCase().includes('suresh');
  };

  const myBindingTasks = labourBindingTasks.filter((t) => isMyTask(t.labourName));
  const myOpenTasks = labourOpenTasks.filter((t) => isMyTask(t.labourName));

  const allTasks: UnifiedTask[] = useMemo(() => [
    ...myBindingTasks.map((t) => ({
      id: t.id,
      jobId: t.jobId,
      customerName: t.customerName,
      workType: 'Binding' as const,
      weight: t.inwardWeight,
      startDate: t.startDate,
      endDate: t.endDate,
      status: t.status,
      tarUsed: t.tarUsed,
      remarks: t.remarks,
      createdAt: t.startDate,
    })),
    ...myOpenTasks.map((t) => ({
      id: t.id,
      jobId: t.jobId,
      customerName: t.customerName,
      workType: 'Open' as const,
      weight: t.weight,
      startDate: t.startDate,
      endDate: t.endDate,
      status: t.status,
      tarUsed: t.tarUsed,
      remarks: t.remarks,
      createdAt: t.startDate,
    })),
  ], [myBindingTasks, myOpenTasks]);

  const filteredTasks = useMemo(() => {
    if (typeFilter === 'Binding') {
      return allTasks.filter((t) => t.workType === 'Binding');
    }
    if (typeFilter === 'Open') {
      return allTasks.filter((t) => t.workType === 'Open');
    }
    return allTasks;
  }, [allTasks, typeFilter]);

  const handleStartWork = (task: UnifiedTask) => {
    if (task.workType === 'Binding') {
      startLabourBindingTask(task.id);
    } else {
      startLabourOpenTask(task.id);
    }
  };

  const handleConfirmComplete = (tarUsed: number, remarks: string) => {
    if (!completeModalTask) return;
    if (completeModalTask.workType === 'Binding') {
      completeLabourBindingTask(completeModalTask.id, tarUsed, remarks);
    } else {
      completeLabourOpenTask(completeModalTask.id, tarUsed, remarks);
    }
    setCompleteModalTask(null);
  };

  const columns: ColumnDef<UnifiedTask>[] = [
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
      header: 'Work Type',
      accessorKey: 'workType',
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-bold ${
            row.workType === 'Binding'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {row.workType === 'Binding' ? <Layers className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
          {row.workType} Work
        </span>
      ),
    },
    {
      header: 'Weight',
      accessorKey: 'weight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          {formatWeight(row.weight)}
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
          {row.tarUsed > 0 ? `${row.tarUsed} g` : '—'}
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
      header: 'End Date & Time',
      accessorKey: 'endDate',
      sortable: true,
      cell: (row) => (
        <span className="text-2xs text-slate-600">
          {row.endDate ? formatDateTime(row.endDate) : '—'}
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
              onClick={() => handleStartWork(row)}
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
            <span className="text-2xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              Completed
            </span>
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
            My Assigned Work Queue
          </h2>
          <p className="text-xs text-slate-500">
            Assigned silver jewellery wire binding, sealing tar application, and post-plating open operations.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          {filteredTasks.length} Assigned Tasks
        </div>
      </div>

      {/* 2. Unified DataTable */}
      <DataTable
        data={filteredTasks}
        columns={columns}
        searchPlaceholder="Search assigned tasks by Job ID, Customer, or Task ID..."
        exportFilename="my_assigned_work"
        actions={
          <div className="erp-toolbar-control inline-flex items-center p-1 bg-slate-100 border border-slate-200 shrink-0 gap-1">
            <button
              type="button"
              onClick={() => setTypeFilter('All')}
              className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                typeFilter === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Work ({allTasks.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('Binding')}
              className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                typeFilter === 'Binding'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              Binding ({myBindingTasks.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('Open')}
              className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                typeFilter === 'Open'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Open ({myOpenTasks.length})
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
          weight={completeModalTask.weight}
          workType={completeModalTask.workType}
          initialTarUsed={completeModalTask.tarUsed}
          initialRemarks={completeModalTask.remarks}
        />
      )}
    </div>
  );
};

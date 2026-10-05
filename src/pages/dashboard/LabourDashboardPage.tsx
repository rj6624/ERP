import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { Button, Card } from '../../components/ui/Primitives';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CompleteWorkModal } from '../../components/labour/CompleteWorkModal';
import { formatWeight, formatDateTime } from '../../utils/formatters';
import {
  Briefcase,
  Layers,
  Sparkles,
  Clock,
  CheckCircle2,
  Play,
  CheckCircle,
  FileText,
  Hammer,
} from 'lucide-react';

interface UnifiedTask {
  id: string;
  jobId: string;
  customerName: string;
  customerId?: string;
  workType: 'Binding' | 'Open';
  weight: number;
  startDate?: string;
  endDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  tarUsed: number;
  remarks?: string;
}

export const LabourDashboardPage: React.FC = () => {
  const navigate = useNavigate();
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

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [completeModalTask, setCompleteModalTask] = useState<UnifiedTask | null>(null);

  // Filter tasks assigned to current user (Suresh Parmar or matching name)
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
    })),
  ], [myBindingTasks, myOpenTasks]);

  // KPIs
  const assignedWorkCount = allTasks.filter((t) => t.status !== 'Completed').length;
  const pendingBindingCount = myBindingTasks.filter((t) => t.status === 'Pending').length;
  const pendingOpenCount = myOpenTasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = allTasks.filter((t) => t.status === 'In Progress').length;
  const completedTodayCount = allTasks.filter((t) => t.status === 'Completed').length;

  // Filtered tasks for table
  const filteredTasks = useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return allTasks.filter((t) => t.status === 'Pending');
      case 'in_progress':
        return allTasks.filter((t) => t.status === 'In Progress');
      case 'completed':
        return allTasks.filter((t) => t.status === 'Completed');
      case 'all':
      default:
        return allTasks;
    }
  }, [allTasks, activeTab]);

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
              <Play className="w-3.5 h-3.5 fill-current" /> Start
            </Button>
          )}

          {row.status === 'In Progress' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCompleteModalTask(row)}
              className="text-xs inline-flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Complete
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
    <div className="space-y-5">
      {/* 1. Header Banner - Unified Application Standard */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-slate-500 font-mono uppercase tracking-wider">
              Artisan Bench #04 • Labour Specialist
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Shift Active
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-900">Artisan Work Processing Console</h2>
          <p className="text-xs text-slate-500">
            Welcome back, <strong className="text-slate-800">{currentUser?.name || 'Suresh Parmar'}</strong>. Silver chain binding, tar sealing, and post-plating unbinding operations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            variant="secondary"
            onClick={() => navigate('/labour/reports')}
            className="inline-flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Shift Reports
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/my-work')}
            className="inline-flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5" /> My Assigned Queue
          </Button>
        </div>
      </div>

      {/* 2. Primary KPI Row (5 Core Operational KPIs) */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Bench Operational Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <StatCard
            title="Assigned Work"
            value={`${assignedWorkCount} tasks`}
            subtitle="Active queued jobs"
            icon={Briefcase}
            badgeText="Assigned"
            badgeVariant="info"
            onClick={() => navigate('/my-work')}
          />
          <StatCard
            title="Pending Binding"
            value={`${pendingBindingCount} tasks`}
            subtitle="Pre-plating fixture"
            icon={Layers}
            badgeText="Wire Queue"
            badgeVariant="warning"
            onClick={() => navigate('/labour/binding')}
          />
          <StatCard
            title="Pending Open"
            value={`${pendingOpenCount} tasks`}
            subtitle="Untying & cleaning"
            icon={Sparkles}
            badgeText="Post-Plating"
            badgeVariant="success"
            onClick={() => navigate('/labour/open')}
          />
          <StatCard
            title="In Progress Work"
            value={`${inProgressCount} tasks`}
            subtitle="On current bench"
            icon={Clock}
            badgeText="In Cycle"
            badgeVariant="warning"
            urgent={inProgressCount > 0}
            onClick={() => navigate('/my-work')}
          />
          <StatCard
            title="Completed Today"
            value={`${completedTodayCount} tasks`}
            subtitle="Done & verified"
            icon={CheckCircle2}
            badgeText="Verified"
            badgeVariant="success"
            onClick={() => navigate('/labour/reports')}
          />
        </div>
      </div>

      {/* 3. Floor Workflows & Operations */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Artisan Workflows & Bench Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Action 1 */}
          <Card
            padding="md"
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-100">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {assignedWorkCount} Assigned
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Assigned Work Queue</h4>
              <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
                Unified work list containing all assigned binding and opening tasks for your bench.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/my-work')}
                className="w-full justify-center text-xs"
              >
                <Briefcase className="w-3.5 h-3.5" /> View Assigned Work
              </Button>
            </div>
          </Card>

          {/* Action 2 */}
          <Card
            padding="md"
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-100">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  {pendingBindingCount} Pending
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Wire & Tar Binding</h4>
              <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
                Pre-electroplating copper wire stringing, fixture assembly, and sealing tar application.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/labour/binding')}
                className="w-full justify-center text-xs"
              >
                <Layers className="w-3.5 h-3.5" /> Binding Queue
              </Button>
            </div>
          </Card>

          {/* Action 3 */}
          <Card
            padding="md"
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {pendingOpenCount} Pending
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Post-Plating Open & Clean</h4>
              <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
                Post-plating wire removal, tar unbinding, ultrasonic cleaning, and batch completion.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/labour/open')}
                className="w-full justify-center text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" /> Open & Clean Queue
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Live Work Queue Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Live Artisan Work Queue
        </h3>

        {/* Unified DataTable */}
        <DataTable
          data={filteredTasks}
          columns={columns}
          searchPlaceholder="Search tasks by Job ID, Customer, or Task ID..."
          exportFilename="artisan_work_queue"
          actions={
            <div className="erp-toolbar-control inline-flex items-center p-1 bg-slate-100 border border-slate-200 shrink-0 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Tasks ({allTasks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'pending'
                    ? 'bg-white text-amber-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({allTasks.filter((t) => t.status === 'Pending').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('in_progress')}
                className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                  activeTab === 'in_progress'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Progress ({inProgressCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                  activeTab === 'completed'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed ({completedTodayCount})
              </button>
            </div>
          }
        />
      </div>

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

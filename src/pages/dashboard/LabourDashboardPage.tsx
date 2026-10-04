import { Button, Card } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Briefcase,
  Layers,
  Sparkles,
  Clock,
  CheckCircle2,
  Play,
  CheckCircle,
  ArrowRight,
  Scale,
  Calendar,
  AlertCircle,
  Hammer,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CompleteWorkModal } from '../../components/labour/CompleteWorkModal';

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
  } = useERP();

  // Filter tasks assigned to current user (Suresh Parmar or matching name)
  const isMyTask = (labourName: string) => {
    if (!currentUser?.name) return true;
    return labourName === currentUser.name || labourName.toLowerCase().includes('suresh');
  };

  const myBindingTasks = labourBindingTasks.filter((t) => isMyTask(t.labourName));
  const myOpenTasks = labourOpenTasks.filter((t) => isMyTask(t.labourName));

  // Combine tasks into unified labour assignments
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
  }

  const allTasks: UnifiedTask[] = [
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
  ];

  // KPIs
  const assignedWorkCount = allTasks.filter((t) => t.status !== 'Completed').length;
  const pendingBindingCount = myBindingTasks.filter((t) => t.status === 'Pending').length;
  const pendingOpenCount = myOpenTasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = allTasks.filter((t) => t.status === 'In Progress').length;
  const completedTodayCount = allTasks.filter((t) => t.status === 'Completed').length;

  // Active / In Progress Work
  const inProgressTasks = allTasks.filter((t) => t.status === 'In Progress');

  // Next Pending Work
  const pendingTasks = allTasks.filter((t) => t.status === 'Pending');

  // Recent Completed
  const completedTasks = allTasks.filter((t) => t.status === 'Completed').slice(0, 5);

  // Modal State for Completing Work
  const [completeModalTask, setCompleteModalTask] = useState<UnifiedTask | null>(null);

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

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Greeting & Station Status */}
      <Card padding="md" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Hammer className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">
                Work Dashboard
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Artisan Bench #4
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Welcome back, <strong className="text-slate-800">{currentUser?.name || 'Suresh Parmar'}</strong>. Manage your assigned jewellery labour tasks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Active Tasks: <span className="text-amber-600 font-bold">{inProgressCount} In Progress</span>
          </span>
        </div>
      </Card>

      {/* 2. 5 KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Assigned Work */}
        <Card padding="sm"
          onClick={() => navigate('/my-work')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Assigned Work</span>
            <Briefcase className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {assignedWorkCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Active queued jobs</p>
        </Card>

        {/* Pending Binding */}
        <Card padding="sm"
          onClick={() => navigate('/labour/binding')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pending Binding</span>
            <Layers className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">
            {pendingBindingCount}
          </div>
          <p className="text-[11px] text-amber-700/80 mt-0.5">Awaiting start</p>
        </Card>

        {/* Pending Open */}
        <Card padding="sm"
          onClick={() => navigate('/labour/open')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pending Open</span>
            <Sparkles className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">
            {pendingOpenCount}
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-0.5">Untying queue</p>
        </Card>

        {/* In Progress */}
        <Card padding="sm"
          onClick={() => navigate('/my-work')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-600">
            {inProgressCount}
          </div>
          <p className="text-[11px] text-indigo-700/80 mt-0.5">On current bench</p>
        </Card>

        {/* Completed Today */}
        <Card padding="sm"
          onClick={() => navigate('/labour/reports')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-colors cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Completed Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {completedTodayCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Done & verified</p>
        </Card>
      </div>

      {/* 3. QUICK ACTIONS (Large touch buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button variant="surface"
          onClick={() => navigate('/my-work')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:bg-blue-50/30 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                View My Work
              </div>
              <div className="text-[11px] text-slate-500">All assigned jobs list</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Button>

        <Button variant="surface"
          onClick={() => navigate('/labour/binding')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:bg-amber-50/30 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800">
                Binding Work
              </div>
              <div className="text-[11px] text-slate-500">Wiring & tar fixture jobs</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
        </Button>

        <Button variant="surface"
          onClick={() => navigate('/labour/open')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                Open Work
              </div>
              <div className="text-[11px] text-slate-500">Unbinding & cleaning queue</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
        </Button>
      </div>

      {/* 4. CURRENT WORK (In Progress Bench) */}
      <Card padding="none" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <h2 className="text-sm font-bold text-slate-900">
              Current Work (In Progress)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
              {inProgressTasks.length} active
            </span>
          </div>
          <Button variant="ghost"
            onClick={() => navigate('/my-work')}
            className="flex items-center gap-1"
          >
            View All Work <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {inProgressTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No tasks are currently in progress. Start one from the pending queue below.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {inProgressTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      task.workType === 'Binding'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {task.workType === 'Binding' ? <Layers className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                        {task.jobId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.workType === 'Binding'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {task.workType} Work
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                        IN PROGRESS
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className="font-bold text-slate-900">{task.customerName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono text-slate-700 font-bold flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-slate-400" />
                        {Number(task.weight).toFixed(3)} kg
                      </span>
                    </div>

                    {task.remarks && (
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        "{task.remarks}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Complete Action Button */}
                <div className="flex items-center gap-2 sm:self-center">
                  <Button variant="primary"
                    onClick={() => setCompleteModalTask(task)}
                    className="w-full sm:w-auto transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Work
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 5. PENDING WORK QUEUE */}
      <Card padding="none" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Pending Queue (Ready to Start)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {pendingTasks.length} pending
            </span>
          </div>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No pending tasks waiting. Great job!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      task.workType === 'Binding'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {task.workType === 'Binding' ? <Layers className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                        {task.jobId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.workType === 'Binding'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {task.workType} Work
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        PENDING
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className="font-bold text-slate-900">{task.customerName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono text-slate-700 font-bold flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-slate-400" />
                        {Number(task.weight).toFixed(3)} kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Start Work Action Button */}
                <div className="flex items-center gap-2 sm:self-center">
                  <Button variant="primary"
                    onClick={() => handleStartWork(task)}
                    className="w-full sm:w-auto transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Start Work
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 6. RECENT COMPLETED WORK */}
      <Card padding="none" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <h2 className="text-sm font-bold text-slate-900">
            Recently Completed Work
          </h2>
          <Button variant="ghost"
            onClick={() => navigate('/labour/reports')}
            className=""
          >
            Work History →
          </Button>
        </div>

        {completedTasks.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No completed records yet for today.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {completedTasks.map((task) => (
              <div key={task.id} className="p-3.5 px-5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-mono font-bold text-slate-900 mr-2">{task.jobId}</span>
                    <span className="text-slate-600 font-medium mr-2">{task.customerName}</span>
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                      {Number(task.weight).toFixed(3)} kg
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  {task.tarUsed > 0 && (
                    <span className="bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded border border-amber-200/60">
                      Tar: {task.tarUsed}g
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Complete Modal */}
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

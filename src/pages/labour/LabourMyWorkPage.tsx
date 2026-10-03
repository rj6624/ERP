import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Briefcase,
  Layers,
  Sparkles,
  Search,
  Filter,
  Play,
  CheckCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Scale,
  Calendar,
  X,
  FileText,
  ChevronRight,
  Info,
} from 'lucide-react';
import { CompleteWorkModal } from '../../components/labour/CompleteWorkModal';

export const LabourMyWorkPage: React.FC = () => {
  const {
    labourBindingTasks,
    labourOpenTasks,
    startLabourBindingTask,
    completeLabourBindingTask,
    startLabourOpenTask,
    completeLabourOpenTask,
    currentUser,
  } = useERP();

  // Active Tab: 'All' | 'Binding' | 'Open'
  const [typeFilter, setTypeFilter] = useState<'All' | 'Binding' | 'Open'>('All');
  // Status Filter: 'All' | 'Pending' | 'In Progress' | 'Completed'
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Task for Detail Drawer
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // Modal State for Completing Work
  const [completeModalTask, setCompleteModalTask] = useState<any | null>(null);

  const isMyTask = (labourName: string) => {
    if (!currentUser?.name) return true;
    return labourName === currentUser.name || labourName.toLowerCase().includes('suresh');
  };

  const myBindingTasks = labourBindingTasks.filter((t) => isMyTask(t.labourName));
  const myOpenTasks = labourOpenTasks.filter((t) => isMyTask(t.labourName));

  const allTasks = [
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
      createdAt: t.createdAt,
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
      createdAt: t.createdAt,
    })),
  ];

  // Filtering
  const filteredTasks = allTasks.filter((task) => {
    // Work Type
    if (typeFilter !== 'All' && task.workType !== typeFilter) return false;
    // Status
    if (statusFilter !== 'All' && task.status !== statusFilter) return false;
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = task.jobId.toLowerCase().includes(q);
      const matchCust = task.customerName.toLowerCase().includes(q);
      if (!matchId && !matchCust) return false;
    }
    return true;
  });

  const handleStartWork = (task: any) => {
    if (task.workType === 'Binding') {
      startLabourBindingTask(task.id);
    } else {
      startLabourOpenTask(task.id);
    }
    if (selectedTask?.id === task.id) {
      setSelectedTask({ ...selectedTask, status: 'In Progress', startDate: new Date().toISOString() });
    }
  };

  const handleConfirmComplete = (tarUsed: number, remarks: string) => {
    if (!completeModalTask) return;
    if (completeModalTask.workType === 'Binding') {
      completeLabourBindingTask(completeModalTask.id, tarUsed, remarks);
    } else {
      completeLabourOpenTask(completeModalTask.id, tarUsed, remarks);
    }
    if (selectedTask?.id === completeModalTask.id) {
      setSelectedTask({
        ...selectedTask,
        status: 'Completed',
        endDate: new Date().toISOString(),
        tarUsed,
        remarks,
      });
    }
    setCompleteModalTask(null);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            My Assigned Work
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View, start, and complete your assigned binding and open operations.
          </p>
        </div>

        {/* Work Type Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setTypeFilter('All')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              typeFilter === 'All'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Work ({allTasks.length})
          </button>
          <button
            onClick={() => setTypeFilter('Binding')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
              typeFilter === 'Binding'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Binding ({myBindingTasks.length})
          </button>
          <button
            onClick={() => setTypeFilter('Open')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
              typeFilter === 'Open'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Open ({myOpenTasks.length})
          </button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by Customer ID (DARSHAN1...) or Customer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Work List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <Briefcase className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No assigned work found</p>
            <p className="text-slate-400">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Work Type</th>
                  <th className="py-3 px-4 text-right">Weight (kg)</th>
                  <th className="py-3 px-4">Start Time</th>
                  <th className="py-3 px-4">End Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Customer */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {task.customerName}
                    </td>

                    {/* Customer ID (Read-only) */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                        {task.jobId}
                      </span>
                    </td>

                    {/* Work Type */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          task.workType === 'Binding'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {task.workType === 'Binding' ? <Layers className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                        {task.workType} Work
                      </span>
                    </td>

                    {/* Weight (strictly 3 decimals, kg unit) */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right">
                      {Number(task.weight).toFixed(3)} kg
                    </td>

                    {/* Start Time */}
                    <td className="py-3 px-4 text-slate-600">
                      {task.startDate ? (
                        <span className="text-[11px] font-medium">
                          {new Date(task.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <span className="block text-[10px] text-slate-400">
                            {new Date(task.startDate).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* End Time */}
                    <td className="py-3 px-4 text-slate-600">
                      {task.endDate ? (
                        <span className="text-[11px] font-medium">
                          {new Date(task.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <span className="block text-[10px] text-slate-400">
                            {new Date(task.endDate).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          task.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : task.status === 'In Progress'
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 animate-pulse'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {task.status === 'Pending' && (
                        <button
                          onClick={() => handleStartWork(task)}
                          className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all inline-flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Start Work
                        </button>
                      )}

                      {task.status === 'In Progress' && (
                        <button
                          onClick={() => setCompleteModalTask(task)}
                          className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all inline-flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Complete Work
                        </button>
                      )}

                      {task.status === 'Completed' && (
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <Info className="w-3.5 h-3.5 text-slate-500" />
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. DETAIL SLIDE-OVER DRAWER */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Drawer Header */}
            <div>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedTask.workType === 'Binding'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedTask.workType === 'Binding' ? <Layers className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedTask.workType} Work Details
                    </h3>
                    <p className="text-[11px] text-slate-500">Assigned Labour Operation</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-5 space-y-4">
                {/* Status Banner */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Current Status</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide ${
                      selectedTask.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : selectedTask.status === 'In Progress'
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {selectedTask.status.toUpperCase()}
                  </span>
                </div>

                {/* Core Job Details (Read-only) */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Customer Name</span>
                      <span className="font-bold text-slate-900">{selectedTask.customerName}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Customer ID</span>
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {selectedTask.jobId}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Inward Weight</span>
                      <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-slate-400" />
                        {Number(selectedTask.weight).toFixed(3)} kg
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Work Operation</span>
                      <span className="font-semibold text-slate-800">
                        {selectedTask.workType} Work
                      </span>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Start Date/Time</span>
                      <span className="font-medium text-slate-800">
                        {selectedTask.startDate
                          ? new Date(selectedTask.startDate).toLocaleString([], {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : 'Pending start'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">End Date/Time</span>
                      <span className="font-medium text-slate-800">
                        {selectedTask.endDate
                          ? new Date(selectedTask.endDate).toLocaleString([], {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : 'In progress / Not completed'}
                      </span>
                    </div>
                  </div>

                  {/* Tar Usage (where applicable) */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Tar Used</span>
                      <span className="font-bold text-amber-800 font-mono">
                        {selectedTask.tarUsed > 0 ? `${selectedTask.tarUsed} grams` : '0 grams'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Actual sealing tar consumed during {selectedTask.workType.toLowerCase()} operation.
                    </p>
                  </div>

                  {/* Remarks */}
                  {selectedTask.remarks && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                      <span className="text-slate-500 font-medium">Remarks / Notes</span>
                      <p className="text-slate-700 italic">"{selectedTask.remarks}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
              {selectedTask.status === 'Pending' && (
                <button
                  onClick={() => handleStartWork(selectedTask)}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Start {selectedTask.workType} Work
                </button>
              )}

              {selectedTask.status === 'In Progress' && (
                <button
                  onClick={() => setCompleteModalTask(selectedTask)}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete {selectedTask.workType} Work
                </button>
              )}

              {selectedTask.status === 'Completed' && (
                <div className="w-full py-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Work Completed & Timestamped
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

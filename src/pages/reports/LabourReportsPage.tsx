import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Filter,
  X,
  Scale,
} from 'lucide-react';

export const LabourReportsPage: React.FC = () => {
  const {
    labourBindingTasks,
    labourOpenTasks,
    currentUser,
  } = useERP();

  // Tab: 'Pending' | 'Completed' | 'History'
  const [activeReportTab, setActiveReportTab] = useState<'Pending' | 'Completed' | 'History'>('History');
  const [workTypeFilter, setWorkTypeFilter] = useState<'All' | 'Binding' | 'Open'>('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredTasks = allTasks.filter((task) => {
    // Tab Filter
    if (activeReportTab === 'Pending' && task.status !== 'Pending') return false;
    if (activeReportTab === 'Completed' && task.status !== 'Completed') return false;

    // Work Type Filter
    if (workTypeFilter !== 'All' && task.workType !== workTypeFilter) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = task.jobId.toLowerCase().includes(q);
      const matchCust = task.customerName.toLowerCase().includes(q);
      if (!matchId && !matchCust) return false;
    }
    return true;
  });

  const pendingCount = allTasks.filter((t) => t.status === 'Pending').length;
  const completedCount = allTasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Labour Work Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational summaries of your pending jobs, completed batches, and full work history.
          </p>
        </div>

        {/* Report Sub-Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveReportTab('History')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeReportTab === 'History'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Work History ({allTasks.length})
          </button>
          <button
            onClick={() => setActiveReportTab('Pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
              activeReportTab === 'Pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            My Pending Work ({pendingCount})
          </button>
          <button
            onClick={() => setActiveReportTab('Completed')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
              activeReportTab === 'Completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            My Completed Work ({completedCount})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search report by Customer ID or Customer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
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

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Operation:
          </span>
          {(['All', 'Binding', 'Open'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setWorkTypeFilter(type)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                workTypeFilter === type
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No report records found</p>
            <p className="text-slate-400">There are no jobs matching the selected report filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Work Type</th>
                  <th className="py-3 px-4 text-right">Weight</th>
                  <th className="py-3 px-4">Start Time</th>
                  <th className="py-3 px-4">End Time</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Customer */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {task.customerName}
                    </td>

                    {/* Customer ID */}
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
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right whitespace-nowrap">
                      {Number(task.weight).toFixed(3)} kg
                    </td>

                    {/* Start Time */}
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {task.startDate ? (
                        <span>
                          {new Date(task.startDate).toLocaleDateString([], { day: '2-digit', month: 'short' })}{' '}
                          <span className="text-slate-400 font-mono">
                            {new Date(task.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* End Time */}
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {task.endDate ? (
                        <span>
                          {new Date(task.endDate).toLocaleDateString([], { day: '2-digit', month: 'short' })}{' '}
                          <span className="text-slate-400 font-mono">
                            {new Date(task.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

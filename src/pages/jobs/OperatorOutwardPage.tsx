import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { formatWeight, formatPlating } from '../../utils/formatters';
import {
  ArrowUpRight,
  Search,
  Zap,
  Filter,
  Clock,
  CheckCircle2,
  Plus,
  Scale,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const OperatorOutwardPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'FAST_FORWARD' | 'REGULAR'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'READY' | 'COMPLETED'>('READY');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search by ID, Customer, Plating
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        job.id.toLowerCase().includes(q) ||
        job.customerName.toLowerCase().includes(q) ||
        job.platingType.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Filter Priority
      if (filterPriority === 'FAST_FORWARD' && job.priority !== 'Fast Forward') return false;
      if (filterPriority === 'REGULAR' && job.priority !== 'Regular') return false;

      // Filter Status
      if (filterStatus === 'READY' && job.status === 'Outward Completed') return false;
      if (filterStatus === 'COMPLETED' && job.status !== 'Outward Completed') return false;

      return true;
    });
  }, [jobs, searchQuery, filterPriority, filterStatus]);

  const readyCount = jobs.filter((j) => j.status !== 'Outward Completed').length;
  const ffCount = jobs.filter(
    (j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed'
  ).length;

  return (
    <div className="space-y-5 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Customer Outward Queue
            </h1>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              {readyCount} Pending Outward
            </span>
            {ffCount > 0 && (
              <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950" /> {ffCount} Urgent
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verify finished jewellery, capture outward weight, calculate plating concentration, and complete dispatch.
          </p>
        </div>

        <button
          onClick={() => navigate('/outward/new')}
          className="h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Process Outward Directly</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Job ID (e.g. DARSHAN1), Customer, Plating..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Priority Filter */}
        <div className="sm:col-span-3">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="w-full py-2 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="FAST_FORWARD">⚡ Fast Forward Only</option>
            <option value="REGULAR">Regular Priority</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full py-2 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="READY">Ready for Outward</option>
            <option value="COMPLETED">Outward Completed</option>
            <option value="ALL">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Outward Cards Grid (Touch-Friendly) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isCompleted = job.status === 'Outward Completed';
            const isFastForward = job.priority === 'Fast Forward';

            return (
              <div
                key={job.id}
                className={`bg-white rounded-2xl border-2 transition-all p-5 flex flex-col justify-between shadow-xs ${
                  isFastForward && !isCompleted
                    ? 'border-amber-400 bg-amber-50/20 shadow-md ring-1 ring-amber-300'
                    : isCompleted
                    ? 'border-slate-200 opacity-90'
                    : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <span className="font-mono font-black text-base text-slate-900">
                      {job.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isFastForward && (
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Zap className="w-3 h-3 fill-slate-950" /> FAST FORWARD
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>

                  {/* Customer & Plating */}
                  <div className="py-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Customer:</span>
                      <span className="font-bold text-slate-900">{job.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Plating Type:</span>
                      <span className="font-bold text-slate-800">{job.platingType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Inward Weight:</span>
                      <span className="font-black text-slate-900 font-mono text-sm">
                        {formatWeight(job.inwardWeight)}
                      </span>
                    </div>

                    {isCompleted && (
                      <>
                        <div className="flex justify-between pt-1 border-t border-slate-100">
                          <span className="text-slate-500 font-medium">Outward Weight:</span>
                          <span className="font-black text-emerald-800 font-mono text-sm">
                            {formatWeight(job.outwardWeight || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Plating per KG:</span>
                          <span className="font-black text-emerald-700 font-mono">
                            {formatPlating(job.platingPerKg || 0)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-slate-100">
                  {isCompleted ? (
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>View Outward Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/outward/new?jobId=${job.id}`)}
                      className={`w-full h-11 rounded-xl font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isFastForward
                          ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950'
                          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Process Outward</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            No jobs are currently ready for Outward.
          </div>
        )}
      </div>
    </div>
  );
};

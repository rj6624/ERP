import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { formatWeight, formatPlating } from '../../utils/formatters';
import {
  Zap,
  ArrowUpRight,
  Clock,
  ArrowLeft,
  Sparkles,
  Scale,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const OperatorFastForwardPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs } = useERP();

  // Fast Forward jobs that are NOT outward completed
  const pendingFastForwardJobs = jobs.filter(
    (j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed'
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-2xl p-6 text-slate-950 shadow-md border border-amber-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-black shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>FACTORY URGENT PRIORITY</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-2 text-slate-950">
              ⚡ Fast Forward Queue
            </h1>
            <p className="text-xs sm:text-sm text-slate-900 font-semibold mt-0.5">
              These jobs require accelerated processing. Complete outward immediately once plating is ready.
            </p>
          </div>

          <div className="text-right sm:text-right shrink-0">
            <span className="text-3xl sm:text-4xl font-black block font-mono">
              {pendingFastForwardJobs.length}
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900">
              Pending Urgent Jobs
            </span>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-3">
        {pendingFastForwardJobs.length > 0 ? (
          pendingFastForwardJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border-2 border-amber-400 shadow-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-lg transition-all"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-black text-slate-900 font-mono tracking-wide">
                    {job.id}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    • {job.customerName}
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    {job.platingType}
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Status: {job.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-slate-400" />
                    <span>Inward Weight:</span>
                    <span className="font-mono font-black text-slate-900 text-sm">
                      {formatWeight(job.inwardWeight)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Inward Date:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(job.inwardDate).toLocaleDateString([], {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Big & Touch-Friendly */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  <span>Inspect</span>
                </button>

                <button
                  onClick={() => navigate(`/outward/new?jobId=${job.id}`)}
                  className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Process Outward</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              No Fast Forward jobs are currently pending.
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All high-priority jobs have been processed or dispatched. Normal priority work can continue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

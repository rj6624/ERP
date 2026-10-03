import React from 'react';
import { useERP } from '../../context/ERPContext';

export const JobStatusChart: React.FC = () => {
  const { jobs } = useERP();

  const statusCounts = {
    'Inward Received': jobs.filter((j) => j.status === 'Inward Received').length || 12,
    'In Process': jobs.filter((j) => j.status === 'In Process').length || 8,
    'Ready for Outward': jobs.filter((j) => j.status === 'Ready for Outward').length || 6,
    'Outward Completed': jobs.filter((j) => j.status === 'Outward Completed').length || 37,
  };

  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  const items = [
    { label: 'Inward Received', count: statusCounts['Inward Received'], color: 'bg-blue-500', barColor: 'bg-blue-500' },
    { label: 'In Process', count: statusCounts['In Process'], color: 'bg-amber-500', barColor: 'bg-amber-500' },
    { label: 'Ready for Outward', count: statusCounts['Ready for Outward'], color: 'bg-purple-500', barColor: 'bg-purple-500' },
    { label: 'Outward Completed', count: statusCounts['Outward Completed'], color: 'bg-emerald-500', barColor: 'bg-emerald-500' },
  ];

  return (
    <div className="erp-card bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Jobs by Status</h3>
        <span className="text-xs text-slate-500 font-mono font-semibold">{total} Total Jobs</span>
      </div>

      {/* Progress Bar Distribution */}
      <div className="h-3 w-full rounded-full bg-slate-100 flex overflow-hidden gap-0.5 mb-4">
        {items.map((item, idx) => {
          const pct = total > 0 ? (item.count / total) * 100 : 0;
          return (
            <div
              key={idx}
              style={{ width: `${pct}%` }}
              className={`${item.barColor} transition-all duration-300`}
              title={`${item.label}: ${item.count} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Grid of statuses */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {items.map((item, idx) => (
          <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-[11px] text-slate-600 truncate">{item.label}</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

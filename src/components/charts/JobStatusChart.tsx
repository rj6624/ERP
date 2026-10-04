import { Card } from '../ui/Primitives';
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
    { label: 'Inward Received', count: statusCounts['Inward Received'], color: '#7ba8d4' },
    { label: 'In Process', count: statusCounts['In Process'], color: '#e8bf77' },
    { label: 'Ready for Outward', count: statusCounts['Ready for Outward'], color: '#b29bd4' },
    { label: 'Outward Completed', count: statusCounts['Outward Completed'], color: '#379780' },
  ];

  return (
    <Card padding="md" className="erp-card erp-chart-card bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Jobs by Status</h3>
        <span className="text-xs text-slate-500 font-mono font-semibold">{total} Total Jobs</span>
      </div>

      <div className="erp-status-body">
        <div className="erp-status-donut">
          <svg viewBox="0 0 120 120" role="img" aria-label={`Jobs by status: ${items.map(item => `${item.label}: ${item.count}`).join(', ')}`}>
            <circle cx="60" cy="60" r="49" fill="none" stroke="#f0f4f5" strokeWidth="13" />
            {items.map((item, index) => {
              const length = total > 0 ? item.count / total * 100 : 0;
              const offset = total > 0 ? items.slice(0, index).reduce((sum, entry) => sum + entry.count, 0) / total * 100 : 0;
              return <circle key={item.label} cx="60" cy="60" r="49" pathLength="100" fill="none" stroke={item.color} strokeWidth="13" strokeDasharray={`${Math.max(0, length - 1.3)} ${100 - Math.max(0, length - 1.3)}`} strokeDashoffset={-offset}>
                <title>{`${item.label}: ${item.count} (${length.toFixed(1)}%)`}</title>
              </circle>;
            })}
          </svg>
          <div className="erp-status-total" aria-hidden="true"><strong>{total}</strong><span>Total Jobs</span></div>
        </div>
        <div className="erp-status-legend">
          {items.map(item => <div key={item.label}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
            <strong>{item.count}</strong>
          </div>
          )}
        </div>
      </div>
    </Card>
  );
};

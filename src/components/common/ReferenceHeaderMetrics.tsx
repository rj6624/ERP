import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface MetricItem {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
}

interface ReferenceHeaderMetricsProps {
  metrics: MetricItem[];
}

export const ReferenceHeaderMetrics: React.FC<ReferenceHeaderMetricsProps> = ({ metrics }) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-4 font-sans">
      {metrics.map((m, idx) => (
        <div key={idx} className="flex-1 min-w-[140px] flex flex-col justify-center">
          <div className="text-[11px] font-medium text-slate-400 truncate tracking-tight mb-1">
            {m.label}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {m.value}
            </span>
            {m.change && (
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                  m.isPositive !== false
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {m.isPositive !== false ? (
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                )}
                {m.change}
              </span>
            )}
          </div>
          {m.subtext && (
            <div className="text-[10px] text-slate-400 mt-0.5">{m.subtext}</div>
          )}
        </div>
      ))}
    </div>
  );
};

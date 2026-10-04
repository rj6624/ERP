import { Card } from '../ui/Primitives';
import React from 'react';
import { formatWeight } from '../../utils/formatters';

export const WeightTrendChart: React.FC = () => {
  const dailyData = [
    { day: '18 Sep', inward: 210.450, outward: 215.800 },
    { day: '19 Sep', inward: 195.200, outward: 201.150 },
    { day: '20 Sep', inward: 230.800, outward: 238.400 },
    { day: '21 Sep', inward: 215.100, outward: 221.750 },
    { day: '22 Sep', inward: 240.300, outward: 247.900 },
    { day: '23 Sep', inward: 228.600, outward: 235.200 },
    { day: '24 Sep (Today)', inward: 245.650, outward: 252.300 },
  ];

  const maxVal = 260.000;

  return (
    <Card padding="md" className="erp-card erp-chart-card bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Daily Weight Comparison (7 Days)
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Inward Weight vs Outward Dispatched Weight (kg)</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-sm" />
            <span className="text-slate-600 font-medium">Inward</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-sm" />
            <span className="text-slate-600 font-medium">Outward</span>
          </div>
        </div>
      </div>

      {/* Bar graph visualizer */}
      <div className="erp-weight-plot h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-200">
        {dailyData.map((d, idx) => {
          const inwardH = (d.inward / maxVal) * 100;
          const outwardH = (d.outward / maxVal) * 100;
          const isToday = idx === dailyData.length - 1;

          return (
            <div key={idx} className="min-w-0 flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                {/* Inward Bar */}
                <div
                  style={{ height: `${inwardH}%` }}
                  className={`w-3 sm:w-4 rounded-t ${
                    isToday ? 'bg-blue-600' : 'bg-blue-400'
                  } group-hover:brightness-110 transition-all relative`}
                >
                  <div className="hidden sm:block opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded font-mono pointer-events-none whitespace-nowrap z-10">
                    {formatWeight(d.inward)}
                  </div>
                </div>
                {/* Outward Bar */}
                <div
                  style={{ height: `${outwardH}%` }}
                  className={`w-3 sm:w-4 rounded-t ${
                    isToday ? 'bg-emerald-600' : 'bg-emerald-400'
                  } group-hover:brightness-110 transition-all relative`}
                >
                  <div className="hidden sm:block opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded font-mono pointer-events-none whitespace-nowrap z-10">
                    {formatWeight(d.outward)}
                  </div>
                </div>
              </div>
              <span className={`text-[10px] mt-2 font-medium truncate w-full text-center ${isToday ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                {d.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-2 items-center justify-between text-xs text-slate-500">
        <span>Today's Weight Difference: <strong className="text-emerald-700 font-mono">+6.650 kg</strong></span>
        <span>Average Efficiency: <strong className="text-slate-800 font-mono">98.4%</strong></span>
      </div>
    </Card>
  );
};

import React from 'react';
import { Scale, TrendingUp, Sparkles, MoreHorizontal } from 'lucide-react';

interface ReferencePriceCardProps {
  title?: string;
  inwardWeight: number;
  outwardWeight?: number;
  platingPerKg?: number;
  pricePerKg?: number;
  totalBill?: number;
  onMoreClick?: () => void;
}

export const ReferencePriceCard: React.FC<ReferencePriceCardProps> = ({
  title = 'Weight & Plating Metrics',
  inwardWeight,
  outwardWeight,
  platingPerKg,
  pricePerKg,
  totalBill,
  onMoreClick,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        </div>
        <button
          onClick={onMoreClick}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          More
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] font-medium text-slate-400">Inward Weight</div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black text-slate-900 font-mono">
              {Number(inwardWeight).toFixed(3)}
            </span>
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium text-slate-400">Plating per KG</div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black text-slate-900 font-mono">
              {platingPerKg !== undefined ? platingPerKg.toFixed(3) : '53.659'}
            </span>
            <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-600">
              g/kg
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-slate-600 text-xs">
        <div>
          <div className="text-[10px] text-slate-400 font-medium">Outward Weight</div>
          <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
            {outwardWeight ? `${Number(outwardWeight).toFixed(3)} kg` : '— (Pending)'}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 font-medium">Weight Delta</div>
          <div className="font-mono font-bold text-emerald-700 text-xs mt-0.5">
            {outwardWeight ? `+${(outwardWeight - inwardWeight).toFixed(3)} kg` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ChevronDown, Building2, User, Scale, Sparkles, Layers } from 'lucide-react';

interface ReferenceEntityCardProps {
  id: string;
  title?: string;
  customerName: string;
  customerSubtitle?: string;
  customerLogoUrl?: string;
  creatorName: string;
  creatorAvatarUrl?: string;
  artisanName: string;
  artisanAvatarUrl?: string;
  inwardWeight: number;
  platingType: string;
  priority?: 'Regular' | 'Fast Forward';
  status: string;
  onStatusClick?: () => void;
}

export const ReferenceEntityCard: React.FC<ReferenceEntityCardProps> = ({
  id,
  title,
  customerName,
  customerSubtitle = 'Jewellery Retail & Exports',
  creatorName = 'Ramesh Patel (Operator)',
  artisanName = 'Suresh Parmar (Artisan Bench #4)',
  inwardWeight,
  platingType,
  priority = 'Regular',
  status,
  onStatusClick,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 font-sans text-xs">
      {/* Title */}
      <h2 className="text-base font-bold text-slate-900">
        {title || `Application #${id}`}
      </h2>

      {/* Grid of details matching reference image 1 & 2 */}
      <div className="space-y-3.5">
        {/* Customer */}
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="col-span-5 text-slate-400 font-medium text-[11px]">Customer</div>
          <div className="col-span-7 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-[10px] flex items-center justify-center shrink-0">
              {customerName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-slate-900 truncate block text-xs">{customerName}</span>
              <span className="text-[10px] text-slate-400 block truncate">{customerSubtitle}</span>
            </div>
          </div>
        </div>

        {/* Created an application */}
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="col-span-5 text-slate-400 font-medium text-[11px]">Created an application</div>
          <div className="col-span-7 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
              RP
            </div>
            <span className="font-semibold text-slate-800 text-xs truncate">{creatorName}</span>
          </div>
        </div>

        {/* Responsible artisan */}
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="col-span-5 text-slate-400 font-medium text-[11px]">Responsible artisan</div>
          <div className="col-span-7 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">
              SP
            </div>
            <span className="font-semibold text-slate-800 text-xs truncate">{artisanName}</span>
          </div>
        </div>

        {/* Inward Weight */}
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="col-span-5 text-slate-400 font-medium text-[11px]">Inward weight</div>
          <div className="col-span-7 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full border-2 border-slate-900"></span>
            <span className="font-mono font-bold text-slate-900 text-xs">{Number(inwardWeight).toFixed(3)} kg</span>
          </div>
        </div>

        {/* Plating Type */}
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="col-span-5 text-slate-400 font-medium text-[11px]">Plating formulation</div>
          <div className="col-span-7 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-900"></span>
            <span className="font-bold text-slate-900 text-xs">{platingType}</span>
          </div>
        </div>

        {/* Status Dropdown Pill with Keyboard Shortcut */}
        <div className="grid grid-cols-12 items-center gap-2 pt-1 border-t border-slate-100">
          <div className="col-span-5 text-slate-400 font-medium text-[11px]">Status</div>
          <div className="col-span-7">
            <button
              onClick={onStatusClick}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 text-xs font-semibold text-slate-800 transition-colors"
            >
              <span className="truncate">{status}</span>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] bg-white text-slate-500 rounded border border-slate-200">
                  ⌘C
                </kbd>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

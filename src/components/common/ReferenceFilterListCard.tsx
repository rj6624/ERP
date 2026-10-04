import { Card } from '../ui/Primitives';
import React from 'react';
import { Check } from 'lucide-react';

export interface FilterListItem {
  id: string;
  label: string;
  count: number;
  colorDot?: string;
  checked: boolean;
}

interface ReferenceFilterListCardProps {
  title?: string;
  items: FilterListItem[];
  onToggle: (id: string) => void;
}

export const ReferenceFilterListCard: React.FC<ReferenceFilterListCardProps> = ({
  title = 'Job Filters',
  items,
  onToggle,
}) => {
  return (
    <Card padding="sm" className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2.5 font-sans text-xs">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onToggle(item.id)}
          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                item.checked
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 bg-white'
              }`}
            >
              {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
            </div>

            {item.colorDot && (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.colorDot }}
              />
            )}

            <span className={`font-semibold ${item.checked ? 'text-slate-900' : 'text-slate-600'}`}>
              {item.label}
            </span>
          </div>

          <span className="text-slate-400 font-mono text-[11px] font-medium">{item.count}</span>
        </div>
      ))}
    </Card>
  );
};

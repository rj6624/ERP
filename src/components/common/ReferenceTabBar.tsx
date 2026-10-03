import React from 'react';

export interface TabOption {
  id: string;
  label: string;
  count?: number;
  colorDot?: string; // e.g. '#10b981', '#3b82f6', '#f59e0b', '#ef4444'
}

interface ReferenceTabBarProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const ReferenceTabBar: React.FC<ReferenceTabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-1 overflow-x-auto custom-scrollbar font-sans text-xs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            {tab.colorDot && (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: tab.colorDot }}
              />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] font-semibold px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

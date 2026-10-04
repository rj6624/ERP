import { Badge, TabButton } from '../ui/Primitives';
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
    <div className="ds-tabs" role="group" aria-label="Filter views">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TabButton active={isActive}
            key={tab.id}

            onClick={() => onTabChange(tab.id)}
            className=""
          >
            {tab.colorDot && (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: tab.colorDot }}
              />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <Badge tone={isActive ? 'success' : 'neutral'}>
                {tab.count}
              </Badge>
            )}
          </TabButton>
        );
      })}
    </div>
  );
};

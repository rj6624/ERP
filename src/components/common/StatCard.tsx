import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  badgeText?: string;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  trend?: string;
  onClick?: () => void;
  className?: string;
  urgent?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = 'neutral',
  trend,
  onClick,
  className = '',
  urgent = false,
}) => {
  const badgeClasses = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  }[badgeVariant];

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      } : undefined}
      onClick={onClick}
      className={`erp-stat-card erp-card bg-white border ${
        urgent ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
      } ${onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-md' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${urgent ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {(badgeText || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          {badgeText && (
            <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${badgeClasses}`}>
              {badgeText}
            </span>
          )}
          {trend && <span className="text-slate-500 font-medium text-[11px]">{trend}</span>}
        </div>
      )}
    </div>
  );
};

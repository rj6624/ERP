import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge, Card } from '../ui/Primitives';

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
  return (
    <Card
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      } : undefined}
      onClick={onClick}
      data-urgent={urgent}
      className={`erp-stat-card erp-card bg-white border ${
        urgent ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
      } ${onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-md' : ''} ${className}`}
    >
      <div className="erp-stat-heading">
        <p>{title}</p>
        {Icon && (
          <div className="erp-stat-icon">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="erp-stat-value">{value}</div>
      {subtitle && <p className="erp-stat-subtitle">{subtitle}</p>}

      {(badgeText || trend) && (
        <div className="erp-stat-footer">
          {badgeText && (
            <Badge tone={badgeVariant}>
              {badgeText}
            </Badge>
          )}
          {trend && <span className="text-slate-500 font-medium text-[11px]">{trend}</span>}
        </div>
      )}
    </Card>
  );
};

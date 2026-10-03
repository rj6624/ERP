import React from 'react';
import { JobStatus, JobPriority, PaymentStatus, StockStatus, LabourStatus } from '../../types/erp';
import { Zap, AlertTriangle, CheckCircle, Clock, XCircle, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  type: 'job' | 'priority' | 'payment' | 'stock' | 'labour' | 'user';
  value: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-semibold';

  // Priority Badges
  if (type === 'priority') {
    const priority = value as JobPriority;
    if (priority === 'Fast Forward') {
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded bg-amber-500 text-slate-950 shadow-sm border border-amber-400 animate-pulse ${sizeClasses}`}>
          <Zap className="w-3 h-3 fill-slate-950" />
          Fast Forward
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 font-medium rounded bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
        Regular
      </span>
    );
  }

  // Job Status Badges
  if (type === 'job') {
    const status = value as JobStatus;
    switch (status) {
      case 'Inward Received':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium ${sizeClasses}`}>
            <Clock className="w-3 h-3" />
            Inward Received
          </span>
        );
      case 'In Process':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium ${sizeClasses}`}>
            <Clock className="w-3 h-3" />
            In Process
          </span>
        );
      case 'Ready for Outward':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-purple-50 text-purple-700 border border-purple-200 font-medium ${sizeClasses}`}>
            <CheckCircle className="w-3 h-3" />
            Ready for Outward
          </span>
        );
      case 'Outward Completed':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium ${sizeClasses}`}>
            <CheckCircle className="w-3 h-3" />
            Outward Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-red-50 text-red-700 border border-red-200 font-medium ${sizeClasses}`}>
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return <span className={`inline-flex items-center rounded bg-slate-100 text-slate-700 ${sizeClasses}`}>{value}</span>;
    }
  }

  // Payment Status Badges
  if (type === 'payment') {
    const status = value as PaymentStatus;
    switch (status) {
      case 'Paid':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium ${sizeClasses}`}>
            <CheckCircle className="w-3 h-3" />
            Paid
          </span>
        );
      case 'Partially Paid':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium ${sizeClasses}`}>
            <Clock className="w-3 h-3" />
            Partially Paid
          </span>
        );
      case 'Promise Date Due':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-orange-50 text-orange-800 border border-orange-200 font-semibold ${sizeClasses}`}>
            <AlertTriangle className="w-3 h-3" />
            Promise Date Due
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-red-50 text-red-700 border border-red-200 font-medium ${sizeClasses}`}>
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  }

  // Stock Status Badges
  if (type === 'stock') {
    const status = value as StockStatus;
    switch (status) {
      case 'Healthy':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium ${sizeClasses}`}>
            <CheckCircle className="w-3 h-3" />
            Healthy
          </span>
        );
      case 'Low Stock':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium ${sizeClasses}`}>
            <AlertTriangle className="w-3 h-3" />
            Low Stock
          </span>
        );
      case 'Out of Stock':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-red-50 text-red-700 border border-red-200 font-medium ${sizeClasses}`}>
            <ShieldAlert className="w-3 h-3" />
            Out of Stock
          </span>
        );
      default:
        return <span className={`inline-flex items-center rounded bg-slate-100 text-slate-700 ${sizeClasses}`}>{value}</span>;
    }
  }

  // Labour Status Badges
  if (type === 'labour') {
    const status = value as LabourStatus;
    switch (status) {
      case 'Completed':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium ${sizeClasses}`}>
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium ${sizeClasses}`}>
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium ${sizeClasses}`}>
            Pending
          </span>
        );
    }
  }

  // User Status
  if (type === 'user') {
    if (value === 'Active') {
      return (
        <span className={`inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium ${sizeClasses}`}>
          Active
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium ${sizeClasses}`}>
        Inactive
      </span>
    );
  }

  return <span className={`inline-flex items-center rounded bg-slate-100 text-slate-700 ${sizeClasses}`}>{value}</span>;
};

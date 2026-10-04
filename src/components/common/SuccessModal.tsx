import React, { useId, ReactNode } from 'react';
import { DialogSurface } from '../ui/DialogSurface';
import { Button } from '../ui/Primitives';
import { CheckCircle2, Sparkles, X, ArrowRight } from 'lucide-react';

export interface SuccessDetailItem {
  label: string;
  value: ReactNode;
  isMono?: boolean;
  isHighlight?: boolean;
  badge?: {
    text: string;
    variant?: 'success' | 'warning' | 'info' | 'purple' | 'neutral';
  };
}

export interface SuccessModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
}

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  greeting?: string;
  message?: string;
  details?: SuccessDetailItem[];
  primaryAction?: SuccessModalAction;
  secondaryAction?: SuccessModalAction;
  dismissText?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  iconVariant?: 'emerald' | 'blue' | 'purple' | 'amber';
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  greeting = 'Action Completed Successfully!',
  message,
  details = [],
  primaryAction,
  secondaryAction,
  dismissText = 'Done',
  maxWidth = 'lg',
  iconVariant = 'emerald',
}) => {
  const titleId = useId();
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth];

  const iconColors = {
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'text-emerald-600',
    },
    blue: {
      bg: 'bg-blue-500/10 text-blue-600 ring-blue-500/20',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: 'text-blue-600',
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-600 ring-purple-500/20',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: 'text-purple-600',
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600 ring-amber-500/20',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'text-amber-600',
    },
  }[iconVariant];

  const getBadgeClass = (variant?: string) => {
    switch (variant) {
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'purple':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'neutral':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'success':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="ds-overlay erp-modal fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <DialogSurface
        onClose={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex flex-col w-full ${maxWidthClass} bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150`}
      >
        {/* Top Header Banner */}
        <div className="relative p-5 sm:p-6 pb-4 text-center border-b border-slate-100 bg-linear-to-b from-slate-50/90 to-white">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Success Icon Badge with Ripple */}
          <div className="inline-flex items-center justify-center mb-3 relative">
            <div className={`w-14 h-14 rounded-2xl ${iconColors.bg} ring-8 flex items-center justify-center shadow-xs transition-transform`}>
              <CheckCircle2 className={`w-8 h-8 ${iconColors.icon}`} />
            </div>
            <div className="absolute -top-1 -right-1 p-1 bg-amber-400 text-slate-950 rounded-full shadow-xs">
              <Sparkles className="w-3 h-3 fill-slate-950" />
            </div>
          </div>

          <h3 id={titleId} className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {title}
          </h3>
          {greeting && (
            <p className="text-xs font-semibold text-emerald-700 mt-1">
              {greeting}
            </p>
          )}
          {message && (
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
          )}
        </div>

        {/* Details Card Grid */}
        {details.length > 0 && (
          <div className="p-4 sm:p-5 max-h-[50vh] overflow-y-auto space-y-2.5">
            <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-3.5 divide-y divide-slate-200/60 text-xs">
              {details.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-3 ${idx === 0 ? 'pb-2' : idx === details.length - 1 ? 'pt-2' : 'py-2'}`}
                >
                  <span className="text-slate-500 font-medium">{item.label}</span>
                  <div className="flex items-center gap-2 text-right">
                    <span
                      className={`font-semibold ${item.isHighlight ? 'text-sm font-bold text-slate-900' : 'text-slate-800'} ${item.isMono ? 'font-mono' : ''}`}
                    >
                      {item.value}
                    </span>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getBadgeClass(item.badge.variant)}`}>
                        {item.badge.text}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 pt-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center">
            {dismissText && (
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full sm:w-auto text-xs text-slate-500 hover:text-slate-800 justify-center"
              >
                {dismissText}
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'secondary'}
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-medium"
              >
                {secondaryAction.icon}
                <span>{secondaryAction.label}</span>
              </Button>
            )}

            {primaryAction && (
              <Button
                variant={primaryAction.variant || 'primary'}
                onClick={primaryAction.onClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold shadow-xs"
              >
                {primaryAction.icon || <ArrowRight className="w-3.5 h-3.5" />}
                <span>{primaryAction.label}</span>
              </Button>
            )}
          </div>
        </div>
      </DialogSurface>
    </div>
  );
};

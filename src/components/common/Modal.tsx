import { DialogSurface } from '../ui/DialogSurface';
import { Button } from '../ui/Primitives';
import React, { useId, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  footer?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  footer,
}) => {
  const titleId = useId();
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="ds-overlay erp-modal fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <DialogSurface onClose={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex flex-col max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] w-full ${maxWidthClass} bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-slate-200 bg-slate-50/80">
          <div>
            <h3 id={titleId} className="text-sm font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <Button variant="ghost" size="icon"
            aria-label="Close dialog"
            onClick={onClose}
            className="transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="min-h-0 p-4 sm:p-5 overflow-y-auto overscroll-contain text-xs text-slate-700">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 px-4 sm:px-5 py-3 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </DialogSurface>
    </div>
  );
};

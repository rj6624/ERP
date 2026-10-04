import { Button } from '../ui/Primitives';
import React, { useRef, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { Bell, CheckCheck, AlertTriangle, Zap, ShieldAlert, X } from 'lucide-react';
import { NavigationPage } from '../../types/navigation';
import { formatDateTime } from '../../utils/formatters';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ isOpen, onClose }) => {
  const { alerts, markAlertRead, clearAllAlerts, setCurrentPage, setSelectedJobId } = useERP();
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter strictly operational alerts: exclude all payment promise due & payment received notifications
  const operationalAlerts = alerts.filter(
    (a) => a.type !== 'PAYMENT_PROMISE' && a.type !== ('PAYMENT' as any)
  );
  const unreadAlerts = operationalAlerts.filter((a) => !a.isRead);

  const handleAlertClick = (alert: any) => {
    markAlertRead(alert.id);
    if (alert.targetModule === 'job_detail' && alert.targetId) {
      setSelectedJobId(alert.targetId);
      setCurrentPage('job_detail');
    } else if (alert.targetModule) {
      setCurrentPage(alert.targetModule as NavigationPage);
    }
    onClose();
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'FAST_FORWARD':
        return <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case 'LOW_STOCK':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'OVERDUE_JOB':
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div
      ref={popoverRef}
      className="ds-popover erp-notifications absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 font-sans"
    >
      {/* Header */}
      <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Operational Alerts</h3>
          {unreadAlerts.length > 0 && (
            <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
              {unreadAlerts.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadAlerts.length > 0 && (
            <Button variant="ghost" size="sm"
              onClick={clearAllAlerts}
              className="flex items-center gap-1 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Clear
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="" aria-label="Close dialog">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs custom-scrollbar">
        {operationalAlerts.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            <CheckCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
            <p className="font-semibold text-slate-700">No active alerts</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              All tracked materials and jobs are within normal thresholds.
            </p>
          </div>
        ) : (
          operationalAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => handleAlertClick(alert)}
              className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                alert.isRead ? 'bg-white opacity-70 hover:opacity-100' : 'bg-slate-50/80 hover:bg-slate-100/80'
              }`}
            >
              <div className="mt-0.5 shrink-0">{getAlertIcon(alert.type)}</div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`font-semibold text-xs truncate ${
                      alert.isRead ? 'text-slate-700' : 'text-slate-900 font-bold'
                    }`}
                  >
                    {alert.title}
                  </span>
                  {!alert.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  )}
                </div>
                <p className="text-slate-500 text-[11px] leading-snug">{alert.message}</p>
                <span className="text-2xs font-mono text-slate-400 block pt-0.5">
                  {formatDateTime(alert.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
        <Button variant="ghost"
          onClick={() => {
            onClose();
            setCurrentPage('alerts');
          }}
          className=""
        >
          View All Alerts & Thresholds →
        </Button>
      </div>
    </div>
  );
};

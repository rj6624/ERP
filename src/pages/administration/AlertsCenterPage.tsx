import { Button, Card, Input } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Bell,
  Sliders,
  AlertTriangle,
  Zap,
  Clock,
  FlaskConical,
  Flame,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const AlertsCenterPage: React.FC = () => {
  const {
    alerts,
    systemConfig,
    updateSystemConfig,
    markAlertRead,
    clearAllAlerts,
    setCurrentPage,
    navigateToJob,
  } = useERP();

  const [thresholdDays, setThresholdDays] = useState(
    systemConfig.overduePendingThresholdDays.toString()
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Operational alerts only (Section 37: 5-day pending, Fast Forward, low chemical/acid/metal/tar stock)
  const operationalAlerts = alerts.filter(
    (a) => a.type !== 'PAYMENT_PROMISE' && a.type !== ('PAYMENT' as any)
  );

  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    const days = parseInt(thresholdDays, 10);
    if (isNaN(days) || days <= 0) return;
    updateSystemConfig({ overduePendingThresholdDays: days });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'FAST_FORWARD':
        return <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case 'LOW_STOCK':
        return <FlaskConical className="w-4 h-4 text-orange-500" />;
      case 'OVERDUE_JOB':
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* List Header */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Operational Alerts & Threshold Rule Center</h2>
          <p className="text-xs text-slate-500">
            Monitor and configure plant alerts for overdue jewellery jobs, low chemical tanks, and fast forward queues.
          </p>
        </div>

        <Button variant="primary"
          onClick={clearAllAlerts}
          className="self-start sm:self-auto"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Mark All as Resolved
        </Button>
      </div>

      {/* Threshold Configuration Card */}
      <Card padding="md" className="erp-card bg-white p-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <Sliders className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Automated Alert Thresholds & Parameters
          </h3>
        </div>

        <form onSubmit={handleSaveThreshold} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Job Overdue Alert Threshold (Days) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="1"
                max="60"
                value={thresholdDays}
                onChange={(e) => setThresholdDays(e.target.value)}
                className="w-28 font-mono"
              />
              <span className="text-xs text-slate-500 font-medium">
                Days from Inward receipt (Default: <strong>5 days</strong>)
              </span>
              <Button variant="primary" type="submit" className="ml-auto">
                Save Threshold
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Any customer job lingering in 'In Process' or 'Inward Received' beyond this threshold automatically triggers an urgent Admin alert.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Overdue threshold updated to {systemConfig.overduePendingThresholdDays} days!</span>
            </div>
          )}
        </form>
      </Card>

      {/* Active Alerts List */}
      <Card padding="md" className="erp-card bg-white p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Active Plant Alerts ({operationalAlerts.length})
          </h3>
          <span className="text-2xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
            {operationalAlerts.filter((a) => !a.isRead).length} Unresolved
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {operationalAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-lg flex items-start justify-between gap-4 transition-colors ${
                !alert.isRead ? 'bg-amber-50/40 border border-amber-200/60' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5 shadow-xs">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{alert.title}</h4>
                    {!alert.isRead && (
                      <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>
                  <p className="text-[10px] text-slate-400 font-mono pt-1">
                    Triggered: {formatDateTime(alert.timestamp)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="secondary"
                  onClick={() => {
                    markAlertRead(alert.id);
                    if (alert.targetModule === 'job_detail' && alert.targetId) {
                      navigateToJob(alert.targetId);
                    } else if (alert.targetModule) {
                      setCurrentPage(alert.targetModule as any);
                    }
                  }}
                  className="text-2xs"
                >
                  Inspect Record <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

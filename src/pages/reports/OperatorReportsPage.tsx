import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import { formatWeight, formatPlating } from '../../utils/formatters';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Calendar,
  Scale,
  Zap,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';

type OperatorReportType =
  | 'TODAY_INWARD'
  | 'TODAY_OUTWARD'
  | 'PENDING_JOBS'
  | 'FAST_FORWARD'
  | 'WEIGHT_REPORT';

export const OperatorReportsPage: React.FC = () => {
  const { jobs, customers } = useERP();

  const [activeReport, setActiveReport] = useState<OperatorReportType>('TODAY_INWARD');
  const [searchQuery, setSearchQuery] = useState('');

  const reportTabs = [
    { key: 'TODAY_INWARD' as const, label: "Today's Inward", icon: ArrowDownLeft },
    { key: 'TODAY_OUTWARD' as const, label: "Today's Outward", icon: ArrowUpRight },
    { key: 'PENDING_JOBS' as const, label: 'Pending Jobs', icon: Clock },
    { key: 'FAST_FORWARD' as const, label: 'Fast Forward Queue', icon: Zap },
    { key: 'WEIGHT_REPORT' as const, label: 'Weight & Plating Report', icon: Scale },
  ];

  // Filter jobs based on active tab & search
  const reportRows = useMemo(() => {
    let list = [...jobs];

    if (activeReport === 'TODAY_INWARD') {
      // Show inward received / today's jobs
      list = list.filter((j) => j.status !== 'Cancelled');
    } else if (activeReport === 'TODAY_OUTWARD') {
      list = list.filter((j) => j.status === 'Outward Completed');
    } else if (activeReport === 'PENDING_JOBS') {
      list = list.filter((j) => j.status !== 'Outward Completed' && j.status !== 'Cancelled');
    } else if (activeReport === 'FAST_FORWARD') {
      list = list.filter(
        (j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed'
      );
    } else if (activeReport === 'WEIGHT_REPORT') {
      list = list.filter((j) => j.inwardWeight > 0);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (j) =>
          j.id.toLowerCase().includes(q) ||
          j.customerName.toLowerCase().includes(q) ||
          j.platingType.toLowerCase().includes(q)
      );
    }

    return list;
  }, [jobs, activeReport, searchQuery]);

  // Aggregate metrics
  const totalInwardKg = reportRows.reduce((acc, j) => acc + j.inwardWeight, 0);
  const totalOutwardKg = reportRows.reduce((acc, j) => acc + (j.outwardWeight || 0), 0);
  const completedCount = reportRows.filter((j) => j.platingPerKg && j.platingPerKg > 0).length;
  const avgPlating =
    completedCount > 0
      ? reportRows.reduce((acc, j) => acc + (j.platingPerKg || 0), 0) / completedCount
      : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Operational Daily Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational verification ledgers: jewellery intake, dispatches, scale weights & plating rates
          </p>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Showing {reportRows.length} Operational Records
        </div>
      </div>

      {/* Report Tabs (Touch-Friendly Buttons) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveReport(tab.key)}
              className={`h-12 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Summary KPI Ribbon */}
      <div className="bg-emerald-950 text-white rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-sm border border-emerald-900">
        <div>
          <span className="text-[11px] text-emerald-300 font-semibold block">Total Inward Weight</span>
          <span className="text-lg font-black font-mono">{formatWeight(totalInwardKg)}</span>
        </div>
        <div>
          <span className="text-[11px] text-emerald-300 font-semibold block">Total Outward Weight</span>
          <span className="text-lg font-black font-mono">{formatWeight(totalOutwardKg)}</span>
        </div>
        <div>
          <span className="text-[11px] text-emerald-300 font-semibold block">Average Plating</span>
          <span className="text-lg font-black font-mono text-emerald-400">
            {formatPlating(avgPlating)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-emerald-300 font-semibold block">Record Count</span>
          <span className="text-lg font-black font-mono">{reportRows.length} Jobs</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search report records by Job ID, Customer, or Plating..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Job ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Plating Type</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Inward Weight</th>
                <th className="py-3 px-4 text-right">Outward Weight</th>
                <th className="py-3 px-4 text-right">Plating per KG</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportRows.length > 0 ? (
                reportRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-slate-900">
                      {row.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {row.customerName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {row.platingType}
                    </td>
                    <td className="py-3 px-4">
                      {row.priority === 'Fast Forward' ? (
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded flex items-center gap-1 w-max">
                          <Zap className="w-3 h-3 fill-slate-950" /> FAST FORWARD
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">Regular</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatWeight(row.inwardWeight)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      {row.outwardWeight ? formatWeight(row.outwardWeight) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-800">
                      {row.platingPerKg ? formatPlating(row.platingPerKg) : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          row.status === 'Outward Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.status === 'Ready for Outward'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-500">
                    No matching report records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

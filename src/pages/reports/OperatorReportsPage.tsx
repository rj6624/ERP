import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JewelleryJob } from '../../types/erp';
import { formatWeight, formatPlating, formatDate } from '../../utils/formatters';
import {
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Scale,
} from 'lucide-react';

type OperatorReportType =
  | 'TODAY_INWARD'
  | 'TODAY_OUTWARD'
  | 'PENDING_JOBS'
  | 'FAST_FORWARD'
  | 'WEIGHT_REPORT';

export const OperatorReportsPage: React.FC = () => {
  const { jobs, navigateToJob, navigateToCustomer } = useERP();

  const [activeReport, setActiveReport] = useState<OperatorReportType>('TODAY_INWARD');

  const reportTabs = [
    { key: 'TODAY_INWARD' as const, label: "Today's Inward", icon: ArrowDownLeft },
    { key: 'TODAY_OUTWARD' as const, label: "Today's Outward", icon: ArrowUpRight },
    { key: 'PENDING_JOBS' as const, label: 'Pending Jobs', icon: Clock },
    { key: 'FAST_FORWARD' as const, label: 'Fast Forward Queue', icon: Zap },
    { key: 'WEIGHT_REPORT' as const, label: 'Weight & Plating Report', icon: Scale },
  ];

  // Filter jobs based on active tab
  const reportRows = useMemo(() => {
    let list = [...jobs];

    if (activeReport === 'TODAY_INWARD') {
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

    return list;
  }, [jobs, activeReport]);

  const totalInwardKg = useMemo(
    () => reportRows.reduce((acc, r) => acc + (r.inwardWeight || 0), 0),
    [reportRows]
  );
  const totalOutwardKg = useMemo(
    () => reportRows.reduce((acc, r) => acc + (r.outwardWeight || 0), 0),
    [reportRows]
  );
  const avgPlating = useMemo(() => {
    const withPlating = reportRows.filter((r) => r.platingPerKg && r.platingPerKg > 0);
    if (!withPlating.length) return 0;
    const sum = withPlating.reduce((acc, r) => acc + (r.platingPerKg || 0), 0);
    return sum / withPlating.length;
  }, [reportRows]);

  const columns: ColumnDef<JewelleryJob>[] = [
    {
      header: 'Job ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      sortable: true,
      cell: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateToCustomer(row.customerId);
          }}
          className="text-left font-bold text-xs text-slate-800 hover:text-blue-600 hover:underline"
        >
          {row.customerName}
        </button>
      ),
    },
    {
      header: 'Plating Type',
      accessorKey: 'platingType',
      sortable: true,
      cell: (row) => <span className="text-xs font-semibold text-slate-700">{row.platingType}</span>,
    },
    {
      header: 'Inward Weight',
      accessorKey: 'inwardWeight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          {formatWeight(row.inwardWeight)}
        </span>
      ),
    },
    {
      header: 'Outward Weight',
      accessorKey: 'outwardWeight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {row.outwardWeight ? formatWeight(row.outwardWeight) : '—'}
        </span>
      ),
    },
    {
      header: 'Plating / KG',
      accessorKey: 'platingPerKg',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
          {row.platingPerKg ? formatPlating(row.platingPerKg) : '—'}
        </span>
      ),
    },
    {
      header: 'Inward Date',
      accessorKey: 'inwardDate',
      sortable: true,
      cell: (row) => <span className="text-2xs text-slate-600">{formatDate(row.inwardDate)}</span>,
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-bold ${
            row.priority === 'Fast Forward'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {row.priority === 'Fast Forward' && <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />}
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge type="job" value={row.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Operational Daily Reports
          </h2>
          <p className="text-xs text-slate-500">
            Operational verification ledgers: jewellery intake, dispatches, scale weights & plating rates.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          Showing {reportRows.length} Operational Records
        </div>
      </div>

      {/* Report Segmented Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start flex-wrap">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveReport(tab.key)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-slate-500" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Clean Summary KPI Bar */}
      <div className="bg-white rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border border-slate-200 shadow-sm">
        <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Total Inward Weight</span>
          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">{formatWeight(totalInwardKg)}</span>
        </div>
        <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Total Outward Weight</span>
          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">{formatWeight(totalOutwardKg)}</span>
        </div>
        <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Average Plating</span>
          <span className="text-base font-bold font-mono text-purple-700 mt-0.5 block">{formatPlating(avgPlating)}</span>
        </div>
        <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Record Count</span>
          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">{reportRows.length} Jobs</span>
        </div>
      </div>

      {/* Unified DataTable */}
      <DataTable
        data={reportRows}
        columns={columns}
        onRowClick={(row) => navigateToJob(row.id)}
        searchPlaceholder="Search operational report records..."
        exportFilename={`operator_report_${activeReport.toLowerCase()}`}
      />
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import { Button, TabButton } from '../../components/ui/Primitives';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JewelleryJob } from '../../types/erp';
import { formatWeight, formatPlating, formatDate } from '../../utils/formatters';
import { exportToCSV, triggerPrint } from '../../utils/exportUtils';
import {
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Scale,
  Download,
  Printer,
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

  const reportMetadata = useMemo(() => {
    switch (activeReport) {
      case 'TODAY_INWARD':
        return {
          title: "TODAY'S INWARD JEWELLERY INTAKE REPORT",
          subtitle: 'All intake batches verified on digital scale console with customer records',
        };
      case 'TODAY_OUTWARD':
        return {
          title: "TODAY'S OUTWARD DISPATCH AUDIT REPORT",
          subtitle: 'Completed finished jewellery dispatches with final verified outward weights',
        };
      case 'PENDING_JOBS':
        return {
          title: 'PENDING PLANT MANUFACTURING JOBS AUDIT',
          subtitle: 'Active floor jobs currently undergoing electroplating or labour unbinding',
        };
      case 'FAST_FORWARD':
        return {
          title: 'FAST FORWARD PRIORITY ORDER QUEUE',
          subtitle: 'Urgent turnaround jewellery orders expedited for same-day delivery',
        };
      case 'WEIGHT_REPORT':
      default:
        return {
          title: 'JEWELLERY WEIGHT PRECISION & PLATING PER KG AUDIT',
          subtitle: 'Strict 3-decimal precision weight tracking and calculated plating concentrations',
        };
    }
  }, [activeReport]);

  const handleExportCSV = () => {
    const headers = [
      'Job ID',
      'Customer',
      'Plating Type',
      'Inward Weight (kg)',
      'Outward Weight (kg)',
      'Difference (kg)',
      'Plating per KG (g/kg)',
      'Inward Date',
      'Priority',
      'Status',
    ];
    const rows = reportRows.map((j) => [
      j.id,
      j.customerName,
      j.platingType,
      j.inwardWeight.toFixed(3),
      j.outwardWeight ? j.outwardWeight.toFixed(3) : '-',
      j.outwardWeight ? (j.outwardWeight - j.inwardWeight).toFixed(3) : '-',
      j.platingPerKg ? j.platingPerKg.toFixed(3) : '-',
      j.inwardDate,
      j.priority,
      j.status,
    ]);
    exportToCSV(`operator_report_${activeReport.toLowerCase()}`, headers, rows);
  };

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
    <div className="space-y-4 font-sans">
      {/* 1. Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Operational Reports Center
          </h2>
          <p className="text-xs text-slate-500">
            Real-time operational manufacturing data: jewellery intake, dispatches, scale weights & plating rates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button variant="secondary" onClick={handleExportCSV} className="inline-flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </Button>
          <Button variant="secondary" onClick={triggerPrint} className="inline-flex items-center gap-1.5">
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Print
          </Button>
        </div>
      </div>

      {/* 2. Operational Categories Selector */}
      <div className="ds-tabs" role="group" aria-label="Operational report categories">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.key;

          return (
            <TabButton
              active={isActive}
              key={tab.key}
              onClick={() => setActiveReport(tab.key)}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </TabButton>
          );
        })}
      </div>

      {/* 3. Operational KPI Rollup Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="erp-light-panel erp-card bg-slate-900 text-white p-3.5">
          <span className="text-[11px] text-slate-400 font-medium">Total Inward Jewellery Intake</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">{formatWeight(totalInwardKg)}</p>
          <span className="text-2xs text-slate-400">All registered intake batches</span>
        </div>

        <div className="erp-light-panel erp-card bg-slate-900 text-white p-3.5">
          <span className="text-[11px] text-slate-400 font-medium">Total Outward Jewellery Dispatched</span>
          <p className="font-mono text-xl font-bold text-emerald-400 mt-0.5">{formatWeight(totalOutwardKg)}</p>
          <span className="text-2xs text-emerald-400/80">Completed verified dispatches</span>
        </div>

        <div className="erp-light-panel erp-card bg-slate-900 text-white p-3.5">
          <span className="text-[11px] text-slate-400 font-medium">Average Plating Concentration</span>
          <p className="font-mono text-xl font-bold text-purple-400 mt-0.5">{formatPlating(avgPlating)}</p>
          <span className="text-2xs text-purple-400/80">Across recorded jobs</span>
        </div>

        <div className="erp-light-panel erp-card bg-slate-900 text-white p-3.5">
          <span className="text-[11px] text-slate-400 font-medium">Total Record Count</span>
          <p className="font-mono text-xl font-bold text-blue-400 mt-0.5">{reportRows.length} Jobs</p>
          <span className="text-2xs text-blue-400/80">In current report filter</span>
        </div>
      </div>

      {/* 4. Unified DataTable */}
      <DataTable
        data={reportRows}
        columns={columns}
        onRowClick={(row) => navigateToJob(row.id)}
        title={reportMetadata.title}
        subtitle={reportMetadata.subtitle}
        searchPlaceholder="Search operational report records..."
        exportFilename={`operator_report_${activeReport.toLowerCase()}`}
      />
    </div>
  );
};

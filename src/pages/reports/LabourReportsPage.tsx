import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import { Button, TabButton } from '../../components/ui/Primitives';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatWeight, formatDateTime } from '../../utils/formatters';
import { exportToCSV, triggerPrint } from '../../utils/exportUtils';
import {
  FileText,
  Clock,
  CheckCircle2,
  Layers,
  Sparkles,
  Download,
  Printer,
  Hammer,
} from 'lucide-react';

type LabourReportType = 'HISTORY' | 'PENDING' | 'COMPLETED' | 'TAR_USAGE';

interface UnifiedTask {
  id: string;
  jobId: string;
  customerName: string;
  workType: 'Binding' | 'Open';
  weight: number;
  startDate?: string;
  endDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  tarUsed: number;
  remarks?: string;
  createdAt?: string;
}

export const LabourReportsPage: React.FC = () => {
  const {
    labourBindingTasks,
    labourOpenTasks,
    currentUser,
    navigateToJob,
  } = useERP();

  const [activeReportTab, setActiveReportTab] = useState<LabourReportType>('HISTORY');

  const reportTabs = [
    { key: 'HISTORY' as const, label: 'All Work History', icon: FileText },
    { key: 'PENDING' as const, label: 'Pending Operations', icon: Clock },
    { key: 'COMPLETED' as const, label: 'Completed Batches', icon: CheckCircle2 },
    { key: 'TAR_USAGE' as const, label: 'Tar & Clean Ledger', icon: Hammer },
  ];

  const isMyTask = (labourName: string) => {
    if (!currentUser?.name) return true;
    return labourName === currentUser.name || labourName.toLowerCase().includes('suresh');
  };

  const myBindingTasks = labourBindingTasks.filter((t) => isMyTask(t.labourName));
  const myOpenTasks = labourOpenTasks.filter((t) => isMyTask(t.labourName));

  const allTasks: UnifiedTask[] = useMemo(() => [
    ...myBindingTasks.map((t) => ({
      id: t.id,
      jobId: t.jobId,
      customerName: t.customerName,
      workType: 'Binding' as const,
      weight: t.inwardWeight,
      startDate: t.startDate,
      endDate: t.endDate,
      status: t.status,
      tarUsed: t.tarUsed,
      remarks: t.remarks,
      createdAt: t.startDate,
    })),
    ...myOpenTasks.map((t) => ({
      id: t.id,
      jobId: t.jobId,
      customerName: t.customerName,
      workType: 'Open' as const,
      weight: t.weight,
      startDate: t.startDate,
      endDate: t.endDate,
      status: t.status,
      tarUsed: t.tarUsed,
      remarks: t.remarks,
      createdAt: t.startDate,
    })),
  ], [myBindingTasks, myOpenTasks]);

  const reportRows = useMemo(() => {
    if (activeReportTab === 'PENDING') {
      return allTasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress');
    }
    if (activeReportTab === 'COMPLETED') {
      return allTasks.filter((t) => t.status === 'Completed');
    }
    if (activeReportTab === 'TAR_USAGE') {
      return allTasks.filter((t) => t.tarUsed > 0);
    }
    return allTasks;
  }, [allTasks, activeReportTab]);

  const totalGrossWeight = useMemo(
    () => reportRows.reduce((acc, r) => acc + (r.weight || 0), 0),
    [reportRows]
  );
  const totalTarConsumed = useMemo(
    () => reportRows.reduce((acc, r) => acc + (r.tarUsed || 0), 0),
    [reportRows]
  );
  const totalCompletedCount = useMemo(
    () => allTasks.filter((t) => t.status === 'Completed').length,
    [allTasks]
  );

  const reportMetadata = useMemo(() => {
    switch (activeReportTab) {
      case 'PENDING':
        return {
          title: 'PENDING ARTISAN OPERATIONS QUEUE AUDIT',
          subtitle: 'Active silver jewellery batches awaiting wire binding or post-plating unbinding',
        };
      case 'COMPLETED':
        return {
          title: 'COMPLETED LABOUR BATCHES REPORT',
          subtitle: 'Historical verified labour work completed on artisan bench',
        };
      case 'TAR_USAGE':
        return {
          title: 'SEALING TAR & CLEANING CONSUMPTION LEDGER',
          subtitle: 'Material tracking for sealing tar application and untying residue cleaning',
        };
      case 'HISTORY':
      default:
        return {
          title: 'COMPLETE ARTISAN WORK HISTORY REPORT',
          subtitle: 'Full operational ledger of all silver jewellery tasks assigned to your bench',
        };
    }
  }, [activeReportTab]);

  const handleExportCSV = () => {
    const headers = [
      'Task ID',
      'Job ID',
      'Customer',
      'Work Type',
      'Weight (kg)',
      'Tar Used (g)',
      'Status',
      'Start Time',
      'End Time',
    ];
    const rows = reportRows.map((t) => [
      t.id,
      t.jobId,
      t.customerName,
      t.workType,
      t.weight.toFixed(3),
      t.tarUsed ? `${t.tarUsed} g` : '-',
      t.status,
      t.startDate ? formatDateTime(t.startDate) : '-',
      t.endDate ? formatDateTime(t.endDate) : '-',
    ]);
    exportToCSV(`labour_report_${activeReportTab.toLowerCase()}`, headers, rows);
  };

  const columns: ColumnDef<UnifiedTask>[] = [
    {
      header: 'Task ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Job ID',
      accessorKey: 'jobId',
      sortable: true,
      cell: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            navigateToJob(row.jobId);
          }}
          className="font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded hover:text-emerald-700 cursor-pointer"
        >
          {row.jobId}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      sortable: true,
      cell: (row) => <span className="font-semibold text-xs text-slate-800">{row.customerName}</span>,
    },
    {
      header: 'Work Type',
      accessorKey: 'workType',
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-bold ${
            row.workType === 'Binding'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {row.workType === 'Binding' ? <Layers className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
          {row.workType}
        </span>
      ),
    },
    {
      header: 'Weight',
      accessorKey: 'weight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          {formatWeight(row.weight)}
        </span>
      ),
    },
    {
      header: 'Tar Used',
      accessorKey: 'tarUsed',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-amber-900">
          {row.tarUsed > 0 ? `${row.tarUsed} g` : '—'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge type="labour" value={row.status} size="sm" />,
    },
    {
      header: 'Start Date & Time',
      accessorKey: 'startDate',
      sortable: true,
      cell: (row) => (
        <span className="text-2xs text-slate-600">
          {row.startDate ? formatDateTime(row.startDate) : '—'}
        </span>
      ),
    },
    {
      header: 'End Date & Time',
      accessorKey: 'endDate',
      sortable: true,
      cell: (row) => (
        <span className="text-2xs text-slate-600">
          {row.endDate ? formatDateTime(row.endDate) : '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Artisan Work Reports Center
          </h2>
          <p className="text-xs text-slate-500">
            Operational summaries of your pending tasks, completed batches, and tar material consumption.
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
      <div className="ds-tabs" role="group" aria-label="Labour report categories">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.key;

          return (
            <TabButton
              active={isActive}
              key={tab.key}
              onClick={() => setActiveReportTab(tab.key)}
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
          <span className="text-[11px] text-slate-400 font-medium">Total Processed Gross Weight</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">{formatWeight(totalGrossWeight)}</p>
          <span className="text-2xs text-slate-400">Filtered batch records</span>
        </div>

        <div className="erp-light-panel erp-card bg-slate-900 text-white p-3.5">
          <span className="text-[11px] text-slate-400 font-medium">Total Sealing Tar Used</span>
          <p className="font-mono text-xl font-bold text-amber-400 mt-0.5">{totalTarConsumed} g</p>
          <span className="text-2xs text-amber-400/80">Consumed or cleaned</span>
        </div>

        <div className="erp-light-panel erp-card bg-slate-900 text-white p-3.5">
          <span className="text-[11px] text-slate-400 font-medium">Completed Batches</span>
          <p className="font-mono text-xl font-bold text-emerald-400 mt-0.5">{totalCompletedCount} Tasks</p>
          <span className="text-2xs text-emerald-400/80">Done & verified</span>
        </div>

        <div className="erp-light-panel erp-card bg-slate-900 text-white p-3.5">
          <span className="text-[11px] text-slate-400 font-medium">Tasks in Current View</span>
          <p className="font-mono text-xl font-bold text-blue-400 mt-0.5">{reportRows.length} Tasks</p>
          <span className="text-2xs text-blue-400/80">In selected filter tab</span>
        </div>
      </div>

      {/* 4. Unified DataTable */}
      <DataTable
        data={reportRows}
        columns={columns}
        onRowClick={(row) => navigateToJob(row.jobId)}
        title={reportMetadata.title}
        subtitle={reportMetadata.subtitle}
        searchPlaceholder="Search report tasks by Job ID, Customer, or Task ID..."
        exportFilename={`labour_report_${activeReportTab.toLowerCase()}`}
      />
    </div>
  );
};

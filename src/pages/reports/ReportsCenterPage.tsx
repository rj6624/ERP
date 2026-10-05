import { Button, TabButton } from '../../components/ui/Primitives';
import React, { useState, useEffect, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { exportToCSV, triggerPrint } from '../../utils/exportUtils';
import {
  Calendar,
  Download,
  Printer,
  Users,
  Briefcase,
  Scale,
  Hammer,
  Box,
  Filter,
  Zap,
} from 'lucide-react';
import {
  formatWeight,
  formatPlating,
  formatDate,
  formatDateTime,
} from '../../utils/formatters';
import { useParams, useNavigate } from 'react-router-dom';

type OperationalCategory = 'CUSTOMER' | 'JOB' | 'WEIGHT' | 'LABOUR' | 'STOCK';

export const ReportsCenterPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const {
    customers,
    jobs,
    labourList,
    labourBindingTasks,
    labourOpenTasks,
    chemicals,
    acids,
    metals,
    tarTransactions,
    scrapRecords,
    selectedReportCategory,
    setSelectedReportCategory,
  } = useERP();

  const getInitialCategory = (): OperationalCategory => {
    if (category) {
      const upper = category.toUpperCase();
      if (['CUSTOMER', 'JOB', 'WEIGHT', 'LABOUR', 'STOCK'].includes(upper)) {
        return upper as OperationalCategory;
      }
    }
    return (selectedReportCategory as OperationalCategory) || 'WEIGHT';
  };

  const [activeCategory, setActiveCategory] = useState<OperationalCategory>(getInitialCategory());
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('7days');
  const [selectedSubReport, setSelectedSubReport] = useState<string>('all');

  useEffect(() => {
    if (category) {
      const upper = category.toUpperCase();
      if (['CUSTOMER', 'JOB', 'WEIGHT', 'LABOUR', 'STOCK'].includes(upper)) {
        setActiveCategory(upper as OperationalCategory);
      }
    } else if (selectedReportCategory) {
      setActiveCategory(selectedReportCategory as OperationalCategory);
    }
  }, [category, selectedReportCategory]);

  const categories = [
    { key: 'WEIGHT' as const, label: 'Weight & Plating Reports', icon: Scale },
    { key: 'JOB' as const, label: 'Job Traceability Reports', icon: Briefcase },
    { key: 'CUSTOMER' as const, label: 'Customer Operations', icon: Users },
    { key: 'LABOUR' as const, label: 'Labour & Tar Usage', icon: Hammer },
    { key: 'STOCK' as const, label: 'Stock & Material Ledger', icon: Box },
  ];

  // WEIGHT & PLATING REPORT COLUMNS
  const weightReportColumns: ColumnDef<any>[] = [
    {
      header: 'Customer',
      accessorKey: 'customerName',
      sortable: true,
      cell: (r) => <span className="font-bold text-slate-900">{r.customerName}</span>,
    },
    {
      header: 'Job ID',
      accessorKey: 'id',
      sortable: true,
      cell: (r) => <span className="font-mono font-bold text-slate-900">{r.id}</span>,
    },
    {
      header: 'Inward Weight',
      accessorKey: 'inwardWeight',
      sortable: true,
      align: 'right',
      cell: (r) => <span className="font-mono">{formatWeight(r.inwardWeight)}</span>,
    },
    {
      header: 'Outward Weight',
      accessorKey: 'outwardWeight',
      sortable: true,
      align: 'right',
      cell: (r) => (
        <span className="font-mono font-bold text-emerald-800">
          {r.outwardWeight ? formatWeight(r.outwardWeight) : '-'}
        </span>
      ),
    },
    {
      header: 'Difference',
      align: 'right',
      cell: (r) => (
        <span className="font-mono font-semibold text-emerald-700">
          {r.outwardWeight ? `+${formatWeight(r.outwardWeight - r.inwardWeight)}` : '-'}
        </span>
      ),
    },
    {
      header: 'Plating per KG (g/kg)',
      accessorKey: 'platingPerKg',
      sortable: true,
      align: 'right',
      cell: (r) => (
        <span className="font-mono font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
          {r.platingPerKg ? formatPlating(r.platingPerKg) : '-'}
        </span>
      ),
    },
    {
      header: 'Plating Type',
      accessorKey: 'platingType',
      cell: (r) => <span>{r.platingType}</span>,
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (r) => (
        <span
          className={`text-2xs font-bold px-1.5 py-0.5 rounded ${
            r.priority === 'Fast Forward'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {r.priority}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (r) => <StatusBadge type="job" value={r.status} />,
    },
  ];

  // Summary calculations for the Weight Report
  const totalInwardWeightSum = useMemo(
    () => jobs.reduce((s, j) => s + (j.inwardWeight || 0), 0),
    [jobs]
  );
  const totalOutwardWeightSum = useMemo(
    () => jobs.reduce((s, j) => s + (j.outwardWeight || 0), 0),
    [jobs]
  );
  const completedJobsList = jobs.filter((j) => j.status === 'Outward Completed');
  const avgPlatingRate = completedJobsList.length
    ? completedJobsList.reduce((s, j) => s + (j.platingPerKg || 0), 0) / completedJobsList.length
    : 53.659;

  const handleExport = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = 'operational_report';

    if (activeCategory === 'WEIGHT') {
      headers = ['Job ID', 'Customer', 'Inward Weight (kg)', 'Outward Weight (kg)', 'Difference (kg)', 'Plating per KG (g/kg)', 'Plating Type', 'Priority', 'Status'];
      rows = jobs.map((j) => [
        j.id,
        j.customerName,
        j.inwardWeight.toFixed(3),
        j.outwardWeight ? j.outwardWeight.toFixed(3) : '-',
        j.outwardWeight ? (j.outwardWeight - j.inwardWeight).toFixed(3) : '-',
        j.platingPerKg ? j.platingPerKg.toFixed(3) : '-',
        j.platingType,
        j.priority,
        j.status,
      ]);
      filename = 'weight_plating_report';
    } else if (activeCategory === 'JOB') {
      headers = ['Job ID', 'Customer', 'Plating Type', 'Priority', 'Inward Weight', 'Status', 'Inward Date'];
      rows = jobs.map((j) => [j.id, j.customerName, j.platingType, j.priority, j.inwardWeight.toFixed(3), j.status, j.inwardDate]);
      filename = 'job_traceability_report';
    } else if (activeCategory === 'CUSTOMER') {
      headers = ['Customer Name', 'Mobile', 'Total Jobs', 'Pending Jobs', 'Completed Jobs', 'Inward Weight (kg)', 'Outward Weight (kg)'];
      rows = customers.map((c) => [c.name, c.mobile, c.totalJobs, c.pendingJobs, c.completedJobs, c.totalInwardWeight.toFixed(3), c.totalOutwardWeight.toFixed(3)]);
      filename = 'customer_operations_report';
    } else if (activeCategory === 'LABOUR') {
      headers = ['Task ID', 'Artisan', 'Job ID', 'Customer', 'Inward Weight (kg)', 'Tar Used', 'Status'];
      rows = labourBindingTasks.map((t) => [t.id, t.labourName, t.jobId, t.customerName, t.inwardWeight.toFixed(3), `${t.tarUsed} ${t.tarUnit}`, t.status]);
      filename = 'labour_work_report';
    } else if (activeCategory === 'STOCK') {
      headers = ['Material', 'Category', 'Current Stock', 'Minimum Required', 'Unit', 'Status'];
      rows = chemicals.map((c) => [c.name, c.category, c.currentStock.toFixed(2), c.minimumStock.toFixed(2), c.unit, c.status]);
      filename = 'stock_inventory_report';
    }

    exportToCSV(filename, headers, rows);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* List Header */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Operational Reports Center</h2>
          <p className="text-xs text-slate-500">
            Real-time operational manufacturing data, weights, plating concentrations, labour, and inventory
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button variant="secondary" onClick={handleExport} className="">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
          <Button variant="secondary" onClick={triggerPrint} className="">
            <Printer className="w-3.5 h-3.5" /> Print
          </Button>
        </div>
      </div>

      {/* 2. Operational Categories Selector */}
      <div className="ds-tabs" role="group" aria-label="Report categories">
        {categories.map((c) => {
          const Icon = c.icon;
          const isActive = activeCategory === c.key;
          return (
            <TabButton active={isActive}
              key={c.key}
              onClick={() => {
                setActiveCategory(c.key);
                setSelectedReportCategory(c.key);
              }}
              className=""
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{c.label}</span>
            </TabButton>
          );
        })}
      </div>

      {/* 3. Weight KPI Rollup (When in WEIGHT category) */}
      {activeCategory === 'WEIGHT' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="erp-light-panel erp-card bg-slate-900 text-white p-3.5">
            <span className="text-[11px] text-slate-400 font-medium">Total Inward Jewellery Intake</span>
            <p className="font-mono text-xl font-bold text-white mt-0.5">{formatWeight(totalInwardWeightSum)}</p>
            <span className="text-2xs text-slate-400">All registered inward batches</span>
          </div>

          <div className="erp-light-panel erp-card bg-slate-900 text-white p-3.5">
            <span className="text-[11px] text-slate-400 font-medium">Total Outward Jewellery Dispatched</span>
            <p className="font-mono text-xl font-bold text-emerald-400 mt-0.5">{formatWeight(totalOutwardWeightSum)}</p>
            <span className="text-2xs text-emerald-400/80">Completed finished dispatches</span>
          </div>

          <div className="erp-light-panel erp-card bg-slate-900 text-white p-3.5">
            <span className="text-[11px] text-slate-400 font-medium">Average Plating Concentration</span>
            <p className="font-mono text-xl font-bold text-purple-400 mt-0.5">{formatPlating(avgPlatingRate)}</p>
            <span className="text-2xs text-purple-400/80">Across completed factory jobs</span>
          </div>
        </div>
      )}

      {/* 4. Active Category Table */}
      {activeCategory === 'WEIGHT' && (
        <DataTable
          data={jobs}
          columns={weightReportColumns}
          title="JEWELLERY WEIGHT PRECISION & PLATING PER KG AUDIT"
          subtitle="Strict 3-decimal precision tracking for all silver jewellery batches"
          exportFilename="jewellery_weight_report"
        />
      )}

      {activeCategory === 'JOB' && (
        <DataTable
          data={jobs}
          columns={[
            { header: 'Job ID', accessorKey: 'id', sortable: true, cell: (r) => <strong className="font-mono">{r.id}</strong> },
            { header: 'Customer', accessorKey: 'customerName', sortable: true },
            { header: 'Plating Type', accessorKey: 'platingType' },
            {
              header: 'Priority',
              accessorKey: 'priority',
              cell: (r) => (
                <span
                  className={`text-2xs font-bold px-1.5 py-0.5 rounded ${
                    r.priority === 'Fast Forward'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {r.priority}
                </span>
              ),
            },
            { header: 'Inward Weight', accessorKey: 'inwardWeight', align: 'right', cell: (r) => <span className="font-mono">{formatWeight(r.inwardWeight)}</span> },
            { header: 'Outward Weight', accessorKey: 'outwardWeight', align: 'right', cell: (r) => <span className="font-mono font-bold">{r.outwardWeight ? formatWeight(r.outwardWeight) : '-'}</span> },
            { header: 'Inward Date', accessorKey: 'inwardDate', cell: (r) => <span>{formatDate(r.inwardDate)}</span> },
            { header: 'Status', accessorKey: 'status', cell: (r) => <StatusBadge type="job" value={r.status} /> },
          ]}
          title="COMPLETE JOB LIFECYCLE AUDIT REPORT"
          subtitle="All registered jobs with priority, inward date, labour assignment, and outward status"
          exportFilename="jobs_lifecycle_report"
        />
      )}

      {activeCategory === 'CUSTOMER' && (
        <DataTable
          data={customers}
          columns={[
            { header: 'Customer Name', accessorKey: 'name', sortable: true, cell: (r) => <strong className="text-slate-900">{r.name}</strong> },
            { header: 'Mobile Number', accessorKey: 'mobile', cell: (r) => <span className="font-mono">{r.mobile}</span> },
            { header: 'Total Jobs', accessorKey: 'totalJobs', align: 'center', cell: (r) => <span className="font-mono">{r.totalJobs}</span> },
            { header: 'Pending Jobs', accessorKey: 'pendingJobs', align: 'center', cell: (r) => <span className="font-mono font-bold text-amber-700">{r.pendingJobs}</span> },
            { header: 'Completed Jobs', accessorKey: 'completedJobs', align: 'center', cell: (r) => <span className="font-mono font-bold text-emerald-700">{r.completedJobs}</span> },
            { header: 'Total Inward Weight', accessorKey: 'totalInwardWeight', align: 'right', cell: (r) => <span className="font-mono">{formatWeight(r.totalInwardWeight)}</span> },
            { header: 'Total Outward Weight', accessorKey: 'totalOutwardWeight', align: 'right', cell: (r) => <span className="font-mono font-bold">{formatWeight(r.totalOutwardWeight)}</span> },
          ]}
          title="CUSTOMER PERFORMANCE & VOLUME REPORT"
          exportFilename="customer_performance_report"
        />
      )}

      {activeCategory === 'LABOUR' && (
        <DataTable
          data={labourBindingTasks}
          columns={[
            { header: 'Task ID', accessorKey: 'id', cell: (r) => <span className="font-mono font-bold">{r.id}</span> },
            { header: 'Labour Specialist', accessorKey: 'labourName', sortable: true },
            { header: 'Job ID', accessorKey: 'jobId', cell: (r) => <span className="font-mono">{r.jobId}</span> },
            { header: 'Customer', accessorKey: 'customerName' },
            { header: 'Inward Weight', accessorKey: 'inwardWeight', align: 'right', cell: (r) => <span className="font-mono">{formatWeight(r.inwardWeight)}</span> },
            { header: 'Tar Consumed', accessorKey: 'tarUsed', align: 'right', cell: (r) => <span className="font-mono font-bold text-amber-900">{r.tarUsed} {r.tarUnit}</span> },
            { header: 'Status', accessorKey: 'status', cell: (r) => <StatusBadge type="labour" value={r.status} /> },
          ]}
          title="LABOUR PERFORMANCE & TAR CONSUMPTION REPORT"
          exportFilename="labour_tar_report"
        />
      )}

      {activeCategory === 'STOCK' && (
        <DataTable
          data={chemicals}
          columns={[
            { header: 'Material / Chemical', accessorKey: 'name', cell: (r) => <strong className="text-slate-900">{r.name}</strong> },
            { header: 'Category', accessorKey: 'category' },
            { header: 'Current Stock', accessorKey: 'currentStock', align: 'right', cell: (r) => <span className="font-mono font-bold">{r.currentStock.toFixed(2)} {r.unit}</span> },
            { header: 'Minimum Level', accessorKey: 'minimumStock', align: 'right', cell: (r) => <span className="font-mono text-slate-500">{r.minimumStock.toFixed(2)} {r.unit}</span> },
            { header: 'Status', accessorKey: 'status', cell: (r) => <StatusBadge type="stock" value={r.status} /> },
          ]}
          title="STOCK & CHEMICAL BATH INVENTORY REPORT"
          exportFilename="stock_inventory_report"
        />
      )}
    </div>
  );
};

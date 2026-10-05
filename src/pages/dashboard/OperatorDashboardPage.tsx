import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { Button, Card } from '../../components/ui/Primitives';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JewelleryJob } from '../../types/erp';
import { formatWeight, formatPlating, formatDate } from '../../utils/formatters';
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Clock,
  Scale,
  FileText,
  Eye,
} from 'lucide-react';

export const OperatorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, navigateToCustomer } = useERP();

  const [activeTab, setActiveTab] = useState<'all' | 'ff' | 'ready' | 'in_process' | 'completed'>('all');

  // Compute metrics
  const todayInwardJobs = useMemo(() => {
    return jobs.filter((j) => {
      const today = new Date().toISOString().split('T')[0];
      return j.inwardDate.startsWith(today);
    });
  }, [jobs]);

  const todayOutwardJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (!j.outwardDate) return false;
      const today = new Date().toISOString().split('T')[0];
      return j.outwardDate.startsWith(today) && j.status === 'Outward Completed';
    });
  }, [jobs]);

  const fastForwardJobs = useMemo(() => {
    return jobs.filter((j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed');
  }, [jobs]);

  const readyForOutwardJobs = useMemo(() => {
    return jobs.filter((j) => j.status !== 'Outward Completed');
  }, [jobs]);

  const inProgressJobs = useMemo(() => {
    return jobs.filter((j) => j.status !== 'Outward Completed');
  }, [jobs]);

  const todayInwardWeight = useMemo(() => {
    return todayInwardJobs.reduce((acc, j) => acc + (j.inwardWeight || 0), 0);
  }, [todayInwardJobs]);

  const todayOutwardWeight = useMemo(() => {
    return todayOutwardJobs.reduce((acc, j) => acc + (j.outwardWeight || 0), 0);
  }, [todayOutwardJobs]);

  // Filtered jobs by active tab
  const filteredJobs = useMemo(() => {
    switch (activeTab) {
      case 'ff':
        return fastForwardJobs;
      case 'ready':
        return jobs.filter((j) => j.status !== 'Outward Completed');
      case 'in_process':
        return jobs.filter((j) => j.status !== 'Outward Completed');
      case 'completed':
        return jobs.filter((j) => j.status === 'Outward Completed');
      case 'all':
      default:
        return jobs;
    }
  }, [jobs, activeTab, fastForwardJobs]);

  // Columns for the Work Queue DataTable
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
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateToCustomer(row.customerId);
            }}
            className="text-left font-bold text-xs text-slate-800 hover:text-blue-600 hover:underline"
          >
            {row.customerName}
          </button>
        </div>
      ),
    },
    {
      header: 'Plating Type',
      accessorKey: 'platingType',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-700">
          {row.platingType}
        </span>
      ),
    },
    {
      header: 'Inward Wt',
      accessorKey: 'inwardWeight',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          {formatWeight(row.inwardWeight)}
        </span>
      ),
    },
    {
      header: 'Outward Wt',
      accessorKey: 'outwardWeight',
      sortable: true,
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
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-purple-700">
          {row.platingPerKg ? formatPlating(row.platingPerKg) : '—'}
        </span>
      ),
    },
    {
      header: 'Inward Date',
      accessorKey: 'inwardDate',
      sortable: true,
      cell: (row) => (
        <span className="text-2xs text-slate-600">
          {formatDate(row.inwardDate)}
        </span>
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-bold ${
            row.priority === 'Fast Forward'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
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
    {
      header: 'Action',
      cell: (row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/jobs/${row.id}`)}
            className="text-xs"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </Button>
          {row.status !== 'Outward Completed' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/outward/new')}
              className="text-xs"
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Outward
            </Button>
          ) : (
            <span className="text-2xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              Dispatched
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* 1. Header Banner - Unified Application Standard */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-slate-500 font-mono uppercase tracking-wider">
              Station 01 • Digital Scale Console
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Shift Active
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-900">Factory Operator Processing Console</h2>
          <p className="text-xs text-slate-500">
            High-speed intake scale verification, real-time inward & outward dispatch execution, and urgent fast-forward job queues.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            variant="secondary"
            onClick={() => navigate('/outward/new')}
            className="inline-flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Process Outward
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/inward/new')}
            className="inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> New Inward Intake
          </Button>
        </div>
      </div>

      {/* 2. Primary KPI Row (5 Core Operational KPIs) */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Station Operational Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <StatCard
            title="Today's Inward Intake"
            value={`${todayInwardJobs.length} jobs`}
            subtitle={`Gross Wt: ${formatWeight(todayInwardWeight)}`}
            icon={ArrowDownLeft}
            badgeText="Intake Active"
            badgeVariant="info"
            onClick={() => navigate('/inward')}
          />
          <StatCard
            title="Today's Outward"
            value={`${todayOutwardJobs.length} jobs`}
            subtitle={`Gross Wt: ${formatWeight(todayOutwardWeight)}`}
            icon={ArrowUpRight}
            badgeText="Dispatched"
            badgeVariant="success"
            onClick={() => navigate('/outward')}
          />
          <StatCard
            title="Fast Forward Urgent"
            value={`${fastForwardJobs.length} jobs`}
            subtitle="Accelerated delivery queue"
            icon={Zap}
            badgeText="Priority 1"
            badgeVariant="warning"
            urgent={fastForwardJobs.length > 0}
            onClick={() => navigate('/fast-forward')}
          />
          <StatCard
            title="Pending Plant Jobs"
            value={`${inProgressJobs.length} jobs`}
            subtitle="In electroplating & labour"
            icon={Clock}
            badgeText="In Cycle"
            badgeVariant="warning"
            onClick={() => navigate('/inward')}
          />
          <StatCard
            title="Digital Scale Status"
            value="Calibrated"
            subtitle="±0.001 kg Precision Sync"
            icon={Scale}
            badgeText="Certified"
            badgeVariant="success"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* 3. Station Quick Action Workflows */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Floor Workflows & Scale Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Action 1 */}
          <Card
            padding="md"
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Step 1
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">New Customer Inward</h4>
              <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
                Record intake weight on digital scale, attach camera photos, and assign sequential Job ID.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/inward/new')}
                className="w-full justify-center text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Start Inward Intake
              </Button>
            </div>
          </Card>

          {/* Action 2 */}
          <Card
            padding="md"
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-100">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Step 2
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Process Outward Dispatch</h4>
              <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
                Fetch Inward weight, record verified Outward weight, and compute Plating per KG automatically.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/outward/new')}
                className="w-full justify-center text-xs"
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> Process Outward
              </Button>
            </div>
          </Card>

          {/* Action 3 */}
          <Card
            padding="md"
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-100">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  {fastForwardJobs.length} Urgent
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Fast Forward Priority Queue</h4>
              <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
                Accelerated processing queue for high-priority same-day jewellery orders.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/fast-forward')}
                className="w-full justify-center text-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" /> View Priority Queue
              </Button>
            </div>
          </Card>

          {/* Action 4 */}
          <Card
            padding="md"
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold border border-purple-100">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Daily Audit
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Operator Reports & Shift Logs</h4>
              <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
                Export daily batch logs, intake weighment records, and dispatch audit summaries.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/reports')}
                className="w-full justify-center text-xs"
              >
                <FileText className="w-3.5 h-3.5" /> Shift Reports
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Live Work Queue Table with Filter Tabs next to Export */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Live Station Work Queue
        </h3>

        {/* Unified DataTable */}
        <DataTable
          data={filteredJobs}
          columns={columns}
          onRowClick={(row) => navigate(`/jobs/${row.id}`)}
          searchPlaceholder="Search jobs by Job ID, Customer, Plating type..."
          exportFilename="operator_work_queue"
          actions={
            <div className="erp-toolbar-control inline-flex items-center p-1 bg-slate-100 border border-slate-200 shrink-0 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Jobs ({jobs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ff')}
                className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ff'
                    ? 'bg-white text-amber-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                Fast Forward ({fastForwardJobs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ready')}
                className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                  activeTab === 'ready'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Intake ({readyForOutwardJobs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`h-7 px-2.5 text-xs font-semibold rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer flex items-center justify-center ${
                  activeTab === 'completed'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed ({jobs.filter((j) => j.status === 'Outward Completed').length})
              </button>
            </div>
          }
        />
      </div>

      {/* 5. Hardware Diagnostics & Scale Calibration Status */}
      <Card
        padding="md"
        className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900">Mettler Toledo Precision Industrial Balance #01</h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Connected
              </span>
            </div>
            <p className="text-2xs text-slate-500 mt-0.5">
              Dual-scale zero-tare certified at ±0.001 kg. High-resolution camera stream active for photo-verified customer intake receipts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <div className="text-right p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">Scale Tolerance</span>
            <span className="font-mono text-xs font-extrabold text-slate-800">±0.001 kg</span>
          </div>
          <div className="text-right p-2 rounded bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] text-emerald-700 uppercase tracking-wider block font-medium">Camera Link</span>
            <span className="font-mono text-xs font-extrabold text-emerald-800">Dual Sync 1080p</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

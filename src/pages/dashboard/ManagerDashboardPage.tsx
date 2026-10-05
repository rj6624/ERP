import { Button, Card } from '../../components/ui/Primitives';
import React from 'react';
import { useERP } from '../../context/ERPContext';
import { StatCard } from '../../components/common/StatCard';
import { JobStatusChart } from '../../components/charts/JobStatusChart';
import { WeightTrendChart } from '../../components/charts/WeightTrendChart';
import {
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Zap,
  Scale,
  FlaskConical,
  Flame,
  Hammer,
  Layers,
  Unlock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Box,
  Eye,
} from 'lucide-react';
import { formatWeight, formatPlating, formatDate, formatDateTime } from '../../utils/formatters';

export const ManagerDashboardPage: React.FC = () => {
  const {
    jobs,
    chemicals,
    acids,
    metals,
    currentTarStock,
    timeline,
    setCurrentPage,
    navigateToJob,
    navigateToCustomer,
    setIsQuickActionOpen,
  } = useERP();

  // Fast Forward Pending Jobs (Priority = Fast Forward & status != Outward Completed)
  const fastForwardPendingJobs = jobs.filter(
    (j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed'
  );

  // Operational Timeline items only (strictly exclude payment events)
  const operationalTimeline = timeline.filter((t) => t.type !== 'payment');

  // Exact Manager Dashboard KPIs specified in Section 8 & 10
  const managerKPIs = {
    totalCustomers: 248,
    todayInward: 42,
    todayOutward: 37,
    pendingJobs: 18,
    fastForward: 5,
    todayInwardWeight: 245.650,
    todayOutwardWeight: 252.300,
    avgPlating: 53.659,
    pendingBinding: 8,
    pendingOpen: 5,
    activeLabour: 12,
    lowChemical: 2,
    lowAcid: 1,
    lowMetal: 0,
    lowTar: 3,
  };

  return (
    <div className="erp-dashboard space-y-5 font-sans">
      {/* 1. TOP OPERATIONAL BANNER */}
      <div className="erp-page-intro erp-light-panel bg-slate-900 text-white rounded-xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-2xs font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              SHIFT IN PROGRESS
            </span>
            <span className="text-slate-400 text-xs font-mono">Shift 01 • Rajkot Facility</span>
          </div>
          <h2 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
            Operations overview
          </h2>
          <p className="text-xs text-slate-300">
            Real-time tracking of inward silver weight, chemical baths, fast-forward queues, and labour assignments.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="primary"
            onClick={() => setCurrentPage('create_inward')}
            className="inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" /> New Inward
          </Button>
          <Button variant="secondary"
            onClick={() => setCurrentPage('create_outward')}
            className="inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Process Outward
          </Button>
          <Button variant="secondary"
            onClick={() => setIsQuickActionOpen(true)}
            className="inline-flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Action
          </Button>
        </div>
      </div>

      {/* 2. KPI ROW (Section 8: Customer & Job Volumes) */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Production at a glance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <StatCard
            title="Total Customers"
            value={managerKPIs.totalCustomers}
            subtitle="Registered accounts"
            icon={Users}
            onClick={() => setCurrentPage('customers')}
            trend="+3 this month"
          />

          <StatCard
            title="Today's Inward"
            value={`${managerKPIs.todayInward} jobs`}
            subtitle="Received today"
            icon={ArrowDownLeft}
            onClick={() => setCurrentPage('inward_list')}
            badgeText="Active Shift"
            badgeVariant="info"
          />

          <StatCard
            title="Today's Outward"
            value={`${managerKPIs.todayOutward} jobs`}
            subtitle="Dispatched today"
            icon={ArrowUpRight}
            onClick={() => setCurrentPage('outward_list')}
            badgeText="Completed"
            badgeVariant="success"
          />

          <StatCard
            title="Pending Jobs"
            value={managerKPIs.pendingJobs}
            subtitle="In plant cycle"
            icon={Clock}
            onClick={() => setCurrentPage('inward_list')}
            badgeText="In Progress"
            badgeVariant="warning"
          />

          <StatCard
            title="Fast Forward Pending"
            value={managerKPIs.fastForward}
            subtitle="Urgent priority queue"
            icon={Zap}
            badgeText="Priority 1"
            badgeVariant="warning"
            urgent
            onClick={() => setCurrentPage('fast_forward')}
          />
        </div>
      </div>

      {/* 3. WEIGHT & PLATING PRECISION SECTION (Section 8: Weight KPIs & Flow) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" /> Weight Precision & Plating Concentration
          </h3>
          <span className="text-2xs text-slate-500 font-mono">Strict 3-Decimal Precision (0.000 kg)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card padding="md" className="erp-card bg-white p-4 space-y-1">
            <span className="text-xs font-semibold text-slate-600">Today's Inward Weight</span>
            <div className="text-2xl font-extrabold font-mono text-slate-900">
              {formatWeight(managerKPIs.todayInwardWeight)}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              <span>Gross unplated jewellery</span>
              <span className="font-semibold text-slate-700">{managerKPIs.todayInward} Batches</span>
            </div>
          </Card>

          <Card padding="md" className="erp-card bg-white p-4 space-y-1">
            <span className="text-xs font-semibold text-slate-600">Today's Outward Weight</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-700">
              {formatWeight(managerKPIs.todayOutwardWeight)}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              <span>Finished dispatched weight</span>
              <span className="font-semibold text-emerald-700">{managerKPIs.todayOutward} Batches</span>
            </div>
          </Card>

          <Card padding="md" className="erp-card bg-white p-4 space-y-1 border-purple-200 bg-purple-50/20">
            <span className="text-xs font-semibold text-purple-900">Average Plating per KG</span>
            <div className="text-2xl font-extrabold font-mono text-purple-700">
              {formatPlating(managerKPIs.avgPlating)}
            </div>
            <div className="flex justify-between items-center text-xs text-purple-700 pt-1">
              <span>Formula: ((Out - In)/In) * 1000</span>
              <span className="font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded text-[10px]">
                Strict Standard
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. CHARTS: JOB STATUS & DAILY WEIGHT FLOW (Section 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card padding="md" className="erp-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Job Status Distribution
            </h4>
            <span className="text-xs font-mono text-slate-500">63 Total Jobs Today</span>
          </div>
          <JobStatusChart />
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 mt-3 text-center">
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-2xs text-slate-500 block">Inward Received</span>
              <span className="font-mono text-sm font-bold text-slate-800">12</span>
            </div>
            <div className="p-2 rounded bg-amber-50 border border-amber-100">
              <span className="text-2xs text-amber-800 block">In Process</span>
              <span className="font-mono text-sm font-bold text-amber-900">8</span>
            </div>
            <div className="p-2 rounded bg-purple-50 border border-purple-100">
              <span className="text-2xs text-purple-800 block">Ready Outward</span>
              <span className="font-mono text-sm font-bold text-purple-900">6</span>
            </div>
            <div className="p-2 rounded bg-emerald-50 border border-emerald-100">
              <span className="text-2xs text-emerald-800 block">Completed</span>
              <span className="font-mono text-sm font-bold text-emerald-900">37</span>
            </div>
          </div>
        </Card>

        <Card padding="md" className="erp-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Daily Weight Flow (Inward vs Outward kg)
            </h4>
            <span className="text-xs font-mono text-slate-500">7 Days Rolling</span>
          </div>
          <WeightTrendChart />
        </Card>
      </div>

      {/* 5. FAST FORWARD PRIORITY QUEUE (Section 22 & 58) */}
      <Card padding="md" className="erp-card p-4 border-amber-200 bg-amber-50/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-amber-500 text-slate-950 font-bold">
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Fast Forward Priority Queue
              </h4>
              <p className="text-[11px] text-slate-500">
                5 urgent jobs currently require immediate bath priority & expedited labour
              </p>
            </div>
          </div>
          <Button variant="ghost"
            onClick={() => setCurrentPage('fast_forward')}
            className="inline-flex items-center gap-1 transition-colors"
          >
            View Complete Queue <ArrowRight className="w-3 h-3" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-amber-200 text-slate-600 bg-amber-100/50">
                <th className="py-2 px-3 font-semibold">Job ID</th>
                <th className="py-2 px-3 font-semibold">Customer</th>
                <th className="py-2 px-3 font-semibold text-right">Inward Weight</th>
                <th className="py-2 px-3 font-semibold">Plating Type</th>
                <th className="py-2 px-3 font-semibold">Received</th>
                <th className="py-2 px-3 font-semibold text-center">Status</th>
                <th className="py-2 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {fastForwardPendingJobs.slice(0, 5).map((job) => (
                <tr key={job.id} className="hover:bg-amber-100/30 transition-colors">
                  <td className="py-2 px-3 font-mono font-bold text-amber-950">{job.id}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{job.customerName}</td>
                  <td className="py-2 px-3 font-mono text-right font-semibold text-slate-900">
                    {formatWeight(job.inwardWeight)}
                  </td>
                  <td className="py-2 px-3 font-medium text-slate-700">{job.platingType}</td>
                  <td className="py-2 px-3 text-slate-500">{formatDate(job.inwardDate)}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {job.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <Button variant="ghost"
                      onClick={() => navigateToJob(job.id)}
                      className="hover:underline inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 6. LABOUR WORKLOAD & STOCK ALERTS (Section 8: Labour & Stock KPIs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Labour Overview */}
        <Card padding="md" className="erp-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Hammer className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Labour Operations & Workload
              </h4>
            </div>
            <Button variant="ghost"
              onClick={() => setCurrentPage('labour_list')}
              className="hover:underline flex items-center gap-1"
            >
              Labour Directory <ArrowRight className="w-3 h-3" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div
              onClick={() => setCurrentPage('labour_binding')}
              className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 cursor-pointer hover:bg-indigo-50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-indigo-900 font-medium">
                <span>Pending Binding</span>
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="text-xl font-bold font-mono text-indigo-950 mt-1">
                {managerKPIs.pendingBinding}
              </div>
              <span className="text-2xs text-indigo-700">Tying on jigs</span>
            </div>

            <div
              onClick={() => setCurrentPage('labour_open')}
              className="p-3 rounded-lg bg-orange-50/60 border border-orange-100 cursor-pointer hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-orange-900 font-medium">
                <span>Pending Open</span>
                <Unlock className="w-3.5 h-3.5 text-orange-600" />
              </div>
              <div className="text-xl font-bold font-mono text-orange-950 mt-1">
                {managerKPIs.pendingOpen}
              </div>
              <span className="text-2xs text-orange-700">Untying finished pieces</span>
            </div>

            <div
              onClick={() => setCurrentPage('labour_list')}
              className="p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                <span>Active Labour</span>
                <Users className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                {managerKPIs.activeLabour}
              </div>
              <span className="text-2xs text-emerald-700 font-semibold">100% on shift</span>
            </div>
          </div>
        </Card>

        {/* Stock Alerts Overview */}
        <Card padding="md" className="erp-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Raw Materials & Stock Status
              </h4>
            </div>
            <Button variant="ghost"
              onClick={() => setCurrentPage('stock_chemical')}
              className="hover:underline flex items-center gap-1"
            >
              Inventory Ledger <ArrowRight className="w-3 h-3" />
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div
              onClick={() => setCurrentPage('stock_chemical')}
              className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/40 cursor-pointer hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Chemical</span>
                <FlaskConical className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-bold font-mono text-amber-900">{managerKPIs.lowChemical}</span>
                <span className="text-2xs font-bold text-amber-800 bg-amber-200/80 px-1 rounded">Low</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Gold Sol & Additive</span>
            </div>

            <div
              onClick={() => setCurrentPage('stock_acid')}
              className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/40 cursor-pointer hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Acid</span>
                <Flame className="w-3.5 h-3.5 text-red-500" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-bold font-mono text-amber-900">{managerKPIs.lowAcid}</span>
                <span className="text-2xs font-bold text-amber-800 bg-amber-200/80 px-1 rounded">Low</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Nitric Acid Bath</span>
            </div>

            <div
              onClick={() => setCurrentPage('stock_metal')}
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Metal</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-bold font-mono text-slate-900">{managerKPIs.lowMetal}</span>
                <span className="text-2xs font-bold text-emerald-700 bg-emerald-100 px-1 rounded">Normal</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Silver Anodes OK</span>
            </div>

            <div
              onClick={() => setCurrentPage('stock_tar')}
              className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/40 cursor-pointer hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Tar</span>
                <Box className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-bold font-mono text-amber-900">{managerKPIs.lowTar}</span>
                <span className="text-2xs font-bold text-amber-800 bg-amber-200/80 px-1 rounded">Low</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Hard Red Tar Reorder</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 7. RECENT JOB ACTIVITY TIMELINE (Section 46 & 62) */}
      <Card padding="md" className="erp-card p-4">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Operational Job Activity
            </h4>
          </div>
          <span className="text-2xs font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            Plant floor stream
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {operationalTimeline.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2.5"
            >
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</p>
                  {item.jobId && (
                    <span className="font-mono text-2xs font-bold bg-slate-100 text-slate-800 px-1.5 py-0.2 rounded border border-slate-200">
                      {item.jobId}
                    </span>
                  )}
                </div>
                <p className="text-slate-700 text-xs font-normal leading-relaxed">{item.description}</p>
                <div className="flex items-center gap-3 pt-0.5 text-[11px] text-slate-600">
                  <span>
                    Operator: <strong className="font-semibold text-slate-900">{item.userName}</strong>
                  </span>
                </div>
              </div>

              <div className="shrink-0 sm:self-start sm:text-right">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-slate-700 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {formatDateTime(item.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

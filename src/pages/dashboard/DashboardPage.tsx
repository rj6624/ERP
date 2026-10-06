import { Button, Card } from '../../components/ui/Primitives';
import React from 'react';
import { useERP } from '../../context/ERPContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JobStatusChart } from '../../components/charts/JobStatusChart';
import { WeightTrendChart } from '../../components/charts/WeightTrendChart';
import { PaymentAnalyticsChart } from '../../components/charts/PaymentAnalyticsChart';
import {
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Zap,
  FileText,
  CreditCard,
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
} from 'lucide-react';
import { formatWeight, formatPlating, formatCurrency, formatDateTime } from '../../utils/formatters';

export const DashboardPage: React.FC = () => {
  const {
    dashboardMetrics,
    jobs,
    chemicals,
    acids,
    timeline,
    setCurrentPage,
    navigateToJob,
    navigateToCustomer,
    setIsQuickActionOpen,
  } = useERP();

  const fastForwardJobs = jobs.filter(
    (j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed'
  );

  return (
    <div className="erp-dashboard space-y-5">
      {/* Top Banner with Quick Actions & Status */}
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
            Real-time tracking of inward silver weight, chemical baths, fast-forward queues, and billing.
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

      {/* Primary KPI Row (9 Core KPIs) */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Production at a glance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <StatCard
            title="Total Customers"
            value={dashboardMetrics.totalCustomers}
            subtitle="Registered accounts"
            icon={Users}
            onClick={() => setCurrentPage('customers')}
            trend="+3 this month"
          />
          <StatCard
            title="Today's Inward"
            value={`${dashboardMetrics.todayInwardCount} jobs`}
            subtitle="Received today"
            icon={ArrowDownLeft}
            badgeText="Active Shift"
            badgeVariant="info"
            onClick={() => setCurrentPage('inward_list')}
          />
          <StatCard
            title="Today's Outward"
            value={`${dashboardMetrics.todayOutwardCount} jobs`}
            subtitle="Dispatched today"
            icon={ArrowUpRight}
            badgeText="Completed"
            badgeVariant="success"
            onClick={() => setCurrentPage('outward_list')}
          />
          <StatCard
            title="Pending Jobs"
            value={`${dashboardMetrics.pendingJobsCount}`}
            subtitle="In plant cycle"
            icon={Clock}
            badgeText="In Progress"
            badgeVariant="warning"
            onClick={() => setCurrentPage('inward_list')}
          />
          <StatCard
            title="Fast Forward Pending"
            value={`${dashboardMetrics.fastForwardCount}`}
            subtitle="Urgent priority queue"
            icon={Zap}
            badgeText="Priority 1"
            badgeVariant="warning"
            urgent={dashboardMetrics.fastForwardCount > 0}
            onClick={() => setCurrentPage('fast_forward')}
          />
        </div>
      </div>

      {/* Weight & Plating Precision KPIs */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-slate-600" />
            Weight Precision & Plating Concentration
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Strict 3-Decimal Precision (0.000 kg)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card padding="md" className="erp-card bg-white p-4 border-l-4 border-l-blue-600">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Today's Inward Weight</p>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {formatWeight(dashboardMetrics.todayInwardWeight)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Gross unplated jewellery</span>
              <span className="text-blue-600 font-semibold font-mono">42 Batches</span>
            </p>
          </Card>

          <Card padding="md" className="erp-card bg-white p-4 border-l-4 border-l-emerald-600">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Today's Outward Weight</p>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {formatWeight(dashboardMetrics.todayOutwardWeight)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Finished dispatched weight</span>
              <span className="text-emerald-600 font-semibold font-mono">37 Batches</span>
            </p>
          </Card>

          <Card padding="md" className="erp-card bg-white p-4 border-l-4 border-l-purple-600">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average Plating per KG</p>
            <div className="text-2xl font-bold font-mono text-purple-700 mt-1">
              {formatPlating(dashboardMetrics.avgPlatingPerKg)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Formula: ((Out - In)/In) * 1000</span>
              <span className="text-purple-600 font-semibold text-[11px] bg-purple-50 px-1.5 py-0.2 rounded">
                Strict Standard
              </span>
            </p>
          </Card>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <JobStatusChart />
        <WeightTrendChart />
      </div>

      {/* Fast Forward Urgent Queue & Labour Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fast Forward Queue widget */}
        <Card padding="md" className="erp-card bg-white p-4 lg:col-span-2 border-amber-300 bg-amber-50/10">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-amber-200/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 shrink-0 shadow-2xs">
                <Zap className="w-4 h-4 fill-slate-950" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider truncate">
                  Fast Forward Pending Queue ({fastForwardJobs.length})
                </h3>
                <p className="text-[11px] text-slate-500 truncate">Urgent customer batches requiring immediate turn-around</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage('fast_forward')}
              className="hover:underline flex items-center gap-1 shrink-0 text-xs font-semibold text-slate-700 hover:text-slate-900 px-2 py-1"
            >
              <span>View Full Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {fastForwardJobs.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No pending Fast Forward jobs in queue.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {fastForwardJobs.slice(0, 4).map((job) => (
                <div
                  key={job.id}
                  onClick={() => navigateToJob(job.id)}
                  className="py-3.5 px-2.5 rounded-lg flex items-center justify-between gap-4 hover:bg-amber-50/60 cursor-pointer transition-colors no-wrap-mobile"
                >
                  {/* LEFT SIDE: Tag -> [Name & Description Group] */}
                  <div className="min-w-0 flex-1 flex flex-col items-start gap-1.5">
                    <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded shadow-2xs shrink-0">
                      {job.id}
                    </span>
                    <div className="min-w-0 w-full flex flex-col">
                      <p className="font-bold text-xs text-slate-900 truncate leading-tight">
                        {job.customerName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate leading-normal">
                        {job.platingType} • <span className="font-mono font-semibold text-slate-700">{formatWeight(job.inwardWeight)}</span>
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SIDE: Top Status (Rounded Rectangle) -> Bottom Right Button with comfortable spacing */}
                  <div className="flex flex-col items-end justify-between shrink-0 gap-3 py-0.5">
                    <StatusBadge type="job" value={job.status} size="sm" />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPage('create_outward');
                      }}
                      className="text-[11px] font-semibold px-2.5 py-1 min-h-[26px] h-[26px] rounded-md whitespace-nowrap shadow-2xs"
                    >
                      Process Outward
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Labour Operations Widget */}
        <Card padding="md" className="erp-card bg-white p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Labour Summary
                </h3>
              </div>
              <Button variant="ghost" size="sm"
                onClick={() => setCurrentPage('labour_binding')}
                className="hover:underline"
              >
                Manage →
              </Button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-medium text-slate-700">Pending Binding</span>
                </div>
                <span className="font-bold font-mono text-xs text-slate-900">
                  {dashboardMetrics.pendingBindingCount} batches
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-medium text-slate-700">Pending Open</span>
                </div>
                <span className="font-bold font-mono text-xs text-slate-900">
                  {dashboardMetrics.pendingOpenCount} batches
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">Active Labour Staff</span>
                </div>
                <span className="font-bold font-mono text-xs text-slate-900">
                  {dashboardMetrics.activeLabourCount} Workers
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 text-2xs text-slate-500 flex items-center justify-between">
            <span>Tar Usage tracking active</span>
            <span className="text-emerald-700 font-semibold font-mono">100% Logged</span>
          </div>
        </Card>
      </div>

      {/* Stock Alerts & Inventory Health */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-slate-600" />
            Stock & Chemical Baths Warning Center
          </h3>
          <Button variant="ghost"
            onClick={() => setCurrentPage('stock_chemical')}
            className="hover:underline"
          >
            All Inventory Modules →
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => setCurrentPage('stock_chemical')}
            className={`erp-card p-3 cursor-pointer hover:shadow-md transition-all ${
              dashboardMetrics.lowStockChemicalCount > 0 ? 'border-amber-400 bg-amber-50/20' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Chemical Stock</span>
              <FlaskConical className="w-4 h-4 text-slate-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-slate-900">{chemicals.length} Items</span>
              {dashboardMetrics.lowStockChemicalCount > 0 && (
                <span className="text-[11px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.2 rounded">
                  {dashboardMetrics.lowStockChemicalCount} Low
                </span>
              )}
            </div>
          </div>

          <div
            onClick={() => setCurrentPage('stock_acid')}
            className={`erp-card p-3 cursor-pointer hover:shadow-md transition-all ${
              dashboardMetrics.lowStockAcidCount > 0 ? 'border-amber-400 bg-amber-50/20' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Acid Inventory</span>
              <Flame className="w-4 h-4 text-slate-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-slate-900">{acids.length} Types</span>
              {dashboardMetrics.lowStockAcidCount > 0 && (
                <span className="text-[11px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.2 rounded">
                  {dashboardMetrics.lowStockAcidCount} Low
                </span>
              )}
            </div>
          </div>

          <Card padding="md"
            onClick={() => setCurrentPage('stock_metal')}
            className="erp-card bg-white p-3 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Precious Metal</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-slate-900">85.500 kg</span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                Healthy
              </span>
            </div>
          </Card>

          <Card padding="md"
            onClick={() => setCurrentPage('stock_tar')}
            className="erp-card bg-white p-3 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Tar Stock</span>
              <span className="text-2xs bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-mono">Current</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-slate-900">45.500 kg</span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                Optimal
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* BILLING & PAYMENT FINANCIAL SUMMARY (ADMIN ONLY) */}
      <div className="erp-light-panel p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                Financial Operations & Collections (Admin View)
              </h3>
              <p className="text-[11px] text-slate-400">Strictly restricted to Admin role</p>
            </div>
          </div>
          <Button variant="ghost"
            onClick={() => setCurrentPage('payments_dashboard')}
            className="hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Open Full Payment Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="text-[11px] text-slate-400">Today's Bills Generated</span>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {formatCurrency(dashboardMetrics.todayBillsAmount)}
            </div>
            <span className="text-[10px] text-slate-400">Weight × ₹ Rate</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="text-[11px] text-slate-400">Pending Receivables (Bills)</span>
            <div className="text-lg font-bold font-mono text-amber-400 mt-1">
              {formatCurrency(dashboardMetrics.pendingBillsAmount)}
            </div>
            <span className="text-[10px] text-amber-400/80">Awaiting clearance</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="text-[11px] text-slate-400">Today's Collections (Payments)</span>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
              {formatCurrency(dashboardMetrics.todayPaymentAmount)}
            </div>
            <span className="text-[10px] text-emerald-400/80">RTGS, UPI, Cheque</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="text-[11px] text-slate-400">Promise Date Pending</span>
            <div className="text-lg font-bold font-mono text-orange-400 mt-1">
              {dashboardMetrics.promiseDateDueCount} Parties
            </div>
            <span className="text-[10px] text-orange-400/80">Due today or this week</span>
          </div>
        </div>

        {/* Payment mode chart */}
        <PaymentAnalyticsChart />
      </div>

      {/* Live System Activity Timeline Feed */}
      <Card padding="md" className="erp-card bg-white p-4">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Live Manufacturing Activity Stream
          </h3>
          <span className="text-2xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded font-mono border border-slate-200">
            Auto-Updated
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {timeline.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2.5"
            >
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">
                    {item.title}
                  </p>
                  {item.jobId && (
                    <span className="font-mono text-2xs font-bold bg-slate-100 text-slate-800 px-1.5 py-0.2 rounded border border-slate-200">
                      {item.jobId}
                    </span>
                  )}
                </div>
                <p className="text-slate-700 text-xs font-normal leading-relaxed">
                  {item.description}
                </p>
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

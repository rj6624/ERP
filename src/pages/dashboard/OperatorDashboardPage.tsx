import { Button, Card } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import {
  Plus,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  Scale,
  Sparkles,
  Camera,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Play,
  ArrowUpRight,
} from 'lucide-react';
import { ReferenceHeaderMetrics, MetricItem } from '../../components/common/ReferenceHeaderMetrics';
import { ReferenceTabBar, TabOption } from '../../components/common/ReferenceTabBar';
import { ReferenceEntityCard } from '../../components/common/ReferenceEntityCard';
import { ReferencePriceCard } from '../../components/common/ReferencePriceCard';
import { ReferenceCommentsCard, CommentItem } from '../../components/common/ReferenceCommentsCard';
import { ProcessRouteStepper, RouteStop } from '../../components/common/ProcessRouteStepper';
import { ReferenceFilterListCard, FilterListItem } from '../../components/common/ReferenceFilterListCard';

export const OperatorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, timeline, currentUser } = useERP();

  const [activeTab, setActiveTab] = useState<string>('all');

  // Filter items
  const [filterList, setFilterList] = useState<FilterListItem[]>([
    { id: 'all', label: 'All Jobs', count: jobs.length, checked: true },
    { id: 'ff', label: 'Fast Forward Priority', count: 5, colorDot: '#f59e0b', checked: true },
    { id: 'ready', label: 'Ready for Outward', count: 12, colorDot: '#10b981', checked: true },
    { id: 'binding', label: 'In Binding / Labour', count: 18, colorDot: '#3b82f6', checked: false },
    { id: 'completed', label: 'Completed Today', count: 37, colorDot: '#8b5cf6', checked: false },
  ]);

  const handleToggleFilter = (id: string) => {
    setFilterList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // Top Metrics Strip Data (Matching Image 1, 2, 3)
  const topMetrics: MetricItem[] = [
    {
      label: 'Total Pending Inward Weight',
      value: '83.650 kg',
      change: '11.3%',
      isPositive: true,
      subtext: '42 jobs in factory cycle',
    },
    {
      label: 'Today\'s Inward Intake',
      value: '42',
      change: '+14',
      isPositive: true,
      subtext: 'Target 50 jobs/shift',
    },
    {
      label: 'Average Plating per KG',
      value: '53.659 g/kg',
      change: '2.4%',
      isPositive: true,
      subtext: 'High precision calibration',
    },
    {
      label: 'Pending Outward Dispatch',
      value: '12',
      change: '-5',
      isPositive: true,
      subtext: 'Awaiting scale verification',
    },
    {
      label: 'Fast Forward Priority',
      value: '5',
      change: 'Urgent',
      isPositive: false,
      subtext: 'Expedited processing queue',
    },
    {
      label: 'Completed Today',
      value: '37',
      change: '+12',
      isPositive: true,
      subtext: 'Dispatched & verified',
    },
  ];

  // Top Horizontal Pill Filter Tabs (Matching Image 3)
  const tabOptions: TabOption[] = [
    { id: 'all', label: 'All Work', count: jobs.length },
    { id: 'ff', label: 'Fast Forward', count: 5, colorDot: '#f59e0b' },
    { id: 'inward', label: 'Inward Received', count: 42, colorDot: '#3b82f6' },
    { id: 'in_process', label: 'In Process', count: 18, colorDot: '#6366f1' },
    { id: 'ready_outward', label: 'Ready for Outward', count: 12, colorDot: '#10b981' },
    { id: 'completed', label: 'Completed Today', count: 37, colorDot: '#8b5cf6' },
  ];

  // Active Highlight Job
  const highlightJob = jobs.find((j) => j.id === 'DARSHAN4') || jobs[0];

  // Stepper route stops (Matching Image 1 & 2 lifecycle)
  const routeStops: RouteStop[] = [
    {
      id: 'step-1',
      title: 'Customer Inward Intake — Darshan Jewellers',
      subtitle: 'Recorded Inward Weight: 10.250 kg (Scale Photo Calibrated)',
      time: '10:42 am, Thu 26/09/2026',
      commentCount: 2,
      status: 'completed',
      tag: 'Scale Certified',
    },
    {
      id: 'step-2',
      title: 'Labour Binding Operation — Bench #4 (Suresh Parmar)',
      subtitle: 'Copper wire framing with 120g Tar sealant fixation',
      time: '11:30 am, Thu 26/09/2026',
      commentCount: 1,
      status: 'completed',
      tag: 'Bench Active',
    },
    {
      id: 'step-3',
      title: 'White Gold Electroplating Bath — Tank #2',
      subtitle: 'Current bath temperature: 52°C • Flash cycle active',
      time: '01:15 pm, Thu 26/09/2026',
      status: 'current',
      tag: 'In Process',
    },
    {
      id: 'step-4',
      title: 'Labour Open & Ultrasonic Untying — Station 03',
      subtitle: 'Post-plating rinsing, drying, and unbinding verification',
      time: '02:45 pm, Thu 26/09/2026',
      status: 'pending',
    },
    {
      id: 'step-5',
      title: 'Customer Outward Dispatch & Final Weight Entry',
      subtitle: 'Target Outward Weight: ~10.800 kg (Plating per KG: 53.659 g/kg)',
      time: '03:30 pm, Thu 26/09/2026',
      status: 'pending',
    },
  ];

  // Comments Feed with Photo Evidence (Matching Image 1 & 5)
  const operationalComments: CommentItem[] = [
    {
      id: 'c1',
      authorName: 'Ramesh Patel',
      authorRole: 'Intake Operator • Station 01',
      avatarInitials: 'RP',
      avatarBg: 'bg-slate-900 text-white',
      date: '10:43 am',
      text: 'Scale zero-calibration verified before intake. Item arrived in tamper-proof container.',
      attachment: {
        name: 'Scale_Reading_10.250kg.png',
        subtext: 'Dual-Scale Photo Verification • Certified',
      },
    },
    {
      id: 'c2',
      authorName: 'Suresh Parmar',
      authorRole: 'Artisan Bench #4',
      avatarInitials: 'SP',
      avatarBg: 'bg-amber-600 text-white',
      date: '11:35 am',
      text: 'Binding executed with heavy gauge copper ties. 120 grams sealing tar consumed.',
    },
  ];

  return (
    <div className="space-y-5 font-sans max-w-[1600px] mx-auto text-slate-800">
      {/* 1. Top Header Actions & Station Bar */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-900 tracking-tight">
              Application #PLATING-OP-01
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Station 01 Active
            </span>
          </div>
          <h1 className="text-lg font-black text-slate-900 mt-1">
            Operator Processing Console
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button variant="secondary"
            onClick={() => navigate('/outward/new')}
            className="flex items-center gap-2"
          >
            <span>Process Outward</span>
          </Button>
          <Button variant="primary"
            onClick={() => navigate('/inward/new')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Customer Inward</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Horizontal Metric Strip (Image 1, 2, 3) */}
      <ReferenceHeaderMetrics metrics={topMetrics} />

      {/* 3. Top Status Filter Tab Bar (Image 3) */}
      <ReferenceTabBar
        tabs={tabOptions}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id);
          if (id === 'ff') navigate('/fast-forward');
          if (id === 'ready_outward') navigate('/outward');
        }}
      />

      {/* 4. 3-COLUMN MAIN WORKSPACE (Matching Image 1 & 2 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Entity Overview & Pricing/Weights & Activity (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Active Job Card */}
          <ReferenceEntityCard
            id={highlightJob.id}
            title={`Application #${highlightJob.id}`}
            customerName={highlightJob.customerName}
            customerSubtitle="Silver Jewellery Manufacturing & Exports"
            creatorName="Ramesh Patel (Intake)"
            artisanName="Suresh Parmar (Bench #4)"
            inwardWeight={highlightJob.inwardWeight}
            platingType={highlightJob.platingType}
            priority={highlightJob.priority}
            status={highlightJob.status}
            onStatusClick={() => navigate(`/jobs/${highlightJob.id}`)}
          />

          {/* Weight & Plating Metrics Card */}
          <ReferencePriceCard
            title="Weight & Plating Metrics"
            inwardWeight={highlightJob.inwardWeight}
            outwardWeight={highlightJob.outwardWeight}
            platingPerKg={highlightJob.platingPerKg}
            onMoreClick={() => navigate('/reports')}
          />

          {/* Comments & Photo Evidence Feed (Image 1 & 5) */}
          <ReferenceCommentsCard
            title="Verification & Scale Evidence"
            subtitle="Job notes and scale camera attachments"
            comments={operationalComments}
            placeholder="Add operational notes to this job..."
          />
        </div>

        {/* MIDDLE COLUMN: Process Route Stepper & Quick Intakes (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Process Lifecycle Stepper Card */}
          <ProcessRouteStepper
            title="Manufacturing Lifecycle"
            count={5}
            actionText="View details"
            onAction={() => navigate(`/jobs/${highlightJob.id}`)}
            stops={routeStops}
          />

          {/* Touch Actions Promo Box */}
          <Card padding="md" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Physical Station Workflows</h3>
                <p className="text-[11px] text-slate-400">High-speed factory floor actions</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button variant="surface"
                onClick={() => navigate('/inward/new')}
                className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex flex-col justify-between h-24 text-left transition-all shadow-xs cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">New Inward</div>
                  <div className="text-[10px] text-slate-400 font-normal">Dual Photo Capture</div>
                </div>
              </Button>

              <Button variant="surface"
                onClick={() => navigate('/outward/new')}
                className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex flex-col justify-between h-24 text-left transition-all shadow-xs cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Process Outward</div>
                  <div className="text-[10px] text-blue-100 font-normal">Plating per KG Auto</div>
                </div>
              </Button>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Filter Checkbox List & Fast Forward Urgent Queue (3 Cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Status Checkbox Filter List Card (Image 1) */}
          <ReferenceFilterListCard
            title="Work Queues"
            items={filterList}
            onToggle={handleToggleFilter}
          />

          {/* Urgent Fast Forward Priority Card */}
          <Card padding="md" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                <span>Fast Forward Queue</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                5 Pending
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-blue-700 text-xs">MAGANLAL3</div>
                  <div className="text-[11px] font-bold text-slate-800">8.500 kg • Rose Gold</div>
                </div>
                <Button variant="ghost" size="sm"
                  onClick={() => navigate('/outward/new')}
                  className="cursor-pointer"
                >
                  Process
                </Button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-blue-700 text-xs">DARSHAN4</div>
                  <div className="text-[11px] font-bold text-slate-800">10.250 kg • Teen Gold</div>
                </div>
                <Button variant="ghost" size="sm"
                  onClick={() => navigate('/jobs/DARSHAN4')}
                  className="cursor-pointer"
                >
                  Open
                </Button>
              </div>
            </div>

            <Button variant="ghost"
              onClick={() => navigate('/fast-forward')}
              className="w-full text-center block transition-colors cursor-pointer"
            >
              View Full Priority Queue →
            </Button>
          </Card>

          {/* Scale Calibration Hardware Card */}
          <Card padding="sm" className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 text-xs">Precision Scale Active</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Mettler Toledo Balance #S01 calibrated at ±0.001 kg precision. Dual camera link active.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

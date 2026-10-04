import { Button, Card } from '../../components/ui/Primitives';
import React from 'react';
import { useERP } from '../../context/ERPContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  Calendar,
  Scale,
  Hammer,
  Clock,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Layers,
  Unlock,
  User,
  Sparkles,
  Camera,
} from 'lucide-react';
import {
  formatWeight,
  formatPlating,
  formatDate,
  formatDateTime,
} from '../../utils/formatters';
import { useParams, useNavigate } from 'react-router-dom';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedJobId,
    jobs,
    labourBindingTasks,
    labourOpenTasks,
    timeline,
    setCurrentPage,
    navigateToCustomer,
  } = useERP();

  const job = jobs.find((j) => j.id.toLowerCase() === id?.toLowerCase() || j.id === selectedJobId) || jobs[0];

  if (!job) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 font-sans">
        Job record not found.
      </div>
    );
  }

  // Associated labour tasks
  const bindingTask = labourBindingTasks.find((t) => t.jobId === job.id);
  const openTask = labourOpenTasks.find((t) => t.jobId === job.id);

  // Operational activity timeline for this job (strictly exclude payment events)
  const jobTimeline = timeline.filter(
    (t) => t.type !== 'payment' && (t.jobId === job.id || t.title.includes(job.id) || t.description.includes(job.id))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5 font-sans">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost"
          onClick={() => setCurrentPage('inward_list')}
          className="inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Inward List
        </Button>

        <div className="flex items-center gap-2">
          {job.status !== 'Outward Completed' && (
            <Button variant="primary"
              onClick={() => setCurrentPage('create_outward')}
              className=""
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Process Outward
            </Button>
          )}
        </div>
      </div>

      {/* 1. HEADER (Section 17: DARSHAN1, Darshan, White Gold, 10.250 kg, Status, Priority) */}
      <Card padding="md" className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-base font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 shadow-sm">
                {job.id}
              </span>
              <h2
                onClick={() => navigateToCustomer(job.customerId)}
                className="text-lg font-extrabold text-slate-900 hover:text-brand-600 cursor-pointer transition-colors"
              >
                {job.customerName}
              </h2>
              <StatusBadge type="priority" value={job.priority} />
              <StatusBadge type="job" value={job.status} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <span className="font-semibold text-slate-800">
                Plating: <span className="text-brand-700">{job.platingType}</span>
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-800 font-mono">
                Inward: <span className="text-slate-900">{formatWeight(job.inwardWeight)}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Intake: {formatDateTime(job.inwardDate)}
              </span>
            </div>
          </div>

          <div className="text-right p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold">
              Current Production State
            </span>
            <span className="text-sm font-bold text-slate-800">{job.status}</span>
          </div>
        </div>
      </Card>

      {/* 2. JOB SUMMARY & SPECIFICATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card padding="md" className="erp-card bg-white p-3.5">
          <span className="text-2xs font-semibold text-slate-500 uppercase block">Inward Gross Weight</span>
          <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
            {formatWeight(job.inwardWeight)}
          </span>
          <span className="text-[11px] text-slate-500">Initial verified scale tare</span>
        </Card>

        <Card padding="md" className="erp-card bg-white p-3.5">
          <span className="text-2xs font-semibold text-slate-500 uppercase block">Outward Net Weight</span>
          <span className="text-lg font-bold font-mono text-emerald-700 mt-1 block">
            {job.outwardWeight ? formatWeight(job.outwardWeight) : 'Pending Outward'}
          </span>
          <span className="text-[11px] text-slate-500">Finished plated jewellery</span>
        </Card>

        <Card padding="md" className="erp-card bg-white p-3.5 border-purple-200 bg-purple-50/20">
          <span className="text-2xs font-semibold text-purple-800 uppercase block">Plating per KG</span>
          <span className="text-lg font-bold font-mono text-purple-700 mt-1 block">
            {job.platingPerKg ? formatPlating(job.platingPerKg) : 'Awaiting Outward'}
          </span>
          <span className="text-[11px] text-purple-600 font-mono">((Out - In) / In) × 1000</span>
        </Card>

        <Card padding="md" className="erp-card bg-white p-3.5">
          <span className="text-2xs font-semibold text-slate-500 uppercase block">Priority Level</span>
          <div className="mt-1 flex items-center gap-1.5">
            {job.priority === 'Fast Forward' ? (
              <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-xs">
                <Zap className="w-3.5 h-3.5 fill-amber-500" /> Fast Forward Queue
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                Regular Queue
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Factory turnaround profile</span>
        </Card>
      </div>

      {/* 3. INWARD SECTION (Inward Weight, Date, Plating Type, Item Photo, Scale Photo) */}
      <Card padding="md" className="erp-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-600" /> Inward Intake Verification & Scale Records
          </h3>
          <span className="text-2xs font-mono text-slate-400">Section 3 Compliant</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Item Photography</label>
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center group">
              <img
                src={job.itemPhotoUrl}
                alt="Item Photo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/70 text-white text-2xs px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                <Camera className="w-3 h-3" /> Raw Jewellery Intake
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Visual proof of items received prior to bath degreasing.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Scale Scale-Tare Photo</label>
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center group">
              <img
                src={job.scalePhotoUrl}
                alt="Scale Photo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/70 text-white text-2xs px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                <Scale className="w-3 h-3" /> Scale Display: {formatWeight(job.inwardWeight)}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Verified digital scale tare display photo for exact auditability.
            </p>
          </div>
        </div>

        {job.inwardRemarks && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <strong>Intake Remarks:</strong> {job.inwardRemarks}
          </div>
        )}
      </Card>

      {/* 4. LABOUR SECTION (Binding & Open) */}
      <Card padding="md" className="erp-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Hammer className="w-4 h-4 text-indigo-600" /> Labour Work & Tar Consumption
          </h3>
          <span className="text-2xs font-mono text-slate-400">Section 9 & 10 Compliant</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Binding Work */}
          <div className="p-4 rounded-lg bg-indigo-50/40 border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" /> Labour Binding
              </span>
              <span className="text-2xs font-bold px-2 py-0.5 rounded bg-white text-indigo-800 border border-indigo-200">
                {bindingTask?.status || job.bindingStatus || 'Completed'}
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1 pt-1">
              <div className="flex justify-between">
                <span>Assigned Artisan:</span>
                <strong className="text-slate-900">{bindingTask?.labourName || 'Ramesh Patel'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tar Consumed:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {bindingTask ? `${bindingTask.tarUsed} ${bindingTask.tarUnit}` : '150 g (Hard Red Tar)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Start & Completion:</span>
                <span className="text-slate-500">24 Sep 10:00 AM – 12:30 PM</span>
              </div>
            </div>
          </div>

          {/* Open Work */}
          <div className="p-4 rounded-lg bg-orange-50/40 border border-orange-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-orange-600" /> Labour Open / Untying
              </span>
              <span className="text-2xs font-bold px-2 py-0.5 rounded bg-white text-orange-800 border border-orange-200">
                {openTask?.status || job.openStatus || 'Completed'}
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1 pt-1">
              <div className="flex justify-between">
                <span>Assigned Artisan:</span>
                <strong className="text-slate-900">{openTask?.labourName || 'Suresh Parmar'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tar Reclaimed:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {openTask ? `${openTask.tarUsed} g` : '142 g recovered'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Start & Completion:</span>
                <span className="text-slate-500">24 Sep 01:00 PM – 03:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 5. OUTWARD SECTION (Outward Weight, Plating per KG, Date, Outward Photo) */}
      <Card padding="md" className="erp-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" /> Outward Dispatch & Quality Certification
          </h3>
          <span className="text-2xs font-mono text-slate-400">Section 4 Compliant</span>
        </div>

        {job.status === 'Outward Completed' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Finished Product Photo</label>
              <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center group">
                <img
                  src={job.outwardPhotoUrl || job.itemPhotoUrl}
                  alt="Outward Photo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-2 left-2 bg-emerald-950/80 text-emerald-200 text-2xs px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Quality Verified & Plated
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-lg bg-emerald-50/30 border border-emerald-200 text-xs">
              <div className="flex justify-between py-1.5 border-b border-emerald-100">
                <span className="text-slate-600">Dispatched Outward Weight:</span>
                <strong className="font-mono text-emerald-800 text-sm">{formatWeight(job.outwardWeight)}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-100">
                <span className="text-slate-600">Initial Inward Weight:</span>
                <span className="font-mono text-slate-800">{formatWeight(job.inwardWeight)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-100">
                <span className="text-slate-600">Calculated Plating per KG:</span>
                <strong className="font-mono text-purple-700 text-sm">{formatPlating(job.platingPerKg)}</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Outward Dispatch Timestamp:</span>
                <span className="text-slate-700 font-medium">{formatDateTime(job.outwardDate)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <Clock className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Job is currently in production cycle ({job.status})</p>
            <p className="text-2xs text-slate-500">
              When plating baths and untying are completed, proceed to Customer Outward to record final scale weight.
            </p>
            <Button variant="primary"
              onClick={() => setCurrentPage('create_outward')}
              className="mt-2"
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Open Outward Processing
            </Button>
          </div>
        )}
      </Card>

      {/* 6. ACTIVITY TIMELINE (Section 46: Job Created, Labour Assigned, Processing, Ready, Outward Completed) */}
      <Card padding="md" className="erp-card p-5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" /> Complete Production Traceability Timeline
        </h3>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          <div className="relative">
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white"></div>
            <div>
              <p className="text-xs font-bold text-slate-900">Job Inward Received & Verified</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Received {formatWeight(job.inwardWeight)} from {job.customerName}. Photo inspection passed.
              </p>
              <span className="text-2xs font-mono text-slate-400 mt-0.5 block">{formatDateTime(job.inwardDate)}</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white"></div>
            <div>
              <p className="text-xs font-bold text-slate-900">Labour Binding Started & Completed</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Assigned to {bindingTask?.labourName || 'Ramesh Patel'}. 150g hard tar used. Fixed on copper jigs.
              </p>
              <span className="text-2xs font-mono text-slate-400 mt-0.5 block">24 Sep 2026, 12:30 PM</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-cyan-600 ring-4 ring-white"></div>
            <div>
              <p className="text-xs font-bold text-slate-900">Electroplating Bath Cycle ({job.platingType})</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Bath 02 immersion at 45°C. Current density monitored. Gold solution replenishment verified.
              </p>
              <span className="text-2xs font-mono text-slate-400 mt-0.5 block">24 Sep 2026, 01:15 PM</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-orange-600 ring-4 ring-white"></div>
            <div>
              <p className="text-xs font-bold text-slate-900">Labour Open / Untying Completed</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Artisan {openTask?.labourName || 'Suresh Parmar'} untied pieces. Tar reclaimed into recovery vat.
              </p>
              <span className="text-2xs font-mono text-slate-400 mt-0.5 block">24 Sep 2026, 03:00 PM</span>
            </div>
          </div>

          {job.status === 'Outward Completed' && (
            <div className="relative">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white"></div>
              <div>
                <p className="text-xs font-bold text-emerald-800">Customer Outward Completed & Dispatched</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Final scale weight: {formatWeight(job.outwardWeight)}. Plating density certified at{' '}
                  <strong className="text-purple-700">{formatPlating(job.platingPerKg)}</strong>.
                </p>
                <span className="text-2xs font-mono text-slate-400 mt-0.5 block">{formatDateTime(job.outwardDate)}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

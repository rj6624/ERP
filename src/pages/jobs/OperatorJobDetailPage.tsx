import { Button, Card } from '../../components/ui/Primitives';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { formatWeight, formatPlating, formatDate, formatDateTime } from '../../utils/formatters';
import {
  ArrowLeft,
  Calendar,
  Scale,
  Zap,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Eye,
  Camera,
  Layers,
  Sparkles,
  User,
} from 'lucide-react';

export const OperatorJobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, labourBindingTasks, labourOpenTasks, timeline, selectedJobId } = useERP();

  const targetId = id || selectedJobId || 'DARSHAN1';
  const job = jobs.find((j) => j.id.toLowerCase() === targetId.toLowerCase()) || jobs[0];

  if (!job) {
    return (
      <Card padding="md" className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center font-sans text-xs text-slate-500">
        Job record not found.
      </Card>
    );
  }

  // Associated labour tasks
  const bindingTask = labourBindingTasks.find((t) => t.jobId === job.id);
  const openTask = labourOpenTasks.find((t) => t.jobId === job.id);

  // Operational activity timeline (0 payment events)
  const jobTimeline = timeline.filter(
    (t) =>
      t.type !== 'payment' &&
      (t.jobId === job.id || t.title.includes(job.id) || t.description.includes(job.id))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button variant="secondary"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        {job.status !== 'Outward Completed' && (
          <Button variant="primary"
            onClick={() => navigate(`/outward/new?jobId=${job.id}`)}
            className="flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Process Outward for this Job</span>
          </Button>
        )}
      </div>

      {/* Main Job Card */}
      <Card padding="none" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="erp-light-panel p-6 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-mono tracking-wide text-white">
                {job.id}
              </span>
              {job.priority === 'Fast Forward' && (
                <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-slate-950" /> FAST FORWARD
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-slate-200 mt-1">
              Customer: {job.customerName} • Plating: {job.platingType}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-semibold block">Inward Weight</span>
              <span className="text-xl font-black font-mono text-emerald-400">
                {formatWeight(job.inwardWeight)}
              </span>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                job.status === 'Outward Completed'
                  ? 'bg-emerald-500 text-slate-950'
                  : job.status === 'Ready for Outward'
                  ? 'bg-blue-500 text-white'
                  : 'bg-amber-400 text-slate-950'
              }`}
            >
              {job.status}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. INWARD SECTION */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <span>Inward Intake Details</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Customer</span>
                <span className="font-bold text-slate-900">{job.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Inward Date</span>
                <span className="font-bold text-slate-800 font-mono">
                  {formatDate(job.inwardDate)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Plating Type</span>
                <span className="font-bold text-slate-800">{job.platingType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Priority</span>
                <span className="font-bold text-slate-800">{job.priority}</span>
              </div>
            </div>
          </div>

          {/* 2. PHOTOS SECTION (Item Photo & Scale Photo) */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
              Attached Physical Evidence Photos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              {/* Item Photo */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="p-2.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Item Photo</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">Attached</span>
                </div>
                <img
                  src={job.itemPhotoUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'}
                  alt="Item"
                  className="w-full h-40 object-cover"
                />
              </div>

              {/* Scale Photo */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="p-2.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Scale Calibration Photo</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">Verified</span>
                </div>
                <img
                  src={job.scalePhotoUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'}
                  alt="Scale Reading"
                  className="w-full h-40 object-cover"
                />
              </div>

              {/* Outward Photo */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="p-2.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Outward Dispatch Photo</span>
                  {job.outwardPhotoUrl ? (
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">Dispatched</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.2 rounded font-semibold">Pending</span>
                  )}
                </div>
                {job.outwardPhotoUrl ? (
                  <img
                    src={job.outwardPhotoUrl}
                    alt="Outward Dispatch"
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                    <Camera className="w-6 h-6 mb-1 text-slate-300" />
                    <span>Photo will be attached during outward dispatch</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. LABOUR STATUS */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
              Labour Operations Status
            </h3>
            <div className="grid grid-cols-2 gap-4 pt-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[11px]">Binding Status</span>
                  <span className="font-bold text-slate-900">
                    {bindingTask ? bindingTask.status : 'Completed'}
                  </span>
                </div>
                <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {bindingTask?.labourName || 'Rajesh'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[11px]">Open Status</span>
                  <span className="font-bold text-slate-900">
                    {openTask ? openTask.status : 'Completed'}
                  </span>
                </div>
                <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {openTask?.labourName || 'Manoj'}
                </span>
              </div>
            </div>
          </div>

          {/* 4. OUTWARD RESULT */}
          {job.outwardWeight && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider pb-2 border-b border-emerald-200">
                Outward Dispatch Verified
              </h3>
              <div className="grid grid-cols-3 gap-3 pt-3 text-xs">
                <div>
                  <span className="text-emerald-700 block text-[11px]">Outward Weight</span>
                  <span className="font-black text-slate-900 font-mono text-sm">
                    {formatWeight(job.outwardWeight)}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-700 block text-[11px]">Plating per KG</span>
                  <span className="font-black text-emerald-800 font-mono text-base">
                    {formatPlating(job.platingPerKg || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-700 block text-[11px]">Outward Date</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {job.outwardDate ? formatDate(job.outwardDate) : '—'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 5. OPERATIONAL ACTIVITY TIMELINE */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
              Operational Activity Timeline
            </h3>
            <div className="pt-3 space-y-3">
              {jobTimeline.length > 0 ? (
                jobTimeline.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-start gap-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 shrink-0"></div>
                    <div>
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="text-slate-500 ml-2">{item.description}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {formatDateTime(item.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500">
                  Initial inward recorded. Job processing underway on shop floor.
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

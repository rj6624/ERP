import { Button, Card, TabButton } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Plus,
  Scale,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  Hammer,
  Clock,
  Layers,
  Unlock,
  Eye,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatWeight, formatPlating, formatDate, formatDateTime } from '../../utils/formatters';
import { JewelleryJob } from '../../types/erp';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedCustomerId,
    customers,
    jobs,
    labourBindingTasks,
    labourOpenTasks,
    timeline,
    setCurrentPage,
    navigateToJob,
  } = useERP();

  // Exactly the 6 tabs required by Section 12: Overview, Jobs, Inward, Outward, Labour, Activity
  const [activeTab, setActiveTab] = useState<
    'overview' | 'jobs' | 'inward' | 'outward' | 'labour' | 'activity'
  >('jobs');

  const customer = customers.find((c) => c.id === id || c.name.toLowerCase() === id?.toLowerCase() || c.id === selectedCustomerId) || customers[0];

  if (!customer) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 font-sans">
        Customer profile not found.
      </div>
    );
  }

  const customerJobs = jobs.filter((j) => j.customerId === customer.id);
  const customerBindingTasks = labourBindingTasks.filter((t) => t.customerName === customer.name);
  const customerOpenTasks = labourOpenTasks.filter((t) => t.customerName === customer.name);

  // Compute average plating per kg across completed jobs for this customer
  const completedWithPlating = customerJobs.filter((j) => j.platingPerKg && j.platingPerKg > 0);
  const avgPlating =
    completedWithPlating.length > 0
      ? completedWithPlating.reduce((s, j) => s + (j.platingPerKg || 0), 0) /
        completedWithPlating.length
      : 53.659;

  // Filtered operational timeline for this customer
  const customerTimeline = timeline.filter(
    (t) => t.type !== 'payment' && (t.description?.includes(customer.name) || customerJobs.some((j) => j.id === t.jobId))
  );

  // Job History Columns (strictly operational: ID, Date, Inward Weight, Outward Weight, Plating Type, Priority, Status)
  const jobColumns: ColumnDef<JewelleryJob>[] = [
    {
      header: 'Job ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'inwardDate',
      sortable: true,
      cell: (row) => <span className="text-slate-600">{formatDate(row.inwardDate)}</span>,
    },
    {
      header: 'Inward Weight',
      accessorKey: 'inwardWeight',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-semibold text-slate-900">
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
        <span className="font-mono font-semibold text-emerald-800">
          {row.outwardWeight ? formatWeight(row.outwardWeight) : '-'}
        </span>
      ),
    },
    {
      header: 'Plating Type',
      accessorKey: 'platingType',
      sortable: true,
      cell: (row) => <span className="font-medium text-slate-700">{row.platingType}</span>,
    },
    {
      header: 'Plating per KG',
      accessorKey: 'platingPerKg',
      sortable: true,
      align: 'right',
      cell: (row) => (
        <span className="font-mono font-bold text-purple-700">
          {row.platingPerKg ? formatPlating(row.platingPerKg) : '-'}
        </span>
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      sortable: true,
      cell: (row) => <StatusBadge type="priority" value={row.priority} />,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge type="job" value={row.status} />,
    },
    {
      header: 'Action',
      accessorKey: 'id',
      align: 'center',
      cell: (row) => (
        <Button variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            navigateToJob(row.id);
          }}
          className="inline-flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" /> Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4 font-sans">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <Button variant="ghost"
          onClick={() => setCurrentPage('customers')}
          className="inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Customers
        </Button>

        <Button variant="primary"
          onClick={() => setCurrentPage('create_inward')}
          className=""
        >
          <Plus className="w-3.5 h-3.5" /> Create Inward for {customer.name}
        </Button>
      </div>

      {/* Customer Profile Header (Section 12: Customer Name, Mobile Number, Address, Status) */}
      <Card padding="md" className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-extrabold text-slate-900">{customer.name}</h2>
              <span className="font-mono text-2xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                {customer.id}
              </span>
              <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {customer.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {customer.mobile}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {customer.address}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Last Job:{' '}
                {formatDate(customer.lastJobDate)}
              </span>
            </div>
          </div>

          <div className="text-right p-3 rounded bg-slate-50 border border-slate-200 flex sm:flex-col justify-between sm:justify-center">
            <span className="text-[11px] text-slate-500">Next Auto Job ID:</span>
            <span className="font-mono font-bold text-sm text-slate-900">
              {customer.name.toUpperCase().replace(/\s+/g, '')}{customer.lastIdSeq + 1}
            </span>
          </div>
        </div>

        {/* Exact Summary Cards (Section 12: Total Jobs, Pending Jobs, Completed Jobs, Total Inward Weight, Total Outward Weight, Average Plating per KG) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-2.5 rounded bg-slate-50/80 border border-slate-200/60">
            <p className="text-2xs font-semibold text-slate-500 uppercase">Total Jobs</p>
            <p className="text-base font-bold font-mono text-slate-900 mt-0.5">{customer.totalJobs}</p>
          </div>
          <div className="p-2.5 rounded bg-amber-50/60 border border-amber-200/60">
            <p className="text-2xs font-semibold text-amber-700 uppercase">Pending Jobs</p>
            <p className="text-base font-bold font-mono text-amber-900 mt-0.5">{customer.pendingJobs}</p>
          </div>
          <div className="p-2.5 rounded bg-emerald-50/60 border border-emerald-200/60">
            <p className="text-2xs font-semibold text-emerald-700 uppercase">Completed Jobs</p>
            <p className="text-base font-bold font-mono text-emerald-900 mt-0.5">{customer.completedJobs}</p>
          </div>
          <div className="p-2.5 rounded bg-slate-50/80 border border-slate-200/60">
            <p className="text-2xs font-semibold text-slate-500 uppercase">Total Inward Weight</p>
            <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {formatWeight(customer.totalInwardWeight)}
            </p>
          </div>
          <div className="p-2.5 rounded bg-slate-50/80 border border-slate-200/60">
            <p className="text-2xs font-semibold text-slate-500 uppercase">Total Outward Weight</p>
            <p className="text-base font-bold font-mono text-emerald-800 mt-0.5">
              {formatWeight(customer.totalOutwardWeight)}
            </p>
          </div>
          <div className="p-2.5 rounded bg-purple-50/60 border border-purple-200/60">
            <p className="text-2xs font-semibold text-purple-700 uppercase">Avg Plating per KG</p>
            <p className="text-base font-bold font-mono text-purple-900 mt-0.5">
              {formatPlating(avgPlating)}
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation (Section 12: Overview, Jobs, Inward, Outward, Labour, Activity) */}
      <div className="ds-tabs" role="group" aria-label="Customer views">
        <div>
          {[
            { key: 'jobs', label: `Jobs History (${customerJobs.length})`, icon: Briefcase },
            { key: 'overview', label: 'Operational Overview', icon: Sparkles },
            { key: 'inward', label: 'Inward Receipts', icon: ArrowDownLeft },
            { key: 'outward', label: 'Outward Dispatches', icon: ArrowUpRight },
            { key: 'labour', label: `Labour Work (${customerBindingTasks.length + customerOpenTasks.length})`, icon: Hammer },
            { key: 'activity', label: 'Production Activity', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <TabButton active={isActive}
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className=""
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </TabButton>
            );
          })}
        </div>
      </div>

      {/* Tab 1: JOBS HISTORY TABLE */}
      {activeTab === 'jobs' && (
        <DataTable
          columns={jobColumns}
          data={customerJobs}
          searchPlaceholder="Search customer jobs by ID, plating type, status..."
          onRowClick={(row) => navigateToJob(row.id)}
        />
      )}

      {/* Tab 2: OPERATIONAL OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card padding="md" className="erp-card space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Plating Specifications & Preferences
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Primary Plating Finish:</span>
                <strong className="text-slate-900">White Gold & Rose Gold</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Average Bath Thickness:</span>
                <span className="font-mono font-semibold text-slate-800">{formatPlating(avgPlating)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Turnaround Requirement:</span>
                <span className="text-emerald-700 font-semibold">Standard (24-48 Hours)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Operational Notes:</span>
                <span className="text-slate-700">Strict visual mirror shine polish inspection prior to outward</span>
              </div>
            </div>
          </Card>

          <Card padding="md" className="erp-card space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Recent Production Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Total Jewellery Received:</span>
                <span className="font-mono font-bold text-slate-900">{formatWeight(customer.totalInwardWeight)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Finished Jewellery Dispatched:</span>
                <span className="font-mono font-bold text-emerald-700">{formatWeight(customer.totalOutwardWeight)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Active Queue In Plant:</span>
                <span className="font-mono font-bold text-amber-700">{customer.pendingJobs} Batches</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Account Health:</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Active Partner</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: INWARD RECEIPTS */}
      {activeTab === 'inward' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {customerJobs.map((j) => (
              <Card padding="md" key={j.id} className="erp-card p-4 flex gap-4 items-start">
                <img
                  src={j.itemPhotoUrl}
                  alt={j.id}
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-xs text-slate-900">{j.id}</span>
                    <StatusBadge type="job" value={j.status} />
                  </div>
                  <div className="text-xs text-slate-500">
                    Inward Weight: <strong className="font-mono text-slate-900">{formatWeight(j.inwardWeight)}</strong>
                  </div>
                  <div className="text-xs text-slate-500">
                    Plating: <span className="font-medium text-slate-800">{j.platingType}</span>
                  </div>
                  <div className="text-2xs text-slate-400">
                    Received: {formatDateTime(j.inwardDate)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: OUTWARD DISPATCHES */}
      {activeTab === 'outward' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {customerJobs.filter(j => j.status === 'Outward Completed').map((j) => (
              <Card padding="md" key={j.id} className="erp-card p-4 flex gap-4 items-start border-emerald-200 bg-emerald-50/10">
                <img
                  src={j.outwardPhotoUrl || j.itemPhotoUrl}
                  alt={j.id}
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-xs text-slate-900">{j.id}</span>
                    <span className="text-2xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Dispatched
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Outward Weight: <strong className="font-mono text-emerald-800">{formatWeight(j.outwardWeight)}</strong>
                  </div>
                  <div className="text-xs text-purple-700 font-semibold">
                    Plating per KG: <span className="font-mono">{formatPlating(j.platingPerKg)}</span>
                  </div>
                  <div className="text-2xs text-slate-400">
                    Dispatched: {formatDateTime(j.outwardDate)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: LABOUR ASSIGNMENTS */}
      {activeTab === 'labour' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card padding="md" className="erp-card space-y-3">
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-indigo-100 pb-2">
              <Layers className="w-3.5 h-3.5 text-indigo-600" /> Binding Tasks ({customerBindingTasks.length})
            </h4>
            <div className="space-y-2">
              {customerBindingTasks.map((t) => (
                <div key={t.id} className="p-2.5 rounded bg-indigo-50/50 border border-indigo-100 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-indigo-900">{t.id}</span>
                    <p className="text-slate-600 text-[11px] mt-0.5">Worker: {t.labourName}</p>
                    <p className="text-slate-400 text-2xs">Tar Used: {t.tarUsed} {t.tarUnit}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-2xs font-bold bg-white text-indigo-800 border border-indigo-200">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md" className="erp-card space-y-3">
            <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-orange-100 pb-2">
              <Unlock className="w-3.5 h-3.5 text-orange-600" /> Open Tasks ({customerOpenTasks.length})
            </h4>
            <div className="space-y-2">
              {customerOpenTasks.map((t) => (
                <div key={t.id} className="p-2.5 rounded bg-orange-50/50 border border-orange-100 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-orange-900">{t.id}</span>
                    <p className="text-slate-600 text-[11px] mt-0.5">Worker: {t.labourName}</p>
                    <p className="text-slate-400 text-2xs">Tar Reclaimed: {t.tarUsed} g</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-2xs font-bold bg-white text-orange-800 border border-orange-200">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 6: PRODUCTION ACTIVITY TIMELINE */}
      {activeTab === 'activity' && (
        <Card padding="md" className="erp-card p-4">
          <div className="divide-y divide-slate-100 text-xs">
            {customerTimeline.map((item) => (
              <div key={item.id} className="py-2.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{item.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xs font-mono text-slate-400 block">{formatDateTime(item.timestamp)}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                    {item.userName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

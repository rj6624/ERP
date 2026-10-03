import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { formatWeight, formatPlating } from '../../utils/formatters';
import {
  Search,
  Users,
  Briefcase,
  Scale,
  Zap,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export const OperatorCustomerJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { customers, jobs } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CUST-001');

  // Filter customers by search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  const selectedCustomer = useMemo(() => {
    return (
      customers.find((c) => c.id === selectedCustomerId) ||
      filteredCustomers[0] ||
      customers[0]
    );
  }, [customers, filteredCustomers, selectedCustomerId]);

  const customerJobs = useMemo(() => {
    if (!selectedCustomer) return [];
    return jobs.filter((j) => j.customerId === selectedCustomer.id);
  }, [jobs, selectedCustomer]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Customer Job History Lookup
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick lookup of jewellery batches, scale weights, and dispatch status by customer
          </p>
        </div>

        <button
          onClick={() => navigate('/inward/new')}
          className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <span>+ New Inward for Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Customer List / Search (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search customer name or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {filteredCustomers.map((cust) => {
              const isSelected = selectedCustomer?.id === cust.id;
              const count = jobs.filter((j) => j.customerId === cust.id).length;

              return (
                <button
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`w-full py-3 px-3 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border border-emerald-300 shadow-xs'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                      {cust.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{cust.mobile}</p>
                  </div>
                  <span className="text-[11px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full shrink-0">
                    {count} jobs
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Customer Jobs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedCustomer ? (
            <>
              {/* Customer Header Box */}
              <div className="erp-light-panel bg-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    {selectedCustomer.id}
                  </span>
                  <h2 className="text-xl font-black text-white">{selectedCustomer.name}</h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Mobile: {selectedCustomer.mobile} • {selectedCustomer.address}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-2xl font-black font-mono text-emerald-300">
                    {customerJobs.length}
                  </span>
                  <span className="text-[11px] text-slate-400 block font-semibold">
                    Total Transactions
                  </span>
                </div>
              </div>

              {/* Jobs List */}
              <div className="space-y-3">
                {customerJobs.length > 0 ? (
                  customerJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-slate-900">
                            {job.id}
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded">
                            {job.platingType}
                          </span>
                          {job.priority === 'Fast Forward' && (
                            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <Zap className="w-3 h-3 fill-slate-950" /> FF
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span>
                            Inward: <strong className="text-slate-900 font-mono">{formatWeight(job.inwardWeight)}</strong>
                          </span>
                          {job.outwardWeight && (
                            <span>
                              • Outward: <strong className="text-emerald-700 font-mono">{formatWeight(job.outwardWeight)}</strong>
                            </span>
                          )}
                          {job.platingPerKg && (
                            <span className="text-emerald-800 font-bold">
                              • Plating: {formatPlating(job.platingPerKg)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            job.status === 'Outward Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : job.status === 'Ready for Outward'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {job.status}
                        </span>

                        <button
                          onClick={() => navigate(`/jobs/${job.id}`)}
                          className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                    No jobs recorded for this customer yet.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              Select a customer to view their operational job history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

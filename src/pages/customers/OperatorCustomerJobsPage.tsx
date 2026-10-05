import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { Button, Card, Input } from '../../components/ui/Primitives';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatWeight, formatPlating } from '../../utils/formatters';
import {
  Search,
  Zap,
  ChevronRight,
  Plus,
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
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Customer Job History Lookup
          </h2>
          <p className="text-xs text-slate-500">
            Quick lookup of jewellery batches, scale weights, and dispatch status by customer.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/inward/new')}
          className="self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> New Inward for Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Customer List / Search (4 cols) */}
        <Card padding="sm" className="lg:col-span-4 bg-white rounded-lg border border-slate-200 shadow-sm p-3 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              type="text"
              placeholder="Search customer name or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 ds-control-leading"
            />
          </div>

          <div className="divide-y divide-slate-100 max-h-[65vh] overflow-y-auto custom-scrollbar">
            {filteredCustomers.map((cust) => {
              const isSelected = selectedCustomer?.id === cust.id;
              const count = jobs.filter((j) => j.customerId === cust.id).length;

              return (
                <button
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`w-full py-2.5 px-3 rounded-md text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 border border-slate-300 font-bold'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {cust.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{cust.mobile}</p>
                  </div>
                  <span className="text-[11px] bg-slate-200/80 text-slate-700 font-semibold px-2 py-0.5 rounded shrink-0">
                    {count} jobs
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Right: Selected Customer Jobs (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {selectedCustomer ? (
            <>
              {/* Customer Header Box */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider block">
                    {selectedCustomer.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mobile: {selectedCustomer.mobile} • {selectedCustomer.address}
                  </p>
                </div>
                <div className="text-left sm:text-right p-2.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                    Total Transactions
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-900">
                    {customerJobs.length} Jobs
                  </span>
                </div>
              </div>

              {/* Jobs List */}
              <div className="space-y-2.5">
                {customerJobs.length > 0 ? (
                  customerJobs.map((job) => (
                    <Card
                      padding="sm"
                      key={job.id}
                      className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded">
                            {job.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">
                            {job.platingType}
                          </span>
                          {job.priority === 'Fast Forward' && (
                            <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                              <Zap className="w-3 h-3 text-amber-600 fill-amber-600" /> FF
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span>
                            Inward: <strong className="text-slate-900 font-mono">{formatWeight(job.inwardWeight)}</strong>
                          </span>
                          {job.outwardWeight && (
                            <span>
                              • Outward: <strong className="text-slate-900 font-mono">{formatWeight(job.outwardWeight)}</strong>
                            </span>
                          )}
                          {job.platingPerKg && (
                            <span className="text-purple-700 font-bold font-mono">
                              • Plating: {formatPlating(job.platingPerKg)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge type="job" value={job.status} size="sm" />

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                          className="flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card padding="md" className="p-8 text-center bg-white rounded-lg border border-slate-200 text-xs text-slate-500">
                    No jobs recorded for this customer yet.
                  </Card>
                )}
              </div>
            </>
          ) : (
            <Card padding="md" className="p-12 text-center bg-white rounded-lg border border-slate-200 text-xs text-slate-500">
              Select a customer to view their operational job history.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

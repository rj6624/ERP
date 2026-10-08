import React, { useState, useMemo } from 'react';
import { DialogSurface } from '../ui/DialogSurface';
import { Button, Input } from '../ui/Primitives';
import {
  X,
  ArrowUpDown,
  Users,
  Sparkles,
  Zap,
  CheckCircle2,
  Check,
  Search,
} from 'lucide-react';
import { JewelleryJob } from '../../types/erp';

export interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  // Current active filters
  filterCustomer: string;
  setFilterCustomer: (customer: string) => void;
  filterPlating: string;
  setFilterPlating: (plating: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  // Data sources
  customers: Array<{ id: string; name: string }>;
  jobs: JewelleryJob[];
}

type FilterTab = 'sort' | 'customer' | 'plating' | 'priority' | 'status';

const PLATING_OPTIONS = [
  'All Plating Types',
  'White Gold',
  'Golden Brass',
  'Golden Silver',
  'Antic Gold',
  'Teen Gold',
  'Rose Gold',
  'Damar Gold',
  'Dal Chhol Gold',
];

const PRIORITY_OPTIONS = [
  { label: 'All Priorities', value: 'ALL' },
  { label: 'Regular', value: 'Regular' },
  { label: 'Fast Forward Only', value: 'Fast Forward' },
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'ALL', color: '#94a3b8' },
  { label: 'Inward Received', value: 'Inward Received', color: '#3b82f6' },
  { label: 'In Process', value: 'In Process', color: '#f59e0b' },
  { label: 'Ready for Outward', value: 'Ready for Outward', color: '#6366f1' },
  { label: 'Outward Completed', value: 'Outward Completed', color: '#10b981' },
];

const SORT_OPTIONS = [
  { label: 'Newest Receipts First', value: 'newest', desc: 'Latest inward date' },
  { label: 'Oldest Receipts First', value: 'oldest', desc: 'Earliest inward date' },
  { label: 'Inward Weight: High to Low', value: 'weight_desc', desc: 'Heaviest silver intake' },
  { label: 'Inward Weight: Low to High', value: 'weight_asc', desc: 'Lightest silver intake' },
  { label: 'Customer Name: A to Z', value: 'customer_asc', desc: 'Alphabetical order' },
  { label: 'Job ID: Newest First', value: 'id_desc', desc: 'Highest ID sequence' },
];

const FilterBottomSheetContent: React.FC<FilterBottomSheetProps> = ({
  onClose,
  filterCustomer,
  setFilterCustomer,
  filterPlating,
  setFilterPlating,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  customers,
  jobs,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('customer');
  const [customerSearch, setCustomerSearch] = useState('');

  // Staged filter state initialized directly on mount
  const [stagedCustomer, setStagedCustomer] = useState(filterCustomer);
  const [stagedPlating, setStagedPlating] = useState(filterPlating);
  const [stagedPriority, setStagedPriority] = useState(filterPriority);
  const [stagedStatus, setStagedStatus] = useState(filterStatus);
  const [stagedSortBy, setStagedSortBy] = useState(sortBy || 'newest');

  // Compute live match count based on staged values
  const matchingCount = useMemo(() => {
    return jobs.filter((j) => {
      if (stagedCustomer !== 'ALL' && j.customerId !== stagedCustomer) return false;
      if (stagedPlating !== 'ALL' && j.platingType !== stagedPlating) return false;
      if (stagedPriority !== 'ALL' && j.priority !== stagedPriority) return false;
      if (stagedStatus !== 'ALL' && j.status !== stagedStatus) return false;
      return true;
    }).length;
  }, [jobs, stagedCustomer, stagedPlating, stagedPriority, stagedStatus]);

  // Count active filters in staged state
  const stagedActiveCount = useMemo(() => {
    let count = 0;
    if (stagedCustomer !== 'ALL') count++;
    if (stagedPlating !== 'ALL') count++;
    if (stagedPriority !== 'ALL') count++;
    if (stagedStatus !== 'ALL') count++;
    if (stagedSortBy !== 'newest') count++;
    return count;
  }, [stagedCustomer, stagedPlating, stagedPriority, stagedStatus, stagedSortBy]);

  // Quick counts per filter category for preview
  const countsPerCustomer = useMemo(() => {
    const map = new Map<string, number>();
    jobs.forEach((j) => {
      map.set(j.customerId, (map.get(j.customerId) || 0) + 1);
    });
    return map;
  }, [jobs]);

  const countsPerPlating = useMemo(() => {
    const map = new Map<string, number>();
    jobs.forEach((j) => {
      map.set(j.platingType, (map.get(j.platingType) || 0) + 1);
    });
    return map;
  }, [jobs]);

  const filteredCustomerList = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, customerSearch]);

  const handleApply = () => {
    setFilterCustomer(stagedCustomer);
    setFilterPlating(stagedPlating);
    setFilterPriority(stagedPriority);
    setFilterStatus(stagedStatus);
    setSortBy(stagedSortBy);
    onClose();
  };

  const handleReset = () => {
    setStagedCustomer('ALL');
    setStagedPlating('ALL');
    setStagedPriority('ALL');
    setStagedStatus('ALL');
    setStagedSortBy('newest');
  };

  const tabs: { id: FilterTab; label: string; icon: React.ReactNode; isApplied: boolean }[] = [
    {
      id: 'sort',
      label: 'Sort By',
      icon: <ArrowUpDown className="w-4 h-4" />,
      isApplied: stagedSortBy !== 'newest',
    },
    {
      id: 'customer',
      label: 'Customer',
      icon: <Users className="w-4 h-4" />,
      isApplied: stagedCustomer !== 'ALL',
    },
    {
      id: 'plating',
      label: 'Plating Type',
      icon: <Sparkles className="w-4 h-4" />,
      isApplied: stagedPlating !== 'ALL',
    },
    {
      id: 'priority',
      label: 'Priority',
      icon: <Zap className="w-4 h-4" />,
      isApplied: stagedPriority !== 'ALL',
    },
    {
      id: 'status',
      label: 'Status',
      icon: <CheckCircle2 className="w-4 h-4" />,
      isApplied: stagedStatus !== 'ALL',
    },
  ];

  return (
    <div
      className="ds-overlay fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <DialogSurface
        onClose={onClose}
        className="w-full sm:max-w-xl h-[85dvh] sm:h-[600px] max-h-[85dvh] flex flex-col bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200 !overflow-hidden transform transition-all animate-in slide-in-from-bottom duration-300"
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-slate-300/80 rounded-full mx-auto mt-2.5 mb-1 shrink-0 sm:hidden" />

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Filters</h2>
            {stagedActiveCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-[#081c05] text-white">
                {stagedActiveCount} active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {stagedActiveCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full h-8 w-8"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Modal Body: Split Master-Detail Layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden bg-slate-50/50">
          {/* Left Column: Category Navigation Tabs */}
          <div className="w-32 sm:w-36 bg-slate-50 border-r border-slate-200/80 overflow-y-auto py-2 shrink-0 flex flex-col gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant="surface"
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full relative px-3 py-3 flex items-center justify-start gap-2.5 text-xs text-left transition-all border-0 shadow-none rounded-none cursor-pointer ${
                    isActive
                      ? 'bg-white font-bold text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                  }`}
                >
                  {/* Active Left Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#081c05] rounded-r" />
                  )}

                  <span className={isActive ? 'text-[#081c05]' : 'text-slate-400'}>
                    {tab.icon}
                  </span>

                  <span className="truncate flex-1">{tab.label}</span>

                  {/* Dot Badge for applied filters */}
                  {tab.isApplied && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Right Column: Category Content & Option Chips */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col bg-white min-w-0">
            {/* Category: Sort By */}
            {activeTab === 'sort' && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Sort Receipts
                  </h3>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    Select order for inward jewellery receipts
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = stagedSortBy === opt.value;
                    return (
                      <Button
                        key={opt.value}
                        variant="surface"
                        type="button"
                        onClick={() => setStagedSortBy(opt.value)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#081c05] text-white border-[#081c05] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {opt.label}
                          </div>
                          <div className={`text-2xs ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                            {opt.desc}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                          </div>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category: Customer */}
            {activeTab === 'customer' && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Jewellery Customer
                  </h3>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    Filter receipts by registered customer account
                  </p>
                </div>

                {/* Customer search box */}
                <div className="relative group">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#081c05] transition-colors pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Search customer name..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full !pl-8 !pr-7 !text-xs !h-8 !min-h-[32px] !max-h-[32px] !py-1 rounded-lg bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-[#081c05] focus:ring-1 focus:ring-[#081c05]/10 text-slate-800 placeholder:text-slate-400 font-normal transition-all ds-control-leading"
                  />
                  {customerSearch && (
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => setCustomerSearch('')}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 rounded-full h-5 w-5 flex items-center justify-center transition-colors !min-h-0 !min-w-0"
                      title="Clear customer search"
                      aria-label="Clear customer search"
                    >
                      <X className="w-2.5 h-2.5" />
                    </Button>
                  )}
                </div>

                {customerSearch.trim() && (
                  <div className="flex items-center justify-between text-2xs text-slate-500 px-0.5">
                    <span>
                      {filteredCustomerList.length} customer
                      {filteredCustomerList.length === 1 ? '' : 's'} matching "{customerSearch}"
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCustomerSearch('')}
                      className="text-2xs text-[#081c05] font-semibold hover:underline p-0 h-auto"
                    >
                      Clear search
                    </Button>
                  </div>
                )}

                {/* Customer Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {/* All Customers Option */}
                  <Button
                    variant="surface"
                    type="button"
                    onClick={() => setStagedCustomer('ALL')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      stagedCustomer === 'ALL'
                        ? 'bg-[#081c05] text-white border-[#081c05] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    All Customers ({jobs.length})
                  </Button>

                  {filteredCustomerList.map((c) => {
                    const isSelected = stagedCustomer === c.id;
                    const jobCount = countsPerCustomer.get(c.id) || 0;
                    return (
                      <Button
                        key={c.id}
                        variant="surface"
                        type="button"
                        onClick={() => setStagedCustomer(c.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#081c05] text-white border-[#081c05] shadow-xs font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate max-w-[140px]">{c.name}</span>
                        <span
                          className={`text-2xs font-mono px-1.5 py-0.2 rounded-full ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {jobCount}
                        </span>
                      </Button>
                    );
                  })}
                </div>

                {filteredCustomerList.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4">
                    <Search className="w-6 h-6 text-slate-300 mb-1.5" />
                    <p className="text-xs font-semibold text-slate-700">No customers found</p>
                    <p className="text-2xs text-slate-400 mt-0.5">
                      No registered customer matches "{customerSearch}"
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCustomerSearch('')}
                      className="mt-2.5 text-xs rounded-lg px-3 py-1 font-semibold"
                    >
                      Reset Search
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Category: Plating Type */}
            {activeTab === 'plating' && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Plating Finish
                  </h3>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    Filter by applied silver or gold finish style
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {PLATING_OPTIONS.map((plating) => {
                    const value = plating === 'All Plating Types' ? 'ALL' : plating;
                    const isSelected = stagedPlating === value;
                    const count =
                      value === 'ALL'
                        ? jobs.length
                        : countsPerPlating.get(value) || 0;

                    return (
                      <Button
                        key={plating}
                        variant="surface"
                        type="button"
                        onClick={() => setStagedPlating(value)}
                        className={`px-3.5 py-2.5 rounded-xl text-xs border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#081c05] text-white border-[#081c05] font-semibold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <span>{plating}</span>
                        <span
                          className={`text-2xs font-mono px-1.5 py-0.2 rounded-full ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category: Priority */}
            {activeTab === 'priority' && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Receipt Priority
                  </h3>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    Filter by order urgency (Regular or Fast Forward)
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  {PRIORITY_OPTIONS.map((p) => {
                    const isSelected = stagedPriority === p.value;
                    const count =
                      p.value === 'ALL'
                        ? jobs.length
                        : jobs.filter((j) => j.priority === p.value).length;

                    return (
                      <Button
                        key={p.value}
                        variant="surface"
                        type="button"
                        onClick={() => setStagedPriority(p.value)}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#081c05] text-white border-[#081c05] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {p.value === 'Fast Forward' && (
                            <Zap className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-amber-500'}`} />
                          )}
                          <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {p.label}
                          </span>
                        </div>

                        <span
                          className={`text-2xs font-mono px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {count} receipts
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category: Status */}
            {activeTab === 'status' && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Job Status
                  </h3>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    Filter by inward receipt processing stage
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  {STATUS_OPTIONS.map((st) => {
                    const isSelected = stagedStatus === st.value;
                    const count =
                      st.value === 'ALL'
                        ? jobs.length
                        : jobs.filter((j) => j.status === st.value).length;

                    return (
                      <Button
                        key={st.value}
                        variant="surface"
                        type="button"
                        onClick={() => setStagedStatus(st.value)}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#081c05] text-white border-[#081c05] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: st.color }}
                          />
                          <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {st.label}
                          </span>
                        </div>

                        <span
                          className={`text-2xs font-mono px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Sticky Footer (Matching Image 1 Reference) */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            type="button"
            onClick={handleReset}
            className="rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 border-slate-300 hover:bg-slate-100"
          >
            Reset
          </Button>

          <Button
            variant="primary"
            type="button"
            onClick={handleApply}
            className="flex-1 rounded-xl py-2.5 px-4 text-xs sm:text-sm font-bold shadow-md text-white bg-[#081c05] hover:bg-[#040e02] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <span>Show {matchingCount} {matchingCount === 1 ? 'Result' : 'Results'}</span>
          </Button>
        </div>
      </DialogSurface>
    </div>
  );
};

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = (props) => {
  if (!props.isOpen) return null;
  return <FilterBottomSheetContent {...props} />;
};


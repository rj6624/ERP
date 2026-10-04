import { DialogSurface } from '../ui/DialogSurface';
import { Button, Card, Input } from '../ui/Primitives';
import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { Search, User, Briefcase, Box, Users, X, ArrowRight, ShieldCheck, Flame, FlaskConical, Hammer } from 'lucide-react';
import { formatWeight, formatPlating } from '../../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    customers,
    jobs,
    chemicals,
    acids,
    metals,
    labourList,
    navigateToCustomer,
    navigateToJob,
    setCurrentPage,
  } = useERP();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = query.trim().toLowerCase();

  // Strictly operational search items (Section 39)
  const matchingCustomers = q ? customers.filter((c) => c.name.toLowerCase().includes(q) || c.mobile.includes(q)) : [];
  const matchingJobs = q ? jobs.filter((j) => j.id.toLowerCase().includes(q) || j.customerName.toLowerCase().includes(q) || j.platingType.toLowerCase().includes(q)) : [];
  const matchingStock = q ? [
    ...chemicals.filter(c => c.name.toLowerCase().includes(q)).map(c => ({ name: c.name, type: 'Chemical', page: 'stock_chemical' as const, icon: FlaskConical })),
    ...acids.filter(a => a.name.toLowerCase().includes(q)).map(a => ({ name: a.name, type: 'Acid', page: 'stock_acid' as const, icon: Flame })),
    ...metals.filter(m => m.name.toLowerCase().includes(q)).map(m => ({ name: m.name, type: 'Metal', page: 'stock_metal' as const, icon: ShieldCheck })),
  ] : [];
  const matchingLabour = q ? labourList.filter((l) => l.name.toLowerCase().includes(q) || l.labourType.toLowerCase().includes(q)) : [];

  const totalResults = matchingCustomers.length + matchingJobs.length + matchingStock.length + matchingLabour.length;

  return (
    <div className="ds-overlay fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-3 sm:pt-20 px-3 sm:px-4 font-sans">
      <DialogSurface onClose={() => setIsSearchModalOpen(false)}  role="dialog" aria-modal="true" aria-label="Search records" className="flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-6rem)] w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="shrink-0 p-3 sm:p-4 border-b border-slate-200 flex items-center gap-2 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <Input
            type="text"
            aria-label="Search customers, jobs and stock"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Customers, Job IDs (e.g. DARSHAN1), Labour, Materials, Stock..."
            className="min-w-0 w-full placeholder-slate-400"
          />
          {query && (
            <Button variant="ghost" size="icon" aria-label="Clear search" onClick={() => setQuery('')} className="shrink-0">
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" aria-label="Close search" onClick={() => setIsSearchModalOpen(false)} className="shrink-0">Close</Button>
        </div>

        {/* Results Container */}
        <div className="min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4">
          {!q ? (
            <div className="text-center py-8 text-xs text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Type to search across manufacturing jobs, customer profiles, and factory inventory.</p>
              <div className="flex justify-center gap-2 pt-2">
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-2xs font-mono">DARSHAN1</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-2xs font-mono">Rose Gold</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-2xs font-mono">Silver Anode</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching operational records found for &ldquo;<span className="font-semibold text-slate-700">{query}</span>&rdquo;.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* JOBS SECTION (Section 39 example: DARSHAN1 -> Customer, Job, Inward, Outward, Status) */}
              {matchingJobs.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-2xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-brand-600" /> Jewellery Jobs ({matchingJobs.length})
                  </h4>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    {matchingJobs.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => {
                          navigateToJob(j.id);
                          setIsSearchModalOpen(false);
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                              {j.id}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="font-bold text-slate-800">{j.customerName}</span>
                            <span className="text-2xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                              {j.platingType}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Inward: {formatWeight(j.inwardWeight)}
                            {j.outwardWeight ? ` | Outward: ${formatWeight(j.outwardWeight)} | Plating: ${formatPlating(j.platingPerKg)}` : ''}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-2xs font-semibold px-2 py-0.5 rounded ${
                              j.status === 'Outward Completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {j.status}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CUSTOMERS SECTION */}
              {matchingCustomers.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-2xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" /> Customers ({matchingCustomers.length})
                  </h4>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    {matchingCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          navigateToCustomer(c.id);
                          setIsSearchModalOpen(false);
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                              {c.name}
                            </span>
                            <span className="font-mono text-2xs text-slate-400">{c.id}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">{c.mobile} • {c.address}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LABOUR SECTION */}
              {matchingLabour.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-2xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5 text-indigo-600" /> Labour Force ({matchingLabour.length})
                  </h4>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    {matchingLabour.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          setCurrentPage('labour_list');
                          setIsSearchModalOpen(false);
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                              {l.name}
                            </span>
                            <span className="text-2xs text-slate-400 font-mono">{l.id}</span>
                            <span className="text-2xs bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-medium">
                              {l.labourType}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">{l.mobile} • Status: {l.status}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STOCK MATERIALS SECTION */}
              {matchingStock.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-2xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-cyan-600" /> Factory Materials ({matchingStock.length})
                  </h4>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    {matchingStock.map((s, idx) => {
                      const Icon = s.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setCurrentPage(s.page);
                            setIsSearchModalOpen(false);
                          }}
                          className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-slate-500" />
                            <div>
                              <span className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                                {s.name}
                              </span>
                              <span className="text-2xs text-slate-400 block">{s.type} Stock Ledger</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogSurface>
    </div>
  );
};

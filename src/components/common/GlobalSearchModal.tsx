import { DialogSurface } from '../ui/DialogSurface';
import { Button, Input } from '../ui/Primitives';
import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Search,
  User,
  Briefcase,
  Box,
  X,
  ArrowRight,
  ShieldCheck,
  Flame,
  FlaskConical,
  Hammer,
  Clock,
} from 'lucide-react';
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
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('erp_search_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 5);
      }
    } catch {
      // fallback
    }
    return ['DARSHAN1', 'Gold Plating', 'JOB-1025', 'Khimji Jewellers', 'Rhodium Bath'];
  });

  const saveToHistory = (term: string) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('erp_search_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeFromHistory = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item.toLowerCase() !== term.toLowerCase());
      try {
        localStorage.setItem('erp_search_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

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
      <DialogSurface onClose={() => setIsSearchModalOpen(false)} role="dialog" aria-modal="true" aria-label="Search records" className="flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-6rem)] w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) saveToHistory(query.trim());
          }}
          className="shrink-0 p-3 sm:p-4 border-b border-slate-100 flex items-center gap-2.5 bg-white"
        >
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
            <Input
              type="text"
              aria-label="Search records"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, customers, labour, stock..."
              className="erp-modal-search-input w-full"
            />
            {query && (
              <Button
                variant="surface"
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-6 w-6 min-h-0 min-w-0 p-0 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-md border-0 shadow-none cursor-pointer z-10"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            type="button"
            aria-label="Close search"
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 shrink-0 h-[42px] px-3.5 rounded-xl cursor-pointer"
          >
            Close
          </Button>
        </form>

        {/* Results / History Container */}
        <div className="min-h-0 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-4">
          {!q ? (
            <div className="space-y-3">
              {/* LAST 5 RECENT SEARCH HISTORY */}
              {searchHistory.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 px-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Recent Searches</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {searchHistory.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setQuery(item);
                          saveToHistory(item);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-700 hover:text-slate-950 transition-all cursor-pointer group"
                      >
                        <span>{item}</span>
                        <Button
                          variant="surface"
                          type="button"
                          onClick={(e) => removeFromHistory(item, e)}
                          className="p-0.5 rounded-sm hover:bg-rose-100 text-slate-400 hover:text-rose-600 border-0 shadow-none cursor-pointer transition-colors"
                          title="Remove from history"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  <p>Type to search across jobs, customers, labour, and stock...</p>
                </div>
              )}
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No matching records found for &ldquo;<span className="font-semibold text-slate-700">{query}</span>&rdquo;.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* JOBS SECTION */}
              {matchingJobs.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-2xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-brand-600" /> Jewellery Jobs ({matchingJobs.length})
                  </h4>
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden bg-white">
                    {matchingJobs.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => {
                          saveToHistory(j.id);
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
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
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
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden bg-white">
                    {matchingCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          saveToHistory(c.name);
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
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden bg-white">
                    {matchingLabour.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          saveToHistory(l.name);
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
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden bg-white">
                    {matchingStock.map((s, idx) => {
                      const Icon = s.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            saveToHistory(s.name);
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

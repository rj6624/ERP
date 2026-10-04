import { Button } from '../ui/Primitives';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Users,
  Briefcase,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface OperatorSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const OperatorSidebar: React.FC<OperatorSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobs } = useERP();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    work: true,
    customers: true,
    reports: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isNavActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const fastForwardPendingCount = jobs.filter(
    (j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed'
  ).length;

  const outwardPendingCount = jobs.filter(
    (j) => j.status === 'Ready for Outward' || j.status === 'In Process'
  ).length;

  return (
    <aside
      className={`erp-sidebar bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-200 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800 bg-black/40">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-sm shadow-md shrink-0">
              PM
            </div>
            <div className="truncate">
              <span className="font-bold text-xs text-white tracking-wide block leading-tight">
                PLATING FACTORY
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                Operator Station
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-sm mx-auto shadow-md">
            PM
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-4 custom-scrollbar">
        {/* 1. DASHBOARD */}
        <div>
          <Button variant="surface"
            onClick={() => navigate('/dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
              isNavActive('/dashboard')
                ? 'erp-nav-active bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
            title="Operator Dashboard"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </Button>
        </div>

        {/* 2. WORK SECTION */}
        <div>
          {!collapsed && (
            <Button variant="surface"
              onClick={() => toggleSection('work')}
              className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Factory Work</span>
              {openSections.work ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </Button>
          )}

          {(openSections.work || collapsed) && (
            <div className="mt-1 space-y-1">
              {/* Inward */}
              <Button variant="surface"
                onClick={() => navigate('/inward')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isNavActive('/inward')
                    ? 'erp-nav-active bg-slate-800 text-white border-l-3 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
                title="Customer Inward Intake"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400 shrink-0" />
                  {!collapsed && <span className="truncate">Inward Intake</span>}
                </div>
              </Button>

              {/* Outward */}
              <Button variant="surface"
                onClick={() => navigate('/outward')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isNavActive('/outward')
                    ? 'erp-nav-active bg-slate-800 text-white border-l-3 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
                title="Customer Outward Dispatch"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ArrowUpRight className="w-4 h-4 text-blue-400 shrink-0" />
                  {!collapsed && <span className="truncate">Outward Dispatch</span>}
                </div>
                {!collapsed && outwardPendingCount > 0 && (
                  <span className="text-[10px] bg-blue-950/80 text-blue-300 border border-blue-800/60 px-1 py-0.5 rounded-[4px] min-w-[18px] h-[18px] inline-flex items-center justify-center-[4px] font-bold min-w-[18px] h-[18px] inline-flex items-center justify-center">
                    {outwardPendingCount}
                  </span>
                )}
              </Button>

              {/* Fast Forward Queue */}
              <Button variant="surface"
                onClick={() => navigate('/fast-forward')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isNavActive('/fast-forward')
                    ? 'erp-nav-active bg-amber-950/60 text-amber-200 border-l-3 border-amber-500'
                    : 'text-amber-400/90 hover:text-amber-200 hover:bg-amber-950/30'
                }`}
                title="Fast Forward Priority Queue"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" />
                  {!collapsed && <span className="truncate font-bold">Fast Forward</span>}
                </div>
                {!collapsed && fastForwardPendingCount > 0 && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1 py-0.5 rounded-[4px] min-w-[18px] h-[18px] inline-flex items-center justify-center-full shadow-xs">
                    {fastForwardPendingCount}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* 3. CUSTOMERS SECTION */}
        <div>
          {!collapsed && (
            <Button variant="surface"
              onClick={() => toggleSection('customers')}
              className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Customers</span>
              {openSections.customers ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </Button>
          )}

          {(openSections.customers || collapsed) && (
            <div className="mt-1 space-y-1">
              <Button variant="surface"
                onClick={() => navigate('/customers')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isNavActive('/customers')
                    ? 'erp-nav-active bg-slate-800 text-white border-l-3 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
                title="Customer Directory"
              >
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                {!collapsed && <span className="truncate">Customers</span>}
              </Button>

              <Button variant="surface"
                onClick={() => navigate('/customer-jobs')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isNavActive('/customer-jobs')
                    ? 'erp-nav-active bg-slate-800 text-white border-l-3 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
                title="Customer Jobs History"
              >
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                {!collapsed && <span className="truncate">Customer Jobs</span>}
              </Button>
            </div>
          )}
        </div>

        {/* 4. OPERATIONAL REPORTS */}
        <div>
          {!collapsed && (
            <Button variant="surface"
              onClick={() => toggleSection('reports')}
              className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Daily Reports</span>
              {openSections.reports ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </Button>
          )}

          {(openSections.reports || collapsed) && (
            <div className="mt-1 space-y-1">
              <Button variant="surface"
                onClick={() => navigate('/reports')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isNavActive('/reports')
                    ? 'erp-nav-active bg-slate-800 text-white border-l-3 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
                title="Operational Daily Reports"
              >
                <FileSpreadsheet className="w-4 h-4 text-slate-400 shrink-0" />
                {!collapsed && <span className="truncate">Operational Reports</span>}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Operator Station Badge Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <p className="text-[11px] font-bold text-emerald-200 leading-tight">Scale Calibration: Active</p>
              <p className="text-[10px] text-slate-400 font-mono">Precision ±0.001 kg</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

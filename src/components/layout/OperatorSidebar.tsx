import { Button } from '../ui/Primitives';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import {
  LayoutDashboard,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Briefcase,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Scale,
} from 'lucide-react';

interface OperatorSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const OperatorSidebar: React.FC<OperatorSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobs, customers, currentUser } = useERP();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    work: true,
    customer: true,
    reports: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isNavActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const fastForwardPendingCount = jobs.filter(
    (j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed'
  ).length;

  return (
    <aside
      className={`erp-sidebar bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-200 z-30 select-none font-sans shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-14 flex items-center border-b border-slate-800 bg-slate-950/60 shrink-0 ${collapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
        <div
          onClick={() => navigate('/dashboard')}
          className={`flex items-center cursor-pointer overflow-hidden ${collapsed ? 'justify-center' : 'gap-2.5'}`}
        >
          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm shadow-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-xs text-white">
                PLATING MGMT
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight flex items-center gap-1">
                JEWELLERY ERP <span className="text-emerald-400 font-bold text-[9px] bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-800/40">OPERATOR</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-xs custom-scrollbar">
        {/* DASHBOARD */}
        <Button
          variant="surface"
          onClick={() => navigate('/dashboard')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
            isNavActive('/dashboard')
              ? 'erp-nav-active bg-emerald-600 text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Dashboard"
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </Button>

        {/* INTAKE & DISPATCH (WORK SECTION) */}
        <div className="pt-2">
          {!collapsed && (
            <Button
              variant="surface"
              onClick={() => toggleSection('work')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Intake & Dispatch</span>
              {openSections.work ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          )}
          {(!collapsed ? openSections.work : true) && (
            <div className="space-y-0.5 mt-0.5">
              <Button
                variant="surface"
                onClick={() => navigate('/inward')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/inward')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Inward Intake"
              >
                <div className="flex items-center gap-2.5">
                  <ArrowDownLeft className="w-4 h-4 shrink-0 text-blue-400" />
                  {!collapsed && <span>Inward Intake</span>}
                </div>
              </Button>

              <Button
                variant="surface"
                onClick={() => navigate('/outward')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/outward')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Outward Dispatch"
              >
                <div className="flex items-center gap-2.5">
                  <ArrowUpRight className="w-4 h-4 shrink-0 text-emerald-400" />
                  {!collapsed && <span>Outward Dispatch</span>}
                </div>
              </Button>

              <Button
                variant="surface"
                onClick={() => navigate('/fast-forward')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/fast-forward')
                    ? 'erp-nav-active bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                    : 'text-amber-400/80 hover:bg-slate-800/60 hover:text-amber-300'
                }`}
                title="Fast Forward Queue"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 shrink-0 text-amber-400 fill-amber-400" />
                  {!collapsed && <span>Fast Forward</span>}
                </div>
                {!collapsed && fastForwardPendingCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1 py-0.5 rounded-[4px] min-w-[18px] h-[18px] inline-flex items-center justify-center">
                    {fastForwardPendingCount}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* CUSTOMER SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <Button
              variant="surface"
              onClick={() => toggleSection('customer')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Customer Operations</span>
              {openSections.customer ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          )}
          {(!collapsed ? openSections.customer : true) && (
            <div className="space-y-0.5 mt-0.5">
              <Button
                variant="surface"
                onClick={() => navigate('/customers')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/customers')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Customers"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Customers</span>}
                </div>
                {!collapsed && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded-[4px] font-mono min-w-[18px] h-[18px] inline-flex items-center justify-center">
                    {customers.length}
                  </span>
                )}
              </Button>

              <Button
                variant="surface"
                onClick={() => navigate('/customer-jobs')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/customer-jobs')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Customer Job Ledgers"
              >
                <Briefcase className="w-4 h-4 shrink-0 text-cyan-400" />
                {!collapsed && <span>Customer Ledgers</span>}
              </Button>
            </div>
          )}
        </div>

        {/* REPORTS SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <Button
              variant="surface"
              onClick={() => toggleSection('reports')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Operator Reports</span>
              {openSections.reports ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          )}
          {(!collapsed ? openSections.reports : true) && (
            <div className="space-y-0.5 mt-0.5">
              <Button
                variant="surface"
                onClick={() => navigate('/reports')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/reports')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Daily Reports"
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0 text-cyan-400" />
                {!collapsed && <span>Daily Shift Reports</span>}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Operator User Footer Widget */}
      <div className={`p-3 border-t border-slate-800 bg-slate-950/80 flex items-center shrink-0 ${collapsed ? 'justify-center px-0' : 'justify-between'}`}>
        <div className={`flex items-center min-w-0 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
          <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-600">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'RP'}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">{currentUser?.name || 'Ramesh Patel'}</span>
              <span className="text-[10px] text-emerald-400 font-mono">Factory Operator</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

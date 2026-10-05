import { Button } from '../ui/Primitives';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Sparkles,
  FileText,
  ChevronDown,
  ChevronRight,
  Hammer,
} from 'lucide-react';

interface LabourSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export const LabourSidebar: React.FC<LabourSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { labourBindingTasks, labourOpenTasks, currentUser } = useERP();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    work: true,
    reports: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Current worker's tasks
  const isMyTask = (labourName: string) => {
    if (!currentUser?.name) return true;
    return labourName === currentUser.name || labourName.toLowerCase().includes('suresh');
  };

  const myBindingTasks = labourBindingTasks.filter((t) => isMyTask(t.labourName));
  const myOpenTasks = labourOpenTasks.filter((t) => isMyTask(t.labourName));

  const pendingBinding = myBindingTasks.filter((t) => t.status === 'Pending').length;
  const pendingOpen = myOpenTasks.filter((t) => t.status === 'Pending').length;
  const inProgressTotal =
    myBindingTasks.filter((t) => t.status === 'In Progress').length +
    myOpenTasks.filter((t) => t.status === 'In Progress').length;
  const assignedTotal = myBindingTasks.length + myOpenTasks.length;

  const isNavActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

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
                JEWELLERY ERP <span className="text-emerald-400 font-bold text-[9px] bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-800/40">ARTISAN</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-xs custom-scrollbar">
        {/* WORK DASHBOARD */}
        <Button
          variant="surface"
          onClick={() => navigate('/dashboard')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
            isNavActive('/dashboard')
              ? 'erp-nav-active bg-emerald-600 text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Work Dashboard"
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Work Dashboard</span>}
        </Button>

        {/* ARTISAN OPERATIONS SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <Button
              variant="surface"
              onClick={() => toggleSection('work')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Artisan Operations</span>
              {openSections.work ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          )}
          {(!collapsed ? openSections.work : true) && (
            <div className="space-y-0.5 mt-0.5">
              <Button
                variant="surface"
                onClick={() => navigate('/my-work')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/my-work')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="All Assigned Work"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 shrink-0 text-blue-400" />
                  {!collapsed && <span>All Assigned Work</span>}
                </div>
                {!collapsed && inProgressTotal > 0 && (
                  <span className="text-[10px] bg-blue-500 text-white px-1 py-0.5 rounded-[4px] font-bold min-w-[18px] h-[18px] inline-flex items-center justify-center">
                    {inProgressTotal} active
                  </span>
                )}
              </Button>

              <Button
                variant="surface"
                onClick={() => navigate('/labour/binding')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/labour/binding')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Wire & Tar Binding"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 shrink-0 text-amber-400" />
                  {!collapsed && <span>Binding Work</span>}
                </div>
                {!collapsed && pendingBinding > 0 && (
                  <span className="text-[10px] bg-slate-800 text-amber-400 border border-amber-500/40 px-1 py-0.5 rounded-[4px] font-mono min-w-[18px] h-[18px] inline-flex items-center justify-center">
                    {pendingBinding}
                  </span>
                )}
              </Button>

              <Button
                variant="surface"
                onClick={() => navigate('/labour/open')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/labour/open')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Post-Plating Open & Clean"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                  {!collapsed && <span>Open & Clean</span>}
                </div>
                {!collapsed && pendingOpen > 0 && (
                  <span className="text-[10px] bg-slate-800 text-emerald-400 border border-emerald-500/40 px-1 py-0.5 rounded-[4px] font-mono min-w-[18px] h-[18px] inline-flex items-center justify-center">
                    {pendingOpen}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* REPORTS & LOGS SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <Button
              variant="surface"
              onClick={() => toggleSection('reports')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Reports & Logs</span>
              {openSections.reports ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          )}
          {(!collapsed ? openSections.reports : true) && (
            <div className="space-y-0.5 mt-0.5">
              <Button
                variant="surface"
                onClick={() => navigate('/labour/reports')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/labour/reports')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Labour Work Reports"
              >
                <FileText className="w-4 h-4 shrink-0 text-cyan-400" />
                {!collapsed && <span>Work Reports</span>}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Artisan User Footer Widget */}
      <div className={`p-3 border-t border-slate-800 bg-slate-950/80 flex items-center shrink-0 ${collapsed ? 'justify-center px-0' : 'justify-between'}`}>
        <div className={`flex items-center min-w-0 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
          <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-600">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'SP'}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">{currentUser?.name || 'Suresh Parmar'}</span>
              <span className="text-[10px] text-emerald-400 font-mono">Labour Specialist</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { useERP } from '../../context/ERPContext';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Sparkles,
  FileText,
  ChevronLeft,
  ChevronRight,
  Hammer,
  Clock,
  CheckCircle2,
  HardHat,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LabourSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export const LabourSidebar: React.FC<LabourSidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { labourBindingTasks, labourOpenTasks, currentUser } = useERP();

  // Current worker's tasks
  const myBindingTasks = labourBindingTasks.filter(
    (t) => t.labourName === currentUser?.name || currentUser?.name?.includes('Suresh')
  );
  const myOpenTasks = labourOpenTasks.filter(
    (t) => t.labourName === currentUser?.name || currentUser?.name?.includes('Suresh')
  );

  const pendingBinding = myBindingTasks.filter((t) => t.status === 'Pending').length;
  const pendingOpen = myOpenTasks.filter((t) => t.status === 'Pending').length;
  const inProgressTotal =
    myBindingTasks.filter((t) => t.status === 'In Progress').length +
    myOpenTasks.filter((t) => t.status === 'In Progress').length;

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={`erp-sidebar relative flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out shrink-0 select-none z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Hammer className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold tracking-wider text-slate-100 uppercase truncate">
                PLATING WORKER
              </span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                LABOUR STATION 03
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-6 custom-scrollbar text-xs">
        {/* DASHBOARD */}
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
              isActive('/dashboard')
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
            title="Work Dashboard"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0 text-amber-400" />
            {!collapsed && <span>Work Dashboard</span>}
          </button>
        </div>

        {/* MY WORK QUEUE */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Assigned Work
            </div>
          )}

          {/* All My Work */}
          <button
            onClick={() => navigate('/my-work')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${
              isActive('/my-work')
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
            title="All Assigned Work"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 shrink-0 text-blue-400" />
              {!collapsed && <span>All Assigned Work</span>}
            </div>
            {!collapsed && inProgressTotal > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {inProgressTotal} active
              </span>
            )}
          </button>

          {/* Binding Work */}
          <button
            onClick={() => navigate('/labour/binding')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${
              isActive('/labour/binding')
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
            title="Binding Work"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 shrink-0 text-amber-400" />
              {!collapsed && <span>Binding Work</span>}
            </div>
            {!collapsed && pendingBinding > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {pendingBinding} pending
              </span>
            )}
          </button>

          {/* Open Work */}
          <button
            onClick={() => navigate('/labour/open')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${
              isActive('/labour/open')
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
            title="Open Work"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
              {!collapsed && <span>Open Work</span>}
            </div>
            {!collapsed && pendingOpen > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {pendingOpen} pending
              </span>
            )}
          </button>
        </div>

        {/* WORK REPORTS */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Work History
            </div>
          )}

          <button
            onClick={() => navigate('/labour/reports')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
              isActive('/labour/reports')
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
            title="My Work Reports"
          >
            <FileText className="w-4 h-4 shrink-0 text-slate-400" />
            {!collapsed && <span>My Work Reports</span>}
          </button>
        </div>
      </div>

      {/* Artisan Status Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              SP
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-200 truncate">
                {currentUser?.name || 'Suresh Parmar'}
              </div>
              <div className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                <HardHat className="w-2.5 h-2.5" /> Artisan • Bench #4
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

import { Button } from '../ui/Primitives';
import React, { useState, useRef, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  ShieldCheck,
  Shield,
  HardHat,
  Hammer,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';

interface RoleOption {
  id: 'Admin' | 'Manager' | 'Operator' | 'Labour';
  name: string;
  user: string;
  badge: string;
  roleTag: string;
  description: string;
  icon: React.ElementType;
  theme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
    activeBorder: string;
    iconBg: string;
  };
}

const ROLES: RoleOption[] = [
  {
    id: 'Admin',
    name: 'Administrator',
    user: 'Rajan Shah',
    badge: 'ADMIN',
    roleTag: 'Full Access',
    description: 'Enterprise control, financials, billing & permissions',
    icon: ShieldCheck,
    theme: {
      bg: 'bg-emerald-50 hover:bg-emerald-100/70',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      badgeBg: 'bg-emerald-600',
      badgeText: 'text-white',
      glow: 'shadow-emerald-500/10',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
  },
  {
    id: 'Manager',
    name: 'Operations Manager',
    user: 'Vikram Joshi',
    badge: 'OPS',
    roleTag: 'Management',
    description: 'Floor supervision, inventory, queues & reports',
    icon: Shield,
    theme: {
      bg: 'bg-indigo-50 hover:bg-indigo-100/70',
      border: 'border-indigo-200',
      text: 'text-indigo-900',
      badgeBg: 'bg-indigo-600',
      badgeText: 'text-white',
      glow: 'shadow-indigo-500/10',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/20',
      iconBg: 'bg-indigo-100 text-indigo-700',
    },
  },
  {
    id: 'Operator',
    name: 'Factory Operator',
    user: 'Ramesh Patel',
    badge: 'FLOOR',
    roleTag: 'Station 01',
    description: 'Barcode intake, weight calculation & dispatch',
    icon: HardHat,
    theme: {
      bg: 'bg-sky-50 hover:bg-sky-100/70',
      border: 'border-sky-200',
      text: 'text-sky-900',
      badgeBg: 'bg-sky-600',
      badgeText: 'text-white',
      glow: 'shadow-sky-500/10',
      activeBorder: 'border-sky-500 ring-2 ring-sky-500/20',
      iconBg: 'bg-sky-100 text-sky-700',
    },
  },
  {
    id: 'Labour',
    name: 'Labour Artisan',
    user: 'Suresh Parmar',
    badge: 'WORKER',
    roleTag: 'Bench #4',
    description: 'Piecework queue, wire binding & untying tasks',
    icon: Hammer,
    theme: {
      bg: 'bg-amber-50 hover:bg-amber-100/70',
      border: 'border-amber-200',
      text: 'text-amber-900',
      badgeBg: 'bg-amber-600',
      badgeText: 'text-white',
      glow: 'shadow-amber-500/10',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
      iconBg: 'bg-amber-100 text-amber-800',
    },
  },
];

export const RoleSwitcherDropdown: React.FC = () => {
  const { currentRole, setCurrentRole } = useERP();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeRole = ROLES.find((r) => r.id === currentRole) || ROLES[0];
  const ActiveIcon = activeRole.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectRole = (roleId: 'Admin' | 'Manager' | 'Operator' | 'Labour') => {
    setCurrentRole(roleId);
    setIsOpen(false);
  };

  return (
    <div className="erp-role-switcher relative inline-block text-left" ref={dropdownRef}>
      {/* Role Pill Button */}
      <Button variant="surface"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer shadow-xs whitespace-nowrap ${activeRole.theme.bg} ${activeRole.theme.border} ${activeRole.theme.text}`}
        title={`Current Role: ${activeRole.name} (${activeRole.user}) — Click to switch`}
      >
        <div className={`p-1 rounded-md ${activeRole.theme.iconBg}`}>
          <ActiveIcon className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="hidden sm:inline font-bold">{activeRole.name}</span>
          <span className="sm:hidden font-bold">{activeRole.badge}</span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${activeRole.theme.badgeBg} ${activeRole.theme.badgeText}`}
          >
            {activeRole.badge}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Button>

      {/* Role Selector Popover */}
      {isOpen && (
        <div className="ds-popover absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          {/* Header */}
          <div className="px-3.5 pb-2.5 mb-1.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Switch Perspective
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">4 Role Views</span>
          </div>

          {/* Role Cards List */}
          <div className="px-2 space-y-1.5">
            {ROLES.map((role) => {
              const RoleIcon = role.icon;
              const isSelected = role.id === currentRole;

              return (
                <Button variant="surface"
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? `${role.theme.bg} ${role.theme.activeBorder} shadow-xs`
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${role.theme.iconBg}`}>
                    <RoleIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {role.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${role.theme.badgeBg} ${role.theme.badgeText}`}
                        >
                          {role.badge}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-medium text-slate-700 mb-0.5 flex items-center gap-1">
                      <span>{role.user}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 text-[10px]">{role.roleTag}</span>
                    </div>

                    <div className="text-[10px] text-slate-500 leading-tight">
                      {role.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 px-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Instant view switching</span>
            <span className="text-slate-500 font-mono">Plating ERP v2.4</span>
          </div>
        </div>
      )}
    </div>
  );
};

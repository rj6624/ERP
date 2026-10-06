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
  },
  {
    id: 'Manager',
    name: 'Operations Manager',
    user: 'Vikram Joshi',
    badge: 'OPS',
    roleTag: 'Management',
    description: 'Floor supervision, inventory, queues & reports',
    icon: Shield,
  },
  {
    id: 'Operator',
    name: 'Factory Operator',
    user: 'Ramesh Patel',
    badge: 'FLOOR',
    roleTag: 'Station 01',
    description: 'Barcode intake, weight calculation & dispatch',
    icon: HardHat,
  },
  {
    id: 'Labour',
    name: 'Labour Artisan',
    user: 'Suresh Parmar',
    badge: 'WORKER',
    roleTag: 'Bench #4',
    description: 'Piecework queue, wire binding & untying tasks',
    icon: Hammer,
  },
];

export interface RoleSwitcherSectionProps {
  onRoleSelected?: () => void;
}

export const RoleSwitcherSection: React.FC<RoleSwitcherSectionProps> = ({ onRoleSelected }) => {
  const { currentRole, setCurrentRole } = useERP();

  const handleSelectRole = (roleId: 'Admin' | 'Manager' | 'Operator' | 'Labour') => {
    setCurrentRole(roleId);
    onRoleSelected?.();
  };

  return (
    <div className="py-2">
      <div className="px-3 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-slate-500" /> Switch Role
        </span>
        <span className="text-[10px] text-slate-400 font-normal">4 Views</span>
      </div>

      <div className="space-y-1.5 px-2">
        {ROLES.map((role) => {
          const RoleIcon = role.icon;
          const isSelected = role.id === currentRole;

          return (
            <Button
              variant="surface"
              key={role.id}
              type="button"
              onClick={() => handleSelectRole(role.id)}
              className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 flex items-center gap-2.5 cursor-pointer ${
                isSelected
                  ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900/10 shadow-xs font-semibold'
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 transition-colors ${
                  isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <RoleIcon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {role.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {role.badge}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-900 bg-slate-200/80 px-1.5 py-0.5 rounded-full shrink-0 border border-slate-300">
                      <Check className="w-3 h-3 text-slate-900" /> Active
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {role.user} • {role.roleTag}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

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
      <Button
        variant="surface"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-all duration-150 cursor-pointer shadow-xs whitespace-nowrap"
        title={`Current Role: ${activeRole.name} (${activeRole.user}) — Click to switch`}
      >
        <div className="p-1 rounded-md bg-slate-100 text-slate-700">
          <ActiveIcon className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="hidden sm:inline font-bold text-slate-900">{activeRole.name}</span>
          <span className="sm:hidden font-bold text-slate-900">{activeRole.badge}</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-900 text-white">
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
              <Sparkles className="w-4 h-4 text-slate-600" />
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
                <Button
                  variant="surface"
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900/10 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <RoleIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {role.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            isSelected
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {role.badge}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-900 bg-slate-200/80 px-1.5 py-0.5 rounded border border-slate-300 shrink-0">
                          <Check className="w-3 h-3 text-slate-900" /> Active
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-medium text-slate-700 mb-0.5 flex items-center gap-1">
                      <span>{role.user}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 text-[10px]">{role.roleTag}</span>
                    </div>

                    <div className="text-xs text-slate-600 leading-snug">
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

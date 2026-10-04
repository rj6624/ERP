import { Button } from '../ui/Primitives';
import React from 'react';
import { useERP } from '../../context/ERPContext';
import { Modal } from './Modal';
import {
  ArrowDownLeft,
  ArrowUpRight,
  UserPlus,
  Layers,
  Box,
  Zap,
  Unlock,
  Flame,
} from 'lucide-react';

export const QuickActionModal: React.FC = () => {
  const { isQuickActionOpen, setIsQuickActionOpen, setCurrentPage } = useERP();

  if (!isQuickActionOpen) return null;

  // Strictly operational shortcuts for Manager workflow
  const quickActions = [
    {
      title: 'Create Inward Job',
      description: 'Receive new jewellery batch with photo & scale weight',
      icon: ArrowDownLeft,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      action: () => {
        setCurrentPage('create_inward');
        setIsQuickActionOpen(false);
      },
    },
    {
      title: 'Process Outward',
      description: 'Record outward weight & auto-calculate Plating per KG',
      icon: ArrowUpRight,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: () => {
        setCurrentPage('create_outward');
        setIsQuickActionOpen(false);
      },
    },
    {
      title: 'Fast Forward Queue',
      description: 'View and prioritize urgent pending orders',
      icon: Zap,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      action: () => {
        setCurrentPage('fast_forward');
        setIsQuickActionOpen(false);
      },
    },
    {
      title: 'Add New Customer',
      description: 'Register customer profile with auto ID prefix sequencing',
      icon: UserPlus,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      action: () => {
        setCurrentPage('customers');
        setIsQuickActionOpen(false);
      },
    },
    {
      title: 'Assign Labour Binding',
      description: 'Assign incoming batches to artisans and log tar used',
      icon: Layers,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      action: () => {
        setCurrentPage('labour_binding');
        setIsQuickActionOpen(false);
      },
    },
    {
      title: 'Assign Labour Open',
      description: 'Untie finished plated jewellery and reclaim tar',
      icon: Unlock,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      action: () => {
        setCurrentPage('labour_open');
        setIsQuickActionOpen(false);
      },
    },
    {
      title: 'Chemical & Acid Inventory',
      description: 'Monitor solution baths, log replenishment and usage',
      icon: Flame,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      action: () => {
        setCurrentPage('stock_chemical');
        setIsQuickActionOpen(false);
      },
    },
    {
      title: 'Tar Stock & Melting',
      description: 'Track hard red tar purchases, melting and reclamation',
      icon: Box,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      action: () => {
        setCurrentPage('stock_tar');
        setIsQuickActionOpen(false);
      },
    },
  ];

  return (
    <Modal
      isOpen={isQuickActionOpen}
      onClose={() => setIsQuickActionOpen(false)}
      title="Operational Quick Actions"
      subtitle="Fast operational shortcuts for Manager plant workflow"
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
        {quickActions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Button variant="surface"
              key={idx}
              onClick={item.action}
              className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-all group"
            >
              <div className={`p-2.5 rounded-lg border shrink-0 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {item.description}
                </p>
              </div>
            </Button>
          );
        })}
      </div>
    </Modal>
  );
};

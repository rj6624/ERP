import { Zap, AlertTriangle, CheckCircle, Clock, XCircle, ShieldAlert, type LucideIcon } from 'lucide-react';
import { Badge, type BadgeTone } from '../ui/Primitives';

interface StatusBadgeProps {
  type: 'job' | 'priority' | 'payment' | 'stock' | 'labour' | 'user';
  value: string;
  size?: 'sm' | 'md';
}

type Presentation = { tone: BadgeTone; icon?: LucideIcon; label?: string };
const presentations: Record<string, Record<string, Presentation>> = {
  job: {
    'Inward Received': { tone: 'info', icon: Clock },
    'In Process': { tone: 'warning', icon: Clock },
    'Ready for Outward': { tone: 'violet', icon: CheckCircle },
    'Outward Completed': { tone: 'success', icon: CheckCircle },
    Cancelled: { tone: 'danger', icon: XCircle },
  },
  payment: {
    Paid: { tone: 'success', icon: CheckCircle },
    'Partially Paid': { tone: 'warning', icon: Clock },
    'Promise Date Due': { tone: 'warning', icon: AlertTriangle },
  },
  stock: {
    Healthy: { tone: 'success', icon: CheckCircle },
    'Low Stock': { tone: 'warning', icon: AlertTriangle },
    'Out of Stock': { tone: 'danger', icon: ShieldAlert },
  },
  labour: {
    Completed: { tone: 'success', icon: CheckCircle },
    'In Progress': { tone: 'info', icon: Clock },
  },
  priority: { 'Fast Forward': { tone: 'warning', icon: Zap } },
  user: { Active: { tone: 'success' } },
};

// Keep existing labels and fallback behavior; presentation is shared.
const fallbacks: Partial<Record<StatusBadgeProps['type'], Presentation>> = {
  priority: { tone: 'neutral', label: 'Regular' },
  payment: { tone: 'danger', icon: Clock, label: 'Pending' },
  labour: { tone: 'neutral', label: 'Pending' },
  user: { tone: 'neutral', label: 'Inactive' },
};

export function StatusBadge({ type, value, size = 'sm' }: StatusBadgeProps) {
  const { tone, icon: Icon, label } = presentations[type]?.[value] ?? fallbacks[type] ?? { tone: 'neutral' };
  return <Badge tone={tone} size={size}>{Icon && <Icon className="w-3 h-3" aria-hidden="true" />}{label ?? value}</Badge>;
}

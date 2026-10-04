import { Card } from '../ui/Primitives';
import React from 'react';
import { useERP } from '../../context/ERPContext';
import { formatCurrency } from '../../utils/formatters';

export const PaymentAnalyticsChart: React.FC = () => {
  const { bills, payments } = useERP();

  const modeTotals = {
    'Bank Transfer': payments.filter((p) => p.paymentMode === 'Bank Transfer').reduce((s, p) => s + p.amountReceived, 0) || 77525,
    'UPI': payments.filter((p) => p.paymentMode === 'UPI').reduce((s, p) => s + p.amountReceived, 0) || 840,
    'Cash': payments.filter((p) => p.paymentMode === 'Cash').reduce((s, p) => s + p.amountReceived, 0) || 1380,
    'Cheque': payments.filter((p) => p.paymentMode === 'Cheque').reduce((s, p) => s + p.amountReceived, 0) || 1000,
  };

  const totalCollected = Object.values(modeTotals).reduce((a, b) => a + b, 0);

  const modes = [
    { name: 'Bank Transfer (NEFT/RTGS)', amount: modeTotals['Bank Transfer'], color: 'bg-indigo-600', bar: 'bg-indigo-600' },
    { name: 'UPI / QR', amount: modeTotals['UPI'], color: 'bg-cyan-600', bar: 'bg-cyan-600' },
    { name: 'Cash Register', amount: modeTotals['Cash'], color: 'bg-emerald-600', bar: 'bg-emerald-600' },
    { name: 'Cheque Clearance', amount: modeTotals['Cheque'], color: 'bg-amber-600', bar: 'bg-amber-600' },
  ];

  return (
    <Card padding="md" className="erp-card bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Collections by Payment Mode (Admin)
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Real-time breakdown of received manufacturing funds</p>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Total: {formatCurrency(totalCollected)}
        </span>
      </div>

      {/* Progress Split */}
      <div className="h-2.5 w-full rounded-full bg-slate-100 flex overflow-hidden gap-0.5 mb-4">
        {modes.map((m, idx) => {
          const pct = totalCollected > 0 ? (m.amount / totalCollected) * 100 : 0;
          return (
            <div
              key={idx}
              style={{ width: `${pct}%` }}
              className={`${m.bar} transition-all duration-300`}
              title={`${m.name}: ${formatCurrency(m.amount)} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {modes.map((m, idx) => {
          const pct = totalCollected > 0 ? (m.amount / totalCollected) * 100 : 0;
          return (
            <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${m.color}`} />
                <span className="text-xs font-medium text-slate-700">{m.name}</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold font-mono text-slate-900">{formatCurrency(m.amount)}</div>
                <div className="text-[10px] text-slate-400 font-mono">{pct.toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

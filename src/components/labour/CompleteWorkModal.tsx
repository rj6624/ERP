import React, { useState } from 'react';
import { X, CheckCircle, Scale, Clock, Layers, Sparkles, AlertCircle } from 'lucide-react';

interface CompleteWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tarUsed: number, remarks: string) => void;
  jobId: string;
  customerName: string;
  weight: number;
  workType: 'Binding' | 'Open';
  initialTarUsed?: number;
  initialRemarks?: string;
}

export const CompleteWorkModal: React.FC<CompleteWorkModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  jobId,
  customerName,
  weight,
  workType,
  initialTarUsed = 0,
  initialRemarks = '',
}) => {
  const [tarUsed, setTarUsed] = useState<string>(initialTarUsed > 0 ? String(initialTarUsed) : '');
  const [remarks, setRemarks] = useState<string>(initialRemarks);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tarValue = tarUsed.trim() === '' ? 0 : Number(tarUsed);
    if (isNaN(tarValue) || tarValue < 0) {
      setError('Please enter a valid positive number for Tar used.');
      return;
    }
    onConfirm(tarValue, remarks.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                workType === 'Binding' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {workType === 'Binding' ? <Layers className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Complete {workType} Work
              </h3>
              <p className="text-[11px] text-slate-500">Record completion and tar usage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Job Overview Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Customer</span>
              <span className="font-bold text-slate-900">{customerName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Customer ID</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                {jobId}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Weight</span>
              <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                {Number(weight).toFixed(3)} kg
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
              <span className="text-slate-500 font-medium">Completion Time</span>
              <span className="text-slate-700 font-medium flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-emerald-600" /> Auto-recorded now
              </span>
            </div>
          </div>

          {/* Tar Used Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="tarUsedInput" className="text-xs font-bold text-slate-800">
                Tar Used (where applicable)
              </label>
              <span className="text-[11px] text-slate-500 font-medium">Unit: grams</span>
            </div>
            <div className="relative">
              <input
                id="tarUsedInput"
                type="number"
                step="1"
                min="0"
                placeholder="e.g. 120"
                value={tarUsed}
                onChange={(e) => {
                  setTarUsed(e.target.value);
                  setError('');
                }}
                className="w-full h-11 px-3.5 text-sm font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 pr-16 bg-white"
              />
              <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400 select-none">
                grams
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Enter quantity of sealing tar consumed during this {workType.toLowerCase()} batch.
            </p>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label htmlFor="remarksInput" className="text-xs font-bold text-slate-800">
              Work Remarks / Notes (Optional)
            </label>
            <textarea
              id="remarksInput"
              rows={2}
              placeholder={`Notes on ${workType.toLowerCase()} quality, wire count, or untying batch...`}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none bg-white"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Complete Work
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

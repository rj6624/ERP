import React, { useState } from 'react';
import { Button, Input, Textarea } from '../ui/Primitives';
import { Modal } from '../common/Modal';
import { Scale, Clock, AlertCircle } from 'lucide-react';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Complete ${workType} Work`}
      subtitle={`Record completion and tar consumption for Job ID: ${jobId}`}
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="button" onClick={handleSubmit}>
            Confirm & Complete Work
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Overview Summary */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Customer</span>
            <span className="font-bold text-slate-900">{customerName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Job ID</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {jobId}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Batch Weight</span>
            <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              {Number(weight).toFixed(3)} kg
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200">
            <span className="text-slate-500 font-medium">Recorded At</span>
            <span className="text-slate-700 font-medium flex items-center gap-1 text-2xs">
              <Clock className="w-3 h-3 text-emerald-600" /> Auto-recorded timestamp
            </span>
          </div>
        </div>

        {/* Tar Used Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="tarUsedInput" className="block text-xs font-semibold text-slate-700">
              Tar Used (grams)
            </label>
            <span className="text-2xs text-slate-500">Unit: grams</span>
          </div>
          <div className="relative">
            <Input
              id="tarUsedInput"
              type="number"
              step="1"
              min="0"
              placeholder="e.g. 50"
              value={tarUsed}
              onChange={(e) => {
                setTarUsed(e.target.value);
                setError('');
              }}
              className="w-full pr-14 text-xs"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 select-none">
              grams
            </span>
          </div>
          <p className="text-2xs text-slate-500 mt-1">
            Quantity of sealing tar consumed or cleaned during this {workType.toLowerCase()} batch.
          </p>
        </div>

        {/* Remarks */}
        <div>
          <label htmlFor="remarksInput" className="block text-xs font-semibold text-slate-700 mb-1">
            Work Remarks / Notes (Optional)
          </label>
          <Textarea
            id="remarksInput"
            rows={2}
            placeholder={`Notes on ${workType.toLowerCase()} quality or binding details...`}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full text-xs"
          />
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </Modal>
  );
};

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { PlatingType, JobPriority } from '../../types/erp';
import { PhotoUpload } from '../../components/common/PhotoUpload';
import { ArrowDownLeft, ArrowLeft, Zap, Info } from 'lucide-react';
import { formatWeight } from '../../utils/formatters';

export const CreateInwardPage: React.FC = () => {
  const {
    customers,
    createInwardJob,
    getNextJobIdForCustomer,
    setCurrentPage,
    navigateToJob,
  } = useERP();

  const [customerId, setCustomerId] = useState<string>(customers[0]?.id || '');
  const [inwardWeight, setInwardWeight] = useState<string>('10.250');
  const [inwardDate, setInwardDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [platingType, setPlatingType] = useState<PlatingType>('White Gold');
  const [priority, setPriority] = useState<JobPriority>('Regular');
  const [itemPhotoUrl, setItemPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80'
  );
  const [scalePhotoUrl, setScalePhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&auto=format&fit=crop&q=80'
  );
  const [inwardRemarks, setInwardRemarks] = useState<string>('');
  const [error, setError] = useState<string>('');

  const nextJobIdPreview = customerId ? getNextJobIdForCustomer(customerId) : 'DARSHAN1';
  const selectedCustomerObj = customers.find((c) => c.id === customerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(inwardWeight);

    if (!customerId) {
      setError('Please select a valid customer.');
      return;
    }
    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Inward weight must be strictly greater than 0.000 kg.');
      return;
    }

    try {
      const newJob = createInwardJob({
        customerId,
        inwardWeight: weightNum,
        platingType,
        priority,
        inwardDate: new Date(inwardDate).toISOString(),
        itemPhotoUrl,
        scalePhotoUrl,
        inwardRemarks,
      });

      navigateToJob(newJob.id);
    } catch (err: any) {
      setError(err.message || 'Failed to create inward record.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('inward_list')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Inward List
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="erp-light-panel p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> Create Customer Inward
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated Job ID sequence generated on customer selection
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Generated Job ID</span>
            <span className="font-mono text-base font-extrabold text-emerald-400 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
              {nextJobIdPreview}
            </span>
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          {/* SECTION 1: CUSTOMER & ID */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" /> 1. Customer & System Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="erp-input text-xs"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.mobile})
                    </option>
                  ))}
                </select>
                {selectedCustomerObj && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Previous completed jobs: <strong>{selectedCustomerObj.completedJobs}</strong> • Total weight: <strong>{formatWeight(selectedCustomerObj.totalInwardWeight)}</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  System Job ID (Auto-Generated) <span className="text-slate-400">(Read-Only)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={nextJobIdPreview}
                  className="erp-input-readonly font-mono font-bold text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  System-managed sequential key. Operators cannot overwrite ID.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: WEIGHT & PLATING CONFIG */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
              2. Weight & Plating Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inward Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  required
                  value={inwardWeight}
                  onChange={(e) => setInwardWeight(e.target.value)}
                  placeholder="10.250"
                  className="erp-input font-mono font-bold text-sm text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Formatted: <strong>{formatWeight(parseFloat(inwardWeight) || 0)}</strong> (3 decimals required)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plating Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={platingType}
                  onChange={(e) => setPlatingType(e.target.value as PlatingType)}
                  className="erp-input text-xs"
                >
                  <option value="White Gold">White Gold</option>
                  <option value="Golden Brass">Golden Brass</option>
                  <option value="Golden Silver">Golden Silver</option>
                  <option value="Antic Gold">Antic Gold</option>
                  <option value="Teen Gold">Teen Gold</option>
                  <option value="Rose Gold">Rose Gold</option>
                  <option value="Damar Gold">Damar Gold</option>
                  <option value="Dal Chhol Gold">Dal Chhol Gold</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPriority('Regular')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold border ${
                      priority === 'Regular'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Regular
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('Fast Forward')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold border flex items-center justify-center gap-1 ${
                      priority === 'Fast Forward'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-white text-amber-700 border-amber-300'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" /> Fast Forward
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inward Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={inwardDate}
                  onChange={(e) => setInwardDate(e.target.value)}
                  className="erp-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inward Remarks / Batch Notes
                </label>
                <input
                  type="text"
                  value={inwardRemarks}
                  onChange={(e) => setInwardRemarks(e.target.value)}
                  placeholder="e.g. Silver chains for rhodium flash, check hooks"
                  className="erp-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: DOCUMENTATION & PHOTOS */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
              3. Verification Photographs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PhotoUpload
                label="Item Photo (Raw Unplated Jewellery)"
                helperText="Upload or snap unplated jewellery batch"
                value={itemPhotoUrl}
                onChange={setItemPhotoUrl}
                required
              />

              <PhotoUpload
                label="Scale Photo (Digital Weight Display)"
                helperText="Snap digital balance showing inward weight"
                value={scalePhotoUrl}
                onChange={setScalePhotoUrl}
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage('inward_list')}
              className="erp-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="erp-btn-brand">
              <ArrowDownLeft className="w-3.5 h-3.5" /> Submit Inward & Generate {nextJobIdPreview}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

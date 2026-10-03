import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { PlatingType, JobPriority, Customer } from '../../types/erp';
import { CameraPhotoUpload } from '../../components/common/CameraPhotoUpload';
import { formatWeight } from '../../utils/formatters';
import {
  ArrowLeft,
  User,
  CheckCircle2,
  AlertCircle,
  Zap,
  Search,
  Scale,
  Calendar,
  Layers,
  Sparkles,
  Camera,
  ArrowRight,
  RefreshCw,
  Plus,
  Eye,
  Check,
} from 'lucide-react';

export const OperatorCreateInwardPage: React.FC = () => {
  const navigate = useNavigate();
  const { customers, getNextJobIdForCustomer, createInwardJob } = useERP();

  // 1. Customer Selection / Lookup state
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');

  // 2. Form state (exact order)
  const [inwardWeight, setInwardWeight] = useState<string>('10.250');
  const [platingType, setPlatingType] = useState<PlatingType>('White Gold');
  const [priority, setPriority] = useState<JobPriority>('Regular');
  const [itemPhotoUrl, setItemPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
  );
  const [scalePhotoUrl, setScalePhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  );
  const [inwardDateTime] = useState<string>('26 Sep 2026, 10:42 AM');

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [successJob, setSuccessJob] = useState<{
    id: string;
    customerName: string;
    inwardWeight: number;
    platingType: PlatingType;
    priority: JobPriority;
  } | null>(null);

  // Filter customers by name or mobile
  const filteredCustomers = useMemo(() => {
    if (!customerSearchQuery.trim()) return customers;
    const q = customerSearchQuery.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.mobile.includes(q)
    );
  }, [customers, customerSearchQuery]);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId),
    [customers, selectedCustomerId]
  );

  // Automatically generated read-only Job ID (e.g. DARSHAN1, MAGANLAL1)
  const generatedJobId = useMemo(() => {
    if (!selectedCustomerId) return '—';
    return getNextJobIdForCustomer(selectedCustomerId);
  }, [selectedCustomerId, getNextJobIdForCustomer]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCustomerId) {
      newErrors.customer = 'Select a customer.';
    }

    const weightNum = parseFloat(inwardWeight);
    if (!inwardWeight || isNaN(weightNum)) {
      newErrors.weight = 'Enter inward weight.';
    } else if (weightNum <= 0) {
      newErrors.weight = 'Inward weight must be greater than 0.';
    }

    if (!platingType) {
      newErrors.platingType = 'Select Plating Type.';
    }

    if (!itemPhotoUrl) {
      newErrors.itemPhoto = 'Item Photo is required.';
    }

    if (!scalePhotoUrl) {
      newErrors.scalePhoto = 'Scale Photo is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewClick = () => {
    if (validateForm()) {
      setIsReviewModalOpen(true);
    }
  };

  const handleConfirmSubmit = () => {
    setIsReviewModalOpen(false);

    const weightNum = parseFloat(Number(inwardWeight).toFixed(3));
    const newJob = createInwardJob({
      customerId: selectedCustomerId,
      inwardWeight: weightNum,
      platingType,
      priority,
      inwardDate: new Date().toISOString(),
      itemPhotoUrl,
      scalePhotoUrl,
      inwardRemarks: `Inward intake recorded at Station 01. Scale calibrated.`,
    });

    setSuccessJob({
      id: newJob.id,
      customerName: newJob.customerName,
      inwardWeight: newJob.inwardWeight,
      platingType: newJob.platingType,
      priority: newJob.priority,
    });
  };

  const handleCreateAnother = () => {
    setSuccessJob(null);
    setSelectedCustomerId('');
    setInwardWeight('10.250');
    setPlatingType('White Gold');
    setPriority('Regular');
    setErrors({});
  };

  // SUCCESS CONFIRMATION SCREEN (Section 20)
  if (successJob) {
    return (
      <div className="max-w-xl mx-auto my-8 p-6 sm:p-8 bg-white rounded-2xl border-2 border-emerald-400 shadow-xl text-center space-y-6 font-sans animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ✓ Inward Created
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-mono mt-3">
            {successJob.id}
          </h2>
          <p className="text-sm font-bold text-slate-700 mt-1">
            Customer: {successJob.customerName}
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Inward Weight</span>
            <span className="text-base font-black text-slate-900 font-mono">
              {formatWeight(successJob.inwardWeight)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Plating Type</span>
            <span className="text-sm font-bold text-slate-900">{successJob.platingType}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Priority</span>
            <span
              className={`text-xs font-black inline-flex items-center gap-1 ${
                successJob.priority === 'Fast Forward'
                  ? 'text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300'
                  : 'text-slate-800'
              }`}
            >
              {successJob.priority === 'Fast Forward' && <Zap className="w-3 h-3 fill-amber-700" />}
              {successJob.priority}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Status</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
              Inward Received
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => navigate(`/jobs/${successJob.id}`)}
            className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View Job</span>
          </button>
          <button
            onClick={handleCreateAnother}
            className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Another Inward</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-xs text-slate-500 font-medium">Factory Floor Inward Intake</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">New Customer Inward</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow physical intake steps: Customer → ID → Weight → Plating → Photos → Submit
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">
              Station 01
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. CUSTOMER LOOKUP (Section 10) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>1. Customer <span className="text-red-500">*</span></span>
              {selectedCustomer && (
                <span className="text-[11px] font-normal text-slate-500">
                  Mobile: {selectedCustomer.mobile}
                </span>
              )}
            </label>

            {/* Quick search input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search customer by name or mobile (e.g. Darshan, Maganlal)..."
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Customer Dropdown / Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <button
                    key={cust.id}
                    type="button"
                    onClick={() => {
                      setSelectedCustomerId(cust.id);
                      setErrors((prev) => ({ ...prev, customer: '' }));
                    }}
                    className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                      selectedCustomerId === cust.id
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm font-bold'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">{cust.name}</p>
                    <p
                      className={`text-[10px] truncate ${
                        selectedCustomerId === cust.id ? 'text-emerald-100' : 'text-slate-500'
                      }`}
                    >
                      {cust.mobile}
                    </p>
                  </button>
                ))
              ) : (
                <div className="col-span-full py-4 text-center text-xs text-slate-500 font-medium">
                  No customer found. Please contact your Manager.
                </div>
              )}
            </div>
            {errors.customer && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.customer}
              </p>
            )}
          </div>

          {/* 2. AUTOMATIC READ-ONLY JOB ID (Section 11) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                2. Automatic Generated Job ID
              </label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-black text-slate-900 font-mono tracking-wide">
                  {generatedJobId}
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                  System Generated (Read-Only)
                </span>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-500 hidden sm:block">
              Sequential ID assigned to customer
            </div>
          </div>

          {/* 3. INWARD WEIGHT (Section 12, 13) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              3. Inward Weight <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500">
              Enter physical scale reading. Strict 3 decimal places precision.
            </p>

            {/* Giant Touch-Friendly Weight Box */}
            <div className="relative flex items-center">
              <input
                type="number"
                step="0.001"
                min="0.001"
                placeholder="10.250"
                value={inwardWeight}
                onChange={(e) => {
                  setInwardWeight(e.target.value);
                  setErrors((prev) => ({ ...prev, weight: '' }));
                }}
                className={`w-full h-14 pl-4 pr-16 text-xl sm:text-2xl font-black font-mono tracking-wide rounded-xl border-2 transition-all ${
                  errors.weight
                    ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500'
                }`}
              />
              <span className="absolute right-4 font-bold text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                kg
              </span>
            </div>
            {errors.weight && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.weight}
              </p>
            )}
          </div>

          {/* 4. INWARD DATE & TIME (Section 14) */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>4. Inward Date & Time:</span>
            </div>
            <span className="font-bold text-slate-900 font-mono">
              {inwardDateTime} (Current)
            </span>
          </div>

          {/* 5. PLATING TYPE (Section 15) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              5. Plating Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'White Gold',
                'Golden Brass',
                'Golden Silver',
                'Antic Gold',
                'Teen Gold',
                'Rose Gold',
                'Damar Gold',
                'Dal Chhol Gold',
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPlatingType(type as PlatingType)}
                  className={`h-11 px-3 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center cursor-pointer ${
                    platingType === type
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 6. PRIORITY (Section 16) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              6. Priority <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPriority('Regular')}
                className={`h-12 px-4 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  priority === 'Regular'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <span>Regular Priority</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('Fast Forward')}
                className={`h-12 px-4 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  priority === 'Fast Forward'
                    ? 'border-amber-500 bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                    : 'border-amber-300 bg-amber-50/60 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>⚡ FAST FORWARD</span>
              </button>
            </div>
            {priority === 'Fast Forward' && (
              <p className="text-[11px] text-amber-800 font-bold bg-amber-50 border border-amber-200 p-2 rounded-lg flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-amber-700" />
                This job will be flagged as high priority in the Fast Forward Queue.
              </p>
            )}
          </div>

          {/* 7. MANDATORY ITEM PHOTO & SCALE PHOTO (Section 17, 18) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
            {/* Item Photo */}
            <div>
              <CameraPhotoUpload
                label="7. Item Photo"
                sublabel="Capture jewellery batch items"
                value={itemPhotoUrl}
                onChange={(url) => {
                  setItemPhotoUrl(url);
                  setErrors((prev) => ({ ...prev, itemPhoto: '' }));
                }}
                required
                captureHint="Take jewellery batch photo"
              />
              {errors.itemPhoto && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  {errors.itemPhoto}
                </p>
              )}
            </div>

            {/* Scale Photo */}
            <div>
              <CameraPhotoUpload
                label="8. Scale Photo"
                sublabel="Visual evidence of scale display reading"
                value={scalePhotoUrl}
                onChange={(url) => {
                  setScalePhotoUrl(url);
                  setErrors((prev) => ({ ...prev, scalePhoto: '' }));
                }}
                required
                captureHint="Capture physical scale reading"
              />
              {errors.scalePhoto && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  {errors.scalePhoto}
                </p>
              )}
            </div>
          </div>

          {/* 8. SUBMISSION CTA */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleReviewClick}
              className="w-full h-13 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Review & Create Inward</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* REFERENCE MODAL MATCHING IMAGE 4 */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-150 font-sans">
            {/* Modal Header matching Image 4 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Do you really confirm the customer jewellery inward intake?
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
                >
                  Yes, confirm
                </button>
              </div>
            </div>

            {/* 2 Side-by-Side Cards (Customer data & Package data) matching Image 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer data Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 pb-1 border-b border-slate-200/60">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Customer data</span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-[11px]">
                  <span className="col-span-5 text-slate-400 font-medium">Customer name</span>
                  <span className="col-span-7 font-bold text-slate-900">{selectedCustomer?.name}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-[11px]">
                  <span className="col-span-5 text-slate-400 font-medium">Contact number</span>
                  <span className="col-span-7 font-mono font-medium text-slate-700">{selectedCustomer?.mobile}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-[11px]">
                  <span className="col-span-5 text-slate-400 font-medium">Generated Job ID</span>
                  <span className="col-span-7 font-mono font-black text-blue-700">{generatedJobId}</span>
                </div>
              </div>

              {/* Job & Scale data Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 pb-1 border-b border-slate-200/60">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Weighing & Formulation</span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-[11px]">
                  <span className="col-span-5 text-slate-400 font-medium">Inward weight</span>
                  <span className="col-span-7 font-mono font-black text-emerald-700 text-xs">
                    {formatWeight(parseFloat(inwardWeight) || 0)}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-[11px]">
                  <span className="col-span-5 text-slate-400 font-medium">Plating formulation</span>
                  <span className="col-span-7 font-bold text-slate-900">{platingType}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-[11px]">
                  <span className="col-span-5 text-slate-400 font-medium">Priority</span>
                  <span className="col-span-7 font-bold text-slate-900 flex items-center gap-1">
                    {priority === 'Fast Forward' && <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    {priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Intake Items Table matching Image 4 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  1 jewellery batch verified for total of <strong className="font-mono text-emerald-700">{formatWeight(parseFloat(inwardWeight) || 0)}</strong>
                </span>
                <span className="text-[11px] text-slate-400">Scale Precision ±0.001 kg</span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Verification</th>
                      <th className="py-2.5 px-4">Job Reference</th>
                      <th className="py-2.5 px-4">Customer Entity</th>
                      <th className="py-2.5 px-4 text-right">Certified Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr className="bg-white">
                      <td className="py-3 px-4">
                        <span className="w-4 h-4 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{generatedJobId}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{selectedCustomer?.name}</td>
                      <td className="py-3 px-4 text-right font-mono font-black text-slate-900">
                        {formatWeight(parseFloat(inwardWeight) || 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

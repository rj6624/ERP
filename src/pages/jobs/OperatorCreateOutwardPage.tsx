import { DialogSurface } from '../../components/ui/DialogSurface';
import { Button, Card, Input } from '../../components/ui/Primitives';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { CameraPhotoUpload } from '../../components/common/CameraPhotoUpload';
import { formatWeight, formatPlating } from '../../utils/formatters';
import { calculatePlatingPerKg } from '../../utils/calculations';
import {
  ArrowLeft,
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
  AlertTriangle,
} from 'lucide-react';

export const OperatorCreateOutwardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedJobId = searchParams.get('jobId');

  const { jobs, processOutward } = useERP();

  // State
  const [selectedJobId, setSelectedJobId] = useState<string>(preselectedJobId || 'DARSHAN1');
  const [outwardWeight, setOutwardWeight] = useState<string>('10.800');
  const [outwardPhotoUrl, setOutwardPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
  );
  const [outwardDateTime] = useState<string>('26 Sep 2026, 03:30 PM');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    jobId: string;
    customerName: string;
    inwardWeight: number;
    outwardWeight: number;
    platingPerKg: number;
  } | null>(null);

  // Sync if query param changes
  useEffect(() => {
    if (preselectedJobId) {
      setSelectedJobId(preselectedJobId);
    }
  }, [preselectedJobId]);

  // Selected Job record
  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId);
  }, [jobs, selectedJobId]);

  // Auto-calculated Plating per KG: ((Outward - Inward) / Inward) * 1000
  const calculatedPlatingPerKg = useMemo(() => {
    if (!selectedJob) return 0;
    const outWeightNum = parseFloat(outwardWeight);
    if (isNaN(outWeightNum) || outWeightNum <= 0) return 0;
    return calculatePlatingPerKg(selectedJob.inwardWeight, outWeightNum);
  }, [selectedJob, outwardWeight]);

  // Handle Validation
  const validateOutward = (): boolean => {
    setErrorMsg('');

    if (!selectedJob) {
      setErrorMsg('Please select a valid job.');
      return false;
    }

    // Duplicate check (Section 29)
    if (selectedJob.status === 'Outward Completed') {
      setErrorMsg('This job has already been processed for Outward.');
      return false;
    }

    const outWeightNum = parseFloat(outwardWeight);
    if (!outwardWeight || isNaN(outWeightNum) || outWeightNum <= 0) {
      setErrorMsg('Enter outward weight greater than 0.');
      return false;
    }

    // Outward weight cannot be lower than inward weight (Section 26)
    if (outWeightNum < selectedJob.inwardWeight) {
      setErrorMsg('Outward weight cannot be lower than inward weight.');
      return false;
    }

    if (!outwardPhotoUrl) {
      setErrorMsg('Outward photo is required before completing dispatch.');
      return false;
    }

    return true;
  };

  const handleReviewClick = () => {
    if (validateOutward()) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false);
    if (!selectedJob) return;

    const outWeightNum = parseFloat(Number(outwardWeight).toFixed(3));
    const result = processOutward({
      jobId: selectedJob.id,
      outwardWeight: outWeightNum,
      outwardDate: new Date().toISOString(),
      outwardPhotoUrl,
      outwardRemarks: 'Outward verified at factory dispatch station. Plating calculation confirmed.',
    });

    if (result.success) {
      setSuccessResult({
        jobId: selectedJob.id,
        customerName: selectedJob.customerName,
        inwardWeight: selectedJob.inwardWeight,
        outwardWeight: outWeightNum,
        platingPerKg: result.platingPerKg,
      });
    } else {
      setErrorMsg(result.error || 'Failed to complete Outward.');
    }
  };

  const handleProcessNext = () => {
    setSuccessResult(null);
    setSelectedJobId('');
    setOutwardWeight('10.800');
    setErrorMsg('');
  };

  // SUCCESS CONFIRMATION SCREEN (Section 28)
  if (successResult) {
    return (
      <Card padding="md" className="max-w-xl mx-auto my-8 p-6 sm:p-8 bg-white rounded-2xl border-2 border-emerald-400 shadow-xl text-center space-y-6 font-sans animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ✓ Outward Completed Successfully
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-mono mt-3">
            {successResult.jobId}
          </h2>
          <p className="text-sm font-bold text-slate-700 mt-1">
            Customer: {successResult.customerName}
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-left">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Inward</span>
            <span className="text-sm font-black text-slate-800 font-mono">
              {formatWeight(successResult.inwardWeight)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Outward</span>
            <span className="text-sm font-black text-emerald-700 font-mono">
              {formatWeight(successResult.outwardWeight)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Plating per KG</span>
            <span className="text-sm font-black text-emerald-800 font-mono">
              {formatPlating(successResult.platingPerKg)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button variant="primary"
            onClick={() => navigate(`/jobs/${successResult.jobId}`)}
            className="h-12 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View Job</span>
          </Button>
          <Button variant="primary"
            onClick={handleProcessNext}
            className="h-12 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Process Next Outward</span>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="secondary"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Outward Queue</span>
        </Button>
        <span className="text-xs text-slate-500 font-medium">Factory Floor Dispatch Console</span>
      </div>

      <Card padding="none" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Process Customer Outward</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select Job → Auto Fetch Inward Weight → Enter Outward Weight → Calculate Plating → Attach Photo
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">
            Station 01
          </span>
        </div>

        <div className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. SELECT JOB ID */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              1. Customer Job ID <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
              {jobs.map((job) => {
                const isSelected = selectedJobId === job.id;
                const isCompleted = job.status === 'Outward Completed';

                return (
                  <Button variant="surface"
                    key={job.id}
                    type="button"
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setErrorMsg('');
                    }}
                    className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-700 shadow-sm font-bold'
                        : isCompleted
                        ? 'bg-slate-100/70 text-slate-400 border-slate-200'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold">{job.id}</span>
                      {job.priority === 'Fast Forward' && (
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-black ${
                            isSelected ? 'bg-amber-300 text-slate-950' : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          ⚡ FF
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] truncate mt-0.5 ${
                        isSelected ? 'text-blue-100' : 'text-slate-600'
                      }`}
                    >
                      {job.customerName}
                    </p>
                    <p
                      className={`text-[10px] font-mono ${
                        isSelected ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {formatWeight(job.inwardWeight)}
                    </p>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* 2. AUTOMATICALLY FETCHED INWARD DATA (Section 23, 24) */}
          {selectedJob && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  2. Automatically Retrieved Inward Record
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                  System Retrieved (Read-Only)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Customer</span>
                  <span className="font-bold text-slate-900">{selectedJob.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Inward Weight</span>
                  <span className="font-black text-slate-900 font-mono text-sm">
                    {formatWeight(selectedJob.inwardWeight)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Plating Type</span>
                  <span className="font-bold text-slate-900">{selectedJob.platingType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Current Status</span>
                  <span
                    className={`font-bold inline-block px-1.5 py-0.2 rounded text-[10px] ${
                      selectedJob.status === 'Outward Completed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedJob.status}
                  </span>
                </div>
              </div>

              {selectedJob.status === 'Outward Completed' && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>This job has already been processed for Outward on {selectedJob.outwardDate}.</span>
                </div>
              )}
            </div>
          )}

          {/* 3. OUTWARD WEIGHT ENTRY (Section 23, 26) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              3. Outward Weight <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500">
              Enter final scale reading. Strict 3 decimal places (kg).
            </p>

            <div className="relative flex items-center">
              <Input
                type="number"
                step="0.001"
                min="0.001"
                placeholder="10.800"
                value={outwardWeight}
                onChange={(e) => {
                  setOutwardWeight(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full h-14 pl-4 pr-16 text-xl sm:text-2xl font-mono tracking-wide"
              />
              <span className="absolute right-4 font-bold text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                kg
              </span>
            </div>
          </div>

          {/* 4. SYSTEM CALCULATED PLATING PER KG (Section 20, 25) */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border-2 border-emerald-400 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                4. Plating per KG (System Calculated)
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-950 font-mono tracking-wide">
                  {formatPlating(calculatedPlatingPerKg)}
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                  ((Outward - Inward) / Inward) * 1000
                </span>
              </div>
            </div>
            <div className="text-right text-[11px] text-emerald-800 font-semibold hidden sm:block">
              Read-Only Mathematical Output
            </div>
          </div>

          {/* 5. OUTWARD DATE & TIME */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>5. Outward Date & Time:</span>
            </div>
            <span className="font-bold text-slate-900 font-mono">
              {outwardDateTime}
            </span>
          </div>

          {/* 6. MANDATORY OUTWARD PHOTO (Section 27) */}
          <div>
            <CameraPhotoUpload
              label="6. Outward Photo"
              sublabel="Capture final dispatched jewellery on dispatch tray"
              value={outwardPhotoUrl}
              onChange={(url) => {
                setOutwardPhotoUrl(url);
                setErrorMsg('');
              }}
              required
              captureHint="Take outward dispatch photo"
            />
          </div>

          {/* 7. COMPLETE OUTWARD CTA */}
          <div className="pt-4 border-t border-slate-200">
            <Button variant="surface"
              type="button"
              onClick={handleReviewClick}
              disabled={selectedJob?.status === 'Outward Completed'}
              className={`w-full h-13 rounded-xl font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedJob?.status === 'Outward Completed'
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
              }`}
            >
              <span>Verify & Complete Outward</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* CONFIRMATION MODAL (Section 56) */}
      {isConfirmModalOpen && selectedJob && (
        <div className="ds-overlay fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <DialogSurface onClose={() => setIsConfirmModalOpen(false)} aria-label="Confirm outward dispatch"  className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Complete Outward Dispatch
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                Complete Outward?
              </h3>
              <p className="text-xs text-slate-500">
                Please verify the Outward Weight and photo before completing this job.
              </p>
            </div>

            <div className="space-y-2.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Job ID:</span>
                <span className="font-black text-slate-900 font-mono">{selectedJob.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{selectedJob.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Inward Weight:</span>
                <span className="font-mono font-bold text-slate-800">
                  {formatWeight(selectedJob.inwardWeight)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Outward Weight:</span>
                <span className="font-mono font-black text-blue-900 text-sm">
                  {formatWeight(parseFloat(outwardWeight) || 0)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Plating per KG:</span>
                <span className="font-mono font-black text-emerald-800 text-sm">
                  {formatPlating(calculatedPlatingPerKg)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Outward Photo:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Dispatched Tray Photo Verified
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button variant="secondary"
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="transition-colors cursor-pointer"
              >
                Cancel
              </Button>
              <Button variant="primary"
                type="button"
                onClick={handleConfirmSubmit}
                className="font-extrabold transition-all cursor-pointer"
              >
                Complete Outward
              </Button>
            </div>
          </DialogSurface>
        </div>
      )}
    </div>
  );
};

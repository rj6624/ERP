import { Button, Card, Input, Select } from '../../components/ui/Primitives';
import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { PhotoUpload } from '../../components/common/PhotoUpload';
import { SuccessModal } from '../../components/common/SuccessModal';
import { calculatePlatingPerKg } from '../../utils/calculations';
import { formatWeight, formatPlating } from '../../utils/formatters';
import { ArrowUpRight, ArrowLeft, Calculator, AlertTriangle, CheckCircle2, FileText, Eye } from 'lucide-react';
import { JewelleryJob } from '../../types/erp';

export const CreateOutwardPage: React.FC = () => {
  const { jobs, processOutward, setCurrentPage, navigateToJob } = useERP();

  // Find all pending/ready inward jobs (not completed yet)
  const availableJobs = jobs.filter((j) => j.status !== 'Outward Completed');

  const [selectedJobId, setSelectedJobId] = useState<string>(
    availableJobs[0]?.id || ''
  );
  const [outwardWeight, setOutwardWeight] = useState<string>('10.800');
  const [outwardDate, setOutwardDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [outwardPhotoUrl, setOutwardPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80'
  );
  const [outwardRemarks, setOutwardRemarks] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successOutward, setSuccessOutward] = useState<{
    job: JewelleryJob;
    platingPerKg: number;
    outwardWeight: number;
  } | null>(null);

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const inwardWeight = selectedJob?.inwardWeight || 10.250;

  // Real-time calculation of Plating per KG
  const parsedOutwardWeight = parseFloat(outwardWeight) || 0;
  const calculatedPlating = calculatePlatingPerKg(inwardWeight, parsedOutwardWeight);
  const weightDifference = Number((parsedOutwardWeight - inwardWeight).toFixed(3));

  useEffect(() => {
    if (availableJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(availableJobs[0].id);
    }
  }, [availableJobs, selectedJobId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId || !selectedJob) {
      setError('Please select an active Job ID.');
      return;
    }
    if (parsedOutwardWeight <= inwardWeight) {
      setError(
        `Outward weight (${parsedOutwardWeight.toFixed(
          3
        )} kg) must be strictly greater than inward weight (${inwardWeight.toFixed(3)} kg).`
      );
      return;
    }

    const result = processOutward({
      jobId: selectedJobId,
      outwardWeight: parsedOutwardWeight,
      outwardDate: new Date(outwardDate).toISOString(),
      outwardPhotoUrl,
      outwardRemarks,
    });

    if (result.success) {
      setSuccessOutward({
        job: selectedJob,
        platingPerKg: result.platingPerKg,
        outwardWeight: parsedOutwardWeight,
      });
    } else {
      setError(result.error || 'Failed to process outward.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost"
          onClick={() => setCurrentPage('outward_list')}
          className="inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Outward List
        </Button>
      </div>

      <Card padding="none" className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Banner */}
        <div className="erp-light-panel p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-400" /> Process Customer Outward
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Select Job ID to fetch Inward Weight; enter verified Outward Weight to calculate Plating per KG
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Calculated Plating</span>
            <span className="font-mono text-base font-extrabold text-purple-400 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
              {formatPlating(calculatedPlating)}
            </span>
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          {/* SECTION 1: JOB SELECTION */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
              1. Job & Inward Linkage
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Job ID / Customer <span className="text-red-500">*</span>
                </label>
                <Select
                  required
                  value={selectedJobId}
                  onChange={(e) => {
                    setSelectedJobId(e.target.value);
                    setError('');
                  }}
                  className="w-full"
                >
                  {availableJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.id} — {j.customerName} ({formatWeight(j.inwardWeight)} • {j.platingType} • {j.priority})
                    </option>
                  ))}
                </Select>
                {selectedJob && (
                  <div className="p-2.5 mt-2 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <strong className="text-slate-900">{selectedJob.customerName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Plating Type:</span>
                      <strong className="text-slate-900">{selectedJob.platingType}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Priority:</span>
                      <span className="font-semibold text-amber-700">{selectedJob.priority}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inward Weight (kg) <span className="text-slate-400">(Auto-Fetched • Read-Only)</span>
                </label>
                <Input
                  type="text"
                  readOnly
                  disabled
                  value={formatWeight(inwardWeight)}
                  className="font-mono w-full"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Fetched from original inward intake receipt. Cannot be modified in Outward.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: OUTWARD WEIGHT & AUTOMATIC CALCULATION */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-slate-500" /> 2. Outward Weight & Plating Calculation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Outward Weight (kg) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.001"
                  min="0.001"
                  required
                  value={outwardWeight}
                  onChange={(e) => {
                    setOutwardWeight(e.target.value);
                    setError('');
                  }}
                  placeholder="10.800"
                  className="font-mono w-full"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Input: <strong>{formatWeight(parsedOutwardWeight)}</strong> (Strict 3 decimal places)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plating per KG (g/kg) <span className="text-slate-400">(Auto-Calculated • Read-Only)</span>
                </label>
                <Input
                  type="text"
                  readOnly
                  disabled
                  value={formatPlating(calculatedPlating)}
                  className="font-mono text-purple-700 w-full"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Formula: <code>((Outward - Inward) / Inward) × 1000</code>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Outward Date & Time
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={outwardDate}
                  onChange={(e) => setOutwardDate(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Outward Remarks / Quality Check
                </label>
                <Input
                  type="text"
                  value={outwardRemarks}
                  onChange={(e) => setOutwardRemarks(e.target.value)}
                  placeholder="e.g. High luster inspection passed, packed in anti-tarnish pouch"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: OUTWARD PHOTO */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
              3. Finished Product Photographic Record
            </h3>

            <div className="max-w-md">
              <PhotoUpload
                label="Outward Scale / Finished Jewellery Photo"
                helperText="Upload or take snapshot of finished plated jewellery on digital scale"
                value={outwardPhotoUrl}
                onChange={setOutwardPhotoUrl}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <Button variant="secondary"
              type="button"
              onClick={() => setCurrentPage('outward_list')}
              className=""
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="">
              <ArrowUpRight className="w-3.5 h-3.5" /> Complete Outward Dispatch
            </Button>
          </div>
        </form>
      </Card>

      {/* Success Modal Pop-up */}
      {successOutward && (
        <SuccessModal
          isOpen={!!successOutward}
          onClose={() => {
            const jId = successOutward.job.id;
            setSuccessOutward(null);
            navigateToJob(jId);
          }}
          title="Customer Outward Dispatched Successfully!"
          greeting={`✨ Plating density certified at ${formatPlating(successOutward.platingPerKg)}.`}
          message="Final scale weight and plating concentration per KG have been recorded and marked completed."
          details={[
            {
              label: 'Job ID',
              value: successOutward.job.id,
              isMono: true,
              isHighlight: true,
            },
            {
              label: 'Customer',
              value: successOutward.job.customerName,
              isHighlight: true,
            },
            {
              label: 'Dispatched Outward Weight',
              value: formatWeight(successOutward.outwardWeight),
              isMono: true,
              isHighlight: true,
            },
            {
              label: 'Net Weight Increase',
              value: `+${(successOutward.outwardWeight - successOutward.job.inwardWeight).toFixed(3)} kg`,
              isMono: true,
            },
            {
              label: 'Plating Concentration',
              value: formatPlating(successOutward.platingPerKg),
              isMono: true,
              badge: {
                text: 'Certified Standard',
                variant: 'purple',
              },
            },
          ]}
          primaryAction={{
            label: 'Generate Customer Bill',
            icon: <FileText className="w-3.5 h-3.5" />,
            onClick: () => {
              setSuccessOutward(null);
              setCurrentPage('bills_list');
            },
          }}
          secondaryAction={{
            label: 'View Job Details',
            icon: <Eye className="w-3.5 h-3.5" />,
            onClick: () => {
              const jId = successOutward.job.id;
              setSuccessOutward(null);
              navigateToJob(jId);
            },
          }}
          dismissText="Done"
        />
      )}
    </div>
  );
};

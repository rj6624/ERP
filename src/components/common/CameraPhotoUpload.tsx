import { DialogSurface } from '../ui/DialogSurface';
import { Button, Input } from '../ui/Primitives';
import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, X, Check, Image as ImageIcon, Eye } from 'lucide-react';

interface CameraPhotoUploadProps {
  label: string;
  sublabel?: string;
  value?: string;
  onChange: (url: string) => void;
  required?: boolean;
  captureHint?: string;
}

export const CameraPhotoUpload: React.FC<CameraPhotoUploadProps> = ({
  label,
  sublabel,
  value,
  onChange,
  required = false,
  captureHint = 'Take photo with camera or upload image',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSimulatedCameraOpen, setIsSimulatedCameraOpen] = useState(false);

  // Sample realistic jewellery & scale calibration photos for factory demonstration
  const sampleJewelleryPhotos = [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
  ];

  const sampleScalePhotos = [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulatedCapture = (isScale: boolean = false) => {
    const pool = isScale || label.toLowerCase().includes('scale') ? sampleScalePhotos : sampleJewelleryPhotos;
    const randomImg = pool[Math.floor(Math.random() * pool.length)];
    onChange(randomImg);
    setIsSimulatedCameraOpen(false);
  };

  return (
    <div className="space-y-1.5 font-sans">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
          {label} {required && <span className="text-red-500 font-black">*</span>}
        </label>
        {value && (
          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
            <Check className="w-2.5 h-2.5" /> Attached
          </span>
        )}
      </div>
      {sublabel && <p className="text-[11px] text-slate-500 leading-tight">{sublabel}</p>}

      {/* Hidden native file/camera input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        /* Attached Photo Preview State */
        <div className="relative border-2 border-emerald-400 bg-slate-900 rounded-xl overflow-hidden shadow-sm group">
          <img
            src={value}
            alt={label}
            className="w-full h-44 object-cover transition-transform group-hover:scale-102 duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3 justify-between">
            <div className="text-white">
              <span className="text-xs font-bold block truncate drop-shadow-sm">{label}</span>
              <span className="text-[10px] text-emerald-300 font-medium">Ready for transaction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="secondary" size="icon"
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="backdrop-blur-md transition-colors"
                title="Zoom & Inspect"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="icon"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="backdrop-blur-md transition-colors"
                title="Replace Photo"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="danger" size="icon"
                type="button"
                onClick={() => onChange('')}
                className="backdrop-blur-md transition-colors"
                title="Remove Photo"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Touch-First Capture Card */
        <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 bg-slate-50/70 hover:bg-slate-50 transition-colors text-center">
          <div className="flex flex-col items-center justify-center space-y-2.5">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{captureHint}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">High-resolution physical evidence</p>
            </div>

            {/* Action Buttons: Big, touch-friendly min-44px */}
            <div className="grid grid-cols-2 gap-2 w-full pt-1">
              <Button variant="primary"
                type="button"
                onClick={() => handleSimulatedCapture(label.toLowerCase().includes('scale'))}
                className="flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </Button>
              <Button variant="secondary"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Upload</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Modal Preview */}
      {isPreviewModalOpen && value && (
        <div className="ds-overlay fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <DialogSurface onClose={() => setIsPreviewModalOpen(false)} aria-label="Photo preview" className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 text-white">
              <span className="text-xs font-bold">{label} Preview</span>
              <Button variant="ghost" size="icon"
                onClick={() => setIsPreviewModalOpen(false)}
                className="" aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center">
              <img src={value} alt={label} className="max-h-[70vh] object-contain rounded-lg" />
            </div>
          </DialogSurface>
        </div>
      )}
    </div>
  );
};

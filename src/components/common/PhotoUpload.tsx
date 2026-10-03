import React, { useState, useRef } from 'react';
import { Upload, Camera, Trash2, Eye, RefreshCw } from 'lucide-react';
import { Modal } from './Modal';

interface PhotoUploadProps {
  label: string;
  helperText?: string;
  value?: string;
  onChange: (url: string) => void;
  required?: boolean;
  readOnly?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  label,
  helperText,
  value,
  onChange,
  required = false,
  readOnly = false,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fallback demo photos for silver jewellery & digital scale
  const sampleJewelleryPhotos = [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80',
  ];

  const sampleScalePhotos = [
    'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
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

  const handleSimulateCamera = () => {
    if (readOnly) return;
    const isScale = label.toLowerCase().includes('scale');
    const pool = isScale ? sampleScalePhotos : sampleJewelleryPhotos;
    const randomPick = pool[Math.floor(Math.random() * pool.length)];
    onChange(randomPick);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {value && !readOnly && (
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            ✓ Attached
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={readOnly}
      />

      {value ? (
        <div className="relative group rounded-md border border-slate-200 bg-slate-50 overflow-hidden">
          <div className="h-32 w-full flex items-center justify-center bg-slate-900/5">
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="p-1.5 bg-white/90 text-slate-800 rounded-md hover:bg-white text-xs font-medium flex items-center gap-1 shadow"
              title="Preview Image"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            {!readOnly && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 bg-white/90 text-slate-800 rounded-md hover:bg-white text-xs font-medium flex items-center gap-1 shadow"
                  title="Replace"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Replace
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs font-medium flex items-center gap-1 shadow"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files?.[0]) {
              const file = e.dataTransfer.files[0];
              const reader = new FileReader();
              reader.onloadend = () => onChange(reader.result as string);
              reader.readAsDataURL(file);
            }
          }}
          className={`border-2 border-dashed rounded-md p-3 text-center transition-colors ${
            isDragOver ? 'border-brand-500 bg-brand-50/20' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={readOnly}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white text-slate-700 border border-slate-300 rounded shadow-sm hover:bg-slate-50"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" /> Upload File
              </button>
              <button
                type="button"
                onClick={handleSimulateCamera}
                disabled={readOnly}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-900 text-white rounded shadow-sm hover:bg-slate-800"
              >
                <Camera className="w-3.5 h-3.5" /> Camera
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {helperText || 'Drag & drop scale or item photo'}
            </p>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={label}
        subtitle="Historical verification photograph"
        maxWidth="2xl"
      >
        <div className="flex flex-col items-center justify-center bg-slate-900 rounded p-2">
          <img src={value} alt={label} className="max-h-[70vh] object-contain rounded" />
        </div>
      </Modal>
    </div>
  );
};

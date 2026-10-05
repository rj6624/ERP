import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | any) => void;
  options?: Array<SelectOption | string>;
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  direction?: 'down' | 'up';
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  children,
  placeholder,
  className = '',
  disabled = false,
  direction = 'down',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse options from either `options` prop or `<option>` children
  const parsedOptions: SelectOption[] = useMemo(() => {
    if (options && options.length > 0) {
      return options.map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
      );
    }

    const items: SelectOption[] = [];
    if (children) {
      React.Children.forEach(children, (child) => {
        if (React.isValidElement<{ value?: string | number; children?: React.ReactNode }>(child) && child.props) {
          const val = child.props.value !== undefined ? String(child.props.value) : '';
          const label = child.props.children ? String(child.props.children) : val;
          items.push({ value: val, label });
        }
      });
    }
    return items;
  }, [options, children]);

  const selectedOption = parsedOptions.find((opt) => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : placeholder || (parsedOptions[0]?.label ?? '');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    // Support both direct value callback and synthetic event callback
    onChange(val);
    if (typeof onChange === 'function') {
      try {
        onChange({ target: { value: val } } as any);
      } catch {
        // Handled direct value
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button styled identically to secondary buttons / Export button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`ds-button ds-button--secondary erp-toolbar-control flex items-center justify-between gap-2 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-[var(--ds-radius-control,9px)] hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
          isOpen ? 'ring-2 ring-emerald-500/20 border-emerald-500' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-600' : ''
          }`}
        />
      </button>

      {/* Custom Dropdown Menu Popover */}
      {isOpen && (
        <div
          role="listbox"
          className={`ds-popover absolute left-0 ${
            direction === 'up' ? 'bottom-full mb-1.5 origin-bottom' : 'top-full mt-1.5 origin-top'
          } min-w-full w-max max-w-xs max-h-64 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          {parsedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

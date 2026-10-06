import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  roleBadge?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  roleBadge,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6 rounded-md',
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-8 h-8 rounded-lg',
    lg: 'w-10 h-10 rounded-xl',
    xl: 'w-12 h-12 rounded-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${sizeMap[size]} overflow-hidden bg-black flex items-center justify-center shrink-0 shadow-sm shadow-amber-950/20 border border-amber-500/20`}
      >
        <img
          src="/brand-logo.png"
          alt="Brand Logo"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-extrabold tracking-wider text-xs text-inherit leading-tight">
            PLATING MGMT
          </span>
          <span className="text-[10px] text-slate-400 font-mono tracking-tight flex items-center gap-1 leading-tight">
            JEWELLERY ERP
            {roleBadge && (
              <span className="text-amber-400 font-bold text-[9px] bg-amber-950/80 px-1 py-0.2 rounded border border-amber-800/40">
                {roleBadge}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

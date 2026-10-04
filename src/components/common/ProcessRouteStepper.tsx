import { Button, Card } from '../ui/Primitives';
import React from 'react';
import { GitCommit, Clock, MessageSquare, Check, Sparkles, Layers, ArrowRight } from 'lucide-react';

export interface RouteStop {
  id: string;
  title: string;
  subtitle: string;
  time?: string;
  commentCount?: number;
  status: 'completed' | 'current' | 'pending';
  tag?: string;
}

interface ProcessRouteStepperProps {
  title?: string;
  count?: number;
  actionText?: string;
  onAction?: () => void;
  stops: RouteStop[];
}

export const ProcessRouteStepper: React.FC<ProcessRouteStepperProps> = ({
  title = 'Processing Route',
  count,
  actionText = 'View full route',
  onAction,
  stops,
}) => {
  return (
    <Card padding="md" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <GitCommit className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            {title} {count !== undefined && <span className="text-slate-400 font-normal">({count})</span>}
          </h3>
        </div>
        {actionText && (
          <Button variant="ghost"
            onClick={onAction}
            className="transition-colors cursor-pointer"
          >
            {actionText}
          </Button>
        )}
      </div>

      {/* Stepper List */}
      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200">
        {stops.map((stop, index) => {
          const isFirst = index === 0;
          const isLast = index === stops.length - 1;
          const isCurrent = stop.status === 'current';
          const isCompleted = stop.status === 'completed';

          return (
            <div key={stop.id} className="relative group">
              {/* Marker Dot */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 ring-offset-1'
                    : isCompleted
                    ? 'bg-slate-900 text-white'
                    : isFirst
                    ? 'bg-white border-2 border-slate-900 text-transparent'
                    : isLast
                    ? 'bg-slate-900 border-2 border-slate-900 text-white'
                    : 'bg-white border-2 border-slate-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : isCurrent ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                ) : null}
              </div>

              {/* Stop Content */}
              <div className="min-w-0 pr-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-900' : 'text-slate-600'}`}>
                    {stop.title}
                  </span>
                  {stop.commentCount && stop.commentCount > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                      <MessageSquare className="w-3 h-3 text-slate-400" />
                      {stop.commentCount}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 mt-0.5">{stop.subtitle}</div>

                {stop.time && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{stop.time}</span>
                    {stop.tag && (
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold ml-1">
                        {stop.tag}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

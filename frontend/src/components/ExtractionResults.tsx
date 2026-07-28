import React from 'react';
import { Sparkles, UserCheck, MapPin, ShoppingBag, ListChecks, ArrowRightCircle, ShieldAlert, CreditCard } from 'lucide-react';
import type { ExtractedField } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';

interface ExtractionResultsProps {
  fields: ExtractedField[];
}

export const ExtractionResults: React.FC<ExtractionResultsProps> = ({ fields }) => {
  const getIconForField = (key: string) => {
    switch (key) {
      case 'salesperson_name': return <UserCheck className="w-4 h-4 text-indigo-500" />;
      case 'customer_name': return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'customer_location': return <MapPin className="w-4 h-4 text-rose-500" />;
      case 'products_discussed': return <ShoppingBag className="w-4 h-4 text-purple-500" />;
      case 'customer_requirements': return <ListChecks className="w-4 h-4 text-emerald-500" />;
      case 'payment_discussion': return <CreditCard className="w-4 h-4 text-amber-500" />;
      case 'objections': return <ShieldAlert className="w-4 h-4 text-orange-500" />;
      case 'follow_up_action': return <ArrowRightCircle className="w-4 h-4 text-pink-500" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Structured AI Sales Call Analytics</span>
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">
          Extracted Business & Lead Insights
        </h2>
        <p className="text-xs text-indigo-200/80 max-w-2xl leading-relaxed">
          Automatic field extraction from Hindi-English call audio with supporting transcript evidence and confidence scores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div
            key={field.key}
            className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
              field.isDetected
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg'
                : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-85'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {getIconForField(field.key)}
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {field.label}
                  </span>
                </div>
                <ConfidenceBadge
                  confidence={field.confidence}
                  score={field.confidenceScore}
                />
              </div>

              <div className="mt-1">
                <p
                  className={`text-base font-extrabold leading-snug ${
                    field.isDetected
                      ? 'text-slate-900 dark:text-slate-100'
                      : 'text-slate-400 dark:text-slate-500 italic'
                  }`}
                >
                  {field.value}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                <span className="font-semibold text-slate-400 uppercase tracking-wide">Transcript Evidence</span>
                {field.timestamp !== 'N/A' && (
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                    {field.timestamp}
                  </span>
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-400 italic line-clamp-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800">
                "{field.evidence}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

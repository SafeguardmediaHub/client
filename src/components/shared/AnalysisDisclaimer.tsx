import { Info } from 'lucide-react';

export function AnalysisDisclaimer() {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
      <p className="text-xs leading-5 text-slate-500">
        Results are generated using Safeguardmedia&apos;s multi-layer
        verification process. For informational purposes only. Always apply
        editorial judgement before acting on any finding.
      </p>
    </div>
  );
}

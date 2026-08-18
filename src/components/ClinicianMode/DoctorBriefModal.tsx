import React, { useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  Share2,
  Copy,
  Stethoscope
} from 'lucide-react';
import { DoctorBriefData, SupportedLanguage } from '../../types';
import { WaneesLogo } from '../WaneesLogo';

interface DoctorBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  brief: DoctorBriefData;
  language: SupportedLanguage;
}

export const DoctorBriefModal: React.FC<DoctorBriefModalProps> = ({
  isOpen,
  onClose,
  brief,
  language
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = `DOCTOR BRIEF 2.0 - WANISAI
Patient: ${brief.patientName}, Age ${brief.age}
Period: ${brief.reportingPeriod}
ACB Cumulative Score: ${brief.acbSummary.totalScore} (${brief.acbSummary.riskCategory})
Executive Summary: ${brief.summaryExecutive}
Key Discussion Prompts:
${brief.clinicianDiscussionPrompts.map(p => `- ${p}`).join('\n')}
Data Provenance: ${brief.dataProvenance.confidenceRating} confidence, Hash: ${brief.dataProvenance.hash}`;
    
    navigator.clipboard.writeText(summaryText);
    alert(language === 'ar' ? 'تم نسخ التقرير إلى الحافظة بنجاح' : 'Doctor Brief copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="doctor-brief-2-modal"
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
      >
        
        {/* Header Action Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="p-1.5 rounded-2xl bg-slate-800 border border-slate-700/80 shadow-xs flex items-center justify-center">
              <WaneesLogo variant="icon" size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-wide">WANEES Doctor Brief 2.0</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-500 text-slate-950 uppercase">
                  Executive 2-Min Review
                </span>
              </div>
              <p className="text-xs text-teal-300/80 font-medium">
                AI Care &amp; Safety Ecosystem • Validated Geriatric Cognitive Summary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-brief-btn"
              onClick={handleCopySummary}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Copy Summary"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy</span>
            </button>
            <button
              id="print-brief-btn"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print Brief"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              id="close-brief-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable / Viewable Clinical Summary Body */}
        <div ref={printRef} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto text-slate-800 dark:text-slate-200">
          
          {/* Official Document Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <WaneesLogo variant="horizontal" size="sm" showEcosystemSubtitle={true} />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Document Type</span>
              <span className="text-xs font-extrabold text-teal-800 dark:text-teal-300">CLINICAL COGNITIVE SUMMARY</span>
            </div>
          </div>

          {/* Patient Bio & Period Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 block">Patient Name & Demographics</span>
              <strong className="text-sm text-slate-900 dark:text-white font-bold">{brief.patientName}</strong>
              <span className="block text-slate-500">{brief.age} yrs • {brief.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Reporting Window</span>
              <strong className="text-sm text-slate-900 dark:text-white font-bold">{brief.reportingPeriod}</strong>
              <span className="block text-slate-500">Date Generated: {brief.generatedDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Clinical Risk Tier</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <strong className="text-sm font-bold text-amber-700 dark:text-amber-400">{brief.acbSummary.riskCategory}</strong>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Clinical Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              1. Executive Clinical Summary (30-Second SBAR)
            </h3>
            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/80 text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {brief.summaryExecutive}
            </div>
          </div>

          {/* Section 2: Baseline Deltas & Longitudinal Trajectory */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Longitudinal Baseline Variance (vs 30-Day Personal Baseline)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-400 block">Mood Variance</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 mt-1 block">{brief.baselineDelta.moodVariance}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-400 block">Sleep Quality Delta</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 mt-1 block">{brief.baselineDelta.sleepQualityDelta}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-400 block">Reported Memory Lapses</span>
                <span className="font-bold text-slate-900 dark:text-white mt-1 block">{brief.baselineDelta.memoryLapseIncidents} incidents</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-400 block">Social & Functional</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">{brief.baselineDelta.functionalIndependence}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Anticholinergic Cognitive Burden (ACB) Analysis */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                3. Anticholinergic Cognitive Burden (ACB 2.0) Calculation
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-black border border-amber-300">
                Total Score: {brief.acbSummary.totalScore} / 3 Threshold
              </span>
            </div>

            <div className="space-y-2">
              {brief.acbSummary.contributingDrugs.map((drug, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900 dark:text-white text-sm">{drug.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black">
                      ACB +{drug.acb}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Class: {drug.category}</p>
                  <p className="text-slate-700 dark:text-slate-300">{drug.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Patient Verbatim Quotes */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              4. Patient-Reported Verbatim Statements
            </h3>
            <div className="space-y-2">
              {brief.patientVerbatimQuotes.map((quote, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs italic text-slate-700 dark:text-slate-300">
                  {quote}
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Suggested Areas for Review & Clinician Prompts */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              5. Actionable Clinician Discussion Prompts
            </h3>
            <div className="space-y-2">
              {brief.clinicianDiscussionPrompts.map((prompt, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-xs text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{prompt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Safety Flags & Data Provenance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Critical Safety Flags</span>
              <ul className="space-y-1 text-rose-700 dark:text-rose-400">
                {brief.safetyFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 sm:pl-4">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Data Provenance & Audit Trail
              </span>
              <p className="text-slate-500">{brief.dataProvenance.source}</p>
              <p className="text-slate-500">Confidence: <strong>{brief.dataProvenance.confidenceRating}</strong> ({brief.dataProvenance.dataPointsAnalyzed} data points)</p>
              <p className="text-[10px] text-slate-400 font-mono">Hash: {brief.dataProvenance.hash}</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Non-Diagnostic Clinical Decision Support Tool (WanisAI Clinical Protocol v2.4)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white font-bold transition-colors"
          >
            Close Brief
          </button>
        </div>

      </div>
    </div>
  );
};

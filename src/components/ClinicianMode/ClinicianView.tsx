import React, { useState } from 'react';
import { 
  Stethoscope, 
  FileText, 
  Pill, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Printer, 
  ArrowRight,
  TrendingDown,
  Info,
  Plus,
  Trash2,
  HelpCircle,
  Play,
  FileCheck2,
  ClipboardList,
  Check
} from 'lucide-react';
import { 
  SeniorProfile, 
  Medication, 
  DoctorBriefData, 
  LongitudinalMetrics, 
  SupportedLanguage,
  CareCircleTriageNotification,
  CheckInRecord
} from '../../types';
import { DICTIONARY } from '../../data/i18n';
import { DoctorBriefModal } from './DoctorBriefModal';
import { AppointmentHealthSummaryModal } from './AppointmentHealthSummaryModal';
import { ClinicalGeminiCopilot } from './ClinicalGeminiCopilot';
import { ContextualHelpButton } from '../Walkthrough/ContextualHelpButton';
import { generateClinicianPdfReport } from '../../utils/generateClinicianPdfReport';

interface ClinicianViewProps {
  senior: SeniorProfile;
  medications: Medication[];
  doctorBrief: DoctorBriefData;
  longitudinalData: LongitudinalMetrics[];
  triageHistory?: CareCircleTriageNotification[];
  checkins?: CheckInRecord[];
  onUpdateMedications: (meds: Medication[]) => void;
  language: SupportedLanguage;
  totalAcbScore: number;
  onOpenContextualHelp?: (topic: string) => void;
  onStartDoctorBriefTour?: () => void;
}

export const ClinicianView: React.FC<ClinicianViewProps> = ({
  senior,
  medications,
  doctorBrief,
  longitudinalData,
  triageHistory = [],
  checkins = [],
  onUpdateMedications,
  language,
  totalAcbScore,
  onOpenContextualHelp,
  onStartDoctorBriefTour
}) => {
  const t = DICTIONARY[language];
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isHealthSummaryOpen, setIsHealthSummaryOpen] = useState(false);
  const [activeClinicianTab, setActiveClinicianTab] = useState<'brief' | 'acb' | 'soap' | 'copilot'>('brief');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessToast, setPdfSuccessToast] = useState(false);

  // Interactive Drug Simulation
  const [simulatedDrugName, setSimulatedDrugName] = useState('');
  const [simulatedScore, setSimulatedScore] = useState<0 | 1 | 2 | 3>(0);

  const handleAddSimulatedMed = () => {
    if (!simulatedDrugName.trim()) return;
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: simulatedDrugName.trim(),
      genericName: simulatedDrugName.trim(),
      dosage: 'Standard dose',
      frequency: 'Once daily',
      acbScore: simulatedScore,
      drugClass: 'Trial Simulation Drug',
      indication: 'Investigational Addition',
      clinicalExplanation: simulatedScore > 0 ? `Adds ${simulatedScore} point(s) to central anticholinergic burden.` : 'Zero anticholinergic burden.',
      saferAlternatives: [],
      isTakenToday: true
    };
    onUpdateMedications([...medications, newMed]);
    setSimulatedDrugName('');
    setSimulatedScore(0);
  };

  const handleRemoveMed = (id: string) => {
    onUpdateMedications(medications.filter(m => m.id !== id));
  };

  const handleDownloadPdfReport = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      generateClinicianPdfReport({
        senior,
        medications,
        doctorBrief,
        triageHistory,
        longitudinalData,
        totalAcbScore,
        language
      });
      setIsGeneratingPdf(false);
      setPdfSuccessToast(true);
      setTimeout(() => setPdfSuccessToast(false), 4000);
    }, 400);
  };

  return (
    <div id="clinician-portal-container" className="space-y-6 animate-fadeIn">
      
      {/* Top Clinician Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'الذكاء السريري وملف الطبيب 2.0' : 'Clinical Intelligence & Doctor Brief 2.0'}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Geriatric CDS Mode
              </span>
              {onOpenContextualHelp && (
                <ContextualHelpButton
                  topicKey="doctor-brief"
                  label={language === 'ar' ? 'ما هو ملخص الطبيب؟' : 'What is a Doctor Brief?'}
                  language={language}
                  onClick={onOpenContextualHelp}
                />
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Patient: <strong>{senior.fullName}</strong> (Age {senior.age}) • Primary Physician: {senior.primaryPhysician.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full lg:w-auto">
          {onStartDoctorBriefTour && (
            <button
              id="show-me-how-doctor-brief-btn"
              onClick={onStartDoctorBriefTour}
              className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Interactive Step-by-Step Walkthrough"
            >
              <Play className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 fill-current shrink-0" />
              <span>{language === 'ar' ? 'أرني كيف أستخدم الملخص' : 'Show Me How'}</span>
            </button>
          )}

          {/* DOWNLOAD PDF REPORT BUTTON */}
          <button
            id="btn-download-pdf-clinical-report"
            onClick={handleDownloadPdfReport}
            disabled={isGeneratingPdf}
            className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            title="Download PDF Clinical Summary Report for Medical Visits"
          >
            <Download className={`w-4 h-4 shrink-0 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
            <span>
              {isGeneratingPdf 
                ? (language === 'ar' ? 'جاري تجهيز PDF...' : 'Generating PDF...')
                : (language === 'ar' ? 'تحميل تقرير PDF السريري' : 'Download PDF Report')}
            </span>
          </button>

          {/* Generate Comprehensive Health Summary Button */}
          <button
            id="generate-health-summary-btn"
            onClick={() => setIsHealthSummaryOpen(true)}
            className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            title="Generate Comprehensive Appointment Health Summary"
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            <span>{language === 'ar' ? 'إنشاء ملخص الموعد' : 'Generate Health Summary'}</span>
          </button>

          <button
            id="open-full-doctor-brief-btn"
            onClick={() => setIsBriefModalOpen(true)}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>{language === 'ar' ? 'عرض ملف الطبيب 2.0' : 'Launch Doctor Brief 2.0'}</span>
          </button>
        </div>
      </div>

      {/* PDF Ready Toast Notification */}
      {pdfSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-800 text-xs font-bold text-teal-800 dark:text-teal-200 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>
              {language === 'ar'
                ? `تم تجهيز تقرير الالتزام الدوائي وملخص الزيارة الطبية بتنسيق PDF بنجاح!`
                : `Clinical PDF Summary for ${senior.fullName} (Adherence & Triage Logs) is ready and open for printing/download!`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPdfSuccessToast(false)}
            className="text-teal-600 hover:text-teal-800 text-xs underline"
          >
            {language === 'ar' ? 'إغلاق' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full max-w-3xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveClinicianTab('brief')}
          className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center whitespace-nowrap ${activeClinicianTab === 'brief' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          2-Min Clinical Summary
        </button>
        <button
          onClick={() => setActiveClinicianTab('acb')}
          className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center whitespace-nowrap ${activeClinicianTab === 'acb' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          ACB 2.0 Risk Engine ({totalAcbScore})
        </button>
        <button
          onClick={() => setActiveClinicianTab('copilot')}
          className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center whitespace-nowrap flex items-center justify-center gap-1.5 ${activeClinicianTab === 'copilot' ? 'bg-teal-600 text-white shadow-xs' : 'text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Clinical Copilot</span>
        </button>
        <button
          onClick={() => setActiveClinicianTab('soap')}
          className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center whitespace-nowrap ${activeClinicianTab === 'soap' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          SOAP &amp; EHR Export
        </button>
      </div>

      {/* TAB 1: 2-MINUTE CLINICAL SUMMARY */}
      {activeClinicianTab === 'brief' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Executive Card with PDF Export Banner */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  SBAR Clinical Impression (Last 14 Days)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdfReport}
                    className="px-3 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-1.5 border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تصدير تقرير PDF' : 'Export PDF'}</span>
                  </button>
                  <span className="text-xs font-semibold text-slate-400">
                    Generated {doctorBrief.generatedDate}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                {doctorBrief.summaryExecutive}
              </div>

              {/* Actionable Prompts for Doctor Visit */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recommended Clinician Discussion Points
                </span>
                <div className="space-y-2">
                  {doctorBrief.clinicianDiscussionPrompts.map((prompt, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Verbatim Patient Quotes Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Patient Subjective Statements (Verbatim)
              </h3>
              <div className="space-y-2">
                {doctorBrief.patientVerbatimQuotes.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs italic text-slate-700 dark:text-slate-300">
                    {q}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Quick ACB Gauge & Safety Flags */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* ACB Gauge Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Cumulative ACB Score
                  </h3>
                  {onOpenContextualHelp && (
                    <ContextualHelpButton
                      topicKey="acb"
                      label={language === 'ar' ? 'ما هو ACB؟' : 'What is ACB?'}
                      language={language}
                      onClick={onOpenContextualHelp}
                    />
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${totalAcbScore >= 3 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300' : 'bg-emerald-100 text-emerald-800'}`}>
                  Score: {totalAcbScore}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                  {totalAcbScore >= 3 ? 'HIGH COGNITIVE BURDEN (Score ≥ 3)' : 'MODERATE BURDEN'}
                </span>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  Clinically associated with 50% higher delirium risk and increased fall incidence. Muscarinic M1/M3 blockade reduces acetylcholine neurotransmission.
                </p>
              </div>

              <button
                onClick={() => setActiveClinicianTab('acb')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Inspect Drug-by-Drug Breakdown →
              </button>
            </div>

            {/* Safety Flags */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Critical Safety Flags
              </h3>
              <ul className="space-y-2 text-xs">
                {doctorBrief.safetyFlags.map((flag, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-300">
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: FULL ACB 2.0 RISK ENGINE & DEPRESCRIBING SIMULATOR */}
      {activeClinicianTab === 'acb' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Anticholinergic Cognitive Burden (ACB) Scale & Drug Breakdown
                  </h3>
                  {onOpenContextualHelp && (
                    <ContextualHelpButton
                      topicKey="acb"
                      label={language === 'ar' ? 'فهم مؤشر العبء المعرفي' : 'Understand ACB'}
                      language={language}
                      onClick={onOpenContextualHelp}
                    />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Validated geriatric scale quantifying competitive muscarinic antagonism. Total score ≥ 3 requires clinical deprescribing review.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Total Score:</span>
                <span className={`text-2xl font-black px-3 py-1 rounded-2xl ${totalAcbScore >= 3 ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {totalAcbScore}
                </span>
              </div>
            </div>

            {/* Current Medication List with ACB tags */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {medications.map((med) => (
                <div key={med.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {med.name}
                      </span>
                      <span className="text-xs text-slate-400">({med.genericName})</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${med.acbScore === 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-600' : med.acbScore >= 3 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-black' : 'bg-amber-100 text-amber-800'}`}>
                        +{med.acbScore} ACB Point{med.acbScore !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {med.dosage} • {med.frequency} • <span className="italic">{med.indication}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                      {med.clinicalExplanation}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {med.saferAlternatives && med.saferAlternatives.length > 0 && (
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block uppercase">
                          Safer Alternative Available
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {med.saferAlternatives[0].name} (ACB = {med.saferAlternatives[0].acbScore})
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveMed(med.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove / Deprescribe this drug"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive What-If Simulation Sandbox */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                What-If Deprescribing & Prescription Sandbox
              </h4>
              <p className="text-xs text-slate-500">
                Simulate adding a new prescription or trial substitution to calculate real-time impact on {senior.fullName}'s cumulative cognitive burden.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={simulatedDrugName}
                  onChange={(e) => setSimulatedDrugName(e.target.value)}
                  placeholder="Enter trial medication name (e.g. Hydroxyzine, Oxybutynin)..."
                  className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
                
                <select
                  value={simulatedScore}
                  onChange={(e) => setSimulatedScore(Number(e.target.value) as any)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                >
                  <option value={0}>ACB Score 0 (Safe / No Burden)</option>
                  <option value={1}>ACB Score +1 (Mild Anticholinergic)</option>
                  <option value={2}>ACB Score +2 (Moderate Burden)</option>
                  <option value={3}>ACB Score +3 (Severe Burden / High Risk)</option>
                </select>

                <button
                  onClick={handleAddSimulatedMed}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Simulate Impact
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: SOAP NOTE & EHR EXPORT */}
      {activeClinicianTab === 'soap' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {language === 'ar' ? 'تقرير SOAP التوليدي المعتمد (جاهز للأنظمة الصحية)' : 'Generated Geriatric SOAP Note (EHR Ready)'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'تنسيق قياسي موثق للنسخ المباشر أو التصدير لملف المريض' : 'Standard clinical documentation formatted for direct EHR export'}
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                id="btn-soap-download-pdf"
                onClick={handleDownloadPdfReport}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تحميل PDF' : 'Download PDF Report'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsHealthSummaryOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'ملخص الموعد الشامل' : 'Full Health Summary'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`SUBJECTIVE: 76yo female reports fragmented sleep (4.5h) and morning dizziness...\nOBJECTIVE: Baseline delta -18%, Cumulative ACB=4...\nASSESSMENT: High anticholinergic burden exacerbating cognitive latency...\nPLAN: Taper Amitriptyline, trial Cetirizine ACB=0...`);
                  alert('SOAP Note copied to clipboard for EHR insertion!');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {language === 'ar' ? 'نسخ نص SOAP' : 'Copy SOAP Note'}
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-3 leading-relaxed">
            <div>
              <strong className="text-teal-600 block">S (SUBJECTIVE):</strong>
              76 y/o female patient reports 4-day history of interrupted sleep (avg 4.5h/night) with post-awakening brain fog and transient orthostatic dizziness when rising from prayer mat. Notes misplacing prayer beads on 2 occasions.
            </div>
            <div>
              <strong className="text-teal-600 block">O (OBJECTIVE):</strong>
              WanisAI 14-day continuous loop data: Sleep quality index declined 22%. Mood variance -14%. Cumulative Anticholinergic Cognitive Burden score = 4 (Amitriptyline 25mg nightly [Score 3] + Chlorpheniramine 4mg PRN [Score 1]).
            </div>
            <div>
              <strong className="text-teal-600 block">A (ASSESSMENT):</strong>
              Medication-induced cognitive burden and orthostatic vulnerability secondary to high anticholinergic polypharmacy. Mild baseline memory latency exacerbated by muscarinic antagonism.
            </div>
            <div>
              <strong className="text-teal-600 block">P (PLAN):</strong>
              1) Deprescribe/substitute Amitriptyline with low-dose non-anticholinergic sleep hygiene. 2) Discontinue Chlorpheniramine in favor of Cetirizine (ACB=0). 3) Orthostatic vitals check. 4) Follow-up in 14 days via WanisAI Doctor Brief 2.0.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GEMINI CLINICAL COPILOT & DEPRESCRIBING INTELLIGENCE */}
      {activeClinicianTab === 'copilot' && (
        <ClinicalGeminiCopilot
          senior={senior}
          medications={medications}
          totalAcbScore={totalAcbScore}
          language={language}
        />
      )}

      {/* Doctor Brief Modal */}
      <DoctorBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        brief={doctorBrief}
        language={language}
      />

      {/* Appointment Health Summary Modal */}
      <AppointmentHealthSummaryModal
        isOpen={isHealthSummaryOpen}
        onClose={() => setIsHealthSummaryOpen(false)}
        senior={senior}
        medications={medications}
        triageHistory={triageHistory}
        checkins={checkins}
        doctorBrief={doctorBrief}
        totalAcbScore={totalAcbScore}
        language={language}
      />

    </div>
  );
};

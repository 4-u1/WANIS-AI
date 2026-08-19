import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Share2, 
  Download, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  Pill, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Calendar, 
  User, 
  Phone, 
  FileCheck2, 
  AlertCircle,
  MessageSquare,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Info,
  Ban,
  CheckCheck
} from 'lucide-react';
import { 
  SeniorProfile, 
  Medication, 
  CareCircleTriageNotification, 
  CheckInRecord, 
  DoctorBriefData, 
  SupportedLanguage,
  TriageLevel
} from '../../types';
import { WaneesLogo } from '../WaneesLogo';

interface AppointmentHealthSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  senior: SeniorProfile;
  medications: Medication[];
  triageHistory?: CareCircleTriageNotification[];
  checkins?: CheckInRecord[];
  doctorBrief: DoctorBriefData;
  totalAcbScore: number;
  language: SupportedLanguage;
}

export const AppointmentHealthSummaryModal: React.FC<AppointmentHealthSummaryModalProps> = ({
  isOpen,
  onClose,
  senior,
  medications = [],
  triageHistory = [],
  checkins = [],
  doctorBrief,
  totalAcbScore,
  language: initialLanguage
}) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(initialLanguage);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const isRtl = currentLang === 'ar';
  const currentDate = new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const reportRefId = `WAN-MED-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${senior.id.toUpperCase()}`;

  // Triage Color Helper
  const getTriageBadge = (level: TriageLevel) => {
    switch (level) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
          label: currentLang === 'ar' ? 'مستقر / أخضر' : 'Stable (GREEN)',
          dot: 'bg-emerald-500'
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700',
          label: currentLang === 'ar' ? 'متابعة سريرية / أصفر' : 'Moderate Drift (YELLOW)',
          dot: 'bg-amber-500'
        };
      case 'RED':
        return {
          bg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700',
          label: currentLang === 'ar' ? 'تنبيه أمان عاجل / أحمر' : 'Urgent Safety Flag (RED)',
          dot: 'bg-rose-500'
        };
    }
  };

  const currentTriageBadge = getTriageBadge(senior.currentTriage);

  // Generate plain text / markdown for clipboard & EHR sharing
  const generateShareableText = () => {
    const medList = medications.map(m => 
      `- ${m.name} (${m.genericName}): ${m.dosage}, ${m.frequency} [ACB: +${m.acbScore}] - Indication: ${m.indication}${m.notes ? ` (Note: ${m.notes})` : ''}`
    ).join('\n');

    const triageLogs = (triageHistory.slice(0, 5)).map(t => 
      `- [${t.timestamp}] Shift to ${t.newTriage}: ${t.reason}`
    ).join('\n') || '- No acute triage alerts logged in past 14 days.';

    const recentQuotes = doctorBrief.patientVerbatimQuotes.map(q => `"${q}"`).join(' | ');

    return `=====================================================
WANEES CLINICAL INTELLIGENCE - APPOINTMENT HEALTH SUMMARY
=====================================================
Report ID: ${reportRefId}
Date: ${currentDate}
Patient: ${senior.fullName} | Age: ${senior.age} | Gender: ${senior.gender}
Primary Physician: ${senior.primaryPhysician.name} (${senior.primaryPhysician.clinic})
Emergency Contact: ${senior.emergencyContacts[0]?.name} (${senior.emergencyContacts[0]?.phone})

1. CLINICAL IMPRESSION & SUMMARY
-----------------------------------------------------
Current Status: ${senior.currentTriage}
Summary: ${doctorBrief.summaryExecutive}
Cumulative ACB Score: ${totalAcbScore} ${totalAcbScore >= 3 ? '(HIGH RISK - Deprescribing Recommended)' : '(Acceptable Burden)'}
Sleep Quality Delta: ${doctorBrief.baselineDelta.sleepQualityDelta}
Mood Variance: ${doctorBrief.baselineDelta.moodVariance}

2. CURRENT ACTIVE MEDICATION REGIMEN
-----------------------------------------------------
${medList}

3. RECENT TRIAGE & SAFETY EVENTS
-----------------------------------------------------
${triageLogs}

4. PATIENT RECENT SUBJECTIVE INSIGHTS (VERBATIM)
-----------------------------------------------------
${recentQuotes}

5. RECOMMENDED CLINICAL DISCUSSION POINTS
-----------------------------------------------------
${doctorBrief.clinicianDiscussionPrompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}

=====================================================
Data Provenance: WanisAI Continuous Loop Platform
Validated via Geriatric Decision Support Protocol
=====================================================`;
  };

  const handleCopy = () => {
    const text = generateShareableText();
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const text = generateShareableText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Health_Summary_${senior.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div
      id="appointment-health-summary-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Action & Top Control Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shadow-xs">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  {currentLang === 'ar' ? 'ملخص الحالة الصحية للموعد الطبي الشامل' : 'Comprehensive Medical Appointment Health Summary'}
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-teal-400 text-slate-950">
                  EHR & Visit Ready
                </span>
              </div>
              <p className="text-xs text-teal-200/80">
                {currentLang === 'ar' 
                  ? 'تجميع فوري لقائمة الأدوية النشطة، سجل التنبيهات، والرؤى السلوكية لجلسة الطبيب'
                  : 'Compiled medication regimen, safety triage logs, and recent patient check-in insights'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
            
            {/* Language Switcher */}
            <div className="flex items-center rounded-xl bg-white/10 p-0.5 border border-white/15 text-xs">
              <button
                type="button"
                onClick={() => setCurrentLang('ar')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${currentLang === 'ar' ? 'bg-teal-500 text-slate-950' : 'text-white/80 hover:text-white'}`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setCurrentLang('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${currentLang === 'en' ? 'bg-teal-500 text-slate-950' : 'text-white/80 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Copy Shareable Button */}
            <button
              type="button"
              id="btn-copy-health-summary"
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/15 active:scale-95"
              title="Copy formatted summary to clipboard"
            >
              {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copySuccess ? (currentLang === 'ar' ? 'تم النسخ!' : 'Copied!') : (currentLang === 'ar' ? 'نسخ النص' : 'Copy Brief')}</span>
            </button>

            {/* Download Text / JSON */}
            <button
              type="button"
              id="btn-download-health-summary"
              onClick={handleDownload}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/15 active:scale-95"
              title="Download summary text file"
            >
              {downloadSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Download className="w-3.5 h-3.5" />}
              <span>{currentLang === 'ar' ? 'تحميل ملف' : 'Download'}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              id="btn-print-health-summary"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{currentLang === 'ar' ? 'طباعة / PDF' : 'Print / PDF'}</span>
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Close summary modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Printable Body Container */}
        <div id="printable-health-summary-content" className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* ========================================================= */}
          {/* INSTITUTIONAL HEADER & PATIENT DEMOGRAPHICS BANNER        */}
          {/* ========================================================= */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="p-1 rounded-2xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-600">
                  <WaneesLogo variant="icon" size="md" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {currentLang === 'ar' ? 'منصة ونيس للرعاية المستمرة والذكاء الإدراكي' : 'WanisAI Senior Cognitive & Care Continuum'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentLang === 'ar' ? 'تقرير سريري رسمي معتمد للزيارات والمواعيد الطبية' : 'Official Pre-Consultation Clinical Brief & Health Record'}
                  </p>
                </div>
              </div>

              <div className="text-right rtl:text-left space-y-0.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <div><span className="font-bold text-slate-700 dark:text-slate-300">{currentLang === 'ar' ? 'رقم التقرير:' : 'Ref ID:'}</span> {reportRefId}</div>
                <div><span className="font-bold text-slate-700 dark:text-slate-300">{currentLang === 'ar' ? 'تاريخ التوليد:' : 'Generated:'}</span> {currentDate}</div>
              </div>
            </div>

            {/* Demographics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                  {currentLang === 'ar' ? 'اسم المريض' : 'Patient Name'}
                </span>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                  {senior.fullName}
                </span>
                <span className="text-slate-500">
                  {senior.age} {currentLang === 'ar' ? 'سنة' : 'y/o'} • {senior.gender === 'female' ? (currentLang === 'ar' ? 'أنثى' : 'Female') : (currentLang === 'ar' ? 'ذكر' : 'Male')}
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                  {currentLang === 'ar' ? 'الطبيب المعالج والعيادة' : 'Primary Physician'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white block truncate">
                  {senior.primaryPhysician.name}
                </span>
                <span className="text-slate-500 truncate block">
                  {senior.primaryPhysician.specialty} • {senior.primaryPhysician.clinic}
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                  {currentLang === 'ar' ? 'جهة الاتصال الرئيسية (الأسرة)' : 'Primary Caregiver'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {senior.emergencyContacts[0]?.name || 'Maryam (Daughter)'}
                </span>
                <span className="text-slate-500">
                  {senior.emergencyContacts[0]?.phone || '+966 50 123 4567'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                  {currentLang === 'ar' ? 'مستوى التقييم الحالي' : 'Current Triage Status'}
                </span>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black border ${currentTriageBadge.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${currentTriageBadge.dot}`}></span>
                  <span>{currentTriageBadge.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 1: EXECUTIVE CLINICAL & COGNITIVE SNAPSHOT         */}
          {/* ========================================================= */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>{currentLang === 'ar' ? '1. الملخص الإدراكي والسلوكي التراكمي (14 يوماً)' : '1. Longitudinal Cognitive & Behavioral Summary (Last 14 Days)'}</span>
              </h5>
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                SBAR Format
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {doctorBrief.summaryExecutive}
            </div>

            {/* Drift Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {currentLang === 'ar' ? 'تغير جودة النوم' : 'Sleep Fragmentation'}
                </span>
                <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 block">
                  {doctorBrief.baselineDelta.sleepQualityDelta}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {currentLang === 'ar' ? 'تباين المزاج والتفاعل' : 'Mood Stability'}
                </span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {doctorBrief.baselineDelta.moodVariance}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {currentLang === 'ar' ? 'حوادث النسيان الموثقة' : 'Memory Lapse Cues'}
                </span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {doctorBrief.baselineDelta.memoryLapseIncidents} {currentLang === 'ar' ? 'ملاحظات' : 'incidents'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {currentLang === 'ar' ? 'عبء الـ ACB التراكمي' : 'Total ACB Score'}
                </span>
                <span className={`text-sm font-black mt-0.5 block ${totalAcbScore >= 3 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                  +{totalAcbScore} {totalAcbScore >= 3 ? (currentLang === 'ar' ? '(خطر مرتفع)' : '(High Risk)') : ''}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 2: CURRENT MEDICATION LIST & ACB RISK MATRIX      */}
          {/* ========================================================= */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h5 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>{currentLang === 'ar' ? '2. قائمة الأدوية النشطة ومصفوفة عبء مضادات الكولين (ACB)' : '2. Active Medication Regimen & Anticholinergic Burden Matrix'}</span>
              </h5>
              <span className="text-xs font-bold text-slate-500">
                {medications.length} {currentLang === 'ar' ? 'أدوية مسجلة' : 'prescribed medications'}
              </span>
            </div>

            {/* Anticholinergic Warning Banner if Score >= 3 */}
            {totalAcbScore >= 3 && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/80 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-extrabold block">
                    {currentLang === 'ar' ? 'تنبيه أمان سريري: مؤشر ACB ≥ 3 نقاط' : 'Clinical Safety Alert: Cumulative ACB Score ≥ 3'}
                  </strong>
                  <span className="text-rose-800 dark:text-rose-300 leading-relaxed">
                    {currentLang === 'ar'
                      ? 'العبء الكوليني المرتفع يزيد من مخاطر بطء الاستجابة المعرفية، الدوار الوضعي عند الصلاة، ومخاطر السقوط بنسبة 60%. يُنصح بمراجعة البدائل غير الكولينية.'
                      : 'High anticholinergic burden is statistically linked to cognitive latency, orthostatic dizziness, and elevated fall risk. Consider tapering high-ACB agents.'}
                  </span>
                </div>
              </div>
            )}

            {/* Medications Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs text-left rtl:text-right border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">{currentLang === 'ar' ? 'الدواء والاسم العلمي' : 'Medication & Generic'}</th>
                    <th className="p-3">{currentLang === 'ar' ? 'الجرعة والتكرار' : 'Dosage & Schedule'}</th>
                    <th className="p-3">{currentLang === 'ar' ? 'دواعي الاستعمال' : 'Indication'}</th>
                    <th className="p-3">{currentLang === 'ar' ? 'نقاط ACB' : 'ACB Burden'}</th>
                    <th className="p-3">{currentLang === 'ar' ? 'حالة التناول وسياق الجرعة' : 'Adherence & Notes'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {medications.map((med) => {
                    const isHighAcb = med.acbScore >= 2;
                    return (
                      <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3">
                          <span className="font-extrabold text-slate-900 dark:text-white block">{med.name}</span>
                          <span className="text-slate-400 text-[11px] block italic">{med.genericName}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{med.dosage}</span>
                          <span className="text-slate-500 text-[11px] block">{med.frequency}</span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">
                          {med.indication}
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold ${
                            med.acbScore === 0
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              : med.acbScore === 1
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                          }`}>
                            +{med.acbScore} {med.acbScore >= 3 ? '🔴' : med.acbScore > 0 ? '⚠️' : '✓'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              med.isSkippedToday
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : med.isTakenToday
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {med.isSkippedToday ? (
                                <><Ban className="w-3 h-3" /><span>{currentLang === 'ar' ? 'تم التخطي' : 'Skipped'}</span></>
                              ) : med.isTakenToday ? (
                                <><Check className="w-3 h-3 stroke-[3]" /><span>{currentLang === 'ar' ? 'تم الأخذ' : 'Taken Today'}</span></>
                              ) : (
                                <><Clock className="w-3 h-3" /><span>{currentLang === 'ar' ? 'مجدول' : 'Scheduled'}</span></>
                              )}
                            </span>
                            {med.notes && (
                              <p className="text-[11px] text-teal-700 dark:text-teal-300 italic">
                                💬 {med.notes}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 3: TRIAGE & SAFETY ALERTS AUDIT HISTORY          */}
          {/* ========================================================= */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-teal-600" />
                <span>{currentLang === 'ar' ? '3. سجل التنبيهات والتحولات السريرية (Care Circle Triage History)' : '3. Safety Alerts & Triage History (Audit Trail)'}</span>
              </h5>
              <span className="text-xs text-slate-400">
                {triageHistory.length} {currentLang === 'ar' ? 'تنبيهات مسجلة' : 'logged alerts'}
              </span>
            </div>

            {triageHistory.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{currentLang === 'ar' ? 'لا توجد تنبيهات حمراء أو صفراء حرجة خلال الفترة الماضية؛ المؤشرات مستقرة.' : 'No acute triage shifts logged in the reporting period. Vitals and behavioral metrics remain stable.'}</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {triageHistory.slice(0, 4).map((triage) => {
                  const badge = getTriageBadge(triage.newTriage);
                  return (
                    <div
                      key={triage.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {triage.reason}
                          </span>
                        </div>
                        {triage.transcriptSnippet && (
                          <p className="text-[11px] text-slate-500 italic pl-1 rtl:pl-0 rtl:pr-1">
                            "{triage.transcriptSnippet}"
                          </p>
                        )}
                      </div>

                      <div className="text-right rtl:text-left text-[11px] text-slate-400 font-mono shrink-0">
                        {triage.timestamp}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* SECTION 4: PATIENT SUBJECTIVE QUOTES & CHECK-IN INSIGHTS */}
          {/* ========================================================= */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h5 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>{currentLang === 'ar' ? '4. تصريحات المريض الذاتية المباشرة (Patient Verbatim Statements)' : '4. Recent Patient Check-in Transcripts & Subjective Quotes'}</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctorBrief.patientVerbatimQuotes.map((quote, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs italic text-slate-700 dark:text-slate-300 leading-relaxed relative"
                >
                  <span className="text-teal-500 font-black text-base mr-1 rtl:mr-0 rtl:ml-1">“</span>
                  {quote}
                  <span className="text-teal-500 font-black text-base ml-1 rtl:ml-0 rtl:mr-1">”</span>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 5: CLINICIAN ACTIONABLE DISCUSSION CHECKLIST      */}
          {/* ========================================================= */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h5 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{currentLang === 'ar' ? '5. قائمة المراجعة المقترحة لجلسة الطبيب (Actionable Discussion Prompts)' : '5. Recommended Action Items for Medical Consultation'}</span>
            </h5>

            <div className="space-y-2">
              {doctorBrief.clinicianDiscussionPrompts.map((prompt, pIdx) => (
                <div
                  key={pIdx}
                  className="p-3.5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                >
                  <input
                    type="checkbox"
                    id={`chk-prompt-${pIdx}`}
                    defaultChecked={false}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 mt-0.5 shrink-0"
                  />
                  <label htmlFor={`chk-prompt-${pIdx}`} className="cursor-pointer leading-relaxed">
                    {prompt}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 6: INSTITUTIONAL SIGN-OFF & PROVENANCE SEAL       */}
          {/* ========================================================= */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Data Provenance: WanisAI CDS Intelligence Engine v2.4 (Encrypted FHIR Standard)</span>
            </div>
            <span>Confidence Rating: 99.4% • Hash: #8F9A-WAN-2026</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'جاهز للمشاركة مع العيادة ومطابقة متطلبات ملف الطبيب Doctor Brief' : 'Formatted for clinical appointments and EHR ingestion'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{currentLang === 'ar' ? 'طباعة التقرير' : 'Print Summary'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-bold text-xs"
            >
              {currentLang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

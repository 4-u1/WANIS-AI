import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  HeartHandshake, 
  Pill, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Share2, 
  Smile, 
  Moon, 
  Activity, 
  Send, 
  UserCheck, 
  Info,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { SeniorProfile, CheckInRecord, Medication, SupportedLanguage, TriageLevel } from '../../types';
import { generateDailyWellnessSummary } from '../../services/wellnessSummaryService';
import { notificationAudio } from '../../services/notificationService';

interface DailyWellnessSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  senior: SeniorProfile;
  latestCheckin?: CheckInRecord;
  medications: Medication[];
  totalAcbScore: number;
  language: SupportedLanguage;
  onToggleMedicationTaken?: (id: string) => void;
  onTriggerMedicationReminder?: (med: Medication) => void;
  autoShowPreference?: boolean;
  onUpdateAutoShowPreference?: (enabled: boolean) => void;
}

export const DailyWellnessSummaryModal: React.FC<DailyWellnessSummaryModalProps> = ({
  isOpen,
  onClose,
  senior,
  latestCheckin,
  medications = [],
  totalAcbScore,
  language,
  onToggleMedicationTaken,
  onTriggerMedicationReminder,
  autoShowPreference = true,
  onUpdateAutoShowPreference
}) => {
  if (!isOpen) return null;

  const isRtl = language === 'ar';
  const summary = generateDailyWellnessSummary(senior, latestCheckin, medications, totalAcbScore, language);

  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [autoShow, setAutoShow] = useState(autoShowPreference);

  const seniorName = senior.preferredName || senior.fullName;

  const handleCopy = () => {
    const textToCopy = `📋 ${language === 'ar' ? 'ملخص الاطمئنان والعافية اليومي' : 'Daily Wellness Summary'} - ${seniorName} (${summary.dateStr})\n` +
      `----------------------------------------\n` +
      `✨ ${language === 'ar' ? 'الحالة العامة' : 'Status'}: ${summary.statusLabel}\n` +
      `💬 ${language === 'ar' ? 'كلام الوالدة' : 'Senior Spoken Words'}: "${summary.checkinSummary.transcript || (language === 'ar' ? 'تم الفحص بنجاح' : 'Check-in recorded')}"\n` +
      `💊 ${language === 'ar' ? 'الالتزام بالأدوية' : 'Medication Adherence'}: ${summary.medicationSummary.takenCount}/${summary.medicationSummary.totalCount} (${summary.medicationSummary.compliancePercentage}%)\n` +
      `🧠 ${language === 'ar' ? 'العبء المعرفي للأدوية (ACB)' : 'ACB Score'}: ${totalAcbScore}\n` +
      `\n💡 ${language === 'ar' ? 'توصيات العائلة' : 'Care Circle Action Items'}:\n` +
      summary.caregiverRecommendations.map(r => `• ${r}`).join('\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const textToSpeak = `${summary.headline}. ${summary.caregiverRecommendations.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.95;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAcknowledge = () => {
    notificationAudio.playSuccessChime();
    setAcknowledged(true);
  };

  const handleToggleAutoShow = (checked: boolean) => {
    setAutoShow(checked);
    if (onUpdateAutoShowPreference) {
      onUpdateAutoShowPreference(checked);
    }
  };

  const getTriageBadge = (triage: TriageLevel) => {
    switch (triage) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          label: language === 'ar' ? 'استقرار تام وطبيعي' : 'Normal Baseline / Stable'
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500',
          label: language === 'ar' ? 'تنبيه متابعة لطيف' : 'Meaningful Change / Follow-up'
        };
      case 'ORANGE':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
          dot: 'bg-orange-500',
          label: language === 'ar' ? 'مراجعة سريرية مطلوبة' : 'Clinical Review Advised'
        };
      case 'RED':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          dot: 'bg-rose-500',
          label: language === 'ar' ? 'تنبيه عاجل' : 'Urgent Escalation'
        };
    }
  };

  const triageInfo = getTriageBadge(summary.triageLevel);

  return (
    <div 
      id="daily-wellness-summary-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div 
        id="daily-wellness-summary-modal-container"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white p-6 sm:p-7 relative overflow-hidden shrink-0">
          <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={senior.photoUrl}
                  alt={senior.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/40 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-teal-900 rounded-full"></span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-teal-100 text-xs font-bold backdrop-blur">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {language === 'ar' ? 'ملخص الاطمئنان والعافية اليومي' : 'Daily Wellness & Adherence Summary'}
                  </span>
                  <span className="text-xs text-teal-100/80 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {summary.dateStr} • {summary.generatedAt}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {language === 'ar' 
                    ? `مرحباً بكِ مريم — موجز اليوم للوالدة ${seniorName}`
                    : `Welcome, Maryam — Daily Briefing for ${seniorName}`}
                </h2>

                <p className="text-xs sm:text-sm text-teal-100/90 max-w-xl">
                  {summary.headline}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              id="close-daily-wellness-summary-btn"
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors shrink-0"
              title="Close summary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar inside Header */}
          <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur">
              <span className="text-[11px] font-semibold text-teal-100 block uppercase tracking-wider">
                {language === 'ar' ? 'حالة الاطمئنان' : 'Care Triage'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${triageInfo.dot}`}></span>
                {summary.statusLabel}
              </span>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur">
              <span className="text-[11px] font-semibold text-teal-100 block uppercase tracking-wider">
                {language === 'ar' ? 'الالتزام بالأدوية' : 'Med Adherence'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <Pill className="w-4 h-4 text-teal-200" />
                {summary.medicationSummary.takenCount}/{summary.medicationSummary.totalCount} ({summary.medicationSummary.compliancePercentage}%)
              </span>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur">
              <span className="text-[11px] font-semibold text-teal-100 block uppercase tracking-wider">
                {language === 'ar' ? 'المزاج والنوم' : 'Mood & Sleep'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <Smile className="w-4 h-4 text-amber-300" />
                {summary.checkinSummary.moodScore ? `${summary.checkinSummary.moodScore}/10` : '8.5/10'} • {summary.checkinSummary.sleepHours || 7}h
              </span>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur">
              <span className="text-[11px] font-semibold text-teal-100 block uppercase tracking-wider">
                {language === 'ar' ? 'العبء المعرفي (ACB)' : 'Cognitive Burden'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <AlertTriangle className={`w-4 h-4 ${totalAcbScore >= 3 ? 'text-amber-300' : 'text-teal-200'}`} />
                Score: {totalAcbScore} {totalAcbScore >= 3 ? '⚠️' : '✓'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(92vh-280px)]">

          {/* 1. Senior Check-in Notes & Voice Highlights */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? 'ملاحظات الاطمئنان وكلام الوالدة' : 'Senior Voice Check-in & Spoken Words'}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {summary.checkinSummary.timestamp 
                      ? `${language === 'ar' ? 'تم التسجيل في:' : 'Recorded at:'} ${summary.checkinSummary.timestamp}`
                      : (language === 'ar' ? 'فحص الصباح مكتمل' : 'Morning Check-in')}
                  </span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${triageInfo.bg}`}>
                {triageInfo.label}
              </span>
            </div>

            {summary.checkinSummary.transcript && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-xs">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-1">
                  {language === 'ar' ? 'النص الصوتي المفرغ من الوالدة:' : 'Verbatim Voice Transcript:'}
                </span>
                <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
                  "{summary.checkinSummary.transcript}"
                </p>
              </div>
            )}

            {/* Extracted Clinical & Emotional Observations */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === 'ar' ? 'الملاحظات المستخلصة بالذكاء الاصطناعي:' : 'Key Clinical & Emotional Observations:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {summary.checkinSummary.keyObservations.length > 0 ? (
                  summary.checkinSummary.keyObservations.map((obs, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span>{obs}</span>
                    </div>
                  ))
                ) : (
                  summary.actionableInsights.map((insight, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span>{insight}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 2. Medication Adherence Breakdown with Pill Photos */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? 'سجل الالتزام بالأدوية اليومية ومؤشر الأمان' : 'Daily Medication Adherence & Memory Safety'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {summary.medicationSummary.takenCount} {language === 'ar' ? 'من' : 'of'} {summary.medicationSummary.totalCount} {language === 'ar' ? 'جرعات مؤكدة' : 'doses taken'} ({summary.medicationSummary.compliancePercentage}%)
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full sm:w-48 space-y-1">
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${summary.medicationSummary.compliancePercentage}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block text-right">
                  {summary.medicationSummary.compliancePercentage}% {language === 'ar' ? 'مكتمل' : 'Adherence Rate'}
                </span>
              </div>
            </div>

            {/* List of Medications with Photos & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {medications.map((med) => {
                const isTaken = med.isTakenToday;
                return (
                  <div
                    key={med.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isTaken
                        ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/80 shadow-xs'
                        : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Photo Thumbnail */}
                      {med.imageUrl ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs">
                          <img
                            src={med.imageUrl}
                            alt={med.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center shrink-0 text-teal-600">
                          <Pill className="w-5 h-5" />
                        </div>
                      )}

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {med.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            {med.dosage}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {med.frequency}
                        </p>
                        {med.acbScore > 0 && (
                          <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold">
                            ACB +{med.acbScore}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isTaken ? (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'تم الأخذ' : 'Taken'}</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-1 rounded-xl bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-bold">
                            {language === 'ar' ? 'متبقي' : 'Pending'}
                          </span>
                          {onTriggerMedicationReminder && (
                            <button
                              type="button"
                              onClick={() => onTriggerMedicationReminder(med)}
                              className="px-2 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-transform active:scale-95 flex items-center gap-1"
                              title="Send reminder to senior"
                            >
                              <Send className="w-3 h-3" />
                              <span>{language === 'ar' ? 'تذكير' : 'Remind'}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACB Clinical Alert Note */}
            {totalAcbScore >= 3 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-900 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {language === 'ar' ? 'تنبيه العبء المعرفي للأدوية (ACB ≥ 3):' : 'Anticholinergic Cognitive Burden Warning (ACB ≥ 3):'}
                  </span>
                  <span>
                    {language === 'ar' 
                      ? 'مجموع العبء المعرفي للأدوية يبلغ 4 درجات. يُنصح بمناقشة البدائل الآمنة مع الدكتور طارق لتقليل الإجهاد والنعاس الصباحي.' 
                      : 'Total cognitive burden is 4. Consider sharing the Doctor Brief 2.0 with Dr. Tariq to explore safer alternatives for Amitriptyline & Chlorpheniramine.'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Actionable Caregiver Guidance for Today */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {language === 'ar' ? 'إرشادات وتوصيات فريق الرعاية لليوم' : 'Care Circle Action Items & Recommendations'}
              </h3>
            </div>

            <div className="space-y-2">
              {summary.caregiverRecommendations.map((rec, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Auto-show preference */}
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              id="checkbox-auto-show-daily-summary"
              checked={autoShow}
              onChange={(e) => handleToggleAutoShow(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
            />
            <span>{language === 'ar' ? 'عرض هذا الملخص تلقائياً عند تسجيل الدخول' : 'Show this Daily Summary upon login'}</span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            {/* TTS Listen Button */}
            <button
              type="button"
              id="listen-daily-summary-btn"
              onClick={handleSpeak}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              title="Listen to summary"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-teal-600" />}
              <span>{isSpeaking ? (language === 'ar' ? 'إيقاف الصوت' : 'Stop') : (language === 'ar' ? 'استماع صوتي' : 'Listen')}</span>
            </button>

            {/* Share / Copy Summary */}
            <button
              type="button"
              id="copy-daily-summary-btn"
              onClick={handleCopy}
              className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs"
              title="Copy formatted summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'مشاركة الملخص' : 'Share Summary')}</span>
            </button>

            {/* Acknowledge Button */}
            <button
              type="button"
              id="acknowledge-daily-summary-btn"
              onClick={() => {
                handleAcknowledge();
                setTimeout(() => onClose(), 600);
              }}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 ${
                acknowledged
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>
                {acknowledged
                  ? (language === 'ar' ? 'تم الاطلاع والاعتماد ✓' : 'Reviewed & Acknowledged ✓')
                  : (language === 'ar' ? 'تأكيد الاطلاع والإغلاق' : 'Acknowledge & Close')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

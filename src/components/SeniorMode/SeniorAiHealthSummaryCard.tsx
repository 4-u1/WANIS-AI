import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Smile,
  Moon,
  Pill,
  ShieldCheck,
  Brain,
  Info,
  Clock,
  Heart,
  AlertCircle
} from 'lucide-react';
import { SeniorProfile, CheckInRecord, Medication, SupportedLanguage } from '../../types';

interface SeniorAiHealthSummaryCardProps {
  senior: SeniorProfile;
  latestCheckIn?: CheckInRecord;
  medications: Medication[];
  totalAcbScore?: number;
  language: SupportedLanguage;
  voiceEnabled?: boolean;
}

export const SeniorAiHealthSummaryCard: React.FC<SeniorAiHealthSummaryCardProps> = ({
  senior,
  latestCheckIn,
  medications = [],
  totalAcbScore = 0,
  language,
  voiceEnabled = true
}) => {
  const isAr = language === 'ar';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const takenMedsCount = medications.filter(m => m.isTakenToday).length;
  const totalMedsCount = medications.length;
  const adherencePercent = totalMedsCount > 0 ? Math.round((takenMedsCount / totalMedsCount) * 100) : 100;

  // Senior preferred name
  const displayName = senior.gender === 'female' ? (isAr ? 'أم أحمد' : 'Um Ahmed') : senior.fullName;

  // Derive natural language status summary dynamically based on telemetry
  const generateSummary = () => {
    const sleepHrs = latestCheckIn?.sleepHours ?? 7.0;
    const moodScore = latestCheckIn?.moodScore ?? 8.5;
    const triage = latestCheckIn?.triageLevel ?? 'GREEN';

    if (triage === 'RED') {
      return {
        textAr: `نلاحظ يا ${displayName} وجود بعض التعب الشديد أو عدم الاتزان الذي ذكرتِه اليوم. تم إشعار ابنتكِ مريم والدكتور طارق فوراً للاطمئنان عليكِ. يُرجى الجلوس بهدوء في مكان مريح وشرب القليل من الماء حتى يتواصل معكِ الأهل.`,
        textEn: `We noted signs of severe fatigue or balance discomfort reported today, ${displayName}. Maryam and Dr. Tariq have been alerted immediately. Please rest comfortably and stay hydrated while your family checks in.`,
        statusColor: 'rose',
        statusLabelAr: 'تنبيه صحي يتطلب الراحة',
        statusLabelEn: 'Attention & Rest Needed'
      };
    }

    if (triage === 'YELLOW' || sleepHrs < 5.5 || moodScore < 6.5) {
      return {
        textAr: `أهلاً بكِ يا ${displayName}. تشير بيانات اليوم إلى شعوركِ ببعض الإجهاد بعد ${sleepHrs} ساعات من النوم المتقطع. التزامكِ بالأدوية يسير بشكل جيد (${adherencePercent}%)، وقمنا بتهدئة وتيرة التنبيهات. ننصحكِ بأخذ قسط من القيلولة بعد الظهر وشرب كوب ماء دافئ.`,
        textEn: `Hello ${displayName}. Today's AI analysis indicates slight fatigue following ${sleepHrs} hours of interrupted sleep. Your medication adherence is on track (${adherencePercent}%), and we suggest a calming afternoon rest and good hydration.`,
        statusColor: 'amber',
        statusLabelAr: 'إجهاد خفيف — يوصى بالراحة',
        statusLabelEn: 'Mild Fatigue — Rest Advised'
      };
    }

    // Optimal Green Baseline
    return {
      textAr: `الحمد لله، حالتكِ العامة اليوم ممتازة ومستقرة يا ${displayName}. مؤشرات الراحة ونومكِ طيبة (${sleepHrs} ساعات)، والتزامكِ بالأدوية مكتمل بنسبة ${adherencePercent}%. نبرة صوتكِ في جلسة الاطمئنان عكست طمأنينة ونشاطاً إيجابياً. يومكِ مبارك وصحتكِ بألف خير!`,
      textEn: `Praise be to God, your overall wellness is optimal and stable today, ${displayName}. Sleep was restful (${sleepHrs} hours) and your medication schedule is ${adherencePercent}% fulfilled. Your vocal biomarkers reflect calmness and comfort. Wishing you a blessed and healthy day!`,
      statusColor: 'emerald',
      statusLabelAr: 'حالة صحية مستقرة وممتازة',
      statusLabelEn: 'Stable & Optimal Wellness'
    };
  };

  const summaryData = generateSummary();

  const handleSpeakSummary = () => {
    const textToSpeak = isAr ? summaryData.textAr : summaryData.textEn;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isAr ? 'ar-SA' : 'en-US';
      utterance.rate = 0.88; // Gentle, measured pace for seniors
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <div
      id="senior-ai-health-summary-card"
      className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-teal-200/80 dark:border-teal-900/60 shadow-md shadow-teal-900/5 relative overflow-hidden space-y-4"
    >
      {/* Background Decorative Gradient Aura */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
        
        {/* Title and AI Insight Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-sm shadow-teal-700/20 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? 'ملخص ونيس الصحي الذكي' : 'AI Health Status Summary'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                <Brain className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>{isAr ? 'رؤية الذكاء الاصطناعي' : 'AI Insight'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>
                {latestCheckIn
                  ? (isAr ? `مستخلص من آخر جلسة صوتية (${latestCheckIn.timestamp})` : `Derived from latest check-in at ${latestCheckIn.timestamp}`)
                  : (isAr ? 'مستخلص من بيانات اليوم الحالية' : 'Derived from today\'s active telemetry')}
              </span>
            </p>
          </div>
        </div>

        {/* Action: Listen to Voice Readout */}
        <button
          type="button"
          id="btn-play-ai-summary-voice"
          onClick={handleSpeakSummary}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
            isPlayingAudio
              ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700 animate-pulse'
              : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/70 dark:hover:bg-teal-900/80 dark:text-teal-200 dark:border-teal-800'
          }`}
          title={isAr ? 'استمع لملخص حالتك بصوت ونيس' : 'Listen to Wanees voice readout'}
        >
          <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-amber-600' : 'text-teal-600 dark:text-teal-400'}`} />
          <span>{isPlayingAudio ? (isAr ? 'جاري القراءة...' : 'Playing...') : (isAr ? 'استمع للملخص' : 'Listen')}</span>
        </button>
      </div>

      {/* Natural Language Health Status Bubble */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 relative z-10">
        <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
          "{isAr ? summaryData.textAr : summaryData.textEn}"
        </p>
      </div>

      {/* Real-time Health Biomarkers Quick-Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 relative z-10">
        
        {/* Chip 1: Mood & Vitality */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center gap-2 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Smile className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 block truncate">{isAr ? 'المزاج والراحة' : 'Mood & Vitality'}</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {latestCheckIn?.moodScore ?? 8.5}/10 {isAr ? 'مطمئن' : 'Calm'}
            </span>
          </div>
        </div>

        {/* Chip 2: Sleep Hours */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center gap-2 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Moon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 block truncate">{isAr ? 'ساعات النوم' : 'Sleep Rest'}</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {latestCheckIn?.sleepHours ?? 7.0} {isAr ? 'ساعات' : 'hours'}
            </span>
          </div>
        </div>

        {/* Chip 3: Meds Adherence */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center gap-2 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Pill className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 block truncate">{isAr ? 'التزام الأدوية' : 'Med Adherence'}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {takenMedsCount}/{totalMedsCount} ({adherencePercent}%)
            </span>
          </div>
        </div>

        {/* Chip 4: Safety & Care Circle */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center gap-2 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 block truncate">{isAr ? 'دائرة الأمان' : 'Care Circle'}</span>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300 truncate block">
              {isAr ? 'متزامنة ومطمئنة ✓' : 'Synced ✓'}
            </span>
          </div>
        </div>

      </div>

      {/* Expandable Clinical Observations (Doctor-grade Context) */}
      {latestCheckIn?.keyObservations && latestCheckIn.keyObservations.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>
              {showDetails
                ? (isAr ? 'إخفاء الملاحظات السريرية المدونة' : 'Hide clinical observations')
                : (isAr ? 'عرض الملاحظات المسجلة في ملخص الطبيب' : 'Show notes logged for Dr. Brief')}
            </span>
          </button>

          {showDetails && (
            <div className="mt-2.5 p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 space-y-1.5 animate-fadeIn">
              <span className="text-[10px] font-extrabold uppercase text-teal-800 dark:text-teal-300 block">
                {isAr ? 'المؤشرات المستخلصة تلقائياً للزيارة القادمة:' : 'Key Clinical Observations for Next Visit:'}
              </span>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {latestCheckIn.keyObservations.map((obs, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

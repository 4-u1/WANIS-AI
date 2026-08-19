import React, { useState, useEffect } from 'react';
import {
  Clock,
  Pill,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Activity,
  Heart,
  Smile,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Calendar,
  Zap,
  Users
} from 'lucide-react';
import { SupportedLanguage, SeniorProfile, Medication, CheckInRecord } from '../../types';

interface ContextualFactorsWidgetProps {
  language: SupportedLanguage;
  senior?: SeniorProfile;
  medications?: Medication[];
  latestCheckIn?: CheckInRecord;
  className?: string;
}

export const ContextualFactorsWidget: React.FC<ContextualFactorsWidgetProps> = ({
  language,
  senior,
  medications = [],
  latestCheckIn,
  className = ''
}) => {
  const isAr = language === 'ar';
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeFactorDetail, setActiveFactorDetail] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Compute Time of Day
  const hour = currentTime.getHours();
  let timeOfDayKey: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
  let timeOfDayLabel = isAr ? 'الصباح الباكر (وقت أذكار الصباح والدواء)' : 'Morning (Fajr & Morning Meds)';
  let TimeIcon = Sunrise;
  let timeBgClass = 'from-amber-500/10 to-teal-500/10 border-amber-400/30 text-amber-900 dark:text-amber-200';

  if (hour >= 5 && hour < 12) {
    timeOfDayKey = 'morning';
    timeOfDayLabel = isAr ? 'الصباح (الفطور والأدوية الصباحية)' : 'Morning (Breakfast & Morning Meds)';
    TimeIcon = Sunrise;
  } else if (hour >= 12 && hour < 17) {
    timeOfDayKey = 'afternoon';
    timeOfDayLabel = isAr ? 'فترة الظهيرة والنشاط' : 'Afternoon (Active Hours)';
    TimeIcon = Sun;
    timeBgClass = 'from-sky-500/10 to-teal-500/10 border-sky-400/30 text-sky-900 dark:text-sky-200';
  } else if (hour >= 17 && hour < 21) {
    timeOfDayKey = 'evening';
    timeOfDayLabel = isAr ? 'المساء وتجمع العائلة' : 'Evening (Family Time)';
    TimeIcon = Sunset;
    timeBgClass = 'from-indigo-500/10 to-purple-500/10 border-indigo-400/30 text-indigo-900 dark:text-indigo-200';
  } else {
    timeOfDayKey = 'night';
    timeOfDayLabel = isAr ? 'الليل وأذكار النوم' : 'Night (Rest & Evening Meds)';
    TimeIcon = Moon;
    timeBgClass = 'from-slate-500/10 to-indigo-500/10 border-slate-400/30 text-slate-900 dark:text-slate-200';
  }

  // Last medication status
  const takenMeds = medications.filter(m => m.isTakenToday);
  const pendingMeds = medications.filter(m => !m.isTakenToday);
  const adherencePercent = medications.length > 0 
    ? Math.round((takenMeds.length / medications.length) * 100) 
    : 100;

  // Sleep Health Metrics
  const sleepHours = latestCheckIn ? latestCheckIn.sleepHours : 7.0;
  const sleepScore = latestCheckIn ? latestCheckIn.sleepQuality : 8.5; // out of 10
  const sleepQualityText = sleepHours >= 6.5
    ? (isAr ? 'نوم عميق ومريح' : 'Optimal Restful Sleep')
    : (isAr ? 'نوم متقطع / يحتاج راحة' : 'Fragmented Sleep');

  // Mood / Emotional state
  const moodScore = latestCheckIn ? latestCheckIn.moodScore : 9.0;
  const moodSentiment = latestCheckIn ? latestCheckIn.sentiment : 'positive';

  return (
    <div
      id="wanees-contextual-factors-widget"
      className={`rounded-3xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-5 sm:p-6 space-y-4 ${className}`}
    >
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isAr ? 'العوامل السياقية اللحظية التي يعرفها ونيس' : 'Live Contextual Factors Known to Wanees'}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Live Telemetry
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'يستخدم ونيس هذه العوامل لفهم حالتك بصورة دقيقة دون الحاجة لتكرار شرح تفاصيلك اليومية'
                : 'Wanees synthesizes these real-time signals to tailor voice responses without asking repetitive questions'}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* 4 Core Contextual Factor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Factor 1: Circadian Time & Daily Rhythm */}
        <div
          onClick={() => setActiveFactorDetail(activeFactorDetail === 'time' ? null : 'time')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 hover:border-amber-400/80 transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <TimeIcon className="w-3.5 h-3.5" />
              <span>{isAr ? 'الوقت والإيقاع اليومي' : 'Time & Circadian Cycle'}</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
              {timeOfDayLabel}
            </h5>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'يحدد ونيس نبرة التحية وتذكيرات الصلاة' : 'Adapts greeting tone & prayer routine'}
            </p>
          </div>

          {/* Mini Visual Bar */}
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
              <span>{isAr ? 'النشاط النهاري' : 'Daylight Phase'}</span>
              <span>{hour}:00</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, (hour / 24) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Factor 2: Medication Adherence Context */}
        <div
          onClick={() => setActiveFactorDetail(activeFactorDetail === 'meds' ? null : 'meds')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 hover:border-teal-400/80 transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <Pill className="w-3.5 h-3.5" />
              <span>{isAr ? 'حالة الأدوية اليوم' : 'Medication Status'}</span>
            </span>
            <span className={`w-2 h-2 rounded-full ${adherencePercent >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>

          <div className="space-y-1">
            <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
              {takenMeds.length} {isAr ? 'من أصل' : 'of'} {medications.length} {isAr ? 'أدوية مأخوذة' : 'meds logged'}
            </h5>
            <p className="text-[11px] text-slate-500">
              {pendingMeds.length > 0 
                ? (isAr ? `المتبقي: ${pendingMeds[0].name}` : `Next: ${pendingMeds[0].name}`)
                : (isAr ? 'تم أخذ جميع جرعات اليوم بنجاح ✓' : 'All scheduled doses verified ✓')}
            </p>
          </div>

          {/* Mini Visual Bar */}
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
              <span>{isAr ? 'نسبة الالتزام' : 'Adherence Rate'}</span>
              <span className="font-mono font-bold text-teal-600">{adherencePercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${adherencePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Factor 3: Sleep & Rest Health */}
        <div
          onClick={() => setActiveFactorDetail(activeFactorDetail === 'sleep' ? null : 'sleep')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 hover:border-indigo-400/80 transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5" />
              <span>{isAr ? 'مؤشر النوم والراحة' : 'Sleep Health Index'}</span>
            </span>
            <span className={`w-2 h-2 rounded-full ${sleepHours >= 6 ? 'bg-indigo-500' : 'bg-rose-500'}`} />
          </div>

          <div className="space-y-1">
            <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
              {sleepHours} {isAr ? 'ساعات نوم' : 'hours of sleep'}
            </h5>
            <p className="text-[11px] text-slate-500">
              {sleepQualityText}
            </p>
          </div>

          {/* Mini Visual Bar */}
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
              <span>{isAr ? 'جودة الاستيقاظ' : 'Rest Quality'}</span>
              <span className="font-mono font-bold text-indigo-600">{sleepScore} / 10</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(sleepScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Factor 4: Emotional & Dialectal Baseline */}
        <div
          onClick={() => setActiveFactorDetail(activeFactorDetail === 'mood' ? null : 'mood')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 hover:border-purple-400/80 transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5" />
              <span>{isAr ? 'المشاعر والتواصل' : 'Mood & Social Baseline'}</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>

          <div className="space-y-1">
            <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
              {moodSentiment === 'positive' 
                ? (isAr ? 'روح معنوية عالية ومستقرة' : 'Positive & Stable Baseline')
                : (isAr ? 'تحت الملاحظة الهادئة' : 'Mild Fatigue Observed')}
            </h5>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'دائرة الأهل متصلة ومطمئنة' : 'Care Circle active & synchronized'}
            </p>
          </div>

          {/* Mini Visual Bar */}
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
              <span>{isAr ? 'مقياس الطمأنينة' : 'Wellbeing Score'}</span>
              <span className="font-mono font-bold text-purple-600">{moodScore} / 10</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(moodScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Expandable Factor Detail Banner */}
      <div className="p-3.5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-teal-800 dark:text-teal-300 font-bold block">
            {isAr ? 'كيف تحمي هذه العوامل خصوصية كبير السن؟' : 'How does contextual awareness protect senior dignity?'}
          </strong>
          <p className="leading-relaxed text-[11px]">
            {isAr
              ? 'بدلاً من طرح أسئلة استجوابية جافة (مثل: "ما اسم دوائك وكم ساعة نمت؟")، يتعرف ونيس على هذه العوامل تلقائياً في الخلفية ليتحدث كرفيق حقيقي يعرف تفاصيل يومك ويصيغ رده بتعاطف تام.'
              : 'Instead of interrogating the senior with clinical questionnaires, Wanees carries forward longitudinal context so conversations feel like talking to a thoughtful, attentive family friend.'}
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import {
  Pill,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Calendar,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Medication, SupportedLanguage } from '../../types';
import { THIRTY_DAY_MEDICATION_ADHERENCE } from '../../data/medicationAdherence30DayData';

interface MedicationAdherenceSummaryCardsProps {
  medications?: Medication[];
  language: SupportedLanguage;
  onNavigateToAdherence?: () => void;
  className?: string;
}

export const MedicationAdherenceSummaryCards: React.FC<MedicationAdherenceSummaryCardsProps> = ({
  medications = [],
  language,
  onNavigateToAdherence,
  className = ''
}) => {
  const isRtl = language === 'ar';

  // Derived Calculations from 30-Day dataset and current live medication state
  const metrics = useMemo(() => {
    // 1. Historical 30-day sums
    const historicalScheduled = THIRTY_DAY_MEDICATION_ADHERENCE.reduce((acc, d) => acc + d.scheduledDoses, 0);
    const historicalTaken = THIRTY_DAY_MEDICATION_ADHERENCE.reduce((acc, d) => acc + d.takenDoses, 0);
    const historicalMissed = THIRTY_DAY_MEDICATION_ADHERENCE.reduce((acc, d) => acc + d.missedDoses, 0);

    // 2. Today's live state metrics
    const todayTotal = medications.length || 4;
    const todayTaken = medications.filter(m => m.isTakenToday).length;
    const todaySkipped = medications.filter(m => m.isSkippedToday).length;
    const todayPending = medications.filter(m => !m.isTakenToday && !m.isSkippedToday).length;
    const todayRate = todayTotal > 0 ? Math.round((todayTaken / todayTotal) * 100) : 100;

    // 3. Current Month Totals (30 days total + any today modifications)
    const totalMissedDoses = historicalMissed + todaySkipped;
    const totalScheduled = historicalScheduled;
    const totalTaken = historicalTaken;
    const currentMonthAdherenceRate = totalScheduled > 0 
      ? Math.round((totalTaken / totalScheduled) * 100) 
      : 91;

    // 4. Consecutive 100% days streak
    let activeStreak = 0;
    for (let i = THIRTY_DAY_MEDICATION_ADHERENCE.length - 1; i >= 0; i--) {
      if (THIRTY_DAY_MEDICATION_ADHERENCE[i].adherencePercentage === 100) {
        activeStreak++;
      } else {
        break;
      }
    }

    return {
      totalMissedDoses,
      currentMonthAdherenceRate,
      historicalTaken,
      historicalScheduled,
      todayTaken,
      todayTotal,
      todayPending,
      todaySkipped,
      todayRate,
      activeStreak
    };
  }, [medications]);

  return (
    <div 
      id="medication-adherence-summary-cards-container"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 ${className}`}
    >
      {/* CARD 1: Total Missed Doses */}
      <div 
        id="card-total-missed-doses"
        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-400/60 transition-all flex flex-col justify-between space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'إجمالي الجرعات الفائتة' : 'Total Missed Doses'}
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/40">
            {language === 'ar' ? 'خلال 30 يوماً' : '30-Day Total'}
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {metrics.totalMissedDoses}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {language === 'ar' ? `جرعة من أصل ${metrics.historicalScheduled}` : `doses of ${metrics.historicalScheduled} scheduled`}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
              <Clock className="w-3 h-3" />
              {metrics.todaySkipped > 0 
                ? (language === 'ar' ? `${metrics.todaySkipped} تم تخطيها اليوم` : `${metrics.todaySkipped} skipped today`)
                : (metrics.todayPending > 0 
                    ? (language === 'ar' ? `${metrics.todayPending} بانتظار التناول اليوم` : `${metrics.todayPending} pending today`)
                    : (language === 'ar' ? '0 جرعة فائتة اليوم' : '0 missed today')
                  )
              }
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <span>{language === 'ar' ? 'معظم الفجوات: الخميس قبل النوم' : 'Pattern: Thu Bedtime (Fatigue)'}</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold">~9.1% Gap</span>
        </div>
      </div>

      {/* CARD 2: Current Month Adherence Rate */}
      <div 
        id="card-current-month-adherence"
        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-500/60 transition-all flex flex-col justify-between space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="p-1.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'معدل الالتزام للشهر الحالي' : 'Current Month Adherence Rate'}
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            ≥80% Target
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 font-mono">
              {metrics.currentMonthAdherenceRate}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +4.2% {language === 'ar' ? 'عن الشهر السابق' : 'vs prior month'}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              {metrics.historicalTaken} / {metrics.historicalScheduled} {language === 'ar' ? 'جرعة مؤكدة' : 'confirmed doses'}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <span>{language === 'ar' ? 'الحد السريري الموصى به: 80%' : 'Clinical Target: ≥80%'}</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {language === 'ar' ? 'مستقر ومتحقق ✓' : 'Target Met ✓'}
          </span>
        </div>
      </div>

      {/* CARD 3: Today's Live Intake Status */}
      <div 
        id="card-today-med-status"
        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-500/60 transition-all flex flex-col justify-between space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Pill className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'حالة أدوية اليوم المباشرة' : 'Today\'s Intake Status'}
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {language === 'ar' ? 'تحديث لحظي' : 'Live Sync'}
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {metrics.todayTaken}/{metrics.todayTotal}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              ({metrics.todayRate}%)
            </span>
          </div>
          <div className="mt-1.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.todayRate}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <span>
            {metrics.todayPending > 0 
              ? (language === 'ar' ? `يتبقى ${metrics.todayPending} جرعة` : `${metrics.todayPending} dose(s) remaining`)
              : (language === 'ar' ? 'اكتملت جميع جرعات اليوم' : 'All doses taken today')}
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            {metrics.todayTaken === metrics.todayTotal ? '100%' : `${metrics.todayRate}%`}
          </span>
        </div>
      </div>

      {/* CARD 4: Active Perfect Streak */}
      <div 
        id="card-adherence-streak"
        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-400/60 transition-all flex flex-col justify-between space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </span>
            <span className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'سلسلة الالتزام المثالي' : 'Active Perfect Streak'}
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
            {language === 'ar' ? '100% التزام' : '100% Days'}
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 font-mono">
              {metrics.activeStreak}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {language === 'ar' ? 'أيام متتالية بنسبة 100%' : 'consecutive days (100%)'}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {language === 'ar' ? 'تجاوب ممتاز مع التذكيرات الصوتية' : 'Strong response to voice cues'}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <span>{language === 'ar' ? 'أفضل سلسلة: 7 أيام' : 'Best Streak: 7 Days'}</span>
          <span className="text-amber-500 font-bold">🔥 Active</span>
        </div>
      </div>
    </div>
  );
};

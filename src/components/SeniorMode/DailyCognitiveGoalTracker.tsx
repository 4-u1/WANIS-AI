import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Sparkles,
  CheckCircle2,
  Calendar,
  Volume2,
  Heart,
  Star,
  Flame,
  PartyPopper,
  Smile
} from 'lucide-react';
import { SupportedLanguage, CheckInRecord, SeniorProfile } from '../../types';

interface DailyCognitiveGoalTrackerProps {
  language: SupportedLanguage;
  senior: SeniorProfile;
  latestCheckIn?: CheckInRecord;
  onOpenCheckinModal?: () => void;
  className?: string;
}

export const DailyCognitiveGoalTracker: React.FC<DailyCognitiveGoalTrackerProps> = ({
  language,
  senior,
  latestCheckIn,
  onOpenCheckinModal,
  className = ''
}) => {
  const isAr = language === 'ar';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [celebrated, setCelebrated] = useState(true);

  // Preferred senior name
  const displayName = senior.gender === 'female' ? (isAr ? 'أم أحمد' : 'Um Ahmed') : senior.fullName;

  // 3-Day check-in history state (simulated default is 3/3 completed for consistent reward state)
  const isTodayCompleted = Boolean(latestCheckIn);
  const streakDays = isTodayCompleted ? 3 : 2;
  const isGoalAchieved = streakDays >= 3;

  const handlePlayAudioEncouragement = () => {
    const textAr = `ما شاء الله تبارك الله يا ${displayName}! إنجاز رائع ومبارك. أتممتِ جلسات الاطمئنان الصباحي لثلاثة أيام متتالية بهمة ونشاط. حفظكِ الله وأدام عليكِ الصحة والسكينة.`;
    const textEn = `Congratulations dear ${displayName}! You have achieved your 3-day voice check-in consistency milestone. Wishing you continuous vitality and peaceful wellbeing.`;
    const textToSpeak = isAr ? textAr : textEn;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isAr ? 'ar-SA' : 'en-US';
      utterance.rate = 0.88;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2500);
    }
  };

  return (
    <div
      id="daily-cognitive-goal-tracker"
      className={`rounded-3xl p-5 sm:p-6 transition-all relative overflow-hidden border shadow-sm ${
        isGoalAchieved
          ? 'bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-teal-500/15 border-amber-300 dark:border-amber-700/60 dark:bg-slate-900'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      } ${className}`}
    >
      {/* Background Decorative Starburst */}
      {isGoalAchieved && (
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
            isGoalAchieved
              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 shadow-amber-500/30'
              : 'bg-teal-50 dark:bg-teal-950 text-teal-600'
          }`}>
            {isGoalAchieved ? (
              <Trophy className="w-6 h-6 animate-bounce" />
            ) : (
              <Award className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? 'هدف الطمأنينة والنشاط الذهني' : 'Daily Cognitive Goal Tracker'}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
                isGoalAchieved
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                  : 'bg-teal-100 text-teal-800'
              }`}>
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{streakDays} / 3 {isAr ? 'أيام متتالية' : 'Days Streak'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? 'استمرار جلسات الاطمئنان الصوتي لـ 3 أيام يعزز دقة المؤشرات السريرية وصحة الذاكرة'
                : '3-day voice check-in consistency refines cognitive baseline accuracy and wellness tracking'}
            </p>
          </div>
        </div>

        {/* Listen to Voice Encouragement */}
        {isGoalAchieved && (
          <button
            type="button"
            id="btn-play-goal-encouragement"
            onClick={handlePlayAudioEncouragement}
            className={`self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border shadow-xs cursor-pointer active:scale-95 ${
              isPlayingAudio
                ? 'bg-amber-400 text-amber-950 border-amber-500 animate-pulse'
                : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-amber-200 dark:border-amber-700'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{isPlayingAudio ? (isAr ? 'يتم التحدث...' : 'Playing...') : (isAr ? 'استمع للتهنئة' : 'Listen')}</span>
          </button>
        )}
      </div>

      {/* 3-Day Stepper Timeline */}
      <div className="grid grid-cols-3 gap-3 my-4 relative z-10">
        
        {/* Day 1 */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-850 border border-emerald-200 dark:border-emerald-900/60 flex flex-col items-center text-center shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
            {isAr ? 'اليوم الأول' : 'Day 1'}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {isAr ? 'مكتمل ✓' : 'Completed ✓'}
          </span>
        </div>

        {/* Day 2 */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-850 border border-emerald-200 dark:border-emerald-900/60 flex flex-col items-center text-center shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
            {isAr ? 'اليوم الثاني' : 'Day 2'}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {isAr ? 'مكتمل ✓' : 'Completed ✓'}
          </span>
        </div>

        {/* Day 3 (Milestone Goal) */}
        <div className={`p-3 rounded-2xl border flex flex-col items-center text-center shadow-2xs transition-all ${
          isGoalAchieved
            ? 'bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-950/70 dark:to-slate-850 border-amber-300 dark:border-amber-700'
            : 'bg-white dark:bg-slate-850 border-dashed border-slate-300 dark:border-slate-700'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
            isGoalAchieved
              ? 'bg-amber-400 text-amber-950 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}>
            {isGoalAchieved ? <Star className="w-5 h-5 fill-amber-950" /> : <Calendar className="w-4 h-4" />}
          </div>
          <span className="text-[11px] font-extrabold text-slate-900 dark:text-white">
            {isAr ? 'اليوم الثالث' : 'Day 3 (Goal)'}
          </span>
          <span className={`text-[10px] font-bold ${
            isGoalAchieved ? 'text-amber-700 dark:text-amber-300' : 'text-slate-400'
          }`}>
            {isGoalAchieved ? (isAr ? 'تم الإنجاز 🌟' : 'Achieved 🌟') : (isAr ? 'في انتظارك' : 'Pending')}
          </span>
        </div>

      </div>

      {/* Rewarding Congratulatory Message & Positive Iconography */}
      {isGoalAchieved ? (
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-850/90 border border-amber-200 dark:border-amber-900/60 flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-400 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-6 h-6 text-amber-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-900 dark:text-amber-300">
                {isAr ? 'وسام الحيوية والطمأنينة الذهبية 🏅' : 'Golden Vitality & Serenity Badge 🏅'}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
              {isAr
                ? `ما شاء الله يا ${displayName}! أتممتِ جلسات الاطمئنان لـ 3 أيام متتالية بهمة ونشاط. بارك الله في صحتك.`
                : `Masha'Allah ${displayName}! You completed voice check-ins for 3 consecutive days with great consistency.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
              {isAr ? 'أجري جلسة صوتية اليوم لإكمال وسام الـ 3 أيام!' : 'Complete today\'s check-in to unlock your 3-day badge!'}
            </span>
          </div>
          {onOpenCheckinModal && (
            <button
              type="button"
              onClick={onOpenCheckinModal}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
            >
              {isAr ? 'ابدأ الآن' : 'Start Check-in'}
            </button>
          )}
        </div>
      )}

    </div>
  );
};

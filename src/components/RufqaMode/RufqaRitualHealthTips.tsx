import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Heart, 
  Sun, 
  Clock, 
  ShieldAlert, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Footprints, 
  Coffee, 
  RotateCcw, 
  Play, 
  Pause, 
  Plus, 
  Zap, 
  BookOpen, 
  Thermometer, 
  Activity,
  Award,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { RitualHealthTip, SupportedLanguage, RitualIntensityLevel } from '../../types';
import { RITUAL_HEALTH_TIPS } from '../../data/rufqaHealthTipsData';
import { notificationAudio } from '../../services/notificationService';
import { speakText } from '../../services/api';

interface RufqaRitualHealthTipsProps {
  currentRitualStage?: 'TAWAF' | 'SAI' | 'MINA_REST' | 'ARAFAT_DUA' | 'MUZDALIFAH' | 'JAMARAT' | 'HOTEL_REST';
  language: SupportedLanguage;
  voiceEnabled: boolean;
}

export const RufqaRitualHealthTips: React.FC<RufqaRitualHealthTipsProps> = ({
  currentRitualStage = 'TAWAF',
  language,
  voiceEnabled
}) => {
  const isRtl = language === 'ar';

  const [selectedStage, setSelectedStage] = useState<string>(currentRitualStage);
  const [dailyHydrationMl, setDailyHydrationMl] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('rufqa_daily_hydration_ml');
      if (stored) return parseInt(stored, 10);
    } catch {
      // Fallback
    }
    return 1650;
  });
  const [hydrationNotice, setHydrationNotice] = useState<string | null>(null);

  // 10-Minute Rest Timer State
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Sync with prop changes if currentRitualStage updates
  useEffect(() => {
    if (currentRitualStage) {
      setSelectedStage(currentRitualStage);
    }
  }, [currentRitualStage]);

  // Rest Timer Interval
  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && restSecondsRemaining > 0) {
      timer = setInterval(() => {
        setRestSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (restSecondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      notificationAudio.playSuccessChime();
      if (voiceEnabled) {
        const msg = isRtl ? 'اكتمل وقت الاستراحة المباركة. تقبل الله طاعتك وأمدك بالصحة.' : 'Rest time complete. May Allah accept your rituals with vitality and peace.';
        speakText(msg, language);
      }
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, restSecondsRemaining, voiceEnabled, isRtl, language]);

  const activeTip = RITUAL_HEALTH_TIPS.find(t => t.ritualStage === selectedStage) || RITUAL_HEALTH_TIPS[0];

  const handleAddHydration = (amountMl: number) => {
    const updated = Math.min(dailyHydrationMl + amountMl, 4000);
    setDailyHydrationMl(updated);
    try {
      localStorage.setItem('rufqa_daily_hydration_ml', updated.toString());
    } catch {}

    notificationAudio.playReminderChime();
    const notice = isRtl 
      ? `💧 تم تسجيل شرب ${amountMl} مل من ماء زمزم المبارك! مجموع اليوم: ${(updated / 1000).toFixed(2)} لتر`
      : `💧 Logged ${amountMl}ml Zamzam water! Daily total: ${(updated / 1000).toFixed(2)}L`;
    setHydrationNotice(notice);
    setTimeout(() => setHydrationNotice(null), 4000);
  };

  const handleToggleTimer = () => {
    if (!isTimerRunning && restSecondsRemaining === 0) {
      setRestSecondsRemaining(activeTip.restIntervalMinutes * 60);
    }
    setIsTimerRunning(!isTimerRunning);
    notificationAudio.playReminderChime();
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setRestSecondsRemaining(activeTip.restIntervalMinutes * 60);
  };

  const handleSpeakHealthTips = () => {
    setIsSpeaking(true);
    const spokenText = isRtl ? activeTip.audioVoiceGuidanceAr : activeTip.audioVoiceGuidance;
    speakText(spokenText, language);
    setTimeout(() => setIsSpeaking(false), 5000);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getIntensityBadge = (intensity: RitualIntensityLevel) => {
    switch (intensity) {
      case 'LOW_REST':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs border border-emerald-300 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{isRtl ? 'استراحة وتعافي (شدة منخفضة)' : 'Rest & Recovery (Low)'}</span>
          </span>
        );
      case 'MODERATE_PACED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-extrabold text-xs border border-teal-300 dark:border-teal-800">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span>{isRtl ? 'نشاط بدني معتدل ومدروس' : 'Moderate Paced Ritual'}</span>
          </span>
        );
      case 'HIGH_EXERTION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-extrabold text-xs border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{isRtl ? 'مجهود بدني مرتفع (يتطلب فترات راحة)' : 'High Exertion (Rest Required)'}</span>
          </span>
        );
      case 'EXTREME_CAUTION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 font-extrabold text-xs border border-rose-300 dark:border-rose-800 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>{isRtl ? 'أقصى درجات الحذر (حرارة وتزاحم)' : 'Extreme Caution (Heat & Crowds)'}</span>
          </span>
        );
    }
  };

  const dailyGoalMl = 2500;
  const hydrationPercent = Math.min(Math.round((dailyHydrationMl / dailyGoalMl) * 100), 100);

  return (
    <div id="rufqa-ritual-health-tips-section" className="space-y-6">
      
      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-slate-800 shadow-md space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-950/80 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
              <Droplet className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isRtl ? 'الإرشادات الصحية المخصصة لمناسك الحج والعمرة' : 'Ritual-Specific Health & Hydration Protocols'}
                </h3>
                {getIntensityBadge(activeTip.intensity)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl 
                  ? 'توصيات ترطيب دقيقة وجداول راحة مصممة بحسب الموقع وشدة النسك لحماية صحة كبار السن'
                  : 'Tailored hydration targets, seated pacing intervals, and clinical concessions for pilgrimage safety'}
              </p>
            </div>
          </div>

          {/* Senior Voice Audio Guidance Button */}
          <button
            type="button"
            onClick={handleSpeakHealthTips}
            disabled={isSpeaking}
            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm shadow-amber-600/20 active:scale-95 transition-all self-start md:self-center"
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-spin' : ''}`} />
            <span>{isRtl ? 'استمع لنصيحة ونيس الصوتية' : 'Play Voice Health Guidance'}</span>
          </button>
        </div>

        {/* Ritual Stage Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {RITUAL_HEALTH_TIPS.map((tip) => {
            const isSelected = selectedStage === tip.ritualStage;
            return (
              <button
                key={tip.id}
                type="button"
                onClick={() => {
                  setSelectedStage(tip.ritualStage);
                  setRestSecondsRemaining(tip.restIntervalMinutes * 60);
                  setIsTimerRunning(false);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400/40'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{isRtl ? tip.titleAr : tip.title}</span>
              </button>
            );
          })}
        </div>

        {/* Environmental & Intensity HUD Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <Thermometer className="w-4 h-4 text-amber-500" />
              <span>{isRtl ? 'درجة الحرارة المتوقعة' : 'Ambient Temp'}</span>
            </div>
            <strong className="text-base sm:text-lg font-black text-slate-900 dark:text-white block font-mono">
              {activeTip.ambientTempC}°C
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <Droplet className="w-4 h-4 text-teal-500" />
              <span>{isRtl ? 'هدف الشرب بالساعة' : 'Hourly Water Target'}</span>
            </div>
            <strong className="text-base sm:text-lg font-black text-teal-600 dark:text-teal-400 block font-mono">
              {activeTip.hydrationTargetMlPerHour} ml / hr
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{isRtl ? 'فترة الراحة المقترحة' : 'Rest Interval'}</span>
            </div>
            <strong className="text-base sm:text-lg font-black text-slate-900 dark:text-white block font-mono">
              {isRtl ? `كل ${activeTip.restIntervalMinutes} دقيقة` : `Every ${activeTip.restIntervalMinutes} min`}
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <Footprints className="w-4 h-4 text-emerald-500" />
              <span>{isRtl ? 'الموقع والمحيط' : 'Location Zone'}</span>
            </div>
            <strong className="text-xs font-bold text-slate-900 dark:text-white block truncate">
              {isRtl ? activeTip.locationNameAr : activeTip.locationName}
            </strong>
          </div>

        </div>

        {/* INTERACTIVE HYDRATION & REST BREAK TRACKER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Hydration Tracker Card */}
          <div className="p-5 rounded-3xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
                  <Droplet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-teal-950 dark:text-teal-200">
                    {isRtl ? 'سجل شرب ماء زمزم والترطيب اليومي' : 'Zamzam & Fluid Daily Log'}
                  </h4>
                  <span className="text-[11px] text-teal-800 dark:text-teal-400">
                    {isRtl ? 'الهدف الصحي الموصى به: 2.5 لتر يومياً' : 'Recommended Daily Target: 2.5 Liters'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-teal-200 dark:bg-teal-900 text-teal-950 dark:text-teal-200">
                {hydrationPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3.5 bg-teal-200/60 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${hydrationPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-teal-900 dark:text-teal-300 font-mono font-bold">
                <span>{(dailyHydrationMl / 1000).toFixed(2)}L {isRtl ? 'تم شربها' : 'Consumed'}</span>
                <span>{(dailyGoalMl / 1000).toFixed(1)}L {isRtl ? 'الهدف' : 'Target'}</span>
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleAddHydration(250)}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? '+250 مل (كأس زمزم)' : '+250ml Zamzam Cup'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddHydration(500)}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-teal-700 hover:bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? '+500 مل (قارورة)' : '+500ml Bottle'}</span>
              </button>
            </div>

            {hydrationNotice && (
              <p className="text-xs text-teal-900 dark:text-teal-200 bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl font-bold animate-fadeIn">
                {hydrationNotice}
              </p>
            )}
          </div>

          {/* Ritual Rest Interval Timer Card */}
          <div className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-indigo-950 dark:text-indigo-200">
                    {isRtl ? 'مؤقت الاستراحة الموصى بها أثناء النسك' : 'Ritual Rest Interval Timer'}
                  </h4>
                  <span className="text-[11px] text-indigo-800 dark:text-indigo-400">
                    {isRtl ? `استراحة جلوس لمدة ${activeTip.restIntervalMinutes} دقيقة` : `${activeTip.restIntervalMinutes}-min seated rest pacing`}
                  </span>
                </div>
              </div>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full ${isTimerRunning ? 'bg-emerald-500 text-white animate-pulse' : 'bg-indigo-200 dark:bg-indigo-900 text-indigo-950 dark:text-indigo-200'}`}>
                {isTimerRunning ? (isRtl ? 'جاري التوقيت' : 'RUNNING') : (isRtl ? 'جاهز' : 'STANDBY')}
              </span>
            </div>

            {/* Big Countdown Digits */}
            <div className="flex items-center justify-center py-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-indigo-950 dark:text-indigo-200 tracking-wider">
                {formatTimer(restSecondsRemaining)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleTimer}
                className={`flex-1 py-2.5 px-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                  isTimerRunning 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? (isRtl ? 'إيقاف مؤقت' : 'Pause') : (isRtl ? 'بدء الاستراحة' : 'Start Rest Timer')}</span>
              </button>
              
              <button
                type="button"
                onClick={handleResetTimer}
                className="p-2.5 rounded-2xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold"
                title={isRtl ? 'إعادة تعيين' : 'Reset'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* DETAILED GUIDELINE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Hydration Protocols */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Droplet className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{isRtl ? 'إرشادات الترطيب الميداني' : 'Hydration Guidance'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {(isRtl ? activeTip.hydrationGuidelinesAr : activeTip.hydrationGuidelines).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rest & Pacing Protocols */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Coffee className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{isRtl ? 'إرشادات المشي والراحة الجسدية' : 'Pacing & Physical Rest'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {(isRtl ? activeTip.restGuidelinesAr : activeTip.restGuidelines).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* CLINICAL SAFEGUARDS & SHARIAH CONCESSIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Clinical Precaution Card */}
          <div className="p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{isRtl ? 'تنبيه طبي خاص بكبار السن' : 'Geriatric Clinical Precaution'}</span>
            </h4>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {isRtl ? activeTip.clinicalPrecautionAr : activeTip.clinicalPrecaution}
            </p>
            <div className="pt-2 border-t border-amber-200/80 dark:border-amber-900/60 flex items-start gap-1.5 text-[11px] text-rose-700 dark:text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
              <span>
                <strong>{isRtl ? 'علامات تستدعي التوقف فوراً: ' : 'Stop & seek aid if: '}</strong>
                {isRtl ? activeTip.emergencySignToWatchAr : activeTip.emergencySignToWatch}
              </span>
            </div>
          </div>

          {/* Shariah & Elderly Concessions (رخص الحج لكبار السن) */}
          <div className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isRtl ? 'التيسيرات والرخص الشرعية لكبار السن' : 'Elderly Shariah Concessions (Taysir)'}</span>
            </h4>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {isRtl ? activeTip.seniorConcessionAr : activeTip.seniorConcession}
            </p>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-400 italic pt-1">
              {isRtl ? '«إن الله يحب أن تؤتى رخصه كما يحب أن تؤتى عزائمه»' : 'Preserving senior vitality and health is an essential Islamic priority.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

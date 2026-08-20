import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Footprints, 
  Flame, 
  Clock, 
  Compass, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Droplets, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Volume2, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Zap, 
  Sliders, 
  HelpCircle, 
  Info, 
  Layers, 
  Wifi,
  ChevronRight,
  Sun,
  ShieldAlert
} from 'lucide-react';
import { RufqaStepActivityData, SupportedLanguage, GaitStabilityLevel } from '../../types';
import { STEP_GOAL_PRESETS, INITIAL_RUFQA_STEP_DATA, StepGoalPreset } from '../../data/rufqaStepData';
import { speakText } from '../../services/api';
import { notificationAudio } from '../../services/notificationService';

interface RufqaStepCounterProps {
  language: SupportedLanguage;
  voiceEnabled: boolean;
  pilgrimName?: string;
  initialData?: RufqaStepActivityData;
  onStepUpdate?: (data: RufqaStepActivityData) => void;
}

export const RufqaStepCounter: React.FC<RufqaStepCounterProps> = ({
  language,
  voiceEnabled,
  pilgrimName = 'فاطمة الهاشمي',
  initialData = INITIAL_RUFQA_STEP_DATA,
  onStepUpdate
}) => {
  const isAr = language === 'ar';

  const [stepData, setStepData] = useState<RufqaStepActivityData>(initialData);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('goal-standard-umrah');
  const [isAutoWalking, setIsAutoWalking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rituals' | 'sensor-lab'>('overview');
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  const onStepUpdateRef = useRef(onStepUpdate);
  onStepUpdateRef.current = onStepUpdate;
  const isFirstRender = useRef(true);

  // Sync state up if requested only on actual data mutation after mount
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (onStepUpdateRef.current) {
      onStepUpdateRef.current(stepData);
    }
  }, [stepData]);

  // Live Auto-Pedometer Stream Simulation
  useEffect(() => {
    if (!isAutoWalking) return;

    const interval = setInterval(() => {
      setStepData(prev => {
        const addedSteps = Math.floor(Math.random() * 6) + 5; // 5-10 steps per tick
        const newTotal = prev.currentSteps + addedSteps;
        const newDist = +(prev.distanceKm + (addedSteps * 0.00067)).toFixed(2);
        const newCals = Math.round(prev.caloriesBurnedKcal + (addedSteps * 0.038));
        const newHydrationSteps = prev.stepsSinceLastHydration + addedSteps;

        // Accelerometer micro fluctuation
        const newAccelX = +(0.05 + (Math.random() * 0.1)).toFixed(2);
        const newAccelY = +(0.92 + (Math.random() * 0.12)).toFixed(2);
        const newAccelZ = +(0.1 + (Math.random() * 0.08)).toFixed(2);
        const newCadence = Math.min(85, Math.max(62, prev.currentCadenceSpm + (Math.floor(Math.random() * 5) - 2)));

        return {
          ...prev,
          currentSteps: newTotal,
          distanceKm: newDist,
          caloriesBurnedKcal: newCals,
          currentCadenceSpm: newCadence,
          stepsSinceLastHydration: newHydrationSteps,
          sensorStream: {
            ...prev.sensorStream,
            accelX: newAccelX,
            accelY: newAccelY,
            accelZ: newAccelZ,
            lastSyncTimestamp: isAr ? 'الآن (مستشعر IMU نشط)' : 'Just now (Active IMU stream)'
          }
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isAutoWalking, isAr]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: StepGoalPreset) => {
    setSelectedPresetId(preset.id);
    notificationAudio.playReminderChime();
    setStepData(prev => ({
      ...prev,
      dailyStepGoal: preset.goalSteps
    }));

    const msg = isAr 
      ? `تم تعيين هدف المشي: ${preset.nameAr}`
      : `Step goal updated to: ${preset.nameEn}`;
    setRecentNotification(msg);
    setTimeout(() => setRecentNotification(null), 4000);
  };

  // Quick Manual Steps Injection
  const handleAddManualSteps = (amount: number, reasonAr: string, reasonEn: string) => {
    notificationAudio.playReminderChime();
    setStepData(prev => {
      const newTotal = prev.currentSteps + amount;
      const newDist = +(prev.distanceKm + (amount * 0.00067)).toFixed(2);
      const newCals = Math.round(prev.caloriesBurnedKcal + (amount * 0.038));
      const newActiveMins = prev.activeMinutes + Math.round(amount / 70);
      const newHydrationSteps = prev.stepsSinceLastHydration + amount;

      return {
        ...prev,
        currentSteps: newTotal,
        distanceKm: newDist,
        caloriesBurnedKcal: newCals,
        activeMinutes: newActiveMins,
        stepsSinceLastHydration: newHydrationSteps,
        sensorStream: {
          ...prev.sensorStream,
          lastSyncTimestamp: isAr ? 'الآن (تم تسجيل دفعة خطوات)' : 'Just now (Batch registered)'
        }
      };
    });

    const notif = isAr ? `تمت إضافة +${amount} خطوة (${reasonAr})` : `Added +${amount} steps (${reasonEn})`;
    setRecentNotification(notif);
    setTimeout(() => setRecentNotification(null), 3500);
  };

  // Complete a Tawaf Circuit
  const handleCompleteTawafCircuit = () => {
    notificationAudio.playReminderChime();
    setStepData(prev => {
      const currentCircuits = prev.ritualBreakdown.tawaf.circuitsDone;
      const nextCircuit = Math.min(7, currentCircuits + 1);
      const addedSteps = 320;
      const newTawafSteps = prev.ritualBreakdown.tawaf.steps + addedSteps;
      const isFinished = nextCircuit === 7;

      const updated = {
        ...prev,
        currentSteps: prev.currentSteps + addedSteps,
        distanceKm: +(prev.distanceKm + 0.22).toFixed(2),
        caloriesBurnedKcal: prev.caloriesBurnedKcal + 14,
        stepsSinceLastHydration: prev.stepsSinceLastHydration + addedSteps,
        ritualBreakdown: {
          ...prev.ritualBreakdown,
          tawaf: {
            ...prev.ritualBreakdown.tawaf,
            circuitsDone: nextCircuit,
            steps: newTawafSteps,
            status: (isFinished ? 'COMPLETED' : 'IN_PROGRESS') as 'COMPLETED' | 'IN_PROGRESS',
            lastCircuitCompletedTime: isAr ? 'الآن' : 'Just now'
          }
        }
      };

      if (isFinished && voiceEnabled) {
        const speech = isAr
          ? `ما شاء الله تبارك الله يا حاجة فاطمة! أتممتِ أشواط الطواف السبعة كاملة، تقبل الله طاعتك. يُستحب صلاة ركعتي الطواف خلف مقام إبراهيم والشرب من ماء زمزم.`
          : `Alhamdulillah! You have completed all 7 circuits of Tawaf. May Allah accept your worship. Please rest and drink Zamzam water.`;
        speakText(speech, language);
      }

      return updated;
    });

    const notif = isAr 
      ? `تم توثيق إتمام شوط من الطواف (+320 خطوة)`
      : `Tawaf circuit completed (+320 steps)`;
    setRecentNotification(notif);
    setTimeout(() => setRecentNotification(null), 4000);
  };

  // Complete a Sa'i Lap
  const handleCompleteSaiLap = () => {
    notificationAudio.playReminderChime();
    setStepData(prev => {
      const currentLaps = prev.ritualBreakdown.sai.circuitsDone;
      const nextLap = Math.min(7, currentLaps + 1);
      const addedSteps = 480;
      const newSaiSteps = prev.ritualBreakdown.sai.steps + addedSteps;
      const isFinished = nextLap === 7;

      const updated = {
        ...prev,
        currentSteps: prev.currentSteps + addedSteps,
        distanceKm: +(prev.distanceKm + 0.39).toFixed(2),
        caloriesBurnedKcal: prev.caloriesBurnedKcal + 22,
        stepsSinceLastHydration: prev.stepsSinceLastHydration + addedSteps,
        ritualBreakdown: {
          ...prev.ritualBreakdown,
          sai: {
            ...prev.ritualBreakdown.sai,
            circuitsDone: nextLap,
            steps: newSaiSteps,
            status: (isFinished ? 'COMPLETED' : 'IN_PROGRESS') as 'COMPLETED' | 'IN_PROGRESS',
            lastCircuitCompletedTime: isAr ? 'الآن' : 'Just now'
          }
        }
      };

      if (isFinished && voiceEnabled) {
        const speech = isAr
          ? `الحمد لله يا والدتنا الكريمة، اكتملت أشواط السعي السبعة بين الصفا والمروة. بارك الله في صحتك وعمرتك.`
          : `Congratulations! You have completed 7 laps of Sa'i between Safa and Marwah.`;
        speakText(speech, language);
      }

      return updated;
    });

    const notif = isAr 
      ? `تم توثيق شوط سعي بين الصفا والمروة (+480 خطوة)`
      : `Sa'i lap recorded (+480 steps)`;
    setRecentNotification(notif);
    setTimeout(() => setRecentNotification(null), 4000);
  };

  // Log Hydration Action
  const handleLogHydration = () => {
    notificationAudio.playReminderChime();
    setStepData(prev => ({
      ...prev,
      stepsSinceLastHydration: 0
    }));

    const notif = isAr ? 'تم تسجيل شرب ماء زمزم والترطيب بنجاح 💧' : 'Zamzam Hydration intake logged 💧';
    setRecentNotification(notif);
    setTimeout(() => setRecentNotification(null), 4000);

    if (voiceEnabled) {
      const speech = isAr ? 'هنيئاً مريئاً، شرب ماء زمزم شفاء وطمأنينة.' : 'Hydration logged. Stay refreshed!';
      speakText(speech, language);
    }
  };

  // Voice Readout Summary
  const handleVoiceSummary = () => {
    const progressPercent = Math.round((stepData.currentSteps / stepData.dailyStepGoal) * 100);
    const speechAr = `تقرير نشاطكِ اليومي في المشاعر المقدسة يا ${pilgrimName}: قطعتِ ${stepData.currentSteps.toLocaleString('ar-SA')} خطوة من أصل ${stepData.dailyStepGoal.toLocaleString('ar-SA')}، بنسبة إنجاز ${progressPercent}%. المسافة المقطوعة ${stepData.distanceKm} كيلومتر. أتممتِ ${stepData.ritualBreakdown.tawaf.circuitsDone} أشواط من الطواف. إيقاع مشيتكِ هادئ ومستقر عند ${stepData.currentCadenceSpm} خطوة في الدقيقة. حفظكِ الله ويسر مناسككِ.`;
    const speechEn = `Pilgrim activity summary for ${pilgrimName}: You have walked ${stepData.currentSteps} steps of your ${stepData.dailyStepGoal} goal, reaching ${progressPercent}%. Total distance is ${stepData.distanceKm} kilometers with ${stepData.ritualBreakdown.tawaf.circuitsDone} circuits of Tawaf completed. Gait stability is normal.`;
    speakText(isAr ? speechAr : speechEn, language);
  };

  // Calculations
  const progressPercent = Math.min(100, Math.round((stepData.currentSteps / stepData.dailyStepGoal) * 100));
  const remainingSteps = Math.max(0, stepData.dailyStepGoal - stepData.currentSteps);
  const isHydrationDue = stepData.stepsSinceLastHydration >= stepData.hydrationAlertIntervalSteps;

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div id="rufqa-step-counter-widget" className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      
      {/* Top Header & Sensor Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isAr ? 'حساب الخطوات والنشاط الحركي في المناسك' : 'Hajj & Umrah Step Counter & Activity Engine'}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {isAr ? 'مستشعر الحركة IMU متصل' : 'IMU Pedometer Live'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isAr 
                ? 'تتبع دقيق لأشواط الطواف والسعي ومسارات المشاعر مع حماية صحية من الإجهاد الحراري'
                : 'Tracks Tawaf circuits, Sa\'i laps, and sacred sites exertion with heat guardrails'}
            </p>
          </div>
        </div>

        {/* Action Controls: Voice Summary & Auto Walking toggle */}
        <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
          <button
            type="button"
            id="btn-voice-step-summary"
            onClick={handleVoiceSummary}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
            title={isAr ? 'استماع لملخص النشاط الصوتي' : 'Listen to Spoken Step Summary'}
          >
            <Volume2 className="w-4 h-4 text-amber-500" />
            <span>{isAr ? 'قراءة صوتية' : 'Voice Readout'}</span>
          </button>

          <button
            type="button"
            id="btn-toggle-auto-walk"
            onClick={() => setIsAutoWalking(!isAutoWalking)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all active:scale-95 shadow-sm ${
              isAutoWalking
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white'
            }`}
            title={isAr ? 'تشغيل أو إيقاف محاكاة تدفق الحساس المباشر' : 'Toggle live pedometer simulation stream'}
          >
            {isAutoWalking ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{isAr ? 'إيقاف المحاكاة' : 'Pause Stream'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{isAr ? 'محاكاة المشي الحي' : 'Auto Stream'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ephemeral Notification Toast */}
      {recentNotification && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{recentNotification}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          id="tab-step-overview"
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'overview'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'نظرة عامة والهدف' : 'Overview & Goal'}</span>
        </button>

        <button
          type="button"
          id="tab-step-rituals"
          onClick={() => setActiveTab('rituals')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'rituals'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 text-teal-400" />
          <span>{isAr ? 'أشواط الطواف والسعي' : 'Tawaf & Sa\'i Rituals'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 font-black">
            {stepData.ritualBreakdown.tawaf.circuitsDone}/7
          </span>
        </button>

        <button
          type="button"
          id="tab-step-sensor-lab"
          onClick={() => setActiveTab('sensor-lab')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'sensor-lab'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>{isAr ? 'مختبر الحساس والتسارع IMU' : 'IMU Sensor Lab'}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & GOAL */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main Progress Ring & KPIs Bento */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Circular Gauge Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/10 via-teal-500/5 to-slate-100/50 dark:from-slate-800/80 dark:to-slate-900 rounded-3xl p-6 border border-amber-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  {/* Background Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* Progress Arc */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="text-amber-500 transition-all duration-500 ease-out"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                {/* Inner Stat Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stepData.currentSteps.toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr ? 'خطوة اليوم' : 'Steps Today'}
                  </span>
                  <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-xs">
                    {progressPercent}% {isAr ? 'مكتمل' : 'Done'}
                  </span>
                </div>
              </div>

              <div className="mt-4 w-full flex items-center justify-between text-xs px-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                <span>{isAr ? 'الهدف اليومي:' : 'Daily Goal:'} <strong>{stepData.dailyStepGoal.toLocaleString()}</strong></span>
                <span>{isAr ? 'المتبقي:' : 'Remaining:'} <strong className="text-amber-600 dark:text-amber-400">{remainingSteps.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* 4 Essential Metric Cards */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-3.5">
              
              {/* Distance */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
                  <Compass className="w-5 h-5" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {isAr ? 'المسافة' : 'Distance'}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stepData.distanceKm} <span className="text-xs font-bold text-slate-400">{isAr ? 'كم' : 'km'}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAr ? 'يشمل مسار صحن المطاف والممر' : 'Mataf floor & courtyard transit'}
                </p>
              </div>

              {/* Active Time */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                  <Clock className="w-5 h-5" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {isAr ? 'وقت الحركة' : 'Active Time'}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stepData.activeMinutes} <span className="text-xs font-bold text-slate-400">{isAr ? 'دقيقة' : 'mins'}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAr ? 'مشية مريحة مع توقفات' : 'Moderate pacing with pauses'}
                </p>
              </div>

              {/* Cadence / Pacing */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                  <Activity className="w-5 h-5" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {isAr ? 'معدل الخطوات' : 'Cadence (SPM)'}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{stepData.currentCadenceSpm}</span>
                  <span className="text-xs font-bold text-slate-400">{isAr ? 'خطوة/د' : 'spm'}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إيقاع هادئ آمن للمسن' : 'Safe Senior Pace'}</span>
                </div>
              </div>

              {/* Calories */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                  <Flame className="w-5 h-5" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {isAr ? 'السعرات' : 'Energy Burn'}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stepData.caloriesBurnedKcal} <span className="text-xs font-bold text-slate-400">{isAr ? 'سعرة' : 'kcal'}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAr ? 'معدل استهلاك طاقة صحي' : 'Healthy low-glycemic burn'}
                </p>
              </div>

            </div>

          </div>

          {/* Goal Selector Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>{isAr ? 'أهداف النشاط البدني الموصى بها في الحج والعمرة' : 'Recommended Hajj & Umrah Step Targets'}</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {isAr ? 'مخصصة لكبار السن' : 'Geriatric-Optimized'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {STEP_GOAL_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-4 rounded-2xl border text-left rtl:text-right transition-all flex flex-col justify-between space-y-2 cursor-pointer active:scale-98 ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-950 dark:text-amber-200 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs sm:text-sm">
                        {isAr ? preset.nameAr : preset.nameEn}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {isAr ? preset.descriptionAr : preset.descriptionEn}
                    </p>
                    <div className="pt-1 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>{isAr ? 'الهدف:' : 'Goal:'} <strong>{preset.goalSteps.toLocaleString()}</strong></span>
                      <span className="uppercase text-amber-600 dark:text-amber-400">{preset.intensity}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hydration & Heat Safety Card */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
            isHydrationDue
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-950 dark:text-amber-200'
              : 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-950 dark:text-teal-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isHydrationDue ? 'bg-amber-500 text-white animate-bounce' : 'bg-teal-600 text-white'
              }`}>
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm">
                  {isAr ? 'تنبيه ترطيب ماء زمزم الذكي لكبار السن' : 'Smart Zamzam Hydration Alert'}
                </h4>
                <p className="text-[11px] mt-0.5 leading-relaxed text-slate-600 dark:text-slate-300">
                  {isAr 
                    ? `سارت الوالدة ${stepData.stepsSinceLastHydration} خطوة منذ آخر توثيق شرب ماء. يُوصى بتناول 250 مل من ماء زمزم كل 1,500 خطوة لتجنب هبوط الضغط.`
                    : `Senior walked ${stepData.stepsSinceLastHydration} steps since last hydration log. Recommend drinking 250ml Zamzam every 1,500 steps.`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogHydration}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95 cursor-pointer"
            >
              <Droplets className="w-4 h-4" />
              <span>{isAr ? 'توثيق شرب ماء زمزم 💧' : 'Log Zamzam Drink 💧'}</span>
            </button>
          </div>

          {/* Hourly Activity Bar Chart */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>{isAr ? 'توزيع خطوات اليوم على أوقات الصلوات والمناسك' : 'Hourly Step Distribution by Prayer Times'}</span>
              </h4>
              <span className="text-[10px] text-slate-400">
                {isAr ? 'ذروة النشاط: طواف الصباح' : 'Peak: Morning Tawaf'}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end pt-4 h-36">
              {stepData.hourlyDistribution.map((item, idx) => {
                const maxSteps = 2200;
                const barHeight = Math.max(8, Math.round((item.steps / maxSteps) * 100));
                const isPeak = item.steps > 1500;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-amber-500 transition-colors">
                      {item.steps > 0 ? item.steps : '-'}
                    </span>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-lg h-24 flex items-end overflow-hidden p-0.5">
                      <div
                        style={{ height: `${barHeight}%` }}
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isPeak 
                            ? 'bg-gradient-to-t from-amber-500 to-amber-400' 
                            : item.steps > 0 
                              ? 'bg-teal-500' 
                              : 'bg-transparent'
                        }`}
                        title={`${item.hour} - ${item.steps} steps (${item.ritualStageAr || ''})`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {isAr ? item.labelAr : item.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: RITUALS (TAWAF & SA'I) */}
      {activeTab === 'rituals' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Tawaf Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl space-y-5 border border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg">
                      {isAr ? 'طواف الكعبة المشرفة (7 أشواط)' : 'Holy Kaaba Tawaf (7 Circuits)'}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      stepData.ritualBreakdown.tawaf.status === 'COMPLETED'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                    }`}>
                      {stepData.ritualBreakdown.tawaf.status === 'COMPLETED' ? (isAr ? 'مكتمل' : 'Completed') : (isAr ? 'جاري الآن' : 'In Progress')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {isAr 
                      ? 'معدل الشوط الواحد ~320 خطوة لكبار السن (حوالي 200 متر في الصحن)'
                      : 'Approx 320 steps per circuit for seniors in the ground Mataf'}
                  </p>
                </div>
              </div>

              {/* Add Circuit Action */}
              <button
                type="button"
                id="btn-add-tawaf-circuit"
                onClick={handleCompleteTawafCircuit}
                disabled={stepData.ritualBreakdown.tawaf.circuitsDone >= 7}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? '+ إتمام شوط طواف (+320 خطوة)' : '+ Complete Circuit (+320 steps)'}</span>
              </button>
            </div>

            {/* 7 Visual Circuits Stepper */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((circuitNum) => {
                const isDone = circuitNum <= stepData.ritualBreakdown.tawaf.circuitsDone;
                const isCurrent = circuitNum === stepData.ritualBreakdown.tawaf.circuitsDone + 1;
                return (
                  <div
                    key={circuitNum}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                      isDone
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                        : isCurrent
                          ? 'bg-white/10 border-white/40 text-white animate-pulse'
                          : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">{isAr ? 'شوط' : 'Shawt'}</span>
                    <strong className="text-lg font-black my-0.5">{circuitNum}</strong>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] text-slate-400">~320</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tawaf Progress Stats */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span>{isAr ? 'الخطوات المنجزة بالطواف:' : 'Tawaf Steps:'} <strong className="text-amber-300 font-bold">{stepData.ritualBreakdown.tawaf.steps}</strong></span>
                <span>{isAr ? 'الأشواط:' : 'Circuits:'} <strong className="text-white font-bold">{stepData.ritualBreakdown.tawaf.circuitsDone} / 7</strong></span>
              </div>
              <span className="text-slate-300 text-[11px]">
                {isAr ? 'المتبقي: ركعتا الطواف عند الإتمام' : 'Sunnah: 2 Rak\'ahs behind Maqam Ibrahim upon completion'}
              </span>
            </div>
          </div>

          {/* Sa'i Card */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
                  <Footprints className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                      {isAr ? 'السعي بين الصفا والمروة (7 أشواط)' : 'Sa\'i Between Safa & Marwah (7 Laps)'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
                      {stepData.ritualBreakdown.sai.circuitsDone}/7 {isAr ? 'أشواط' : 'Laps'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAr 
                      ? 'المسافة بين الصفا والمروة ~395 متر (حوالي 480 خطوة للشوط الواحد)'
                      : 'Approx 395m per lap (~480 steps) in air-conditioned mas\'a walkway'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-add-sai-lap"
                onClick={handleCompleteSaiLap}
                disabled={stepData.ritualBreakdown.sai.circuitsDone >= 7}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? '+ إتمام شوط سعي (+480 خطوة)' : '+ Complete Sa\'i Lap (+480 steps)'}</span>
              </button>
            </div>

            {/* 7 Visual Laps */}
            <div className="grid grid-cols-7 gap-2">
              {[
                { lap: 1, fromAr: 'الصفا', toAr: 'المروة', fromEn: 'Safa', toEn: 'Marwah' },
                { lap: 2, fromAr: 'المروة', toAr: 'الصفا', fromEn: 'Marwah', toEn: 'Safa' },
                { lap: 3, fromAr: 'الصفا', toAr: 'المروة', fromEn: 'Safa', toEn: 'Marwah' },
                { lap: 4, fromAr: 'المروة', toAr: 'الصفا', fromEn: 'Marwah', toEn: 'Safa' },
                { lap: 5, fromAr: 'الصفا', toAr: 'المروة', fromEn: 'Safa', toEn: 'Marwah' },
                { lap: 6, fromAr: 'المروة', toAr: 'الصفا', fromEn: 'Marwah', toEn: 'Safa' },
                { lap: 7, fromAr: 'الصفا', toAr: 'المروة', fromEn: 'Safa', toEn: 'Marwah' }
              ].map((item) => {
                const isDone = item.lap <= stepData.ritualBreakdown.sai.circuitsDone;
                return (
                  <div
                    key={item.lap}
                    className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                      isDone
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-400 text-teal-800 dark:text-teal-200 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-slate-400">{isAr ? `شوط ${item.lap}` : `Lap ${item.lap}`}</span>
                    <strong className="text-xs font-black my-1 text-slate-800 dark:text-slate-200">
                      {isAr ? item.toAr : item.toEn}
                    </strong>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    ) : (
                      <span className="text-[9px] text-slate-400">480 stp</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wheelchair & Senior Concession Guidance Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 flex items-start gap-3 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-extrabold text-xs sm:text-sm">
                {isAr ? 'رخصة التيسير واستخدام عربات الطواف والسعي لكبار السن' : 'Senior Mobility Concessions & Electric Carts'}
              </h5>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300 text-[11px]">
                {isAr 
                  ? 'الشريعة الإسلامية يسر؛ إذا شعرت الوالدة بأي إرهاق أو دوخة، تتوفر مسارات العربات الكهربائية في الدور العلوي للطواف والمسعى لضمان راحتها وصحتها دون حرج.'
                  : 'Islamic jurisprudence encourages ease: If fatigue arises, electric cart tracks on upper floors are available to preserve senior safety.'}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: SENSOR LAB & ACCELEROMETER */}
      {activeTab === 'sensor-lab' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* 3-Axis Live Accelerometer Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-400" />
                    <span>{isAr ? 'مستشعر التسارع والحركة المدمج (3-Axis IMU Sensor)' : '3-Axis Motion Sensor & Accelerometer'}</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {stepData.sensorStream.samplingRateHz} Hz High-Precision
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {stepData.sensorStream.sensorModel} • {isAr ? 'دقة الخوارزمية:' : 'Confidence:'} {stepData.sensorStream.confidenceScore}%
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">
                  {stepData.sensorStream.lastSyncTimestamp}
                </span>
              </div>
            </div>

            {/* 3 Live Axis Gauges */}
            <div className="grid grid-cols-3 gap-3">
              {/* X Axis */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>Acc-X (Lateral)</span>
                  <span className="text-indigo-400 font-bold">{stepData.sensorStream.accelX} G</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    style={{ width: `${Math.min(100, Math.abs(stepData.sensorStream.accelX) * 100)}%` }}
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  />
                </div>
              </div>

              {/* Y Axis */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>Acc-Y (Vertical)</span>
                  <span className="text-emerald-400 font-bold">{stepData.sensorStream.accelY} G</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    style={{ width: `${Math.min(100, Math.abs(stepData.sensorStream.accelY) * 100)}%` }}
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  />
                </div>
              </div>

              {/* Z Axis */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>Acc-Z (Forward)</span>
                  <span className="text-amber-400 font-bold">{stepData.sensorStream.accelZ} G</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    style={{ width: `${Math.min(100, Math.abs(stepData.sensorStream.accelZ) * 100)}%` }}
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Stride & Gait Diagnostics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                <span className="text-slate-400">{isAr ? 'طول الخطوة المقاس (Stride):' : 'Estimated Stride Length:'}</span>
                <strong className="text-white font-mono">{stepData.sensorStream.strideLengthCm} cm</strong>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                <span className="text-slate-400">{isAr ? 'مؤشر ثبات المشية والتوازن:' : 'Gait Stability Index:'}</span>
                <strong className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isAr ? 'ثبات ممتاز (Normal)' : 'Normal & Steady'}
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Manual Sensor Injection Buttons */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'محاكاة تسجيل خطوات فورية (Mock Step Injection)' : 'Instant Sensor Step Injections'}</span>
            </h4>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => handleAddManualSteps(100, 'مشية قصيرة في بهو الفندق', 'Short hotel lobby walk')}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                +100 {isAr ? 'خطوة (ممر الفندق)' : 'Steps (Hotel)'}
              </button>

              <button
                type="button"
                onClick={() => handleAddManualSteps(300, 'شوط طواف إضافي', 'Extra Tawaf Circuit')}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                +300 {isAr ? 'خطوة (شوط طواف)' : 'Steps (Tawaf)'}
              </button>

              <button
                type="button"
                onClick={() => handleAddManualSteps(500, 'مشي في مخيم منى', 'Mina Camp Walkway')}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                +500 {isAr ? 'خطوة (مسار منى)' : 'Steps (Mina)'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStepData(INITIAL_RUFQA_STEP_DATA);
                  notificationAudio.playReminderChime();
                  setRecentNotification(isAr ? 'تمت إعادة تعيين بيانات الحساس للحالة الأولية' : 'Sensor state reset to default');
                  setTimeout(() => setRecentNotification(null), 3000);
                }}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs font-bold transition-all active:scale-95 cursor-pointer ml-auto rtl:mr-auto rtl:ml-0 flex items-center gap-1"
                title="Reset to Initial Baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

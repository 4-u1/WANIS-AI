import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  X, 
  Send, 
  Phone, 
  ChevronRight, 
  Users, 
  Sparkles, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  Timer,
  Activity,
  Flame
} from 'lucide-react';
import { CareCircleTriageNotification, SupportedLanguage, TriageLevel } from '../../types';

interface CareCircleTriageToastProps {
  notification: CareCircleTriageNotification | null;
  onDismiss: () => void;
  onNavigateToFamilyPortal: () => void;
  language: SupportedLanguage;
}

export const CareCircleTriageToast: React.FC<CareCircleTriageToastProps> = ({
  notification,
  onDismiss,
  onNavigateToFamilyPortal,
  language
}) => {
  const [remainingProgress, setRemainingProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const isRtl = language === 'ar';
  const triageLevel = notification?.newTriage || 'YELLOW';
  const isRed = triageLevel === 'RED';
  const isOrange = triageLevel === 'ORANGE';
  const isYellow = triageLevel === 'YELLOW';

  const autoDismissDuration = isRed ? 24000 : isOrange ? 18000 : 16000;
  const referenceTimeWindow = 60; // 60s benchmark for elapsed alert age progress visualization

  // Dynamic Triage Theme Configuration with Rich Gradients & Pulse Animations
  const triageTheme = useMemo(() => {
    switch (triageLevel) {
      case 'RED':
        return {
          containerBorder: 'border-rose-500 ring-4 ring-rose-500/30',
          bgGradient: 'bg-gradient-to-br from-rose-950/95 via-slate-950/98 to-red-950/95',
          radialGlow1: 'bg-rose-600/25',
          radialGlow2: 'bg-red-600/20',
          ambientBackdropGlow: 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 opacity-70 animate-pulse',
          headerBadgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          triageShiftBadge: 'bg-rose-500/30 text-rose-200 border-rose-500/40',
          iconBg: 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/50 ring-2 ring-rose-400/40',
          dismissCountdownBar: 'bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 animate-pulse',
          elapsedProgressGradient: 'bg-gradient-to-r from-rose-500 via-red-400 to-rose-300',
          elapsedBadgeBg: 'bg-rose-500/30 text-rose-200 border-rose-500/50',
          pulseEffect: 'animate-pulse',
          actionBtn: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/40 animate-pulse',
          secondaryBtn: 'bg-rose-950/50 hover:bg-rose-900/60 border-rose-500/30 text-rose-100',
          infoBoxBg: 'bg-rose-950/40 border-rose-500/25'
        };
      case 'ORANGE':
        return {
          containerBorder: 'border-orange-500 ring-2 ring-orange-500/30',
          bgGradient: 'bg-gradient-to-br from-orange-950/95 via-slate-950/98 to-amber-950/95',
          radialGlow1: 'bg-orange-600/20',
          radialGlow2: 'bg-amber-600/15',
          ambientBackdropGlow: 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 opacity-40',
          headerBadgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          triageShiftBadge: 'bg-orange-500/30 text-orange-200 border-orange-500/40',
          iconBg: 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/40 ring-1 ring-orange-400/30',
          dismissCountdownBar: 'bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500',
          elapsedProgressGradient: 'bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400',
          elapsedBadgeBg: 'bg-orange-500/30 text-orange-200 border-orange-500/50',
          pulseEffect: '',
          actionBtn: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 shadow-lg shadow-orange-500/30 font-black',
          secondaryBtn: 'bg-orange-950/40 hover:bg-orange-900/50 border-orange-500/30 text-orange-100',
          infoBoxBg: 'bg-orange-950/30 border-orange-500/20'
        };
      case 'YELLOW':
      default:
        return {
          containerBorder: 'border-amber-500 ring-2 ring-amber-500/25',
          bgGradient: 'bg-gradient-to-br from-amber-950/90 via-slate-950/98 to-yellow-950/90',
          radialGlow1: 'bg-amber-500/15',
          radialGlow2: 'bg-yellow-500/10',
          ambientBackdropGlow: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 opacity-30',
          headerBadgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          triageShiftBadge: 'bg-amber-500/25 text-amber-200 border-amber-500/30',
          iconBg: 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30',
          dismissCountdownBar: 'bg-gradient-to-r from-amber-400 to-yellow-500',
          elapsedProgressGradient: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400',
          elapsedBadgeBg: 'bg-amber-500/30 text-amber-200 border-amber-500/50',
          pulseEffect: '',
          actionBtn: 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 shadow-lg shadow-amber-400/30 font-black',
          secondaryBtn: 'bg-amber-950/40 hover:bg-amber-900/50 border-amber-500/30 text-amber-100',
          infoBoxBg: 'bg-amber-950/30 border-amber-500/20'
        };
    }
  }, [triageLevel]);

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  // Track creation time and calculate live elapsed seconds
  useEffect(() => {
    if (!notification) {
      setElapsedSeconds(0);
      return;
    }

    const createdTime = notification.createdAt || Date.now();
    const updateElapsed = () => {
      const seconds = Math.max(0, Math.floor((Date.now() - createdTime) / 1000));
      setElapsedSeconds(seconds);
    };

    updateElapsed();
    const elapsedInterval = setInterval(updateElapsed, 1000);

    return () => clearInterval(elapsedInterval);
  }, [notification?.id]);

  // Auto-dismiss countdown timer
  useEffect(() => {
    if (!notification) return;

    setRemainingProgress(100);
    const intervalTime = 100;
    const decrement = (intervalTime / autoDismissDuration) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setRemainingProgress(prev => {
          if (prev <= decrement) {
            clearInterval(timer);
            onDismissRef.current();
            return 0;
          }
          return prev - decrement;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [notification?.id, isPaused, autoDismissDuration]);

  // Format the elapsed time string according to selected language
  const formattedElapsedTime = useMemo(() => {
    if (elapsedSeconds < 3) {
      if (language === 'ar') return 'الآن للتو';
      if (language === 'fr') return "À l'instant";
      return 'Just now';
    }

    if (elapsedSeconds < 60) {
      if (language === 'ar') return `منذ ${elapsedSeconds} ثانية`;
      if (language === 'fr') return `il y a ${elapsedSeconds}s`;
      return `${elapsedSeconds}s ago`;
    }

    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    if (language === 'ar') {
      return secs > 0 ? `منذ ${mins} د و ${secs} ث` : `منذ ${mins} دقيقة`;
    }
    if (language === 'fr') {
      return secs > 0 ? `il y a ${mins}m ${secs}s` : `il y a ${mins} min`;
    }
    return secs > 0 ? `${mins}m ${secs}s ago` : `${mins}m ago`;
  }, [elapsedSeconds, language]);

  // Percentage of elapsed benchmark window (caps at 100%)
  const elapsedPercentage = Math.min(100, Math.round((elapsedSeconds / referenceTimeWindow) * 100));

  if (!notification) return null;

  return (
    <div
      id="care-circle-triage-toast"
      className={`fixed bottom-6 right-6 z-50 max-w-lg w-full p-4 animate-slideUp transition-all duration-300 ${isRtl ? 'rtl' : 'ltr'}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="assertive"
    >
      {/* Outer Ambient Backdrop Glowing Gradient Layer */}
      <div 
        className={`absolute inset-2 rounded-3xl blur-xl transition-all duration-700 pointer-events-none -z-10 ${triageTheme.ambientBackdropGlow}`}
      />

      <div 
        className={`relative rounded-3xl border-2 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 text-white ${triageTheme.containerBorder} ${triageTheme.bgGradient}`}
      >
        {/* Dynamic Internal Ambient Light Flares */}
        <div 
          className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${triageTheme.radialGlow1}`}
        />
        <div 
          className={`absolute -bottom-16 -left-16 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${triageTheme.radialGlow2}`}
        />

        {/* Top Auto-dismiss countdown bar */}
        <div className="h-1.5 w-full bg-slate-900/80 relative overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${triageTheme.dismissCountdownBar}`}
            style={{ width: `${remainingProgress}%` }}
          />
        </div>

        <div className="p-5 space-y-4 relative z-10">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div 
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${triageTheme.iconBg}`}
              >
                {isRed ? (
                  <AlertOctagon className="w-6 h-6" />
                ) : isOrange ? (
                  <Flame className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase border shadow-sm ${triageTheme.headerBadgeBg}`}>
                    {language === 'ar' ? 'إشعار فوري لدائرة الرعاية' : 'Care Circle Auto-Alert'}
                  </span>
                  
                  {/* Shift Badge: GREEN -> YELLOW / ORANGE / RED */}
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${triageTheme.triageShiftBadge}`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
                    <span>{notification.previousTriage}</span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                    <span className={`w-2 h-2 rounded-full ${isRed ? 'bg-rose-500 animate-ping' : isOrange ? 'bg-orange-500' : 'bg-amber-400'}`}></span>
                    <span className="font-black">
                      {notification.newTriage}
                    </span>
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-white mt-1 drop-shadow-sm">
                  {language === 'ar' 
                    ? `تغير مستوى الاطمئنان للوالدة ${notification.seniorName}`
                    : `Triage Shift Detected: ${notification.seniorName}`}
                </h4>
              </div>
            </div>

            <button
              id="dismiss-triage-toast-btn"
              onClick={onDismiss}
              className="text-slate-300 hover:text-white p-1 rounded-xl hover:bg-white/15 transition-colors shrink-0"
              title="Dismiss notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dedicated "How Long Ago Triggered" Progress Indicator Banner */}
          <div 
            id="toast-trigger-progress-container"
            className="p-3 rounded-2xl bg-black/40 border border-white/15 space-y-2 backdrop-blur-md shadow-inner"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isRed ? 'bg-rose-400' : isOrange ? 'bg-orange-400' : 'bg-amber-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isRed ? 'bg-rose-500' : isOrange ? 'bg-orange-500' : 'bg-amber-500'
                  }`}></span>
                </span>
                <Clock className="w-3.5 h-3.5 text-teal-300 ml-0.5" />
                <span>
                  {language === 'ar' ? 'وقت انطلاق التنبيه:' : 'Alert Triggered:'}
                </span>
              </div>

              {/* Dynamic Live Elapsed Time Pill */}
              <div className="flex items-center gap-1.5">
                <span 
                  id="toast-elapsed-time-badge"
                  className={`font-mono font-extrabold px-2.5 py-0.5 rounded-full text-xs shadow-inner flex items-center gap-1 border ${triageTheme.elapsedBadgeBg}`}
                >
                  <Timer className={`w-3 h-3 ${isRed ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                  <span>{formattedElapsedTime}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  ({notification.timestamp})
                </span>
              </div>
            </div>

            {/* Visual Progress Bar showing how long ago alert was triggered */}
            <div className="space-y-1">
              <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div 
                  id="toast-elapsed-progress-bar"
                  className={`h-full rounded-full transition-all duration-1000 ${triageTheme.elapsedProgressGradient}`}
                  style={{ width: `${Math.max(5, elapsedPercentage)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium px-0.5">
                <span>{language === 'ar' ? 'لحظة الفحص الصوتي' : 'Intake Trigger'}</span>
                <span>
                  {isPaused 
                    ? (language === 'ar' ? '⏸️ متوقف مؤقتاً للمعاينة' : '⏸️ Hovered & Paused')
                    : (language === 'ar' ? `${elapsedSeconds} ثانية منذ الرصد` : `${elapsedSeconds}s since detection`)}
                </span>
                <span>{language === 'ar' ? 'متابعة نشطة' : 'Active Care Loop'}</span>
              </div>
            </div>
          </div>

          {/* Reason / Observation */}
          <div className={`p-3 rounded-2xl border space-y-1.5 backdrop-blur-sm ${triageTheme.infoBoxBg}`}>
            <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
              {language === 'ar' ? 'سبب التنبيه التلقائي المستخلص:' : 'Automated Triage Escalation Reason:'}
            </span>
            <p className="text-xs sm:text-sm text-white font-medium leading-snug">
              {notification.reason}
            </p>
            {notification.transcriptSnippet && (
              <p className="text-[11px] text-teal-300/95 italic pt-1 border-t border-white/10">
                "{notification.transcriptSnippet}"
              </p>
            )}
          </div>

          {/* Care Circle Dispatch Status */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-300" />
              {language === 'ar' ? 'تم إشعار أفراد دائرة الرعاية تلقائياً:' : 'Automated Notifications Dispatched To:'}
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {notification.notifiedMembers.map((member, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/10 text-xs"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-bold text-slate-200 truncate">{member.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-teal-300 font-mono shrink-0">
                    {member.channel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2.5">
            <button
              type="button"
              id="triage-toast-view-family-btn"
              onClick={() => {
                onNavigateToFamilyPortal();
                onDismiss();
              }}
              className={`flex-1 py-2.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 ${triageTheme.actionBtn}`}
            >
              <span>{language === 'ar' ? 'عرض بوابة العائلة والموجز' : 'Open Family Care Portal'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <a
              href="tel:+966505123456"
              className={`py-2.5 px-3.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 border transition-colors ${triageTheme.secondaryBtn}`}
              title="Call Caregiver"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ar' ? 'اتصال' : 'Call'}</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

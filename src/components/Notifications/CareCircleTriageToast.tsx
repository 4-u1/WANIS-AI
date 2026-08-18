import React, { useEffect, useState, useMemo } from 'react';
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
import { CareCircleTriageNotification, SupportedLanguage } from '../../types';

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
  const isRed = notification?.newTriage === 'RED';
  const autoDismissDuration = isRed ? 24000 : 16000; // 24s for RED, 16s for YELLOW
  const referenceTimeWindow = 60; // 60s benchmark for elapsed alert age progress visualization

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
  }, [notification]);

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
            onDismiss();
            return 0;
          }
          return prev - decrement;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [notification, isPaused, autoDismissDuration, onDismiss]);

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
      <div 
        className={`rounded-3xl border-2 shadow-2xl overflow-hidden backdrop-blur-md transition-all ${
          isRed
            ? 'bg-slate-900/95 border-rose-500 shadow-rose-950/60 text-white'
            : 'bg-slate-900/95 border-amber-500 shadow-amber-950/60 text-white'
        }`}
      >
        {/* Top Auto-dismiss countdown bar */}
        <div className="h-1.5 w-full bg-slate-800 relative overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              isRed ? 'bg-gradient-to-r from-rose-500 to-red-600' : 'bg-gradient-to-r from-amber-400 to-yellow-500'
            }`}
            style={{ width: `${remainingProgress}%` }}
          ></div>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div 
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  isRed
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-500 text-slate-950'
                }`}
              >
                {isRed ? <AlertOctagon className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase ${
                    isRed ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {language === 'ar' ? 'إشعار فوري لدائرة الرعاية' : 'Care Circle Auto-Alert'}
                  </span>
                  
                  {/* Shift Badge: GREEN -> YELLOW / RED */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{notification.previousTriage}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className={`w-2 h-2 rounded-full ${isRed ? 'bg-rose-500' : 'bg-amber-400'}`}></span>
                    <span className={isRed ? 'text-rose-300 font-extrabold' : 'text-amber-300 font-extrabold'}>
                      {notification.newTriage}
                    </span>
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-white mt-1">
                  {language === 'ar' 
                    ? `تغير مستوى الاطمئنان للوالدة ${notification.seniorName}`
                    : `Triage Shift Detected: ${notification.seniorName}`}
                </h4>
              </div>
            </div>

            <button
              id="dismiss-triage-toast-btn"
              onClick={onDismiss}
              className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors shrink-0"
              title="Dismiss notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dedicated "How Long Ago Triggered" Progress Indicator Banner */}
          <div 
            id="toast-trigger-progress-container"
            className="p-3 rounded-2xl bg-white/10 dark:bg-black/30 border border-white/15 space-y-2"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isRed ? 'bg-rose-400' : 'bg-amber-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isRed ? 'bg-rose-500' : 'bg-amber-500'
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
                  className={`font-mono font-extrabold px-2.5 py-0.5 rounded-full text-xs shadow-inner flex items-center gap-1 ${
                    isRed 
                      ? 'bg-rose-500/30 text-rose-200 border border-rose-500/50' 
                      : 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                  }`}
                >
                  <Timer className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>{formattedElapsedTime}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  ({notification.timestamp})
                </span>
              </div>
            </div>

            {/* Visual Progress Bar showing how long ago alert was triggered */}
            <div className="space-y-1">
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div 
                  id="toast-elapsed-progress-bar"
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isRed 
                      ? 'bg-gradient-to-r from-rose-500 via-red-400 to-rose-300' 
                      : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400'
                  }`}
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
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              {language === 'ar' ? 'سبب التنبيه التلقائي المستخلص:' : 'Automated Triage Escalation Reason:'}
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
              {notification.reason}
            </p>
            {notification.transcriptSnippet && (
              <p className="text-[11px] text-teal-300/90 italic pt-1 border-t border-white/5">
                "{notification.transcriptSnippet}"
              </p>
            )}
          </div>

          {/* Care Circle Dispatch Status */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              {language === 'ar' ? 'تم إشعار أفراد دائرة الرعاية تلقائياً:' : 'Automated Notifications Dispatched To:'}
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {notification.notifiedMembers.map((member, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs"
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
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2.5">
            <button
              type="button"
              id="triage-toast-view-family-btn"
              onClick={() => {
                onNavigateToFamilyPortal();
                onDismiss();
              }}
              className={`flex-1 py-2.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 ${
                isRed
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-amber-400/30'
              }`}
            >
              <span>{language === 'ar' ? 'عرض بوابة العائلة والموجز' : 'Open Family Care Portal'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <a
              href="tel:+966505123456"
              className="py-2.5 px-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/15 transition-colors"
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

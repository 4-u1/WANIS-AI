import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Play, 
  X, 
  Compass, 
  ShieldCheck, 
  Stethoscope, 
  Users,
  Volume2
} from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface FirstTimeWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  language: SupportedLanguage;
}

export const FirstTimeWelcomeModal: React.FC<FirstTimeWelcomeModalProps> = ({
  isOpen,
  onClose,
  onStartTour,
  language
}) => {
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  if (!isOpen) return null;

  const isRtl = language === 'ar';

  const handleDismiss = () => {
    if (dontShowAgain) {
      localStorage.setItem('wanis_welcome_dismissed', 'true');
    }
    onClose();
  };

  const handleStart = () => {
    if (dontShowAgain) {
      localStorage.setItem('wanis_welcome_dismissed', 'true');
    }
    onClose();
    onStartTour();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        id="first-time-welcome-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative ${isRtl ? 'rtl' : 'ltr'}`}
      >
        {/* Top Dismiss Button */}
        <button
          onClick={handleDismiss}
          aria-label="Close"
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Branding */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-teal-600/25">
            <HeartHandshake className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800 inline-block">
              {language === 'ar' ? 'أهلاً بك في منصة ونيس' : 'Welcome to Wanees'}
            </span>
            <h2 id="welcome-modal-title" className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {language === 'ar' ? 'هل ترغب بجولة تعريفية سريعة؟' : 'Would you like a quick tour?'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
            {language === 'ar'
              ? 'ونيس هو رفيقك الصحي الذكي للعناية المعرفية، والاطمئنان اليومي، ومتابعة الأدوية، والتواصل الآمن مع أفراد أسرتك وطبيبك.'
              : 'Wanees is your personal companion for wellbeing, cognitive health, medication awareness, and staying connected with the people who care about you.'}
          </p>
        </div>

        {/* Feature Preview Badges */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{language === 'ar' ? 'اطمئنان صوتي سلس' : 'Voice Check-ins'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{language === 'ar' ? 'ذكاء الأدوية (ACB)' : 'ACB Med Risk'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{language === 'ar' ? 'دائرة العائلة الآمنة' : 'Care Circle'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{language === 'ar' ? 'رفقة الحج والعمرة' : 'Rufqa Pilgrimage'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            id="btn-welcome-start-tour"
            onClick={handleStart}
            className="w-full py-3.5 px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-teal-700/25 transition-transform active:scale-98 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'ar' ? 'ابدأ الجولة (دقيقتان)' : 'Start Tour (2 mins)'}</span>
          </button>

          <button
            type="button"
            id="btn-welcome-maybe-later"
            onClick={handleDismiss}
            className="w-full py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-colors"
          >
            {language === 'ar' ? 'ربما لاحقاً' : 'Maybe Later'}
          </button>
        </div>

        {/* Don't show automatically again checkbox */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
            />
            <span>{language === 'ar' ? 'عدم إظهار هذه الرسالة تلقائياً مرة أخرى' : "Don't show automatically again"}</span>
          </label>
        </div>

      </div>
    </div>
  );
};

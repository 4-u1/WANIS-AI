import React, { useState, useRef, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  Play,
  BookOpen,
  Brain,
  FileText,
  Compass,
  ChevronDown,
  X,
  Volume2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { SupportedLanguage, PersonaMode } from '../../types';

interface UserGuideButtonProps {
  language: SupportedLanguage;
  onOpenHowToUse: () => void;
  onStartTour?: () => void;
  onOpenProductIntroduction?: () => void;
  onOpenVoiceGuide?: () => void;
  onStartShowMeHow?: (workflow: string) => void;
  className?: string;
}

export const UserGuideButton: React.FC<UserGuideButtonProps> = ({
  language,
  onOpenHowToUse,
  onStartTour,
  onOpenProductIntroduction,
  onOpenVoiceGuide,
  onStartShowMeHow,
  className = ''
}) => {
  const isAr = language === 'ar';
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpenMenu(false);
      }
    };
    if (isOpenMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenMenu]);

  // Global keyboard shortcut ('?' or 'Shift + /') to open guide when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        onOpenHowToUse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenHowToUse]);

  const handleMenuAction = (action: () => void) => {
    setIsOpenMenu(false);
    action();
  };

  return (
    <div ref={menuRef} className={`relative inline-flex items-center ${className}`}>
      
      {/* Primary React Button Group */}
      <div className="flex items-center rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 shadow-2xs hover:border-teal-300 dark:hover:border-teal-700 transition-all">
        
        {/* Main Click Area -> Opens Full User Guide Modal */}
        <button
          type="button"
          id="btn-user-guide-main"
          onClick={onOpenHowToUse}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-extrabold text-teal-800 dark:text-teal-200 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 rounded-l-xl rtl:rounded-l-none rtl:rounded-r-xl transition-all cursor-pointer group active:scale-95"
          title={isAr ? 'دليل الاستخدام، الجولة التفاعلية ومركز المساعدة (اختصار: ?)' : 'User Guide, Walkthrough & Help Center (Press ?)'}
        >
          <div className="w-5 h-5 rounded-lg bg-teal-600/10 dark:bg-teal-400/15 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:rotate-12 transition-transform shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-300" />
          </div>
          
          <span className="font-bold tracking-tight">
            {isAr ? 'دليل الاستخدام' : language === 'fr' ? 'Guide d\'utilisation' : 'User Guide'}
          </span>

          {/* Keyboard shortcut hint badge */}
          <span className="hidden lg:inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-mono font-bold bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
            ?
          </span>
        </button>

        {/* Dropdown Trigger Chevron */}
        <button
          type="button"
          id="btn-user-guide-menu-toggle"
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          aria-expanded={isOpenMenu}
          aria-haspopup="true"
          className="px-1.5 py-1.5 sm:py-2 border-l rtl:border-l-0 rtl:border-r border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 rounded-r-xl rtl:rounded-r-none rtl:rounded-l-xl transition-colors cursor-pointer"
          title={isAr ? 'قائمة الوصول السريع للمساعدة' : 'Quick Help Menu'}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpenMenu ? 'rotate-180 text-teal-900 dark:text-white' : ''}`} />
        </button>
      </div>

      {/* Quick Access Popover Menu */}
      {isOpenMenu && (
        <div
          id="user-guide-quick-menu"
          className="absolute top-full mt-2 ltr:right-0 rtl:left-0 z-50 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 space-y-1 animate-fadeIn text-slate-800 dark:text-slate-100"
        >
          {/* Menu Header */}
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAr ? 'خيارات دليل المساعدة' : 'Quick Guide Actions'}</span>
            </span>
            <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
              Wanees Guide
            </span>
          </div>

          {/* Option 1: Main Help Center Modal */}
          <button
            type="button"
            onClick={() => handleMenuAction(onOpenHowToUse)}
            className="w-full p-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-slate-800 text-left rtl:text-right flex items-start gap-3 transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{isAr ? 'مركز المساعدة ودليل الميزات الكامل' : 'Full User Guide & Manual'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr ? 'تصفح كافة الشروحات، الأسئلة الشائعة ومصفوفة الأمان' : 'Explore all features, FAQs and safety matrix'}
              </p>
            </div>
          </button>

          {/* Option 2: Start Interactive Tour */}
          {onStartTour && (
            <button
              type="button"
              onClick={() => handleMenuAction(onStartTour)}
              className="w-full p-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-slate-800 text-left rtl:text-right flex items-start gap-3 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{isAr ? 'بدء الجولة التفاعلية الحية' : 'Start Interactive Spotlight Tour'}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    2 min
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isAr ? 'جولة حية ترشدك على شاشات ونيس خطوة بخطوة' : 'Live step-by-step tour across views'}
                </p>
              </div>
            </button>
          )}

          {/* Option 3: Voice & Dialect Intelligence */}
          {onOpenVoiceGuide && (
            <button
              type="button"
              onClick={() => handleMenuAction(onOpenVoiceGuide)}
              className="w-full p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 text-left rtl:text-right flex items-start gap-3 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {isAr ? 'كيف يفهمني ونيس؟ (الذكاء الصوتي)' : 'How Wanees Understands Voice'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isAr ? 'مختبر محاكاة اللهجات والعوامل السياقية اللحظية' : 'Dialect simulator & live contextual telemetry'}
                </p>
              </div>
            </button>
          )}

          {/* Option 4: Product Vision & Philosophy */}
          {onOpenProductIntroduction && (
            <button
              type="button"
              onClick={() => handleMenuAction(onOpenProductIntroduction)}
              className="w-full p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-left rtl:text-right flex items-start gap-3 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {isAr ? 'رؤية وفلسفة منصة ونيس' : 'Wanees Philosophy & Vision'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isAr ? 'استكشف ركائز الرعاية الست ومعايير الذكاء السريري' : 'Explore the 6 pillars of compassionate intelligence'}
                </p>
              </div>
            </button>
          )}

          {/* Menu Footer */}
          <div className="pt-2 pb-1 px-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>{isAr ? 'اضغط ? في أي وقت لفتح الدليل' : 'Press ? anytime to open'}</span>
            <button
              type="button"
              onClick={() => setIsOpenMenu(false)}
              className="hover:text-slate-700 dark:hover:text-slate-200"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

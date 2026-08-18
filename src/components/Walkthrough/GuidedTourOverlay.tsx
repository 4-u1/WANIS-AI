import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  HelpCircle,
  Play,
  RotateCcw,
  HeartHandshake
} from 'lucide-react';
import { TourStep, SupportedLanguage, PersonaMode } from '../../types';
import { TOUR_STEPS } from '../../data/walkthroughData';

interface GuidedTourOverlayProps {
  isActive: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  currentMode: PersonaMode;
  onSwitchMode: (mode: PersonaMode) => void;
  onOpenCheckinModal: () => void;
  voiceEnabledByDefault?: boolean;
  onOpenProductIntroduction?: () => void;
}

export const GuidedTourOverlay: React.FC<GuidedTourOverlayProps> = ({
  isActive,
  onClose,
  language,
  currentMode,
  onSwitchMode,
  onOpenCheckinModal,
  voiceEnabledByDefault = true,
  onOpenProductIntroduction
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isSeniorSimpleMode, setIsSeniorSimpleMode] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isTourCompleted, setIsTourCompleted] = useState<boolean>(false);

  const isRtl = language === 'ar';
  const NextArrow = isRtl ? ArrowLeft : ArrowRight;
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const currentStep: TourStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];
  const totalSteps = TOUR_STEPS.length;

  // Restore saved step on activation
  useEffect(() => {
    if (isActive) {
      const savedStep = localStorage.getItem('wanis_tour_progress');
      if (savedStep) {
        const stepNum = parseInt(savedStep, 10);
        if (!isNaN(stepNum) && stepNum >= 0 && stepNum < totalSteps) {
          setCurrentStepIndex(stepNum);
        }
      }
      setIsTourCompleted(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [isActive, totalSteps]);

  // Sync mode if current step requires a specific persona view
  useEffect(() => {
    if (!isActive || isTourCompleted) return;

    if (currentStep.targetMode && currentStep.targetMode !== currentMode) {
      onSwitchMode(currentStep.targetMode);
    }
  }, [isActive, currentStep, currentMode, onSwitchMode, isTourCompleted]);

  // Locate target element and calculate bounding box
  useEffect(() => {
    if (!isActive || isTourCompleted) return;

    const findTarget = () => {
      const selectors = currentStep.targetSelector.split(',').map(s => s.trim());
      let element: HTMLElement | null = null;

      for (const sel of selectors) {
        element = document.querySelector(sel) as HTMLElement;
        if (element && element.offsetParent !== null) break;
      }

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    };

    // Give DOM a tick to re-render when switching modes
    const timer = setTimeout(findTarget, 250);
    window.addEventListener('resize', findTarget);
    window.addEventListener('scroll', findTarget);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', findTarget);
      window.removeEventListener('scroll', findTarget);
    };
  }, [isActive, currentStepIndex, currentStep, currentMode, isTourCompleted]);

  // Voice Narration
  const speakCurrentStep = () => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const titleText = currentStep.title[language];
    const bodyText = isSeniorSimpleMode && currentStep.seniorSimpleText 
      ? currentStep.seniorSimpleText[language] 
      : (currentStep.speechAudioText?.[language] || currentStep.description[language]);
    
    const fullSpeech = `${titleText}. ${bodyText}`;
    const utterance = new SpeechSynthesisUtterance(fullSpeech);
    utterance.lang = language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US';
    utterance.rate = 0.88;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    if (currentStepIndex < totalSteps - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      localStorage.setItem('wanis_tour_progress', nextIndex.toString());
    } else {
      // Tour completed
      setIsTourCompleted(true);
      localStorage.setItem('wanis_tour_completed', 'true');
      localStorage.removeItem('wanis_tour_progress');
    }
  };

  const handleBack = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      localStorage.setItem('wanis_tour_progress', prevIndex.toString());
    }
  };

  const handleSkip = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    localStorage.setItem('wanis_tour_dismissed', 'true');
    onClose();
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsTourCompleted(false);
    localStorage.setItem('wanis_tour_progress', '0');
  };

  if (!isActive) return null;

  return (
    <div 
      id="guided-tour-overlay" 
      role="dialog"
      aria-modal="true"
      aria-label="Platform Guided Tour"
      className={`fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto ${isRtl ? 'rtl' : 'ltr'}`}
    >
      {/* Dark backdrop overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 pointer-events-auto" />

      {/* Target Element Spotlight Highlight Box */}
      {targetRect && !isTourCompleted && (
        <div
          id="tour-spotlight-box"
          style={{
            top: Math.max(8, targetRect.top - 8),
            left: Math.max(8, targetRect.left - 8),
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
          className="absolute z-50 rounded-2xl ring-4 ring-teal-400/80 dark:ring-teal-400 bg-teal-500/10 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] pointer-events-none transition-all duration-300 animate-pulse"
        />
      )}

      {/* Main Tour Floating Card Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        
        {/* Regular Step Card */}
        {!isTourCompleted ? (
          <div 
            id="tour-tooltip-card"
            className={`pointer-events-auto max-w-lg w-full bg-white dark:bg-slate-900 border border-teal-500/30 dark:border-teal-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-scaleIn transition-all ${
              isSeniorSimpleMode ? 'text-slate-900 dark:text-white p-7 sm:p-8' : ''
            }`}
          >
            {/* Top Toolbar: Badge, Step Count, Simple Mode, Close */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {currentStep.badge?.[language] || `Step ${currentStepIndex + 1}`}
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  {language === 'ar' ? `الخطوة ${currentStepIndex + 1} من ${totalSteps}` : `Step ${currentStepIndex + 1} of ${totalSteps}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Senior / Simple Mode Toggle */}
                <button
                  type="button"
                  id="tour-senior-mode-toggle"
                  onClick={() => setIsSeniorSimpleMode(!isSeniorSimpleMode)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors border ${
                    isSeniorSimpleMode 
                      ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700' 
                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
                  title={language === 'ar' ? 'وضع كبار السن المبسط' : 'Senior Simple Mode'}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">{language === 'ar' ? 'وضع مبسط' : 'Simple Mode'}</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleSkip}
                  aria-label="Close tour"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Dot Progress Bar */}
            <div className="flex items-center gap-1.5 justify-center py-1">
              {TOUR_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    localStorage.setItem('wanis_tour_progress', idx.toString());
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStepIndex 
                      ? 'w-7 bg-teal-600 dark:bg-teal-400' 
                      : idx < currentStepIndex
                      ? 'w-2 bg-teal-300 dark:bg-teal-700'
                      : 'w-2 bg-slate-200 dark:bg-slate-700'
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Step Body */}
            <div className="space-y-3">
              <h2 className={`font-bold text-slate-900 dark:text-white leading-snug ${
                isSeniorSimpleMode ? 'text-xl sm:text-2xl font-black text-teal-900 dark:text-teal-200' : 'text-lg sm:text-xl'
              }`}>
                {currentStep.title[language]}
              </h2>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300">
                <p className={`leading-relaxed ${
                  isSeniorSimpleMode ? 'text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100' : 'text-sm'
                }`}>
                  {isSeniorSimpleMode && currentStep.seniorSimpleText 
                    ? currentStep.seniorSimpleText[language] 
                    : currentStep.description[language]}
                </p>
                {currentStepIndex === 0 && onOpenProductIntroduction && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'ar' ? 'هل تريد قراءة الرؤية والنموذج الكامل أولاً؟' : 'Want to read the full product vision & care model first?'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenProductIntroduction();
                      }}
                      className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'ar' ? 'مقدمة ونيس' : 'Wanees Intro'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              
              {/* Voice Read Aloud Button */}
              <button
                type="button"
                id="tour-voice-narration-btn"
                onClick={speakCurrentStep}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSpeaking 
                    ? 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-200 dark:border-teal-700 animate-pulse' 
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-teal-600" /> : <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                <span className="hidden xs:inline">{isSpeaking ? (language === 'ar' ? 'إيقاف الصوت' : 'Mute Voice') : (language === 'ar' ? 'استمع صوتياً' : 'Read Aloud')}</span>
              </button>

              {/* Back & Next Actions */}
              <div className="flex items-center gap-2">
                {currentStepIndex > 0 && (
                  <button
                    type="button"
                    id="tour-btn-back"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <BackArrow className="w-4 h-4" />
                    <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
                  </button>
                )}

                <button
                  type="button"
                  id="tour-btn-next"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-700/25 transition-transform active:scale-95"
                >
                  <span>{currentStepIndex === totalSteps - 1 ? (language === 'ar' ? 'إنهاء الجولة' : 'Finish Tour') : (language === 'ar' ? 'التالي' : 'Next')}</span>
                  <NextArrow className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Skip Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2 transition-colors"
              >
                {language === 'ar' ? 'تخطي الجولة الآن' : 'Skip walkthrough for now'}
              </button>
            </div>

          </div>
        ) : (
          /* Tour Completion Card */
          <div 
            id="tour-completion-card"
            className="pointer-events-auto max-w-lg w-full bg-white dark:bg-slate-900 border border-teal-500/40 rounded-3xl p-7 sm:p-8 shadow-2xl text-center space-y-6 animate-scaleIn"
          >
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-teal-600/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {language === 'ar' ? 'اكتملت الجولة بنجاح' : 'Tour Completed'}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {language === 'ar' ? 'أنت الآن جاهز للاستمتاع بـ ونيس' : "You're ready to use Wanees"}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                {language === 'ar' 
                  ? 'تعرفت على الأساسيات! ونيس هنا ليرافقك يومياً، ويفهم احتياجاتك الصحية، ويبقيك على تواصل مستمر مع أحبائك وطبيبك.'
                  : 'You now know the essentials. Wanees is here to help you understand your wellbeing, stay connected, and prepare for better conversations with the people who care for you.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-xs sm:text-sm text-teal-950 dark:text-teal-200 text-center font-medium">
              <p>
                {language === 'ar' 
                  ? 'يمكنك دائماً إعادة فتح الجولة أو الاطلاع على الشروحات بالضغط على زر "دليل الاستخدام" في أعلى الشاشة.'
                  : 'You can restart the tour or browse answers anytime by clicking "How to Use" in the top header.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                id="tour-complete-start-checkin"
                onClick={() => {
                  onClose();
                  onSwitchMode('senior');
                  setTimeout(() => onOpenCheckinModal(), 200);
                }}
                className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-700/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-5 h-5" />
                <span>{language === 'ar' ? 'ابدأ جلستي الأولى الآن' : 'Start My First Check-in'}</span>
              </button>

              <button
                type="button"
                id="tour-complete-explore"
                onClick={onClose}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-colors"
              >
                {language === 'ar' ? 'استكشف المنصة' : 'Explore Wanees'}
              </button>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إعادة الجولة من البداية' : 'Restart tour from beginning'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

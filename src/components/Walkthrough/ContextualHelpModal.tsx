import React from 'react';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  ArrowLeft,
  Volume2,
  Stethoscope,
  Compass,
  HeartHandshake
} from 'lucide-react';
import { ContextualHelpItem, SupportedLanguage, PersonaMode } from '../../types';

interface ContextualHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContextualHelpItem | null;
  language: SupportedLanguage;
  onNavigateToFeature?: (mode: PersonaMode) => void;
  voiceEnabled?: boolean;
}

export const ContextualHelpModal: React.FC<ContextualHelpModalProps> = ({
  isOpen,
  onClose,
  item,
  language,
  onNavigateToFeature,
  voiceEnabled = true
}) => {
  if (!isOpen || !item) return null;

  const isRtl = language === 'ar';
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const speakText = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${item.title[language]}. ${item.shortAnswer[language]}. ${item.detailedExplanation[language]}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getFeatureIcon = (mode?: PersonaMode) => {
    switch (mode) {
      case 'clinician': return <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'rufqa': return <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default: return <HeartHandshake className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        id="contextual-help-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 overflow-hidden relative ${isRtl ? 'rtl' : 'ltr'}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shadow-xs shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                {language === 'ar' ? 'دليل الفهم والشرح' : 'Contextual Understanding'}
              </span>
              <h2 id="help-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
                {item.title[language]}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            aria-label="Close"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Short Summary Card */}
        <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-800/60 space-y-1.5">
          <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ar' ? 'الملخص بعبارة بسيطة:' : 'Key Takeaway:'}
          </span>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {item.shortAnswer[language]}
          </p>
        </div>

        {/* Detailed Explanation */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {language === 'ar' ? 'تفاصيل إضافية:' : 'Detailed Explanation:'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {item.detailedExplanation[language]}
          </p>
        </div>

        {/* Clinical Disclaimer Note if present */}
        {item.clinicalNote && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{item.clinicalNote[language]}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Read aloud button */}
          <button
            onClick={speakText}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors w-full sm:w-auto justify-center"
          >
            <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{language === 'ar' ? 'استمع للشرح' : 'Read Aloud'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {item.relatedFeature && onNavigateToFeature && (
              <button
                onClick={() => {
                  onNavigateToFeature(item.relatedFeature!);
                  onClose();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-700/20 transition-all"
              >
                {getFeatureIcon(item.relatedFeature)}
                <span>{language === 'ar' ? 'عرض الميزة مباشرة' : 'Open Feature'}</span>
                <Arrow className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

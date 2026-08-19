import React, { useState } from 'react';
import {
  Mic,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Volume2,
  Pill,
  HeartHandshake,
  Droplets,
  Smile,
  CheckCircle2,
  HelpCircle,
  Copy
} from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface SeniorVoiceShortcutsTipProps {
  language: SupportedLanguage;
  onSelectShortcut?: (phrase: string) => void;
  className?: string;
}

export const SeniorVoiceShortcutsTip: React.FC<SeniorVoiceShortcutsTipProps> = ({
  language,
  onSelectShortcut,
  className = ''
}) => {
  const isAr = language === 'ar';
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const shortcutCategories = [
    {
      id: 'meds',
      categoryAr: 'تسجيل وتأكيد الأدوية',
      categoryEn: 'Medication Logging',
      icon: Pill,
      color: 'teal',
      examples: [
        {
          ar: '«أخذت حبة الضغط حقت الصباح الحمد لله»',
          en: '"I took my morning blood pressure medication."',
          descAr: 'لتسجيل تناول الدواء فورياً دون ضغط أزرار',
          descEn: 'Instantly logs scheduled morning pill'
        },
        {
          ar: '«سجل إني أخذت حبة السكر بعد الفطور»',
          en: '"Log that I took my Metformin after breakfast."',
          descAr: 'لتحديث جدول الأدوية والمزامنة مع العائلة',
          descEn: 'Updates medication log for caregivers'
        },
        {
          ar: '«ذكرني بحبة العصر بعد صلاة العصر إن شاء الله»',
          en: '"Remind me about my afternoon dose after prayer."',
          descAr: 'لجدولة تذكير سياقي مرتبط بأوقات الصلاة',
          descEn: 'Schedules context-aware prayer reminder'
        }
      ]
    },
    {
      id: 'checkin',
      categoryAr: 'جلسة الاطمئنان الصباحي والصحي',
      categoryEn: 'Daily Health Check-in',
      icon: HeartHandshake,
      color: 'amber',
      examples: [
        {
          ar: '«يا ونيس، صباح الخير، نمت 7 ساعات ومرتاحة اليوم»',
          en: '"Good morning Wanees, I slept 7 hours and feel rested."',
          descAr: 'لتسجيل جودة النوم والمزاج في جلسة واحدة',
          descEn: 'Logs sleep duration and positive baseline'
        },
        {
          ar: '«أشعر بشوية ثقل خفيف في ركبتي عند القيام»',
          en: '"I feel mild stiffness in my knee upon standing."',
          descAr: 'للتسجيل السريري الهادئ دون إثارة قلق مفاجئ',
          descEn: 'Captures subtle mobility shifts safely'
        }
      ]
    },
    {
      id: 'daily',
      categoryAr: 'السوائل والتواصل الأسري',
      categoryEn: 'Hydration & Family Sync',
      icon: Droplets,
      color: 'indigo',
      examples: [
        {
          ar: '«شربت كاسة موية دافية»',
          en: '"I just drank a glass of water."',
          descAr: 'لمتابعة ترطيب الجسم ومنع الجفاف',
          descEn: 'Tracks senior daily hydration target'
        },
        {
          ar: '«طمن مريم إني بخير وأفطرت تمام»',
          en: '"Let Maryam know I had a good breakfast and feel great."',
          descAr: 'لإرسال إشعار طمأنينة لدائرة الرعاية الأسرية',
          descEn: 'Sends peace-of-mind digest to family'
        }
      ]
    }
  ];

  const handleSpeakPhrase = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Strip quotes for natural speech
      const cleaned = text.replace(/[«»"']/g, '');
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = isAr ? 'ar-SA' : 'en-US';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleUsePhrase = (phrase: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleaned = phrase.replace(/[«»"']/g, '');
    if (onSelectShortcut) {
      onSelectShortcut(cleaned);
    }
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      id="senior-voice-shortcuts-tip"
      className={`rounded-3xl bg-gradient-to-r from-amber-500/10 via-teal-500/5 to-emerald-500/10 border border-amber-200/80 dark:border-amber-900/50 p-4 transition-all shadow-sm ${className}`}
    >
      {/* Header Bar / Collapsible Trigger */}
      <button
        type="button"
        id="toggle-voice-shortcuts-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 text-left rtl:text-right cursor-pointer group"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Mic className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {isAr ? 'أوامر صوتية مختصرة وسريعة' : 'Voice Shortcuts & Natural Commands'}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {isAr ? 'تحدث بعفويتك' : 'Speak Naturally'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {isAr
                ? 'يمكنك التحدث مع ونيس بلهجتك الطبيعية لتسجيل أدويتك أو بدء الاطمئنان بكلمات بسيطة'
                : 'Speak naturally in your dialect to log meds or check in with simple phrases'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 hidden sm:inline">
            {isExpanded ? (isAr ? 'إخفاء الأوامر' : 'Hide') : (isAr ? 'عرض الأمثلة' : 'View Examples')}
          </span>
          <div className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded Shortcuts Drawer */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-900/40 space-y-4 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {shortcutCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {isAr ? category.categoryAr : category.categoryEn}
                    </span>
                  </div>

                  {/* Examples List */}
                  <div className="space-y-2">
                    {category.examples.map((item, idx) => {
                      const globalIdx = `${category.id}-${idx}`;
                      const phraseText = isAr ? item.ar : item.en;
                      const descText = isAr ? item.descAr : item.descEn;

                      return (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50/70 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 transition-colors group/item"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                              {phraseText}
                            </p>
                            
                            <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover/item:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => handleSpeakPhrase(phraseText, e)}
                                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                                title={isAr ? 'استمع للنطق الصوتي' : 'Listen to pronunciation'}
                              >
                                <Volume2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                              </button>
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            {descText}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dialect Tip Footer */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-400 px-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {isAr
                  ? 'يفهم ونيس اللهجة الحجازية، النجدية، الجنوبية، الخليجية والمصرية تلقائياً دون الحاجة لكلمات محددة.'
                  : 'Wanees naturally understands regional Arabic dialects and English conversational idioms.'}
              </span>
            </span>
          </div>

        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Mic,
  Brain,
  Pill,
  Heart,
  ShieldCheck,
  Volume2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Activity,
  Play,
  RotateCcw,
  HelpCircle,
  Clock,
  Smile,
  AlertTriangle,
  Lock,
  Layers
} from 'lucide-react';
import { SupportedLanguage, SeniorProfile, Medication, CheckInRecord } from '../../types';
import { WaneesLogo } from '../WaneesLogo';
import { ContextualFactorsWidget } from '../Common/ContextualFactorsWidget';

interface HowWaneesUnderstandsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  senior?: SeniorProfile;
  medications?: Medication[];
  latestCheckIn?: CheckInRecord;
}

interface SimulationScenario {
  id: string;
  titleAr: string;
  titleEn: string;
  dialectAr: string;
  dialectEn: string;
  speechTextAr: string;
  speechTextEn: string;
  extractedMood: { score: number; labelAr: string; labelEn: string; sentiment: string };
  extractedSleep: { hours: number; quality: string };
  extractedMeds: { name: string; statusAr: string; statusEn: string; acb: number };
  clinicalFlag?: { textAr: string; textEn: string; isUrgent: boolean };
  waneesVoiceResponseAr: string;
  waneesVoiceResponseEn: string;
}

const SAMPLE_SCENARIOS: SimulationScenario[] = [
  {
    id: 'morning-routine',
    titleAr: 'صباح نشيط والتزام بالدواء',
    titleEn: 'Optimal Morning Routine & Adherence',
    dialectAr: 'لهجة خليجية / نجدية',
    dialectEn: 'Gulf Dialect (Warm tone)',
    speechTextAr: 'صباح الخير يا ونيس، الحمد لله صليت الفجر وأخذت حبة الضغط مع كاسة موية دافية ونومي كان طيب ٧ ساعات.',
    speechTextEn: 'Good morning Wanees, thank God I prayed Fajr and took my blood pressure pill with warm water, and had a restful 7 hours of sleep.',
    extractedMood: { score: 9.0, labelAr: 'راحة نفسية ونشاط', labelEn: 'Positive & Energetic', sentiment: 'positive' },
    extractedSleep: { hours: 7.0, quality: 'عميق ومريح (Optimal)' },
    extractedMeds: { name: 'Lisinopril 10mg', statusAr: 'تم تناول الجرعة في وقتها ✓', statusEn: 'Taken on-time ✓', acb: 0 },
    waneesVoiceResponseAr: 'صباح النور والسرور يا أم أحمد! نوم العافية وصحة وهنا يا رب.. بارك الله فيك سجلت لك حبة الضغط ويومك مبارك إن شاء الله.',
    waneesVoiceResponseEn: 'Good morning Um Ahmed! May you always be in good health. I have logged your morning medication, have a blessed day!'
  },
  {
    id: 'fatigue-dizziness',
    titleAr: 'شعور بالثقل وقلة النوم',
    titleEn: 'Fatigue & Sleep Dip',
    dialectAr: 'لهجة حجازية هادئة',
    dialectEn: 'Hijazi Dialect (Subdued tone)',
    speechTextAr: 'اليوم حاسس بشوية ثقل بالرأس ودوخة خفيفة لما قمت من السجادة، وما نمت إلا ٤ ساعات بالليل.',
    speechTextEn: 'Today I feel a slight heaviness in my head and mild dizziness after standing up from the prayer mat, and I only slept 4 hours.',
    extractedMood: { score: 5.5, labelAr: 'إجهاد وخمول خفيف', labelEn: 'Subdued / Mild Fatigue', sentiment: 'concerning' },
    extractedSleep: { hours: 4.0, quality: 'متقطع وقصير (4.0 hrs)' },
    extractedMeds: { name: 'Amitriptyline (مراجعة)', statusAr: 'تأثير تراكمي محتمل (ACB 3)', statusEn: 'Potential sedative load (ACB 3)', acb: 3 },
    clinicalFlag: {
      textAr: 'تنبيه لطيف: انخفاض ساعات النوم مع دوخة وضعية (تم تدوينه في ملخص الطبيب وتنبيه مريم للاطمئنان)',
      textEn: 'Mild Clinical Flag: Fragmented sleep & transient orthostatic dizziness noted for Dr. Brief',
      isUrgent: false
    },
    waneesVoiceResponseAr: 'سلامتك ألف سلامة يا خالة.. اجلسي وارتاحي ولا تستعجلي بالوقوف، خذي رشفة ماء وبلغت ابنتك مريم تطمئن عليك بعد شوي.',
    waneesVoiceResponseEn: 'May you feel better soon! Please sit down, rest and drink some water. I have notified Maryam to check in gently on you.'
  },
  {
    id: 'social-family',
    titleAr: 'زيارة عائلية وفرحة الأحفاد',
    titleEn: 'Social Engagement & Family Visit',
    dialectAr: 'لهجة مصرية / عامية',
    dialectEn: 'Egyptian Dialect (Cheerful)',
    speechTextAr: 'الحمد لله يا ونيس، زارتني مريم وأولادها على الغداء ومبسوطة بشوفتهم، والحمد لله أخذت كل أدويتي بمواعيدها.',
    speechTextEn: 'Praise be to God Wanees, Maryam and the children visited me for lunch, I was so happy to see them and took all my medications on time.',
    extractedMood: { score: 9.5, labelAr: 'بهجة وتواصل اجتماعي عالٍ', labelEn: 'Joyful & Socially Connected', sentiment: 'positive' },
    extractedSleep: { hours: 7.5, quality: 'مستقر 7.5 ساعات' },
    extractedMeds: { name: 'جميع أدوية اليوم', statusAr: 'التزام كامل 100%', statusEn: '100% Adherence Confirmed', acb: 0 },
    waneesVoiceResponseAr: 'ما شاء الله تبارك الله! الله يجمعكم على الخير ويفرح قلبك بشوفتهم دائماً يا رب.. يومك سعيد!',
    waneesVoiceResponseEn: 'Wonderful to hear! May your home always be filled with joy and family warmth.'
  }
];

export const HowWaneesUnderstandsModal: React.FC<HowWaneesUnderstandsModalProps> = ({
  isOpen,
  onClose,
  language,
  senior,
  medications,
  latestCheckIn
}) => {
  const isAr = language === 'ar';
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [activeViewMode, setActiveViewMode] = useState<'all' | 'contextual' | 'sandbox'>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const currentScenario = SAMPLE_SCENARIOS[selectedScenarioIndex];

  // Speech playback using SpeechSynthesis
  const handlePlayVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isAr ? 'ar-SA' : 'en-US';
      utterance.rate = 0.9; // Calm, respectful pace for seniors
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <div
      id="modal-how-wanees-understands"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto relative max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Warm Branding */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white p-6 sm:p-7 relative overflow-hidden flex items-start justify-between gap-4">
          <div className="absolute -right-6 -bottom-6 w-40 h-40 opacity-15 pointer-events-none">
            <WaneesLogo variant="icon" size="xl" />
          </div>

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur border border-white/30 text-amber-300 flex items-center justify-center shadow-md shrink-0">
              <Brain className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 uppercase tracking-wide">
                  {isAr ? 'الذكاء الاصطناعي السريري المتعاطف' : 'Compassionate Clinical AI'}
                </span>
                <span className="text-xs text-teal-100 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{isAr ? 'مصفوفة خصوصية Tier 1-4' : '4-Tier Privacy Protected'}</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {isAr ? 'كيف يفهمني ونيس؟ رحلة الصوت إلى رعاية متكاملة' : 'How Does Wanees Understand You? Voice-to-Care Pipeline'}
              </h2>
              <p className="text-teal-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {isAr
                  ? 'يتحدث ونيس معك كرفيق مخلص ويفهم اللهجات العربية وعفوية الحديث، ويستخلص مؤشرات الراحة والصحة دون أي تعقيد أو تشخيص عشوائي.'
                  : 'Wanees listens with cultural warmth, parses dialectal nuance, logs medication adherence, and protects your privacy without diagnostic overreach.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-how-wanees-understands"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Chips */}
        <div className="px-5 sm:px-7 pt-4 pb-1 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveViewMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {isAr ? 'العرض الشامل (السياق + المحاكاة)' : 'Full View (Context & Sandbox)'}
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('contextual')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'contextual'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>{isAr ? 'العوامل السياقية اللحظية' : 'Live Contextual Factors'}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('sandbox')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'sandbox'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              <span>{isAr ? 'مختبر محاكاة اللهجات' : 'Dialect Speech Sandbox'}</span>
            </span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* SECTION: CONTEXTUAL FACTORS DATA VISUALIZATION WIDGET */}
          {(activeViewMode === 'all' || activeViewMode === 'contextual') && (
            <ContextualFactorsWidget
              language={language}
              senior={senior}
              medications={medications}
              latestCheckIn={latestCheckIn}
            />
          )}

          {/* SECTION: INTERACTIVE DIALECT & SPEECH SANDBOX */}
          {(activeViewMode === 'all' || activeViewMode === 'sandbox') && (
            <>
              {/* Dialect & Speech Sandbox Header */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{isAr ? 'جرّب بنفسك: اختر سيناريو لكلام كبير السن' : 'Interactive Sandbox: Select a Senior Speech Scenario'}</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {isAr ? 'انقر على أي مثال لتشاهد كيف يحلله ونيس' : 'Tap any example to see live step-by-step analysis'}
                  </span>
                </div>

                {/* Scenario Selection Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_SCENARIOS.map((scenario, idx) => (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => setSelectedScenarioIndex(idx)}
                      className={`p-3 rounded-2xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
                        selectedScenarioIndex === idx
                          ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 dark:border-teal-500 shadow-sm ring-1 ring-teal-500'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {isAr ? scenario.titleAr : scenario.titleEn}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${selectedScenarioIndex === idx ? 'bg-teal-500' : 'bg-slate-300'}`} />
                      </div>
                      <span className="text-[10px] text-teal-700 dark:text-teal-300 block mt-1 font-semibold">
                        {isAr ? scenario.dialectAr : scenario.dialectEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Senior Utterance Speech Bubble */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{isAr ? 'الكلمات المنطوقة من كبير السن (المدخل الصوتي):' : 'Senior Spoken Words (Voice Input):'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handlePlayVoice(isAr ? currentScenario.speechTextAr : currentScenario.speechTextEn)}
                    className="px-3 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-slate-600 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-600 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse text-amber-500' : ''}`} />
                    <span>{isPlayingAudio ? (isAr ? 'جاري القراءة...' : 'Playing...') : (isAr ? 'استمع للصوت' : 'Play Audio')}</span>
                  </button>
                </div>

                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 font-serif">
                  "{isAr ? currentScenario.speechTextAr : currentScenario.speechTextEn}"
                </p>
              </div>

              {/* The 4-Stage Intelligence Pipeline Flow */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span>{isAr ? 'مراحل المعالجة والاستخلاص الفوري في ونيس' : 'Real-Time Parsing & Extraction Pipeline'}</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  {/* Step 1: Sentiment & Dialect */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">
                        {isAr ? '١. تحليل النبرة والمشاعر' : '1. Tone & Sentiment'}
                      </span>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                        {isAr ? currentScenario.extractedMood.labelAr : currentScenario.extractedMood.labelEn}
                      </h5>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-mono font-extrabold text-teal-600">
                        {currentScenario.extractedMood.score} / 10
                      </span>
                      <Smile className="w-4 h-4 text-amber-500" />
                    </div>
                  </div>

                  {/* Step 2: Sleep & Vitality */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                        {isAr ? '٢. استخلاص ساعات النوم' : '2. Sleep Biomarker'}
                      </span>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                        {currentScenario.extractedSleep.quality}
                      </h5>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-mono font-extrabold text-indigo-600">
                        {currentScenario.extractedSleep.hours} {isAr ? 'ساعات' : 'hours'}
                      </span>
                      <Clock className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>

                  {/* Step 3: Medication Verification */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                        {isAr ? '٣. الالتزام الدوائي' : '3. Medication Intake'}
                      </span>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                        {currentScenario.extractedMeds.name}
                      </h5>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-600">
                        {isAr ? currentScenario.extractedMeds.statusAr : currentScenario.extractedMeds.statusEn}
                      </span>
                      <Pill className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>

                  {/* Step 4: Family & Clinician Sync */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider">
                        {isAr ? '٤. مزامنة دائرة الرعاية' : '4. Care Circle Sync'}
                      </span>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                        {isAr ? 'تحديث تلقائي مشفر' : 'Encrypted CDS Update'}
                      </h5>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-purple-600">
                        {isAr ? 'دائرة الأمان مطمئنة ✓' : 'Circle Synced ✓'}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-purple-500" />
                    </div>
                  </div>

                </div>
              </div>

              {/* Wanees Voice Reassurance Response */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-teal-50 dark:from-slate-800/90 dark:to-teal-950/40 border border-amber-200/80 dark:border-teal-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black uppercase tracking-wide text-teal-800 dark:text-teal-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{isAr ? 'رد ونيس الصوتي الحنون والمباشر لكبير السن:' : 'Wanees Empathetic Vocal Reassurance:'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handlePlayVoice(isAr ? currentScenario.waneesVoiceResponseAr : currentScenario.waneesVoiceResponseEn)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'استمع لرد ونيس الصوتي' : 'Speak Reassurance'}</span>
                  </button>
                </div>

                <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-relaxed bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-teal-200/60 dark:border-teal-800">
                  "{isAr ? currentScenario.waneesVoiceResponseAr : currentScenario.waneesVoiceResponseEn}"
                </p>

                {currentScenario.clinicalFlag && (
                  <div className="p-3 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{isAr ? currentScenario.clinicalFlag.textAr : currentScenario.clinicalFlag.textEn}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Section: Trust, Privacy, & Ethical AI Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Lock className="w-3.5 h-3.5 text-teal-600" />
                <span>{isAr ? 'خصوصية مطلقة ومشفرة' : 'Zero-Leakage Privacy'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isAr ? 'تسجيلاتك ملكك وحدك. لا تُباع البيانات، وتتحكم بنفسك في مستوى مشاركتها مع الأسرة.' : 'Your voice data is strictly encrypted and shared only per your consented privacy tiers.'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>{isAr ? 'رفيق داعم وليس بديلاً للطبيب' : 'Companion, Not Doctor'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isAr ? 'ونيس لا يصدر تشخيصات مرضية، بل يساعد طبيبك وعائلتك على فهم نمط حياتك اليومي.' : 'Wanees never issues medical diagnoses, but equips your physician with longitudinal context.'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'فهم اللهجات العفوية' : 'Native Dialect Fluency'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isAr ? 'تحدث بطبيعتك وبلهجتك المعتادة دون الحاجة للتكلف أو التحدث بلغة فصحى جافة.' : 'Speak naturally in your native dialect; Wanees understands authentic conversational tone.'}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {isAr ? 'ونيس — مصمم خصيصاً لراحة كبار السن وعائلاتهم' : 'Wanees Voice Intelligence • Built for Senior Ease & Dignity'}
          </span>

          <button
            type="button"
            id="btn-understand-how-it-works-close"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            {isAr ? 'فهمت، شكراً لك' : 'Got it, Thank You'}
          </button>
        </div>

      </div>
    </div>
  );
};

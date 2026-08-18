import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Play, 
  X, 
  Compass, 
  ShieldCheck, 
  Stethoscope, 
  Users, 
  Brain, 
  MessageSquare, 
  Pill, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Layers, 
  ShieldAlert, 
  UserCheck, 
  Eye, 
  Navigation, 
  Activity, 
  Lock, 
  HelpCircle,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface WaneesProductIntroductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  language: SupportedLanguage;
}

type IntroSection = 'story' | 'care-model' | 'pillars' | 'ecosystem' | 'trust' | 'roadmap';

export const WaneesProductIntroductionModal: React.FC<WaneesProductIntroductionModalProps> = ({
  isOpen,
  onClose,
  onStartTour,
  language
}) => {
  const [activeSection, setActiveSection] = useState<IntroSection>('story');
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isRtl = language === 'ar';
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const handleDismiss = () => {
    if (dontShowAgain) {
      localStorage.setItem('wanis_welcome_dismissed', 'true');
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onClose();
  };

  const handleStartTourClick = () => {
    if (dontShowAgain) {
      localStorage.setItem('wanis_welcome_dismissed', 'true');
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onClose();
    onStartTour();
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const narrationTexts: Record<SupportedLanguage, string> = {
      ar: 'أهلاً بكم في ونيس. طريقة أذكى وأكثر تعاطفاً لدعم الشيخوخة الصحية. ونيس هو رفيق ذكي يساعد كبار السن على فهم عافيتهم والبقاء على اتصال بأحبائهم. ونيس يستمع، يفهم، يدعم، ويصل. ونيس لا يستبدل الرعاية الإنسانية، بل يجعلها أكثر وعياً واتصالاً.',
      en: 'Welcome to Wanees. A smarter, more compassionate way to support healthy aging. Wanees is an intelligent companion designed to help older adults understand their wellbeing, stay connected with the people who care about them, and navigate health with confidence. Wanees listens, understands, supports, and connects. Wanees does not replace human care; it empowers it.',
      fr: 'Bienvenue sur Wanees. Une approche plus intelligente et bienveillante du vieillissement en santé. Wanees est un compagnon intelligent conçu pour aider les aînés à comprendre leur bien-être et rester connectés avec leurs proches. Wanees écoute, comprend, soutient et connecte.'
    };

    const textToSpeak = narrationTexts[language];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US';
    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wanees-intro-title"
    >
      <div 
        id="wanees-product-intro-modal"
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] ${isRtl ? 'rtl' : 'ltr'}`}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-5 sm:p-6 relative flex flex-wrap items-center justify-between gap-4 border-b border-teal-700/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/30 border border-teal-400/40 text-teal-200 flex items-center justify-center shadow-inner">
              <HeartHandshake className="w-7 h-7 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-400/20 text-teal-200 border border-teal-400/30">
                  {language === 'ar' ? 'مقدمة المنصة' : language === 'fr' ? 'Introduction Produit' : 'Product Introduction'}
                </span>
                <span className="text-xs text-teal-300/80 font-medium">
                  {language === 'ar' ? 'منظومة العناية المعرفية والتواصل' : 'Cognitive Wellbeing & Connected Care'}
                </span>
              </div>
              <h1 id="wanees-intro-title" className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-0.5">
                {language === 'ar' ? 'أهلاً بك في ونيس' : language === 'fr' ? 'Bienvenue sur Wanees' : 'Welcome to Wanees'}
              </h1>
            </div>
          </div>

          {/* Top Utility Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSpeech}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isSpeaking 
                  ? 'bg-amber-500 text-slate-950 font-bold animate-pulse' 
                  : 'bg-white/10 hover:bg-white/20 text-teal-100'
              }`}
              title={language === 'ar' ? 'استمع إلى المقدمة' : 'Listen to Introduction'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isSpeaking 
                  ? (language === 'ar' ? 'إيقاف الصوت' : 'Stop') 
                  : (language === 'ar' ? 'استماع' : 'Listen')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsLargeText(!isLargeText)}
              className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                isLargeText ? 'bg-teal-400 text-slate-950' : 'bg-white/10 hover:bg-white/20 text-teal-100'
              }`}
              title={language === 'ar' ? 'تعديل حجم الخط' : 'Toggle Larger Text'}
            >
              Aa+
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close"
              className="p-2 rounded-xl text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs for Chapters */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'story', label: language === 'ar' ? 'الرؤية والهدف' : language === 'fr' ? 'Vision' : 'Vision & Purpose' },
            { id: 'care-model', label: language === 'ar' ? 'نموذج الرعاية (4 خطوات)' : language === 'fr' ? 'Modèle de Soins' : 'Care Model (4 Steps)' },
            { id: 'pillars', label: language === 'ar' ? 'القدرات الست' : language === 'fr' ? '6 Piliers' : '6 Core Pillars' },
            { id: 'ecosystem', label: language === 'ar' ? 'أكثر من مجرد ذكاء اصطناعي' : language === 'fr' ? 'Différenciation' : 'More Than AI' },
            { id: 'trust', label: language === 'ar' ? 'الخصوصية والأمان' : language === 'fr' ? 'Confiance' : 'Trust & Safety' },
            { id: 'roadmap', label: language === 'ar' ? 'خريطة الجولة (7 محطات)' : language === 'fr' ? 'Parcours du Tour' : 'Tour Roadmap (7 Steps)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as IntroSection)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeSection === tab.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body Content */}
        <div className={`p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 ${isLargeText ? 'text-base' : 'text-sm'}`}>
          
          {/* SECTION 1: VISION & PURPOSE */}
          {activeSection === 'story' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Supporting Headline Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80">
                <p className="text-base sm:text-lg font-bold text-teal-900 dark:text-teal-200 leading-snug">
                  {language === 'ar'
                    ? 'طريقة أذكى وأكثر تعاطفاً لدعم الشيخوخة الصحية.'
                    : language === 'fr'
                    ? 'Une approche plus intelligente et bienveillante du vieillissement en santé.'
                    : 'A smarter, more compassionate way to support healthy aging.'}
                </p>
                <p className="text-xs sm:text-sm text-teal-800/90 dark:text-teal-300/90 mt-1">
                  {language === 'ar'
                    ? 'منظومة قائمة على الذكاء الاصطناعي الوكيل للعناية المعرفية، والاطمئنان، والأمان، والرعاية المتصلة لكبار السن.'
                    : 'An agentic AI ecosystem for cognitive wellbeing, companionship, safety, and connected care for older adults.'}
                </p>
              </div>

              {/* Warm Opening Manifesto */}
              <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  {language === 'ar' ? (
                    <>
                      <strong>ونيس</strong> هو رفيق ذكي مصمم لمساعدة كبار السن على فهم عافيتهم اليومية والمعرفية، والبقاء على اتصال وثيق بمن يهتم لأمرهم، والتعامل مع جوانب الصحة والسلامة بثقة واستقلالية أكبر مع الحفاظ الكامل على الكرامة.
                    </>
                  ) : language === 'fr' ? (
                    <>
                      <strong>Wanees</strong> est un compagnon intelligent conçu pour aider les aînés à comprendre leur bien-être, à rester connectés avec leurs proches et à naviguer dans leur santé au quotidien avec dignité et sérénité.
                    </>
                  ) : (
                    <>
                      <strong>Wanees</strong> is an intelligent companion designed to help older adults understand their wellbeing, stay connected with the people who care about them, and navigate everyday health and safety with greater confidence and dignity.
                    </>
                  )}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    {language === 'ar' ? 'كيف تعمل منظومة ونيس المتكاملة؟' : 'How the Wanees Ecosystem Works'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {language === 'ar'
                      ? 'من خلال المحادثات الصوتية البسيطة والاطمئنان الودود، يستطيع ونيس التعرف على التغيرات الحقيقية في العافية والمزاج مع مرور الوقت، وتنظيم معلومات الأدوية وحساب عبئها المعرفي، والمساعدة في تجهيز ملخص الزيارة الطبية للأطباء، ومشاركة الطمأنينة مع أفراد الأسرة وفق موافقة صريحة ومحكمة.'
                      : 'Through simple conversations and check-ins, Wanees can identify meaningful changes in wellbeing over time, organize medication information, help prepare conversations with healthcare professionals, and connect trusted family members when the user chooses to share.'}
                  </p>
                </div>

                {/* Rufqa Callout */}
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                      {language === 'ar' ? 'رفقة: رفيق الحج والعمرة المخلص' : 'Rufqa: Dedicated Hajj & Umrah Pilgrimage Companion'}
                    </h5>
                    <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                      {language === 'ar'
                        ? 'خلال مناسك الحج والعمرة، يمتد دعم ونيس من خلال «رفقة»، الرفيق المخصص لمساعدة ضيوف الرحمن على البقاء على تواصل دائم مع مرشد الفوج، وجهات الاتصال الموثوقة، ومشاركة الموقع الآمن عند الحاجة لأي مساعدة أو عند الانفصال عن المجموعة.'
                        : 'During Hajj and Umrah, Wanees extends this support through Rufqa, a dedicated companion designed to help pilgrims stay connected with their group, trusted contacts, and location when assistance is needed.'}
                    </p>
                  </div>
                </div>

                {/* Core Philosophy Callout */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white text-center sm:text-right rtl:sm:text-right ltr:sm:text-left space-y-1 shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                    {language === 'ar' ? 'فلسفتنا الجوهرية' : 'Our Core Philosophy'}
                  </span>
                  <blockquote className="text-sm sm:text-base font-bold italic text-teal-50">
                    {language === 'ar'
                      ? '«ونيس لا يستبدل الرعاية الإنسانية؛ بل يساعد الجميع على تقديم رعاية أفضل، وأكثر وعياً، وتواصلاً، ورحمة.»'
                      : '"Wanees does not replace human care. It helps people provide better, more informed, more connected, and more compassionate care."'}
                  </blockquote>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: THE WANEES CARE MODEL (Listen -> Understand -> Support -> Connect) */}
          {activeSection === 'care-model' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-1 max-w-xl mx-auto">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {language === 'ar' ? 'رحلة الرعاية الرباعية' : 'The 4-Stage Care Journey'}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'يستمع ← يفهم ← يدعم ← يصل' : 'Listen → Understand → Support → Connect'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'ar'
                    ? 'كيف تتحول الكلمات العفوية إلى رعاية استباقية ومترابطة'
                    : 'How natural spoken conversations transform into proactive, connected care'}
                </p>
              </div>

              {/* 4 Cards Grid with Visual Progression */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. LISTEN */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-teal-500/40 shadow-sm space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                      01
                    </span>
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      <Volume2 className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {language === 'ar' ? 'يستمع (Listen)' : 'Listen'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {language === 'ar'
                      ? 'يستمع ونيس إلى المحادثات الطبيعية والاطمئنان الصوتي اليومي باللغة العربية ومختلف اللهجات، دون الحاجة لملء استبيانات أو نماذج معقدة.'
                      : 'Wanees listens to natural conversations and check-ins rather than requiring complicated forms.'}
                  </p>
                </div>

                {/* 2. UNDERSTAND */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-indigo-500/40 shadow-sm space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                      02
                    </span>
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      <Brain className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {language === 'ar' ? 'يفهم (Understand)' : 'Understand'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {language === 'ar'
                      ? 'يحلل الأنماط الطولية عبر الزمن لرصد التغيرات ذات الدلالة في المزاج، وجودة النوم، والطاقة، والمخاوف الإدراكية، وعبء الأدوية التراكمي.'
                      : 'It looks at patterns over time to help identify meaningful changes in wellbeing, mood, cognitive concerns, medication burden, and daily experience.'}
                  </p>
                </div>

                {/* 3. SUPPORT */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-emerald-500/40 shadow-sm space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                      03
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {language === 'ar' ? 'يدعم (Support)' : 'Support'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {language === 'ar'
                      ? 'يقدم اقتراحات لطيفة، وتذكيرات بمواعيد الدواء، وملخصات صحية، وتوجيهات عملية ضمن حدود أمان واضحة ومسؤولة طبياً.'
                      : 'Wanees provides appropriate suggestions, reminders, summaries, and next-step guidance within clearly defined safety boundaries.'}
                  </p>
                </div>

                {/* 4. CONNECT */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-amber-500/40 shadow-sm space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                      04
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {language === 'ar' ? 'يصل (Connect)' : 'Connect'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {language === 'ar'
                      ? 'عند الحاجة—وبموافقة المستخدم التامة—يساعد ونيس في وصل الوالد أو الوالدة بأبنائهم، ومقدمي الرعاية، أو الأطباء في الوقت المناسب.'
                      : "When appropriate—and with the user's permission—Wanees helps connect the senior with family, caregivers, or healthcare professionals."}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 3: 6 CORE CAPABILITIES */}
          {activeSection === 'pillars' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'الركائز الست لمنظومة ونيس' : 'The Six Core Pillars of Wanees'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'ar'
                    ? 'إمكانات صُممت بتناغم لتغطية جميع جوانب الاستقلالية والصحة'
                    : 'Capabilities designed to work harmoniously for senior dignity, safety, and health'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                
                {/* Pillar 1: Cognitive Wellbeing */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 shrink-0">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {language === 'ar' ? '🧠 العافية المعرفية' : '🧠 Cognitive Wellbeing'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {language === 'ar'
                        ? 'فهم التغيرات في المزاج، والذاكرة، والنوم، والطاقة من خلال المحادثات الطبيعية والأنماط الطولية المستمرة.'
                        : 'Understand changes in mood, memory concerns, sleep, energy, and overall wellbeing through natural conversations and longitudinal patterns.'}
                    </p>
                  </div>
                </div>

                {/* Pillar 2: Personal Check-ins */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {language === 'ar' ? '💬 الاطمئنان الصوتي الشخصي' : '💬 Personal Check-ins'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {language === 'ar'
                        ? 'عبر عن شعورك بكلماتك ولهجتك الخاصة. يحلل ونيس المحادثة للتعرف على التغيرات المهمة وتقديم إرشاد داعم.'
                        : 'Share how you are feeling in your own words. Wanees analyzes the conversation to identify meaningful changes and provide supportive guidance.'}
                    </p>
                  </div>
                </div>

                {/* Pillar 3: Medication Intelligence */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 shrink-0">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {language === 'ar' ? '💊 ذكاء الأدوية وحساب العبء (ACB)' : '💊 Medication Intelligence'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {language === 'ar'
                        ? 'مراجعة الأدوية وفهم مقياس العبء المعرفي لمضادات الكولين (ACB) لإثراء النقاش مع الطبيب وتفادي التداخلات.'
                        : 'Review medications and understand Anticholinergic Cognitive Burden scores that may help inform conversations with healthcare professionals.'}
                    </p>
                  </div>
                </div>

                {/* Pillar 4: Doctor Brief */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {language === 'ar' ? '🩺 ملخص الزيارة الطبية (Doctor Brief)' : '🩺 Doctor Brief'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {language === 'ar'
                        ? 'تحويل معلومات العافية والأدوية إلى تقرير سريري موجز في دقيقتين يساعد في التحضير لاستشارة طبية دقيقة ومثمرة.'
                        : 'Transform relevant wellbeing and medication information into a concise summary that can help prepare for a healthcare consultation.'}
                    </p>
                  </div>
                </div>

                {/* Pillar 5: Care Circle */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {language === 'ar' ? '👨‍👩‍👧 دائرة العائلة ورعاية الأحباء' : '👨‍👩‍👧 Care Circle'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {language === 'ar'
                        ? 'ابق على تواصل مع أفراد الأسرة الموثوقين أو مقدمي الرعاية من خلال مشاركة آمنة مبنية تماماً على الموافقة.'
                        : 'Stay connected with trusted family members or caregivers through permission-based information sharing.'}
                    </p>
                  </div>
                </div>

                {/* Pillar 6: Rufqa */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {language === 'ar' ? '🕋 رفقة لضيوف الرحمن' : '🕋 Rufqa (Hajj & Umrah)'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {language === 'ar'
                        ? 'دعم مخصص خلال الحج والعمرة يتضمن التواصل مع مرشد الفوج، ومشاركة الموقع، والمساعدة الفورية عند الانفصال أو التيه.'
                        : 'Receive specialized support during Hajj and Umrah, including group contact, location sharing, and assistance when separated or in need.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 4: DIFFERENTIATION & ECOSYSTEM VISUAL */}
          {activeSection === 'ecosystem' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-teal-900 text-white space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-300" />
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    {language === 'ar' ? 'أكثر من مجرد مساعد ذكاء اصطناعي' : 'More Than an AI Assistant'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                  {language === 'ar'
                    ? 'لم يُصمم ونيس لمجرد الإجابة على الأسئلة أو إجراء محادثات سطحية. بل صُمم ليفهم السياق، ويتعرف على التغيرات الحقيقية في العافية، ويوجه المستخدمين نحو الإجراءات السليمة، ويساعد في ربط الأشخاص المناسبين في الوقت المناسب.'
                    : 'Wanees is not designed simply to answer questions. It is designed to understand context, recognize meaningful changes, guide users toward appropriate actions, and help connect the right people at the right time.'}
                </p>

                {/* Flow Sequence: Conversation -> Insight -> Recommendation -> Human Connection */}
                <div className="pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 font-bold text-teal-100">
                      💬 {language === 'ar' ? 'محادثة عفوية' : 'Conversation'}
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 font-bold text-teal-100">
                      💡 {language === 'ar' ? 'رؤى دقيقة' : 'Insight'}
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 font-bold text-teal-100">
                      🧭 {language === 'ar' ? 'إرشاد سليم' : 'Recommendation'}
                    </div>
                    <div className="p-2.5 rounded-xl bg-teal-400 text-slate-950 font-extrabold">
                      ❤️ {language === 'ar' ? 'تواصل إنساني' : 'Human Connection'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Central Visual Ecosystem Map */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3 text-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {language === 'ar' ? 'ترابط المنظومة الإنسانية' : 'Connected Human Ecosystem'}
                </h4>
                
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-2">
                  <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    👴 {language === 'ar' ? 'كبير السن' : 'Senior'}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                  <div className="px-4 py-2 rounded-xl bg-teal-600 text-white font-extrabold text-xs shadow-md shadow-teal-600/30 flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'ونيس (Wanees AI)' : 'Wanees AI'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                  <div className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-extrabold text-xs">
                    👨‍👩‍👧 {language === 'ar' ? 'العائلة والأبناء' : 'Family & Circle'}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-extrabold text-xs">
                    🩺 {language === 'ar' ? 'الطبيب والمختص' : 'Doctor & Clinic'}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center gap-2 text-xs text-amber-700 dark:text-amber-300 font-medium">
                  <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>
                    {language === 'ar' 
                      ? '+ طبقة أمان الحج والعمرة (رفقة & مطوف الفوج)' 
                      : '+ Pilgrimage Safety Layer (Rufqa & Tawafa Guide)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: TRUST, PRIVACY & SAFETY */}
          {activeSection === 'trust' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {language === 'ar' ? 'الأمان والخصوصية أولاً' : 'Safety, Privacy & Control'}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'عافيتك. خياراتك. تحكّمك التام.' : 'Your wellbeing. Your choices. Your control.'}
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'صُمم ونيس حول مبادئ الكرامة، والخصوصية، والشفافية، والتحكم الشخصي الكامل. مشاركة أي معلومة مع أفراد الأسرة أو الأطباء تتم فقط بموافقتك المباشرة، مع توضيح صريح بأن تحليلات ونيس هي رؤى مساعدة وليست تشخيصات طبية قاطعة.'
                    : 'Wanees is designed around dignity, privacy, transparency, and user control. Sharing information with family members or healthcare professionals is strictly permission-based, and Wanees clearly communicates when information is an AI-generated insight rather than a medical diagnosis.'}
                </p>

                {/* Important Clinical Boundaries Box */}
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span>
                      {language === 'ar'
                        ? 'ونيس يدعم الحوارات الصحية ويعزز الاستعداد الطبي؛ لكنه لا يستبدل الأطباء، أو مقدمي الرعاية، أو خدمات الطوارئ (997).'
                        : 'Wanees supports healthcare conversations; it does not replace doctors, caregivers, or emergency services.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Privacy Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto" />
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                    {language === 'ar' ? 'تشفير وموافقة مشروطة' : 'Consent-First Matrix'}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ar' ? 'تحديد دقيق لما يُشارك مع كل ابن أو طبيب' : 'Granular permission per contact'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto" />
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                    {language === 'ar' ? 'تدرج الفرز الذكي (Triage)' : 'Safe Triage Protocol'}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ar' ? 'مستويات رعاية خضراء وصفراء وحمراء' : 'Green, Yellow & Red guidance'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                    {language === 'ar' ? 'إشراف إنساني دائم' : 'Human Oversight'}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ar' ? 'القرار الطبي والأخير دائماً للإنسان' : 'AI informs, humans decide'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: TOUR ROADMAP & PREVIEW */}
          {activeSection === 'roadmap' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {language === 'ar' ? 'دليل الجولة التفاعلية' : 'Interactive Walkthrough'}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'دعنا نستكشف ونيس معاً' : "Let's explore Wanees together"}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {language === 'ar'
                    ? 'في الدقائق القادمة، سنأخذك عبر المحطات الرئيسية ونوضح لك كيف يعمل كل جزء بتناغم تام.'
                    : "In the next few minutes, we'll take you through the key areas of the platform and show you how everything works together."}
                </p>
              </div>

              {/* 7-Step Visual Roadmap */}
              <div className="space-y-2.5">
                {[
                  {
                    step: '01',
                    title: language === 'ar' ? 'لوحة المتابعة الرئيسية' : 'Your Dashboard',
                    desc: language === 'ar' ? 'فهم عافيتك اليومية بلمحة واحدة واضحة.' : 'Understand your wellbeing at a glance.',
                    color: 'text-teal-600 dark:text-teal-400'
                  },
                  {
                    step: '02',
                    title: language === 'ar' ? 'الاطمئنان الصوتي الأسبوعي' : 'Weekly Check-in',
                    desc: language === 'ar' ? 'أخبر ونيس بصوتك كيف تشعر اليوم.' : "Tell Wanees how you're doing.",
                    color: 'text-blue-600 dark:text-blue-400'
                  },
                  {
                    step: '03',
                    title: language === 'ar' ? 'تحليل العافية المعرفية' : 'Cognitive Wellbeing',
                    desc: language === 'ar' ? 'اكتشف الأنماط والتغيرات مع مرور الوقت.' : 'Discover meaningful patterns over time.',
                    color: 'text-indigo-600 dark:text-indigo-400'
                  },
                  {
                    step: '04',
                    title: language === 'ar' ? 'ذكاء الأدوية وحساب ACB' : 'Medications',
                    desc: language === 'ar' ? 'افهم العبء المعرفي التراكمي للأدوية وبدائلها.' : 'Understand medication cognitive burden.',
                    color: 'text-purple-600 dark:text-purple-400'
                  },
                  {
                    step: '05',
                    title: language === 'ar' ? 'ملخص الطبيب (Doctor Brief)' : 'Doctor Brief',
                    desc: language === 'ar' ? 'استعد لحوار طبي مثمر ومختصر في دقيقتين.' : 'Prepare for better healthcare conversations.',
                    color: 'text-emerald-600 dark:text-emerald-400'
                  },
                  {
                    step: '06',
                    title: language === 'ar' ? 'دائرة العائلة (Care Circle)' : 'Care Circle',
                    desc: language === 'ar' ? 'تواصل مع من تثق بهم بمحبة وأمان.' : 'Connect with trusted people.',
                    color: 'text-pink-600 dark:text-pink-400'
                  },
                  {
                    step: '07',
                    title: language === 'ar' ? 'رفقة الحج والعمرة (Rufqa)' : 'Rufqa',
                    desc: language === 'ar' ? 'رفيقك المخلص في المناسك ومشاركة الموقع.' : 'Discover your Hajj & Umrah companion.',
                    color: 'text-amber-600 dark:text-amber-400'
                  }
                ].map((item) => (
                  <div 
                    key={item.step}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-black text-sm ${item.color}`}>
                        {item.step}
                      </span>
                      <div>
                        <strong className="text-slate-900 dark:text-white block">
                          {item.title}
                        </strong>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 italic">
                {language === 'ar'
                  ? '💡 يمكنك التحرك حسب سرعتك المريحة، والرجوع لأي خطوة، أو إعادة الجولة متى شئت.'
                  : '💡 You can move at your own pace, go back to previous steps, skip any section, or restart the tour whenever you need.'}
              </p>
            </div>
          )}

          {/* FINAL EMOTIONAL MESSAGE BANNER */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white shadow-lg space-y-2 border border-teal-500/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold text-teal-200 uppercase tracking-wide">
                {language === 'ar' ? 'رسالتنا الختامية' : 'Our Commitment'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-50 font-medium leading-relaxed">
              {language === 'ar'
                ? '«بُني ونيس حول فكرة بسيطة: عندما نفهم التغيرات في وقت أبكر، ونبقى على اتصال دائم، ونجمع الأشخاص المناسبين معاً، يمكننا مساعدة الشيخوخة لتكون تجربة أكثر أماناً، واستقلالية، وكرامة.»'
                : '"Wanees is built around a simple idea: when we understand changes earlier, stay connected, and bring the right people together, we can help aging feel safer, more independent, and more dignified."'}
            </p>
            <p className="text-xs font-bold text-amber-300 pt-1">
              {language === 'ar' ? 'أهلاً بك في ونيس. دعنا نبدأ.' : "Welcome to Wanees. Let's begin."}
            </p>
          </div>

        </div>

        {/* Footer Actions & Direct CTAs */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Don't show automatically again */}
          <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none order-2 sm:order-1">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
            />
            <span>{language === 'ar' ? 'عدم إظهار هذه المقدمة تلقائياً' : "Don't show automatically again"}</span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
            <button
              type="button"
              id="btn-intro-skip-for-now"
              onClick={handleDismiss}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors"
            >
              {language === 'ar' ? 'تخطي الآن' : 'Skip for Now'}
            </button>

            <button
              type="button"
              id="btn-intro-explore-solo"
              onClick={handleDismiss}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm transition-colors"
            >
              {language === 'ar' ? 'استكشاف بمفردي' : 'Explore on My Own'}
            </button>

            {/* Primary Hero CTA */}
            <button
              type="button"
              id="btn-intro-start-guided-tour"
              onClick={handleStartTourClick}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-600/30 transition-transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{language === 'ar' ? 'ابدأ الجولة التفاعلية ←' : 'Start the Guided Tour →'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

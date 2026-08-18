import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Play, 
  Sparkles, 
  Compass, 
  HeartHandshake, 
  Users, 
  Stethoscope, 
  Cpu, 
  Briefcase, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  PhoneCall,
  Sliders,
  FileText
} from 'lucide-react';
import { SupportedLanguage, PersonaMode } from '../../types';
import { FEATURE_GUIDE_ITEMS, FAQ_ITEMS, CONTEXTUAL_HELP_ITEMS } from '../../data/walkthroughData';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onStartTour: () => void;
  onStartShowMeHow: (workflow: string) => void;
  onNavigateToMode: (mode: PersonaMode) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenContextualHelp: (topic: string) => void;
  onOpenProductIntroduction?: () => void;
}

type TabType = 'start' | 'features' | 'faq' | 'accessibility' | 'rufqa-safety';

export const HowToUseModal: React.FC<HowToUseModalProps> = ({
  isOpen,
  onClose,
  language,
  onStartTour,
  onStartShowMeHow,
  onNavigateToMode,
  voiceEnabled,
  onToggleVoice,
  onOpenContextualHelp,
  onOpenProductIntroduction
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('start');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  if (!isOpen) return null;

  const isRtl = language === 'ar';
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const filteredFaqs = FAQ_ITEMS.filter(item => {
    const q = item.question[language].toLowerCase();
    const a = item.answer[language].toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return !query || q.includes(query) || a.includes(query);
  });

  const getFeatureIcon = (name: string) => {
    switch (name) {
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'Users': return <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      default: return <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn">
      <div 
        id="how-to-use-onboarding-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-to-use-title"
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold backdrop-blur">
                <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'ar' ? 'مركز المساعدة ودليل الاستخدام' : 'Onboarding & Help Center'}</span>
              </div>
              <h1 id="how-to-use-title" className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {language === 'ar' ? 'دليل استخدام ونيس' : 'How to Use Wanees'}
              </h1>
              <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
                {language === 'ar' 
                  ? 'دليلك السريع لتحقيق أقصى استفادة من رفيقك الصحي الذكي ونيس.'
                  : 'A quick guide to help you get the most from your Wanees companion.'}
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-5 scrollbar-none">
            <button
              id="tab-btn-start"
              onClick={() => setActiveTab('start')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'start' 
                  ? 'bg-white text-teal-900 shadow-md font-extrabold' 
                  : 'bg-white/10 text-teal-100 hover:bg-white/20'
              }`}
            >
              {language === 'ar' ? 'ابدأ الجولة التفاعلية' : 'Guided Tour'}
            </button>

            <button
              id="tab-btn-features"
              onClick={() => setActiveTab('features')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'features' 
                  ? 'bg-white text-teal-900 shadow-md font-extrabold' 
                  : 'bg-white/10 text-teal-100 hover:bg-white/20'
              }`}
            >
              {language === 'ar' ? 'دليل الميزات والقدرات' : 'Explore Features'}
            </button>

            <button
              id="tab-btn-faq"
              onClick={() => setActiveTab('faq')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'faq' 
                  ? 'bg-white text-teal-900 shadow-md font-extrabold' 
                  : 'bg-white/10 text-teal-100 hover:bg-white/20'
              }`}
            >
              {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}
            </button>

            <button
              id="tab-btn-accessibility"
              onClick={() => setActiveTab('accessibility')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'accessibility' 
                  ? 'bg-white text-teal-900 shadow-md font-extrabold' 
                  : 'bg-white/10 text-teal-100 hover:bg-white/20'
              }`}
            >
              {language === 'ar' ? 'وضع كبار السن وسهولة الاستخدام' : 'Senior Mode'}
            </button>

            <button
              id="tab-btn-rufqa-safety"
              onClick={() => setActiveTab('rufqa-safety')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'rufqa-safety' 
                  ? 'bg-white text-teal-900 shadow-md font-extrabold' 
                  : 'bg-white/10 text-teal-100 hover:bg-white/20'
              }`}
            >
              {language === 'ar' ? 'دليل أمان رفقة والطوارئ' : 'Rufqa & Safety'}
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: Start Guided Tour & Quick Actions */}
          {activeTab === 'start' && (
            <div className="space-y-6">
              
              {/* Big Hero Guided Tour Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-teal-950/40 dark:to-slate-900 border border-teal-200/80 dark:border-teal-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-600 text-white">
                      {language === 'ar' ? 'جولة تفاعلية حية' : 'Interactive Walkthrough'}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {language === 'ar' ? '7 محطات سريعة (دقيقتان)' : '7 Steps (approx 2 mins)'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {language === 'ar' ? 'استكشف ونيس خطوة بخطوة' : 'Explore Wanees Step-by-Step'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {language === 'ar'
                      ? 'جولة سياقية ذكية تسلط الضوء على الشاشة الحية وتعرّفك على كيفية الاطمئنان الصوتي، وتتبع الأنماط، ومراجعة أدوية ACB، واستخدام رفقة.'
                      : 'A live spotlight tour highlighting real interface elements: voice check-ins, longitudinal pattern graphs, ACB medication risk scoring, and Rufqa pilgrimage tools.'}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    id="btn-start-guided-tour-modal"
                    onClick={() => {
                      onClose();
                      onStartTour();
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-teal-700/25 transition-transform active:scale-95 flex items-center justify-center gap-2.5"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>{language === 'ar' ? 'بدء الجولة الحية الآن' : 'Start Guided Tour'}</span>
                  </button>

                  {onOpenProductIntroduction && (
                    <button
                      type="button"
                      id="btn-open-product-intro-modal"
                      onClick={() => {
                        onClose();
                        onOpenProductIntroduction();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{language === 'ar' ? 'مقدمة المنصة ورؤية ونيس' : 'Wanees Product Overview & Vision'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mental Model Cards: The Wanees Care Flow */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ar' ? 'كيف تعمل دائرة الرعاية في ونيس؟' : 'The Wanees Care Flow'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {language === 'ar' ? 'الاطمئنان الصوتي' : 'Voice Check-in'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'ar' ? 'تحدث بلهجتك الطبيعية وصوتك المريح.' : 'Speak naturally without tedious medical forms.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {language === 'ar' ? 'فهم الأنماط' : 'Pattern Insights'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'ar' ? 'متابعة تغيرات النوم والمزاج ضد خط الأساس.' : 'Track sleep, mood, and fatigue trajectories.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {language === 'ar' ? 'مراجعة الأدوية' : 'Medication Risk'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'ar' ? 'حساب عبء الأدوية المعرفي (ACB) واقتراح البدائل.' : 'Monitor anticholinergic burden to reduce confusion.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {language === 'ar' ? 'ملخص الطبيب' : 'Doctor Brief'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'ar' ? 'تجهيز تقرير سريري يقرأه الطبيب في دقيقتين.' : '2-minute executive summary for your clinician.'}
                    </p>
                  </div>

                </div>
              </div>

              {/* Show Me How Guided Workflows */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ar' ? 'مسارات إرشادية موجهة ("أرني كيف"):' : 'Show Me How Workflows:'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Workflow 1: Doctor Brief */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between shadow-2xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {language === 'ar' ? 'كيف تُنشئ ملخص الطبيب للزيارة القادمة؟' : 'How to Create a Doctor Brief?'}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {language === 'ar' 
                          ? 'مسار إرشادي يوجهك من بيانات الاطمئنان اليومي مروراً بعبء الأدوية حتى تصدير التقرير السريري للطبيب.'
                          : 'Step-by-step workflow navigating from daily check-ins and ACB meds to generating your exportable clinical summary.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToMode('clinician');
                        onStartShowMeHow('doctor-brief');
                      }}
                      className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-xs font-bold transition-colors"
                    >
                      <span>{language === 'ar' ? 'أرني كيف أنشئ الملخص ←' : 'Show Me How →'}</span>
                      <Arrow className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Workflow 2: Rufqa Emergency */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between shadow-2xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {language === 'ar' ? 'كيف تستخدم رفقة في الحج والعمرة؟' : 'How to Use Rufqa during Pilgrimage?'}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {language === 'ar'
                          ? 'تعلم كيفية إطلاق تنبيه "أنا تائه" ومشاركة الموقع المباشر مع المطوف والوصول للبطاقات الرقمية.'
                          : 'Learn how to trigger the "I\'m Lost" emergency beacon and share live location with your Tawafa group leader.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToMode('rufqa');
                        onStartShowMeHow('rufqa');
                      }}
                      className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold transition-colors"
                    >
                      <span>{language === 'ar' ? 'أرني كيفية استخدام رفقة ←' : 'Show Me How →'}</span>
                      <Arrow className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Explore Features Directory */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {language === 'ar' ? 'دليل ميزات منصة ونيس' : 'Explore Wanees Capabilities'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'ar' ? 'اختر أي ميزة للتعرف عليها أو الانتقال المباشر إليها' : 'Browse each capability or jump straight into the live view'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FEATURE_GUIDE_ITEMS.map((feat) => (
                  <div 
                    key={feat.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-2xs hover:border-teal-400 dark:hover:border-teal-600 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            {getFeatureIcon(feat.iconName)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                              {feat.title[language]}
                            </h4>
                            <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                              {feat.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {feat.description[language]}
                      </p>

                      <div className="space-y-1 pt-1">
                        {feat.highlights[language].slice(0, 3).map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <CheckCircle2 className="w-3 h-3 text-teal-500 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToMode(feat.targetMode);
                      }}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white dark:bg-slate-800 dark:hover:bg-teal-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                    >
                      <span>{language === 'ar' ? 'فتح هذه الشاشة مباشرة' : 'Open This Screen'}</span>
                      <Arrow className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FAQs */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث في الأسئلة الشائعة...' : 'Search frequently asked questions...'}
                  className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div 
                      key={faq.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="w-full p-4 text-left rtl:text-right flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span>{faq.question[language]}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                          {faq.answer[language]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Accessibility & Senior Mode */}
          {activeTab === 'accessibility' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>{language === 'ar' ? 'مبادئ تصميم كبار السن في ونيس' : 'Senior Accessibility Principles'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'تم تصميم ونيس بعناية فائقة ليلائم كبار السن، حيث يعتمد على أزرار لمس كبيرة تزيد عن 48 بكسل، ونصوص عالية التباين، واستماع صوتي لكافة التعليمات، لتوفير أقصى درجات الراحة والاستقلالية.'
                    : 'Wanees is designed senior-first: large touch targets (48px+), high-contrast readable typography, spoken audio narration, and zero unnecessary visual clutter.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Voice Toggle */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {language === 'ar' ? 'التوجيه الصوتي الناطق' : 'Voice Readout'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {voiceEnabled ? (language === 'ar' ? 'مفعّل حالياً' : 'Currently enabled') : (language === 'ar' ? 'صامت' : 'Muted')}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onToggleVoice}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      voiceEnabled 
                        ? 'bg-teal-600 text-white shadow-xs' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {voiceEnabled ? (language === 'ar' ? 'مفعّل' : 'ON') : (language === 'ar' ? 'معطل' : 'OFF')}
                  </button>
                </div>

                {/* Dialect Support */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {language === 'ar' ? 'فهم اللهجات الإقليمية' : 'Dialectal Recognition'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {language === 'ar' ? 'الحجازية، النجدية، والخليجية' : 'Hejazi, Najdi & Gulf dialects'}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Active
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: Rufqa & Emergency Safety Guide */}
          {activeTab === 'rufqa-safety' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5" />
                  <span>{language === 'ar' ? 'إرشادات السلامة واستخدام الطوارئ' : 'Emergency & Safety Guidelines'}</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
                  {language === 'ar'
                    ? 'في حالات الطوارئ الطبية الحرجة داخل المملكة العربية السعودية، اتصل فوراً بالهلال الأحمر (997) أو الطوارئ الموحدة (911). لا تستخدم التطبيق كبديل لخدمات الإسعاف المباشرة.'
                    : 'In urgent medical emergencies within Saudi Arabia, immediately contact Red Crescent (997) or Unified Emergency (911). Wanees is not a replacement for direct emergency dispatch.'}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ar' ? 'أزرار الطوارئ في رفقة:' : 'Rufqa Emergency Features:'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span>{language === 'ar' ? 'زر "أنا تائه" (Lost Pilgrim Beacon)' : '"I\'m Lost" Pilgrim Beacon'}</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {language === 'ar'
                        ? 'مخصص لحالات فقدان المجموعة أو عدم معرفة طريق العودة للمخيم/الفندق. يشارك الموقع فوراً مع المطوف والعائلة.'
                        : 'Designed specifically for lost pilgrims in Makkah/Madinah. Transmits live coordinates to your group leader.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>{language === 'ar' ? 'بطاقات الطوارئ بـ 6 لغات' : '6-Language Digital ID Badges'}</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {language === 'ar'
                        ? 'بطاقة رقمية واضحة برقم الخيمة والحملة جاهزة للإبراز لرجال الأمن والمسعفين بدون الحاجة لإنترنت.'
                        : 'Offline-resilient digital emergency ID card to show local security officers in the Holy Sites.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Wanees Ecosystem v2.4 Pro • Geriatric Decision Support</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartTour();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-700/20 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{language === 'ar' ? 'بدء الجولة التعريفية' : 'Start Tour'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

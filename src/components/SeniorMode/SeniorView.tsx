import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Mic, 
  Smile, 
  Moon, 
  Pill, 
  ShieldAlert, 
  Compass, 
  Volume2, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  Bell,
  HelpCircle,
  Brain
} from 'lucide-react';
import { SeniorProfile, CheckInRecord, Medication, SupportedLanguage, PersonaMode, CareCircleMember } from '../../types';
import { DICTIONARY } from '../../data/i18n';
import { SeniorVoiceAssistant } from './SeniorVoiceAssistant';
import { SeniorMedicationView } from './SeniorMedicationView';
import { ContextualHelpButton } from '../Walkthrough/ContextualHelpButton';
import { HowWaneesUnderstandsModal } from './HowWaneesUnderstandsModal';
import { SeniorAiHealthSummaryCard } from './SeniorAiHealthSummaryCard';
import { SeniorVoiceShortcutsTip } from './SeniorVoiceShortcutsTip';
import { SeniorCognitiveTrends } from './SeniorCognitiveTrends';
import { DailyCognitiveGoalTracker } from './DailyCognitiveGoalTracker';
import { SeniorSuggestedSocialActivity } from './SeniorSuggestedSocialActivity';
import { WaneesLogo } from '../WaneesLogo';
import { LongitudinalMetrics } from '../../types';

interface SeniorViewProps {
  senior: SeniorProfile;
  latestCheckIn?: CheckInRecord;
  medications: Medication[];
  longitudinalData?: LongitudinalMetrics[];
  onOpenCheckinModal: () => void;
  onToggleMedicationTaken: (id: string) => void;
  onNavigateToMode: (mode: PersonaMode) => void;
  language: SupportedLanguage;
  voiceEnabled: boolean;
  totalAcbScore: number;
  careCircle?: CareCircleMember[];
  onOpenContextualHelp?: (topic: string) => void;
  onOpenEmergencyCard?: () => void;
  onTriggerReminderToast?: (med: Medication) => void;
  onOpenReminderModal?: () => void;
}

export const SeniorView: React.FC<SeniorViewProps> = ({
  senior,
  latestCheckIn,
  medications = [],
  longitudinalData,
  onOpenCheckinModal,
  onToggleMedicationTaken,
  onNavigateToMode,
  language,
  voiceEnabled,
  totalAcbScore,
  careCircle = [],
  onOpenContextualHelp,
  onOpenEmergencyCard,
  onTriggerReminderToast,
  onOpenReminderModal
}) => {
  const t = DICTIONARY[language];
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState<'overview' | 'meds' | 'trends' | 'chat'>('overview');
  const [isHowWaneesUnderstandsOpen, setIsHowWaneesUnderstandsOpen] = useState(false);
  const safeMedications = medications || [];

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleOpenHowWaneesUnderstands = () => {
    setIsHowWaneesUnderstandsOpen(true);
    if (onOpenContextualHelp) {
      onOpenContextualHelp('voice-checkin');
    }
  };

  return (
    <div id="senior-view-container" className="space-y-6 animate-fadeIn">
      
      {/* Warm Greeting Hero Banner */}
      <section className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden">
        {/* Subtle Watermark Logo */}
        <div className="absolute -right-8 -bottom-8 w-56 h-56 opacity-10 pointer-events-none">
          <WaneesLogo variant="icon" size="2xl" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-teal-100 text-xs font-semibold backdrop-blur">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {language === 'ar' ? 'ونيس — رفيقك الصحي الدائم' : 'Wanees — Your Daily Companion'}
              </span>

              {/* Upgraded "How Does Wanees Understand Me?" Interactive React Button */}
              <button
                type="button"
                id="btn-how-wanees-understands-hero"
                onClick={handleOpenHowWaneesUnderstands}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400/25 hover:bg-amber-400/40 text-amber-200 hover:text-white transition-all border border-amber-300/40 shadow-xs cursor-pointer active:scale-95"
                title={language === 'ar' ? 'اكتشف كيف يحلل ونيس نبرتك ولهجتك ويفهمك' : 'Discover how Wanees parses your voice and dialect'}
              >
                <Brain className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{language === 'ar' ? 'كيف يفهمني ونيس؟' : 'How does check-in work?'}</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.goodMorning}
            </h1>
            <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
              {t.howAreYouToday}
            </p>
          </div>

          {/* Big Accessible Check-in CTA Button */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              id="start-voice-checkin-hero-btn"
              onClick={onOpenCheckinModal}
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-base sm:text-lg shadow-lg shadow-amber-400/30 flex items-center justify-center gap-3 transition-transform active:scale-95 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-950/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Mic className="w-6 h-6 text-amber-950" />
              </div>
              <span>{t.startCheckin}</span>
            </button>

            <button
              id="goto-rufqa-hero-btn"
              onClick={() => onNavigateToMode('rufqa')}
              className="w-full sm:w-auto px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base backdrop-blur flex items-center justify-center gap-2 transition-colors border border-white/20 cursor-pointer"
            >
              <Compass className="w-5 h-5 text-amber-300 shrink-0" />
              <span>{language === 'ar' ? 'رفقة الحج والعمرة' : 'Rufqa Pilgrimage'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Tabs for Senior */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full sm:max-w-lg overflow-x-auto scrollbar-none">
        <button
          id="senior-tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center whitespace-nowrap cursor-pointer ${activeTab === 'overview' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          {language === 'ar' ? 'اليوميات' : 'Daily Wellbeing'}
        </button>

        <button
          id="senior-tab-meds"
          onClick={() => setActiveTab('meds')}
          className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center whitespace-nowrap cursor-pointer ${activeTab === 'meds' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          {t.medicationTracker}
        </button>

        <button
          id="senior-tab-trends"
          onClick={() => setActiveTab('trends')}
          className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center whitespace-nowrap cursor-pointer ${activeTab === 'trends' ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          {language === 'ar' ? 'مؤشرات المزاج والنوم' : 'Cognitive Trends'}
        </button>

        <button
          id="senior-tab-chat"
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center whitespace-nowrap cursor-pointer ${activeTab === 'chat' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          {language === 'ar' ? 'محادثة ونيس' : 'Voice Companion'}
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Center 2 Cols: Senior Daily Summary & Fast Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Short Natural Language Health Status Summary (AI Insight) */}
            <SeniorAiHealthSummaryCard
              senior={senior}
              latestCheckIn={latestCheckIn}
              medications={safeMedications}
              totalAcbScore={totalAcbScore}
              language={language}
              voiceEnabled={voiceEnabled}
            />

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Today's Medication Card */}
              <div 
                id="senior-meds-summary-card"
                onClick={() => setActiveTab('meds')}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Pill className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    {safeMedications.filter(m => m.isTakenToday).length} / {safeMedications.length} {language === 'ar' ? 'تم أخذها' : 'taken'}
                  </span>
                </div>
                <div className="my-3">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {t.myMedications}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {safeMedications.length > 0 
                      ? (language === 'ar' ? `الجرعة القادمة: ${safeMedications[0].name} (${safeMedications[0].dosage})` : `Next dose: ${safeMedications[0].name}`)
                      : (language === 'ar' ? 'لا توجد أدوية متبقية اليوم' : 'No medications remaining')}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-bold">
                  <span>{language === 'ar' ? 'عرض جدول الأدوية' : 'View full schedule'}</span>
                  <ArrowIcon className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Latest Check-In Pulse Card */}
              <div 
                id="senior-checkin-summary-card"
                onClick={onOpenCheckinModal}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Smile className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {latestCheckIn ? (language === 'ar' ? 'جلسة اليوم مكتملة' : 'Completed') : (language === 'ar' ? 'في انتظارك' : 'Pending')}
                  </span>
                </div>
                <div className="my-3">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {language === 'ar' ? 'جلسة الاطمئنان الصباحي' : 'Daily Voice Check-in'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {latestCheckIn 
                      ? (language === 'ar' ? `آخر تسجيل: ${latestCheckIn.timestamp}` : `Last recorded at ${latestCheckIn.timestamp}`)
                      : (language === 'ar' ? 'ابدأ الآن وتحدث مع ونيس بصوتك' : 'Tap to start your check-in')}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold">
                  <span>{latestCheckIn ? (language === 'ar' ? 'إجراء جلسة جديدة' : 'Record another check-in') : (language === 'ar' ? 'ابدأ التحدث' : 'Start now')}</span>
                  <ArrowIcon className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>

            {/* Quick Portals to Other Modes for Exploration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Emergency Card Quick Button */}
              {onOpenEmergencyCard && (
                <button
                  type="button"
                  id="senior-open-emergency-card-btn"
                  onClick={onOpenEmergencyCard}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-500/50 transition-all text-left rtl:text-right cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {senior.gender === 'female' ? 'أم أحمد' : senior.fullName}
                    </span>
                  </div>
                  <div className="my-3">
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {language === 'ar' ? 'بطاقة الطوارئ والهوية الصحية' : 'Digital Emergency Card'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'ar' ? 'فصيلة الدم، الحساسية، ورمز المسعفين' : 'Blood type, allergies & QR pass'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-bold">
                    <span>{language === 'ar' ? 'عرض بطاقتي الرقمية' : 'Open My Card'}</span>
                    <ArrowIcon className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              )}

              {/* Family Circle Quick Button */}
              <button
                type="button"
                id="senior-goto-family-portal-btn"
                onClick={() => onNavigateToMode('family')}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all text-left rtl:text-right cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    Maryam
                  </span>
                </div>
                <div className="my-3">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? 'دائرة الأهل ومريم' : 'Family Circle Portal'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'ar' ? 'متابعة الأبناء' : 'Caregiver sync'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                  <span>{language === 'ar' ? 'لوحة العائلة' : 'Open Circle'}</span>
                  <ArrowIcon className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Daily Cognitive Goal Tracker & 3-Day Reward Milestone */}
            <DailyCognitiveGoalTracker
              language={language}
              senior={senior}
              latestCheckIn={latestCheckIn}
              onOpenCheckinModal={onOpenCheckinModal}
            />

            {/* 7-Day Cognitive & Wellbeing Trends Section */}
            <SeniorCognitiveTrends data={longitudinalData} language={language} />

            {/* Suggested Social & Calming Activities Widget */}
            <SeniorSuggestedSocialActivity
              senior={senior}
              latestCheckIn={latestCheckIn}
              careCircle={careCircle}
              language={language}
              onOpenCheckinModal={onOpenCheckinModal}
            />

            {/* Voice Shortcuts & Natural Commands Info-Tip */}
            <SeniorVoiceShortcutsTip language={language} />

          </div>

          {/* Right Column: Embedded Voice Assistant */}
          <div className="lg:col-span-1 space-y-4">
            <SeniorVoiceAssistant language={language} voiceEnabled={voiceEnabled} />
          </div>

        </div>
      )}

      {activeTab === 'meds' && (
        <SeniorMedicationView
          medications={medications}
          onToggleTaken={onToggleMedicationTaken}
          language={language}
          totalAcbScore={totalAcbScore}
          careCircle={careCircle}
          onTriggerReminderToast={onTriggerReminderToast}
          onOpenReminderModal={onOpenReminderModal}
        />
      )}

      {activeTab === 'trends' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <DailyCognitiveGoalTracker
            language={language}
            senior={senior}
            latestCheckIn={latestCheckIn}
            onOpenCheckinModal={onOpenCheckinModal}
          />
          <SeniorCognitiveTrends data={longitudinalData} language={language} />
          <SeniorSuggestedSocialActivity
            senior={senior}
            latestCheckIn={latestCheckIn}
            careCircle={careCircle}
            language={language}
            onOpenCheckinModal={onOpenCheckinModal}
          />
          <SeniorVoiceShortcutsTip language={language} />
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <SeniorVoiceAssistant language={language} voiceEnabled={voiceEnabled} />
          <SeniorVoiceShortcutsTip language={language} />
        </div>
      )}

      {/* Upgraded Professional React Modal: How Wanees Understands Me */}
      <HowWaneesUnderstandsModal
        isOpen={isHowWaneesUnderstandsOpen}
        onClose={() => setIsHowWaneesUnderstandsOpen(false)}
        language={language}
        senior={senior}
        medications={medications}
        latestCheckIn={latestCheckIn}
      />

    </div>
  );
};

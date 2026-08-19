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
  HelpCircle
} from 'lucide-react';
import { SeniorProfile, CheckInRecord, Medication, SupportedLanguage, PersonaMode } from '../../types';
import { DICTIONARY } from '../../data/i18n';
import { SeniorVoiceAssistant } from './SeniorVoiceAssistant';
import { SeniorMedicationView } from './SeniorMedicationView';
import { ContextualHelpButton } from '../Walkthrough/ContextualHelpButton';
import { WaneesLogo } from '../WaneesLogo';

interface SeniorViewProps {
  senior: SeniorProfile;
  latestCheckIn?: CheckInRecord;
  medications: Medication[];
  onOpenCheckinModal: () => void;
  onToggleMedicationTaken: (id: string) => void;
  onNavigateToMode: (mode: PersonaMode) => void;
  language: SupportedLanguage;
  voiceEnabled: boolean;
  totalAcbScore: number;
  onOpenContextualHelp?: (topic: string) => void;
  onOpenEmergencyCard?: () => void;
  onTriggerReminderToast?: (med: Medication) => void;
  onOpenReminderModal?: () => void;
}

export const SeniorView: React.FC<SeniorViewProps> = ({
  senior,
  latestCheckIn,
  medications = [],
  onOpenCheckinModal,
  onToggleMedicationTaken,
  onNavigateToMode,
  language,
  voiceEnabled,
  totalAcbScore,
  onOpenContextualHelp,
  onOpenEmergencyCard,
  onTriggerReminderToast,
  onOpenReminderModal
}) => {
  const t = DICTIONARY[language];
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState<'overview' | 'meds' | 'chat'>('overview');
  const safeMedications = medications || [];

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

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
              {onOpenContextualHelp && (
                <button
                  type="button"
                  onClick={() => onOpenContextualHelp('voice-checkin')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 text-white transition-colors"
                  title="How does Wanees analyze check-ins?"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'كيف يفهمني ونيس؟' : 'How does check-in work?'}</span>
                </button>
              )}
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
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-base sm:text-lg shadow-lg shadow-amber-400/30 flex items-center justify-center gap-3 transition-transform active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-950/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Mic className="w-6 h-6 text-amber-950" />
              </div>
              <span>{t.startCheckin}</span>
            </button>

            <button
              id="goto-rufqa-hero-btn"
              onClick={() => onNavigateToMode('rufqa')}
              className="w-full sm:w-auto px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base backdrop-blur flex items-center justify-center gap-2 transition-colors border border-white/20"
            >
              <Compass className="w-5 h-5 text-amber-300 shrink-0" />
              <span>{language === 'ar' ? 'رفقة الحج والعمرة' : 'Rufqa Pilgrimage'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Tabs for Senior */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full sm:max-w-md overflow-x-auto scrollbar-none">
        <button
          id="senior-tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center whitespace-nowrap ${activeTab === 'overview' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          {language === 'ar' ? 'اليوميات' : 'Daily Wellbeing'}
        </button>

        <button
          id="senior-tab-meds"
          onClick={() => setActiveTab('meds')}
          className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center whitespace-nowrap ${activeTab === 'meds' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          {language === 'ar' ? 'أدويتي' : 'Medications'}
        </button>

        <button
          id="senior-tab-chat"
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center whitespace-nowrap ${activeTab === 'chat' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          {language === 'ar' ? 'محادثة ونيس' : 'Voice Chat'}
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Main 2-Columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Latest Conversation & Highlight */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {t.recentCheckin}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {senior.lastCheckInTime}
                </span>
              </div>

              {latestCheckIn ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">
                      "{latestCheckIn.transcript}"
                    </p>
                  </div>

                  {latestCheckIn.agentResponse && (
                    <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-teal-900 dark:text-teal-200">
                        "{latestCheckIn.agentResponse}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Bell className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t.familyNotice}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {language === 'ar' ? 'لم يتم تسجيل فحص صوتي اليوم بعد. اضغطي الزر أعلاه للاطمئنان.' : 'No check-in recorded yet today. Tap start check-in above.'}
                </p>
              )}
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Mood & Spirit Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-emerald-600">
                  <Smile className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mood</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {latestCheckIn ? `${latestCheckIn.moodScore}/10` : '8.5/10'}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'ar' ? 'راحة وطمأنينة مستقرة' : 'Peaceful & Steady'}
                  </p>
                </div>
              </div>

              {/* Sleep Duration */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-indigo-600">
                  <Moon className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sleep</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {latestCheckIn ? `${latestCheckIn.sleepHours} hrs` : '7.0 hrs'}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'ar' ? 'نوم متقطع خفيف' : 'Slight fragmentation'}
                  </p>
                </div>
              </div>

              {/* Medication Compliance */}
              <button
                type="button"
                onClick={() => setActiveTab('meds')}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-left transition-all hover:border-teal-400 group cursor-pointer"
                title="View today's medications and reminders"
              >
                <div className="flex items-center justify-between text-teal-600">
                  <Pill className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Bell className="w-3 h-3 text-teal-500" />
                    Meds
                  </span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {safeMedications.filter(m => m.isTakenToday).length}/{safeMedications.length}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center justify-between">
                    <span>{language === 'ar' ? 'جرعات اليوم المكتملة' : 'Doses taken today'}</span>
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold group-hover:underline">
                      {language === 'ar' ? 'عرض التنبيهات ←' : 'View →'}
                    </span>
                  </p>
                </div>
              </button>

            </div>

            {/* Quick Link to Rufqa, Care Circle & Emergency Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Digital Emergency Card Quick Tile */}
              <button
                id="senior-view-emergency-card-btn"
                onClick={onOpenEmergencyCard}
                className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-teal-950 border-2 border-teal-500/40 hover:border-teal-400 text-left text-white shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shadow-sm">
                    <ShieldAlert className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                    O+ POS
                  </span>
                </div>
                <div className="my-3">
                  <h4 className="font-extrabold text-base text-white">
                    {language === 'ar' ? 'بطاقة الطوارئ والهوية' : 'Emergency Safety Card'}
                  </h4>
                  <p className="text-xs text-teal-200/80 mt-0.5">
                    {language === 'ar' ? 'الحساسية وجهات الاتصال ورمز QR' : 'Allergies, SOS & Secure QR'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                  <span>{language === 'ar' ? 'عرض البطاقة الذكية' : 'View Digital ID'}</span>
                  <ArrowIcon className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => onNavigateToMode('rufqa')}
                className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-300 dark:border-amber-800 hover:bg-amber-500/20 text-left transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                    Gate 79
                  </span>
                </div>
                <div className="my-3">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? 'رفقة — أمان الحرم' : 'Rufqa Haram Safety'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'ar' ? 'بطاقة السكن والفوج' : 'Hotel card & leader'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-bold">
                  <span>{language === 'ar' ? 'فتح نمط الحج' : 'Open Pilgrimage'}</span>
                  <ArrowIcon className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => onNavigateToMode('family')}
                className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-left transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
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

          </div>

          {/* Right Column: Embedded Voice Assistant */}
          <div className="lg:col-span-1">
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
          onTriggerReminderToast={onTriggerReminderToast}
          onOpenReminderModal={onOpenReminderModal}
        />
      )}

      {activeTab === 'chat' && (
        <div className="max-w-2xl mx-auto">
          <SeniorVoiceAssistant language={language} voiceEnabled={voiceEnabled} />
        </div>
      )}

    </div>
  );
};

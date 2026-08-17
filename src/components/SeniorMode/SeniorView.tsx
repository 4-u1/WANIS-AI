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
  Bell
} from 'lucide-react';
import { SeniorProfile, CheckInRecord, Medication, SupportedLanguage, PersonaMode } from '../../types';
import { DICTIONARY } from '../../data/i18n';
import { SeniorVoiceAssistant } from './SeniorVoiceAssistant';
import { SeniorMedicationView } from './SeniorMedicationView';

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
}

export const SeniorView: React.FC<SeniorViewProps> = ({
  senior,
  latestCheckIn,
  medications,
  onOpenCheckinModal,
  onToggleMedicationTaken,
  onNavigateToMode,
  language,
  voiceEnabled,
  totalAcbScore
}) => {
  const t = DICTIONARY[language];
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState<'overview' | 'meds' | 'chat'>('overview');

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div id="senior-view-container" className="space-y-6 animate-fadeIn">
      
      {/* Warm Greeting Hero Banner */}
      <section className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-teal-100 text-xs font-semibold backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {language === 'ar' ? 'رفيقك الصحي الدائم' : 'Your Continuous Cognitive Companion'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.goodMorning}
            </h1>
            <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
              {t.howAreYouToday}
            </p>
          </div>

          {/* Big Accessible Check-in CTA Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="start-voice-checkin-hero-btn"
              onClick={onOpenCheckinModal}
              className="px-6 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-base sm:text-lg shadow-lg shadow-amber-400/30 flex items-center justify-center gap-3 transition-transform active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-950/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6 text-amber-950" />
              </div>
              <span>{t.startCheckin}</span>
            </button>

            <button
              id="goto-rufqa-hero-btn"
              onClick={() => onNavigateToMode('rufqa')}
              className="px-5 py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base backdrop-blur flex items-center justify-center gap-2 transition-colors border border-white/20"
            >
              <Compass className="w-5 h-5 text-amber-300" />
              <span>{language === 'ar' ? 'رفقة الحج والعمرة' : 'Rufqa Pilgrimage'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Tabs for Senior */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md">
        <button
          id="senior-tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          {language === 'ar' ? 'الاطمئنان واليوميات' : 'Daily Wellbeing'}
        </button>

        <button
          id="senior-tab-meds"
          onClick={() => setActiveTab('meds')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'meds' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          {language === 'ar' ? 'أدويتي' : 'My Medications'}
        </button>

        <button
          id="senior-tab-chat"
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'chat' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
        >
          {language === 'ar' ? 'محادثة ونيس' : 'Chat with Wanis'}
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
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-teal-600">
                  <Pill className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Meds</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {medications.filter(m => m.isTakenToday).length}/{medications.length}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'ar' ? 'جرعات اليوم المكتملة' : 'Doses taken today'}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Link to Rufqa & Care Circle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => onNavigateToMode('rufqa')}
                className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-300 dark:border-amber-800 hover:bg-amber-500/20 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {language === 'ar' ? 'رفقة — دليل وأمان الحرم' : 'Rufqa Haram Safety'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'ar' ? 'بطاقة السكن وباب الملك فهد' : 'Hotel card & meeting point'}
                    </p>
                  </div>
                </div>
                <ArrowIcon className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateToMode('family')}
                className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {language === 'ar' ? 'دائرة الأهل ومريم' : 'Family Circle Portal'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'ar' ? 'متابعة الأبناء ومقدمي الرعاية' : 'Caregiver notes & updates'}
                    </p>
                  </div>
                </div>
                <ArrowIcon className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
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

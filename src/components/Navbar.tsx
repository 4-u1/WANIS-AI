import React from 'react';
import { 
  HeartHandshake,
  ShieldAlert, 
  Users, 
  Stethoscope, 
  Compass, 
  Cpu, 
  Briefcase, 
  Globe, 
  Volume2, 
  VolumeX, 
  Lock, 
  Bell,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { PersonaMode, SupportedLanguage, TriageLevel } from '../types';
import { DICTIONARY } from '../data/i18n';
import { WaneesLogo } from './WaneesLogo';
import { UserGuideButton } from './Walkthrough/UserGuideButton';

interface NavbarProps {
  currentMode: PersonaMode;
  onSelectMode: (mode: PersonaMode) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  triageLevel: TriageLevel;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenConsentModal: () => void;
  onTriggerEmergency: () => void;
  onOpenHowToUse: () => void;
  onOpenEmergencyCard: () => void;
  pendingMedicationsCount?: number;
  onOpenReminderCenter?: () => void;
  onStartTour?: () => void;
  onOpenProductIntroduction?: () => void;
  onOpenVoiceGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  language,
  onSelectLanguage,
  triageLevel,
  voiceEnabled,
  onToggleVoice,
  onOpenConsentModal,
  onTriggerEmergency,
  onOpenHowToUse,
  onOpenEmergencyCard,
  pendingMedicationsCount = 0,
  onOpenReminderCenter,
  onStartTour,
  onOpenProductIntroduction,
  onOpenVoiceGuide
}) => {
  const t = DICTIONARY[language];
  const isRtl = language === 'ar';

  const triageBadgeColor = {
    GREEN: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    YELLOW: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700',
    ORANGE: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-700',
    RED: 'bg-rose-100 text-rose-900 border-rose-400 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700 animate-pulse'
  }[triageLevel];

  const triageLabel = {
    GREEN: t.triageGreen,
    YELLOW: t.triageYellow,
    ORANGE: t.triageOrange,
    RED: t.triageRed
  }[triageLevel];

  return (
    <header id="main-header" className={`sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-xs ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          
          {/* Brand & Official Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              id="brand-logo-btn"
              onClick={() => onSelectMode('senior')}
              className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group cursor-pointer transition-transform active:scale-98"
              title="WANEES - AI Care & Safety Ecosystem"
            >
              <div className="p-1 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs group-hover:shadow-md group-hover:border-teal-400 dark:group-hover:border-teal-600 transition-all flex items-center justify-center">
                <WaneesLogo variant="icon" size="sm" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-xl font-extrabold tracking-wider text-[#102A4D] dark:text-white font-sans uppercase">
                    WANEES
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-400 font-arabic">
                    ونـيـس
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hidden xs:inline-block">
                    Pro
                  </span>
                </div>
                <div className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-teal-800 dark:text-teal-400 tracking-wider uppercase hidden md:block">
                  AI CARE &amp; SAFETY ECOSYSTEM
                </div>
              </div>
            </button>
          </div>

          {/* Quick Actions / Triage / SOS / Settings */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Upgraded React "User Guide / دليل الاستخدام" Component */}
            <UserGuideButton
              language={language}
              onOpenHowToUse={onOpenHowToUse}
              onStartTour={onStartTour}
              onOpenProductIntroduction={onOpenProductIntroduction}
              onOpenVoiceGuide={onOpenVoiceGuide}
            />

            {/* Triage Level Indicator */}
            <div className={`hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${triageBadgeColor}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${triageLevel === 'GREEN' ? 'bg-emerald-500' : triageLevel === 'YELLOW' ? 'bg-amber-500' : triageLevel === 'ORANGE' ? 'bg-orange-500' : 'bg-rose-500'}`}></span>
              <span>{triageLabel}</span>
            </div>

            {/* Voice Readout Toggle */}
            <button
              id="voice-toggle-btn"
              onClick={onToggleVoice}
              aria-label="Toggle Voice Readout"
              className={`p-1.5 sm:p-2 rounded-xl border text-sm font-medium transition-all react-btn-tap cursor-pointer ${voiceEnabled ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800' : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}
              title={voiceEnabled ? 'Spoken Voice Output Enabled' : 'Voice Output Muted'}
            >
              {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
              <Globe className="w-3 h-3 text-slate-400 ml-1 mr-1 hidden md:block" />
              {(['ar', 'en', 'fr'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  id={`lang-btn-${lang}`}
                  onClick={() => onSelectLanguage(lang)}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-lg transition-all react-btn-tap cursor-pointer ${language === lang ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                >
                  {lang === 'ar' ? 'عربي' : lang === 'en' ? 'EN' : 'FR'}
                </button>
              ))}
            </div>

            {/* Medication Reminder Button - Hidden on mobile (available in mobile bottom bar) */}
            {onOpenReminderCenter && (
              <button
                id="medication-reminders-nav-btn"
                onClick={onOpenReminderCenter}
                className={`hidden md:flex relative items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border transition-all react-btn-tap cursor-pointer ${
                  pendingMedicationsCount > 0
                    ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/70 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title={language === 'ar' ? 'تنبيهات الأدوية وإشعارات الجرعات' : 'Medication Reminders & Push Alerts'}
              >
                <Bell className={`w-4 h-4 ${pendingMedicationsCount > 0 ? 'text-amber-600 dark:text-amber-400 animate-bounce' : 'text-slate-500'}`} />
                <span>{language === 'ar' ? 'الأدوية' : 'Meds'}</span>
                {pendingMedicationsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center -mr-0.5">
                    {pendingMedicationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Consent & Privacy Button - Hidden on small mobile */}
            <button
              id="consent-settings-btn"
              onClick={onOpenConsentModal}
              className="hidden lg:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all react-btn-tap cursor-pointer"
              title="4-Tier Privacy & Consent Settings"
            >
              <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Consent</span>
            </button>

            {/* Digital Emergency Card Button */}
            <button
              id="emergency-card-nav-btn"
              onClick={onOpenEmergencyCard}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-teal-900 to-emerald-900 hover:from-teal-800 hover:to-emerald-800 text-white border border-teal-500/40 shadow-2xs transition-all react-btn-tap cursor-pointer group"
              title="Digital Safety Card & Medical ID"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline">{language === 'ar' ? 'بطاقة الطوارئ' : 'Emergency Card'}</span>
            </button>

            {/* Emergency SOS Button - Hidden on mobile because it is permanently pinned on MobileBottomNav */}
            <button
              id="emergency-sos-btn"
              onClick={onTriggerEmergency}
              className="hidden sm:flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all react-btn-tap cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span className="uppercase tracking-wider font-extrabold">SOS</span>
            </button>
          </div>
        </div>

        {/* Persona Mode Switcher Tab Bar */}
        <nav 
          id="persona-navigation" 
          aria-label="Persona Mode Selector"
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 dark:border-slate-800/80 -mx-3 px-3 sm:mx-0 sm:px-0"
        >
          <button
            id="nav-mode-senior"
            onClick={() => onSelectMode('senior')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 react-btn-tap cursor-pointer ${currentMode === 'senior' ? 'bg-teal-600 text-white shadow-sm font-bold scale-[1.02]' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span>{t.seniorMode}</span>
          </button>

          <button
            id="nav-mode-family"
            onClick={() => onSelectMode('family')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 react-btn-tap cursor-pointer ${currentMode === 'family' ? 'bg-teal-600 text-white shadow-sm font-bold scale-[1.02]' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>{t.familyMode}</span>
          </button>

          <button
            id="nav-mode-clinician"
            onClick={() => onSelectMode('clinician')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 react-btn-tap cursor-pointer ${currentMode === 'clinician' ? 'bg-teal-600 text-white shadow-sm font-bold scale-[1.02]' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            <Stethoscope className="w-4 h-4 shrink-0" />
            <span>{t.clinicianMode}</span>
          </button>

          <button
            id="nav-mode-rufqa"
            onClick={() => onSelectMode('rufqa')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 react-btn-tap cursor-pointer ${currentMode === 'rufqa' ? 'bg-amber-600 text-white shadow-sm font-bold scale-[1.02]' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100'}`}
          >
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t.rufqaMode}</span>
          </button>

          <button
            id="nav-mode-orchestrator"
            onClick={() => onSelectMode('orchestrator')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 react-btn-tap cursor-pointer ${currentMode === 'orchestrator' ? 'bg-indigo-600 text-white shadow-sm font-bold scale-[1.02]' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            <Cpu className="w-4 h-4 shrink-0" />
            <span>{t.orchestratorMode}</span>
          </button>

          <button
            id="nav-mode-investor"
            onClick={() => onSelectMode('investor')}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 react-btn-tap cursor-pointer ${currentMode === 'investor' ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm font-bold scale-[1.02]' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            <Briefcase className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t.investorMode}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

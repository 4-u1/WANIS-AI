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
  Bell
} from 'lucide-react';
import { PersonaMode, SupportedLanguage, TriageLevel } from '../types';
import { DICTIONARY } from '../data/i18n';

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
  onTriggerEmergency
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
    <header id="main-header" className={`sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <button 
              id="brand-logo-btn"
              onClick={() => onSelectMode('senior')}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {t.appName}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    v2.4 Pro
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  {t.subtag}
                </p>
              </div>
            </button>
          </div>

          {/* Quick Actions / Triage / SOS / Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Triage Level Indicator */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${triageBadgeColor}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${triageLevel === 'GREEN' ? 'bg-emerald-500' : triageLevel === 'YELLOW' ? 'bg-amber-500' : triageLevel === 'ORANGE' ? 'bg-orange-500' : 'bg-rose-500'}`}></span>
              <span>{triageLabel}</span>
            </div>

            {/* Voice Readout Toggle */}
            <button
              id="voice-toggle-btn"
              onClick={onToggleVoice}
              aria-label="Toggle Voice Readout"
              className={`p-2.5 rounded-xl border text-sm font-medium transition-colors ${voiceEnabled ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800' : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}
              title={voiceEnabled ? 'Spoken Voice Output Enabled' : 'Voice Output Muted'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Consent & Privacy Button */}
            <button
              id="consent-settings-btn"
              onClick={onOpenConsentModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              title="4-Tier Privacy & Consent Settings"
            >
              <Lock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">Consent</span>
            </button>

            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1 hidden sm:block" />
              {(['ar', 'en', 'fr'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  id={`lang-btn-${lang}`}
                  onClick={() => onSelectLanguage(lang)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${language === lang ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                >
                  {lang === 'ar' ? 'العربية' : lang === 'en' ? 'EN' : 'FR'}
                </button>
              ))}
            </div>

            {/* Emergency SOS Button */}
            <button
              id="emergency-sos-btn"
              onClick={onTriggerEmergency}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-transform active:scale-95"
            >
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span className="uppercase tracking-wider">SOS</span>
            </button>
          </div>
        </div>

        {/* Persona Mode Switcher Tab Bar */}
        <nav id="persona-navigation" className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-100 dark:border-slate-800/80">
          
          <button
            id="nav-mode-senior"
            onClick={() => onSelectMode('senior')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${currentMode === 'senior' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{t.seniorMode}</span>
          </button>

          <button
            id="nav-mode-family"
            onClick={() => onSelectMode('family')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${currentMode === 'family' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            <Users className="w-4 h-4" />
            <span>{t.familyMode}</span>
          </button>

          <button
            id="nav-mode-clinician"
            onClick={() => onSelectMode('clinician')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${currentMode === 'clinician' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>{t.clinicianMode}</span>
          </button>

          <button
            id="nav-mode-rufqa"
            onClick={() => onSelectMode('rufqa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${currentMode === 'rufqa' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100'}`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{t.rufqaMode}</span>
          </button>

          <button
            id="nav-mode-orchestrator"
            onClick={() => onSelectMode('orchestrator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${currentMode === 'orchestrator' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            <Cpu className="w-4 h-4" />
            <span>{t.orchestratorMode}</span>
          </button>

          <button
            id="nav-mode-investor"
            onClick={() => onSelectMode('investor')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${currentMode === 'investor' ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            <Briefcase className="w-4 h-4 text-emerald-500" />
            <span>{t.investorMode}</span>
          </button>

        </nav>
      </div>
    </header>
  );
};

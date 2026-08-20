import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Users, 
  Stethoscope, 
  Compass, 
  ShieldAlert, 
  Bell,
  Cpu,
  Briefcase,
  MoreHorizontal,
  X
} from 'lucide-react';
import { PersonaMode, SupportedLanguage, TriageLevel } from '../types';
import { DICTIONARY } from '../data/i18n';

interface MobileBottomNavProps {
  currentMode: PersonaMode;
  onSelectMode: (mode: PersonaMode) => void;
  language: SupportedLanguage;
  triageLevel: TriageLevel;
  pendingMedicationsCount?: number;
  onOpenReminderCenter?: () => void;
  onTriggerEmergency: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentMode,
  onSelectMode,
  language,
  triageLevel,
  pendingMedicationsCount = 0,
  onOpenReminderCenter,
  onTriggerEmergency
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const t = DICTIONARY[language];
  const isRtl = language === 'ar';

  const navItems: Array<{
    mode: PersonaMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
  }> = [
    {
      mode: 'senior',
      label: language === 'ar' ? 'الوالدة' : 'Senior',
      icon: HeartHandshake
    },
    {
      mode: 'family',
      label: language === 'ar' ? 'العائلة' : 'Family',
      icon: Users
    },
    {
      mode: 'clinician',
      label: language === 'ar' ? 'الطبيب' : 'Doctor',
      icon: Stethoscope
    },
    {
      mode: 'rufqa',
      label: language === 'ar' ? 'رفقة' : 'Rufqa',
      icon: Compass,
      highlight: true
    }
  ];

  const handleSelectMode = (mode: PersonaMode) => {
    onSelectMode(mode);
    setIsMoreMenuOpen(false);
  };

  return (
    <>
      {/* Mobile More Modes Bottom Drawer */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end md:hidden animate-fadeIn"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl safe-area-pb space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                {language === 'ar' ? 'باقي بوابات المنظومة' : 'Additional Ecosystem Modes'}
              </span>
              <button 
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                id="mobile-more-orchestrator-btn"
                onClick={() => handleSelectMode('orchestrator')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all react-btn-tap text-left ${
                  currentMode === 'orchestrator'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-indigo-500 text-white shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{t.orchestratorMode}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Agentic Engine</div>
                </div>
              </button>

              <button
                id="mobile-more-investor-btn"
                onClick={() => handleSelectMode('investor')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all react-btn-tap text-left ${
                  currentMode === 'investor'
                    ? 'bg-slate-900 dark:bg-slate-800 border-slate-700 text-white font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{t.investorMode}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Financial Impact</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Responsive Mobile Bottom Bar */}
      <div 
        id="mobile-bottom-navigation" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl px-1.5 py-1.5 safe-area-pb"
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.mode;

            return (
              <button
                key={item.mode}
                id={`mobile-nav-btn-${item.mode}`}
                onClick={() => handleSelectMode(item.mode)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl min-w-[50px] min-h-[46px] transition-all react-btn-tap relative ${
                  isActive 
                    ? 'text-teal-600 dark:text-teal-400 font-bold scale-105' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 w-7 h-1 rounded-full bg-teal-500 shadow-xs" />
                )}
                <div className={`p-1 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-teal-50 dark:bg-teal-950/60' 
                    : ''
                }`}>
                  <Icon className={`w-5 h-5 ${item.highlight && !isActive ? 'text-amber-500' : ''}`} />
                </div>
                <span className="text-[10px] leading-tight tracking-tight mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More Modes Drawer Button */}
          <button
            id="mobile-nav-btn-more"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl min-w-[46px] min-h-[46px] transition-all react-btn-tap ${
              currentMode === 'orchestrator' || currentMode === 'investor'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
            title="More Modes"
          >
            <div className="p-1 rounded-xl">
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-tight font-medium mt-0.5">
              {language === 'ar' ? 'المزيد' : 'More'}
            </span>
          </button>

          {/* Medication Reminder Quick Action on Mobile */}
          {onOpenReminderCenter && (
            <button
              id="mobile-nav-btn-reminders"
              onClick={onOpenReminderCenter}
              className="flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl min-w-[46px] min-h-[46px] text-amber-600 dark:text-amber-400 relative react-btn-tap"
              title="Medication Reminders"
            >
              <div className="p-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 relative">
                <Bell className="w-5 h-5" />
                {pendingMedicationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white font-black text-[9px] flex items-center justify-center animate-pulse">
                    {pendingMedicationsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight font-semibold mt-0.5">
                {language === 'ar' ? 'الأدوية' : 'Meds'}
              </span>
            </button>
          )}

          {/* SOS Emergency Trigger Button */}
          <button
            id="mobile-nav-btn-sos"
            onClick={onTriggerEmergency}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl min-w-[46px] min-h-[46px] text-rose-600 dark:text-rose-400 group react-btn-tap"
            title="Emergency SOS"
          >
            <div className="p-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 group-hover:bg-rose-100">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>
            <span className="text-[10px] leading-tight font-black uppercase text-rose-600 dark:text-rose-400 mt-0.5">
              SOS
            </span>
          </button>
        </div>
      </div>
    </>
  );
};


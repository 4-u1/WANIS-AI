import React from 'react';
import { 
  HeartHandshake, 
  Users, 
  Stethoscope, 
  Compass, 
  ShieldAlert,
  Bell,
  Cpu,
  Briefcase
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
  const t = DICTIONARY[language];
  const isRtl = language === 'ar';

  const navItems: Array<{
    mode: PersonaMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
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

  return (
    <div 
      id="mobile-bottom-navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentMode === item.mode;

          return (
            <button
              key={item.mode}
              id={`mobile-nav-btn-${item.mode}`}
              onClick={() => onSelectMode(item.mode)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[56px] min-h-[48px] transition-all relative ${
                isActive 
                  ? 'text-teal-600 dark:text-teal-400 font-bold scale-105' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-full bg-teal-500 shadow-xs" />
              )}
              <div className={`p-1 rounded-xl transition-all ${
                isActive 
                  ? 'bg-teal-50 dark:bg-teal-950/60' 
                  : ''
              }`}>
                <Icon className={`w-5 h-5 ${item.highlight && !isActive ? 'text-amber-500' : ''}`} />
              </div>
              <span className="text-[10px] sm:text-[11px] leading-tight tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Medication Reminder Quick Action on Mobile */}
        {onOpenReminderCenter && (
          <button
            id="mobile-nav-btn-reminders"
            onClick={onOpenReminderCenter}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl min-w-[54px] min-h-[48px] text-amber-600 dark:text-amber-400 relative"
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
            <span className="text-[10px] sm:text-[11px] leading-tight font-semibold mt-0.5">
              {language === 'ar' ? 'الأدوية' : 'Meds'}
            </span>
          </button>
        )}

        {/* SOS Emergency Trigger Button */}
        <button
          id="mobile-nav-btn-sos"
          onClick={onTriggerEmergency}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[54px] min-h-[48px] text-rose-600 dark:text-rose-400 group active:scale-95"
          title="Emergency SOS"
        >
          <div className="p-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 group-hover:bg-rose-100">
            <ShieldAlert className="w-5 h-5 animate-bounce" />
          </div>
          <span className="text-[10px] sm:text-[11px] leading-tight font-black uppercase text-rose-600 dark:text-rose-400 mt-0.5">
            SOS
          </span>
        </button>
      </div>
    </div>
  );
};

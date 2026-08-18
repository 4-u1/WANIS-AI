import React, { useState } from 'react';
import { Pill, Check, Clock, Bell, X, Volume2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Medication, SupportedLanguage } from '../../types';
import { notificationAudio, speakMedicationReminder } from '../../services/notificationService';

export interface ActiveMedicationReminder {
  id: string;
  medication: Medication;
  timestamp: string;
  isUrgent?: boolean;
}

interface MedicationToastNotificationProps {
  reminders?: ActiveMedicationReminder[];
  activeReminders?: ActiveMedicationReminder[];
  onMarkAsTaken: (medId: string) => void;
  onSnooze: (reminderId: string, medId: string) => void;
  onDismiss: (reminderId: string) => void;
  language: SupportedLanguage;
  voiceEnabled: boolean;
}

export const MedicationToastNotification: React.FC<MedicationToastNotificationProps> = ({
  reminders,
  activeReminders,
  onMarkAsTaken,
  onSnooze,
  onDismiss,
  language,
  voiceEnabled
}) => {
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const reminderList = activeReminders || reminders || [];

  if (reminderList.length === 0) return null;

  const isRtl = language === 'ar';

  const handleTakeMedication = (reminderId: string, medId: string) => {
    setAnimatingId(reminderId);
    notificationAudio.playSuccessChime();
    setTimeout(() => {
      onMarkAsTaken(medId);
      setAnimatingId(null);
    }, 350);
  };

  return (
    <div
      id="medication-toast-container"
      className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-md w-[calc(100vw-2rem)] sm:w-[420px] pointer-events-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="region"
      aria-label="Medication Reminders"
    >
      {reminderList.map((item, index) => {
        const { medication, id: reminderId } = item;
        const hasHighAcb = medication.acbScore >= 2;
        const isExiting = animatingId === reminderId;

        return (
          <div
            key={reminderId}
            id={`med-toast-${medication.id}`}
            className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 ${
              hasHighAcb
                ? 'border-amber-400 dark:border-amber-500 shadow-xl shadow-amber-500/10'
                : 'border-teal-500 dark:border-teal-400 shadow-xl shadow-teal-900/15'
            } transition-all duration-300 transform ${
              isExiting ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'
            } animate-bounce-subtle`}
          >
            {/* Header / Pill Badge & Close */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {medication.imageUrl ? (
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
                    <img
                      src={medication.imageUrl}
                      alt={medication.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      hasHighAcb
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                        : 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300'
                    }`}
                  >
                    <Pill className="w-6 h-6 animate-pulse" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      {language === 'ar' ? 'تذكير موعد الدواء' : language === 'fr' ? 'Rappel de Médicament' : 'Scheduled Medication Reminder'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {item.timestamp}
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {medication.name}{' '}
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      ({medication.dosage})
                    </span>
                  </h4>
                </div>
              </div>

              {/* Close / Dismiss */}
              <button
                type="button"
                onClick={() => onDismiss(reminderId)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={language === 'ar' ? 'إغلاق التنبيه' : 'Dismiss reminder'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instruction / Schedule details */}
            <div className="mt-2.5 space-y-1.5">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                {language === 'ar'
                  ? `يا والدتي فاطمة، حان موعد تناول هذا الدواء (${medication.frequency}). هل تناولتِ جرعتكِ؟`
                  : language === 'fr'
                  ? `Hajjah Fatima, il est l'heure de prendre ce médicament (${medication.frequency}). Avez-vous pris votre dose ?`
                  : `Hajjah Fatima, it's time for your scheduled dose (${medication.frequency}). Have you taken it?`}
              </p>

              {/* Indication & ACB Notice */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                <span>🩺 {medication.indication}</span>
                {medication.acbScore > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="w-3 h-3" />
                    ACB +{medication.acbScore}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 flex-wrap sm:flex-nowrap">
              
              {/* Primary Action: Mark as Taken */}
              <button
                type="button"
                id={`toast-mark-taken-${medication.id}`}
                onClick={() => handleTakeMedication(reminderId, medication.id)}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>{language === 'ar' ? 'تم أخذ الدواء الآن ✓' : language === 'fr' ? 'Pris maintenant ✓' : 'Mark as Taken ✓'}</span>
              </button>

              {/* Secondary Action: Snooze 10 min */}
              <button
                type="button"
                id={`toast-snooze-${medication.id}`}
                onClick={() => onSnooze(reminderId, medication.id)}
                className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                title={language === 'ar' ? 'تذكير بعد 10 دقائق' : 'Remind me in 10 minutes'}
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{language === 'ar' ? 'تذكير لاحقاً' : 'Snooze'}</span>
              </button>

              {/* Voice Readout Button */}
              {voiceEnabled && (
                <button
                  type="button"
                  onClick={() => speakMedicationReminder(medication, language)}
                  className="p-3 rounded-2xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/80 text-teal-700 dark:text-teal-300 transition-colors border border-teal-200 dark:border-teal-800"
                  title={language === 'ar' ? 'استماع للتنبيه الصوتي' : 'Hear spoken reminder'}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
};

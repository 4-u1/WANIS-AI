import React from 'react';
import { Pill, Check, Clock, AlertTriangle, ShieldCheck, Info, Bell, BellRing, Volume2, Sparkles, Send } from 'lucide-react';
import { Medication, SupportedLanguage } from '../../types';
import { DICTIONARY } from '../../data/i18n';
import { notificationAudio } from '../../services/notificationService';

interface SeniorMedicationViewProps {
  medications: Medication[];
  onToggleTaken: (id: string) => void;
  language: SupportedLanguage;
  totalAcbScore: number;
  onTriggerReminderToast?: (med: Medication) => void;
  onOpenReminderModal?: () => void;
}

export const SeniorMedicationView: React.FC<SeniorMedicationViewProps> = ({
  medications = [],
  onToggleTaken,
  language,
  totalAcbScore,
  onTriggerReminderToast,
  onOpenReminderModal
}) => {
  const t = DICTIONARY[language];
  const isRtl = language === 'ar';

  const safeMedications = medications || [];
  const pendingMedications = safeMedications.filter(m => !m.isTakenToday);
  const takenCount = safeMedications.filter(m => m.isTakenToday).length;

  const handleQuickTriggerReminder = (med: Medication) => {
    notificationAudio.playReminderChime();
    if (onTriggerReminderToast) {
      onTriggerReminderToast(med);
    }
  };

  const handleTriggerAllPending = () => {
    if (pendingMedications.length === 0) return;
    notificationAudio.playReminderChime();
    pendingMedications.forEach((med, idx) => {
      setTimeout(() => {
        if (onTriggerReminderToast) {
          onTriggerReminderToast(med);
        }
      }, idx * 400);
    });
  };

  return (
    <div id="senior-medication-checklist" className="space-y-4">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.medicationCheck}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === 'ar' 
                ? 'قائمة أدويتكِ اليومية مع تنبيهات سلامة الذاكرة ومؤشر العبء المعرفي'
                : 'Your daily schedule with memory burden safety checks'}
            </p>
          </div>
        </div>

        {/* ACB Summary Tag */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="text-xs font-bold block">{t.acbScoreTitle}</span>
            <span className="text-xs">
              {language === 'ar' ? `مجموع العبء: ${totalAcbScore} (يُنصح بمراجعته مع الطبيب)` : `Total Burden: ${totalAcbScore} (Review with Doctor)`}
            </span>
          </div>
        </div>
      </div>

      {/* Smart Medication Reminder & Push Notification Hub Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 rounded-3xl p-5 sm:p-6 text-white border border-teal-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center shrink-0">
            <BellRing className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-base text-white">
                {language === 'ar' ? 'نظام التنبيهات وإشعارات الأدوية الذكية' : 'Smart Push & Toast Notification System'}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                {takenCount}/{safeMedications.length} {language === 'ar' ? 'مكتمل' : 'Taken'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-200/90 leading-relaxed">
              {pendingMedications.length > 0
                ? (language === 'ar' 
                    ? `لديكِ ${pendingMedications.length} جرعة دواء مجدولة اليوم لم تؤخذ بعد. يمكنك استلام إشعار على الشاشة أو تشغيل تنبيه صوتي.`
                    : `You have ${pendingMedications.length} scheduled dose(s) pending for today. Receive push alerts or audio chimes.`)
                : (language === 'ar'
                    ? '🎉 ما شاء الله! تم تناول جميع أدوية اليوم المقررة بنجاح.'
                    : '🎉 Great! All scheduled medications for today have been confirmed.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
          {pendingMedications.length > 0 && (
            <button
              type="button"
              id="btn-trigger-pending-toast-banner"
              onClick={handleTriggerAllPending}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'ar' ? 'إرسال تنبيه بالجرعات' : 'Send Reminder Toast'}</span>
            </button>
          )}

          {onOpenReminderModal && (
            <button
              type="button"
              id="btn-open-reminder-center"
              onClick={onOpenReminderModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-colors"
            >
              <Bell className="w-4 h-4 text-teal-300" />
              <span>{language === 'ar' ? 'مركز التنبيهات' : 'Reminder Settings'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Medication List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeMedications.map((med) => {
          const hasAcb = med.acbScore > 0;
          return (
            <div
              key={med.id}
              id={`med-card-${med.id}`}
              className={`p-5 rounded-3xl border transition-all ${
                med.isTakenToday 
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Medication Pill Photo Thumbnail */}
                {med.imageUrl ? (
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
                    <img
                      src={med.imageUrl}
                      alt={med.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-teal-50 dark:bg-teal-950/70 border-2 border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0 text-teal-600 dark:text-teal-400">
                    <Pill className="w-8 h-8" />
                  </div>
                )}

                {/* Info and Actions Container */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {med.name}
                        </h4>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {med.dosage}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {med.indication} • {med.frequency}
                      </p>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!med.isTakenToday && onTriggerReminderToast && (
                        <button
                          type="button"
                          id={`card-remind-btn-${med.id}`}
                          onClick={() => handleQuickTriggerReminder(med)}
                          className="w-10 h-10 rounded-2xl flex items-center justify-center bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition-colors"
                          title={language === 'ar' ? 'إرسال تنبيه منبثق فوري' : 'Trigger instant reminder toast'}
                        >
                          <Bell className="w-4 h-4" />
                        </button>
                      )}

                      {/* Take/Untake Action Button */}
                      <button
                        id={`toggle-med-${med.id}`}
                        onClick={() => {
                          if (!med.isTakenToday) {
                            notificationAudio.playSuccessChime();
                          }
                          onToggleTaken(med.id);
                        }}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold transition-transform active:scale-90 ${
                          med.isTakenToday 
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                        }`}
                        title={med.isTakenToday ? 'Mark as not taken' : 'Mark as taken'}
                      >
                        <Check className={`w-5 h-5 ${med.isTakenToday ? 'stroke-[3]' : 'opacity-40'}`} />
                      </button>
                    </div>
                  </div>

                  {hasAcb && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200/80 dark:border-amber-900/60 w-fit">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {language === 'ar' 
                          ? `تأثير على الذاكرة: درجة ${med.acbScore}` 
                          : `Cognitive Burden Score: +${med.acbScore}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {med.lastTaken && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {language === 'ar' ? 'آخر جرعة:' : 'Last dose:'} {med.lastTaken}
                  </span>
                  {med.isTakenToday && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'تم تناولها' : 'Taken'}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Clinical Disclaimer Footnote */}
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center px-4 pt-2">
        {t.clinicianDisclaimer}
      </p>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  Pill, 
  Check, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  X, 
  Send,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Medication, SupportedLanguage } from '../../types';
import { 
  requestNotificationPermission, 
  getNotificationPermissionStatus, 
  sendBrowserPushNotification,
  notificationAudio,
  speakMedicationReminder
} from '../../services/notificationService';

interface MedicationReminderCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
  onToggleMedicationTaken: (id: string) => void;
  onTriggerReminderToast: (medication: Medication) => void;
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const MedicationReminderCenterModal: React.FC<MedicationReminderCenterModalProps> = ({
  isOpen,
  onClose,
  medications = [],
  onToggleMedicationTaken,
  onTriggerReminderToast,
  language,
  voiceEnabled,
  onToggleVoice
}) => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [autoReminderInterval, setAutoReminderInterval] = useState<number>(30); // minutes
  const [isPermissionRequesting, setIsPermissionRequesting] = useState(false);
  const [lastTriggeredMedName, setLastTriggeredMedName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPermissionStatus(getNotificationPermissionStatus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const safeMedications = medications || [];
  const isRtl = language === 'ar';
  const pendingMedications = safeMedications.filter(m => !m.isTakenToday);
  const takenMedications = safeMedications.filter(m => m.isTakenToday);
  const adherenceRate = Math.round((takenMedications.length / (safeMedications.length || 1)) * 100);

  const handleRequestPushPermission = async () => {
    setIsPermissionRequesting(true);
    const result = await requestNotificationPermission();
    setPermissionStatus(result);
    setIsPermissionRequesting(false);
  };

  const handleTriggerSingleReminder = (med: Medication) => {
    // 1. Play chime
    notificationAudio.playReminderChime();

    // 2. Speak voice if enabled
    if (voiceEnabled) {
      speakMedicationReminder(med, language);
    }

    // 3. Send browser push notification if permitted
    sendBrowserPushNotification(med, language, () => {
      onToggleMedicationTaken(med.id);
    });

    // 4. Fire In-App Toast
    onTriggerReminderToast(med);

    setLastTriggeredMedName(med.name);
    setTimeout(() => setLastTriggeredMedName(null), 3000);
  };

  const handleTriggerAllPending = () => {
    if (pendingMedications.length === 0) return;
    pendingMedications.forEach((med, idx) => {
      setTimeout(() => {
        handleTriggerSingleReminder(med);
      }, idx * 600);
    });
  };

  return (
    <div
      id="medication-reminder-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white shadow-inner">
              <BellRing className="w-6 h-6 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold">
                  {language === 'ar' ? 'مركز تنبيهات الأدوية الذكي' : language === 'fr' ? 'Centre de Rappels Médicaux' : 'Medication Smart Reminder Hub'}
                </h3>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-400 text-amber-950">
                  Live Push & Toasts
                </span>
              </div>
              <p className="text-xs sm:text-sm text-teal-100 mt-0.5">
                {language === 'ar' 
                  ? 'إدارة التنبيهات المنبثقة والإشعارات الصوتية لضمان سلامة الجرعات'
                  : 'Manage push notifications, in-app toasts & audio chimes for safe adherence'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Adherence & Status Banner */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-lg shadow-xs">
                {takenMedications.length}/{medications.length}
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {language === 'ar' ? 'مستوى الالتزام بجرعات اليوم' : 'Today’s Medication Compliance'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pendingMedications.length === 0
                    ? (language === 'ar' ? '🎉 تم أخذ جميع الأدوية المقررة بنجاح!' : '🎉 All scheduled doses taken!')
                    : (language === 'ar' ? `متبقي ${pendingMedications.length} جرعات مجدولة لم يتم تأكيدها` : `${pendingMedications.length} scheduled doses pending`)}
                </p>
              </div>
            </div>

            {pendingMedications.length > 0 && (
              <button
                type="button"
                id="btn-trigger-all-reminders"
                onClick={handleTriggerAllPending}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'ar' ? 'إرسال تنبيه بالجرعات المتبقية' : 'Trigger Pending Reminders'}</span>
              </button>
            )}
          </div>

          {/* Browser Push & Sound Permissions Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Push Notifications Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'ar' ? 'إشعارات المتصفح والنظام' : 'Browser Push Notifications'}
                  </h5>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  permissionStatus === 'granted'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : permissionStatus === 'denied'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {permissionStatus === 'granted' ? 'مفعّلة (Active)' : permissionStatus === 'denied' ? 'محظورة (Denied)' : 'غير مفعّلة (Prompt)'}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'ar'
                  ? 'استلام إشعار على شاشة الجهاز حتى لو كان التطبيق يعمل في الخلفية.'
                  : 'Receive push alerts even if the tab is in the background.'}
              </p>

              {permissionStatus !== 'granted' && (
                <button
                  type="button"
                  id="btn-enable-browser-push"
                  onClick={handleRequestPushPermission}
                  disabled={isPermissionRequesting}
                  className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800 transition-colors"
                >
                  {language === 'ar' ? '🔔 تفعيل إشعارات المتصفح' : '🔔 Enable Browser Push'}
                </button>
              )}
            </div>

            {/* Voice & Sound Prompts Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'ar' ? 'التنبيه الصوتي والنغمة' : 'Voice & Audio Chimes'}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={onToggleVoice}
                  className={`p-1.5 rounded-lg border text-xs font-bold ${
                    voiceEnabled
                      ? 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-700'
                      : 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
                >
                  {voiceEnabled ? 'تشغيل (ON)' : 'صامت (OFF)'}
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'ar'
                  ? 'تشغيل نغمة هادئة وقراءة اسم الدواء والجرعة بصوت واضح لكبار السن.'
                  : 'Plays a gentle harmonic chime and speaks the dose name clearly.'}
              </p>

              <button
                type="button"
                onClick={() => notificationAudio.playReminderChime()}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
              >
                {language === 'ar' ? '🔊 اختبار نغمة التنبيه' : '🔊 Test Chime Tone'}
              </button>
            </div>

          </div>

          {/* Pending Medications List with Action Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>
                  {language === 'ar' ? 'أدوية اليوم وجدول التنبيهات' : 'Today’s Medications & Reminders'}
                </span>
              </h5>
              <span className="text-xs text-slate-500">
                {language === 'ar' ? 'اضغط لإرسال تنبيه تجريبي أو تأكيد الأخذ' : 'Test reminder or mark taken'}
              </span>
            </div>

            <div className="space-y-2.5">
              {safeMedications.map((med) => {
                const isPending = !med.isTakenToday;
                const hasAcb = med.acbScore > 0;

                return (
                  <div
                    key={med.id}
                    id={`modal-med-row-${med.id}`}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                      med.isTakenToday
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Medication Photo Thumbnail */}
                      {med.imageUrl ? (
                        <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs">
                          <img
                            src={med.imageUrl}
                            alt={med.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0 text-teal-600 dark:text-teal-400">
                          <Pill className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                            {med.name}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {med.dosage}
                          </span>
                          {hasAcb && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              ACB +{med.acbScore}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate sm:whitespace-normal">
                          {med.indication} • {med.frequency}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Test Reminder Button */}
                      <button
                        type="button"
                        id={`btn-remind-med-${med.id}`}
                        onClick={() => handleTriggerSingleReminder(med)}
                        className="px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-teal-200 dark:border-teal-800"
                        title={language === 'ar' ? 'إرسال تنبيه منبثق وصوتي' : 'Trigger Toast & Push Reminder'}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'تذكير الآن' : 'Remind'}</span>
                      </button>

                      {/* Mark Taken Button */}
                      <button
                        type="button"
                        id={`btn-modal-toggle-med-${med.id}`}
                        onClick={() => {
                          if (!med.isTakenToday) {
                            notificationAudio.playSuccessChime();
                          }
                          onToggleMedicationTaken(med.id);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 ${
                          med.isTakenToday
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${med.isTakenToday ? 'stroke-[3]' : ''}`} />
                        <span>{med.isTakenToday ? (language === 'ar' ? 'تم أخذها ✓' : 'Taken ✓') : (language === 'ar' ? 'تأكيد الأخذ' : 'Mark Taken')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar' ? 'تنبيهات فورية متوافقة مع الذاكرة وخصوصية كبار السن' : 'Senior-friendly notification orchestration'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-bold text-xs transition-colors"
          >
            {language === 'ar' ? 'تم / إغلاق' : 'Done / Close'}
          </button>
        </div>

      </div>
    </div>
  );
};

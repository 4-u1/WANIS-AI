import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle,
  History,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Printer,
  FileCheck2,
  Info,
  CheckSquare,
  Flame,
  Activity,
  Edit2,
  Pencil,
  MessageSquare,
  Plus,
  Trash2,
  StickyNote,
  Tag,
  ListChecks,
  Ban,
  CheckCheck,
  Slash,
  ChevronDown
} from 'lucide-react';
import { Medication, SupportedLanguage, MedicationIntakeRecord } from '../../types';
import { 
  requestNotificationPermission, 
  getNotificationPermissionStatus, 
  sendBrowserPushNotification,
  notificationAudio,
  speakMedicationReminder,
  speakMedicationHistoryRecord
} from '../../services/notificationService';
import { WaneesLogo } from '../WaneesLogo';

interface MedicationReminderCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
  onToggleMedicationTaken: (id: string) => void;
  onBulkUpdateMedications?: (
    updates: { id: string; action: 'TAKE' | 'SKIP' | 'RESET'; note?: string; reason?: string }[]
  ) => void;
  onTriggerReminderToast: (medication: Medication) => void;
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

type TabType = 'schedule' | 'history';
type TimeFilterType = 'all' | 'morning' | 'afternoon' | 'evening' | 'acb_only' | 'skipped_only';

const QUICK_NOTE_PRESETS = {
  ar: [
    { label: '🍽️ بعد الوجبة', text: 'تم التناول بعد وجبة الطعام' },
    { label: '🥛 مع ماء وفير', text: 'تم التناول مع كوب ماء كامل' },
    { label: '🛌 قبل النوم', text: 'تم التناول مباشرة قبل النوم' },
    { label: '👨‍⚕️ بإشراف المرافق', text: 'تم التأكد والتوثيق بإشراف المرافق' },
    { label: '⚡ لوحظ دوار خفيف', text: 'لوحظ دوار خفيف بعد التناول ويجري المتابعة' }
  ],
  en: [
    { label: '🍽️ After meal', text: 'Taken after a light meal' },
    { label: '🥛 With full glass of water', text: 'Taken with a full glass of water' },
    { label: '🛌 Right before bed', text: 'Taken right before bedtime' },
    { label: '👨‍⚕️ Caregiver verified', text: 'Intake verified by caregiver' },
    { label: '⚡ Mild dizziness noted', text: 'Mild dizziness noted after dose; monitoring' }
  ],
  fr: [
    { label: '🍽️ Après repas', text: 'Pris après le repas' },
    { label: '🥛 Avec grand verre d\'eau', text: 'Pris avec un grand verre d\'eau' },
    { label: '🛌 Avant le coucher', text: 'Pris juste avant de dormir' },
    { label: '👨‍⚕️ Vérifié par l\'aidant', text: 'Prise vérifiée par l\'aidant' },
    { label: '⚡ Léger vertige noté', text: 'Léger vertige noté après la prise' }
  ]
};

const SKIPPED_REASON_PRESETS = {
  ar: [
    'تم تفويت فترة الجرعات بالكامل',
    'بتوجيه من الطبيب المعالج',
    'صيام / فحص سريري مجدول',
    'النائم / تعذر الإيقاظ',
    'لوحظت أعراض جانبية وتم إيقاف الجرعة مؤقتاً'
  ],
  en: [
    'Missed entire dosing block',
    'Advised by treating physician',
    'Fasting / Scheduled clinical lab test',
    'Patient asleep / resting',
    'Adverse side-effects noted; temporarily held'
  ],
  fr: [
    'Bloc de prise manqué dans son ensemble',
    'Conseillé par le médecin traitant',
    'À jeun / Examen clinique programmé',
    'Patient endormi / au repos',
    'Effets secondaires constatés; dose suspendue'
  ]
};

export const MedicationReminderCenterModal: React.FC<MedicationReminderCenterModalProps> = ({
  isOpen,
  onClose,
  medications = [],
  onToggleMedicationTaken,
  onBulkUpdateMedications,
  onTriggerReminderToast,
  language,
  voiceEnabled,
  onToggleVoice
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [isPermissionRequesting, setIsPermissionRequesting] = useState(false);
  const [lastTriggeredMedName, setLastTriggeredMedName] = useState<string | null>(null);
  
  // History tab search & filter states
  const [historySearch, setHistorySearch] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('all');
  const [speakingHistoryId, setSpeakingHistoryId] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Inline Note Editing States
  const [editingNoteMedId, setEditingNoteMedId] = useState<string | null>(null);
  const [noteDraftText, setNoteDraftText] = useState<string>('');
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('wanees_med_history_notes');
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return {
      'med-03': 'Taken with breakfast & light meal',
      'med-01': 'Taken with warm herbal tea before bed'
    };
  });

  // Bulk Edit States
  const [isBulkEditMode, setIsBulkEditMode] = useState<boolean>(false);
  const [selectedMedIds, setSelectedMedIds] = useState<string[]>([]);
  const [bulkCustomNote, setBulkCustomNote] = useState<string>('');
  const [isBulkSkipModalOpen, setIsBulkSkipModalOpen] = useState<boolean>(false);
  const [selectedSkipReason, setSelectedSkipReason] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPermissionStatus(getNotificationPermissionStatus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const safeMedications = medications || [];
  const isRtl = language === 'ar';
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const pendingMedications = safeMedications.filter(m => !m.isTakenToday && !m.isSkippedToday);
  const takenMedications = safeMedications.filter(m => m.isTakenToday);
  const skippedMedications = safeMedications.filter(m => m.isSkippedToday);
  const adherenceRate = Math.round((takenMedications.length / (safeMedications.length || 1)) * 100);
  const takenAcbScore = takenMedications.reduce((sum, m) => sum + (m.acbScore || 0), 0);

  // Derive chronological intake records for today (both Taken and Skipped)
  const intakeHistory: MedicationIntakeRecord[] = useMemo(() => {
    const loggedMeds = safeMedications.filter(m => m.isTakenToday || m.isSkippedToday);

    return loggedMeds.map(med => {
      // Parse or infer time of day
      const rawTime = med.lastTaken || 'Today 08:30 AM';
      let timeStr = rawTime.replace(/^(Today|Yesterday)\s*/i, '').trim();
      if (!timeStr) timeStr = '08:30 AM';

      let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'bedtime' = 'morning';
      const lowerFreq = med.frequency.toLowerCase();
      if (lowerFreq.includes('night') || lowerFreq.includes('bedtime')) {
        timeOfDay = 'bedtime';
      } else if (lowerFreq.includes('evening')) {
        timeOfDay = 'evening';
      } else if (lowerFreq.includes('afternoon') || lowerFreq.includes('lunch')) {
        timeOfDay = 'afternoon';
      } else {
        timeOfDay = 'morning';
      }

      // Log source inference
      let loggedVia: 'VOICE_CHECKIN' | 'IN_APP_TOAST' | 'MANUAL_MODAL' | 'SYSTEM_SCHEDULE' | 'BULK_EDIT' = 'VOICE_CHECKIN';
      if (med.isSkippedToday) {
        loggedVia = 'BULK_EDIT';
      } else if (med.id === 'med-03') {
        loggedVia = 'VOICE_CHECKIN';
      } else if (med.id === 'med-01') {
        loggedVia = 'SYSTEM_SCHEDULE';
      } else {
        loggedVia = 'MANUAL_MODAL';
      }

      const customNote = savedNotes[med.id] || med.notes || (med.acbScore > 0 && !med.isSkippedToday ? `Anticholinergic monitoring active (+${med.acbScore})` : '');

      return {
        id: `intake-${med.id}`,
        medicationId: med.id,
        medicationName: med.name,
        dosage: med.dosage,
        genericName: med.genericName,
        takenAt: timeStr,
        timeOfDay,
        acbScore: med.acbScore,
        indication: med.indication,
        status: med.isSkippedToday ? 'SKIPPED' : 'TAKEN_ON_TIME',
        loggedVia,
        imageUrl: med.imageUrl,
        notes: customNote,
        isSkipped: med.isSkippedToday,
        skippedReason: med.skippedReason
      };
    });
  }, [safeMedications, savedNotes]);

  // Filter history items based on search and timeFilter
  const filteredHistory = useMemo(() => {
    return intakeHistory.filter(item => {
      // Search term
      const query = historySearch.toLowerCase().trim();
      const matchesSearch = !query || 
        item.medicationName.toLowerCase().includes(query) ||
        (item.genericName && item.genericName.toLowerCase().includes(query)) ||
        item.indication.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query)) ||
        (item.skippedReason && item.skippedReason.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Filter chips
      if (timeFilter === 'all') return true;
      if (timeFilter === 'acb_only') return item.acbScore > 0;
      if (timeFilter === 'skipped_only') return Boolean(item.isSkipped);
      if (timeFilter === 'morning') return item.timeOfDay === 'morning';
      if (timeFilter === 'afternoon') return item.timeOfDay === 'afternoon';
      if (timeFilter === 'evening') return item.timeOfDay === 'evening' || item.timeOfDay === 'bedtime';

      return true;
    });
  }, [intakeHistory, historySearch, timeFilter]);

  const handleRequestPushPermission = async () => {
    setIsPermissionRequesting(true);
    const result = await requestNotificationPermission();
    setPermissionStatus(result);
    setIsPermissionRequesting(false);
  };

  const handleTriggerSingleReminder = (med: Medication) => {
    notificationAudio.playReminderChime();

    if (voiceEnabled) {
      speakMedicationReminder(med, language);
    }

    sendBrowserPushNotification(med, language, () => {
      onToggleMedicationTaken(med.id);
    });

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

  const handlePlayHistorySpeech = (item: MedicationIntakeRecord) => {
    setSpeakingHistoryId(item.id);
    speakMedicationHistoryRecord(item.medicationName, item.dosage, item.takenAt, language);
    setTimeout(() => setSpeakingHistoryId(null), 3500);
  };

  const handlePrintAuditTrail = () => {
    setExportNotice(
      language === 'ar' 
        ? 'تم تجهيز تقرير سجل الجرعات اليومي والملاحظات المرفقة للطباعة أو المشاركة السريرية.'
        : 'Today’s Medication Adherence & Context Notes are formatted for printing/clinical sharing.'
    );
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Inline Note Editing Actions
  const handleStartEditNote = (medId: string, currentNote?: string) => {
    setEditingNoteMedId(medId);
    setNoteDraftText(currentNote || savedNotes[medId] || '');
  };

  const handleSaveNote = (medId: string) => {
    const trimmed = noteDraftText.trim();
    const updated = { ...savedNotes, [medId]: trimmed };
    setSavedNotes(updated);
    try {
      localStorage.setItem('wanees_med_history_notes', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setEditingNoteMedId(null);
    setNoteDraftText('');
  };

  const handleCancelEditNote = () => {
    setEditingNoteMedId(null);
    setNoteDraftText('');
  };

  const handleClearNote = (medId: string) => {
    const updated = { ...savedNotes };
    delete updated[medId];
    setSavedNotes(updated);
    try {
      localStorage.setItem('wanees_med_history_notes', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setEditingNoteMedId(null);
    setNoteDraftText('');
  };

  const handleSelectPresetNote = (text: string) => {
    setNoteDraftText(prev => prev ? `${prev} • ${text}` : text);
  };

  // Bulk Edit Actions
  const handleToggleSelectMed = (medId: string) => {
    setSelectedMedIds(prev => 
      prev.includes(medId) ? prev.filter(id => id !== medId) : [...prev, medId]
    );
  };

  const handleSelectAllMeds = () => {
    setSelectedMedIds(safeMedications.map(m => m.id));
  };

  const handleDeselectAllMeds = () => {
    setSelectedMedIds([]);
  };

  const handleBulkMarkAsTaken = () => {
    if (selectedMedIds.length === 0) return;
    if (onBulkUpdateMedications) {
      onBulkUpdateMedications(
        selectedMedIds.map(id => ({
          id,
          action: 'TAKE',
          note: bulkCustomNote || undefined
        }))
      );
    } else {
      // Fallback
      selectedMedIds.forEach(id => onToggleMedicationTaken(id));
    }
    setExportNotice(
      language === 'ar'
        ? `تم تحديث ${selectedMedIds.length} أدوية كـ "تم الأخذ" بنجاح.`
        : `Successfully marked ${selectedMedIds.length} medication(s) as Taken.`
    );
    setTimeout(() => setExportNotice(null), 3500);
    setSelectedMedIds([]);
    setIsBulkEditMode(false);
    setBulkCustomNote('');
  };

  const handleBulkMarkAsSkipped = () => {
    if (selectedMedIds.length === 0) return;
    const defaultReason = SKIPPED_REASON_PRESETS[language]?.[0] || 'Missed entire dosing block';
    const reason = selectedSkipReason || defaultReason;

    if (onBulkUpdateMedications) {
      onBulkUpdateMedications(
        selectedMedIds.map(id => ({
          id,
          action: 'SKIP',
          reason,
          note: bulkCustomNote ? `${reason} • ${bulkCustomNote}` : reason
        }))
      );
    }
    setExportNotice(
      language === 'ar'
        ? `تم توثيق ${selectedMedIds.length} أدوية كـ "تم التخطي" مع ذكر السبب.`
        : `Successfully marked ${selectedMedIds.length} medication(s) as Skipped with reason.`
    );
    setTimeout(() => setExportNotice(null), 3500);
    setSelectedMedIds([]);
    setIsBulkEditMode(false);
    setIsBulkSkipModalOpen(false);
    setSelectedSkipReason('');
    setBulkCustomNote('');
  };

  const handleBulkReset = () => {
    if (selectedMedIds.length === 0) return;
    if (onBulkUpdateMedications) {
      onBulkUpdateMedications(
        selectedMedIds.map(id => ({
          id,
          action: 'RESET'
        }))
      );
    }
    setExportNotice(
      language === 'ar'
        ? `تمت إعادة ${selectedMedIds.length} أدوية إلى قائمة الانتظار والمواعيد المجدولة.`
        : `Reset ${selectedMedIds.length} medication(s) to scheduled pending list.`
    );
    setTimeout(() => setExportNotice(null), 3500);
    setSelectedMedIds([]);
    setIsBulkEditMode(false);
  };

  const currentPresets = QUICK_NOTE_PRESETS[language] || QUICK_NOTE_PRESETS.en;
  const currentSkipReasons = SKIPPED_REASON_PRESETS[language] || SKIPPED_REASON_PRESETS.en;

  return (
    <div
      id="medication-reminder-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-2xl bg-white/10 border border-teal-400/30 text-teal-200 hidden sm:flex items-center justify-center shadow-inner">
                <WaneesLogo variant="icon" size="sm" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                    {language === 'ar' ? 'مركز تنبيهات وسجل الأدوية الذكي' : language === 'fr' ? 'Centre de Rappels & Historique Médical' : 'Medication Reminders & Adherence Hub'}
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-400 text-amber-950">
                    Live Audit Trail
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-teal-200/90 mt-0.5">
                  {language === 'ar' 
                    ? 'إدارة التنبيهات المباشرة وتتبع السجل الزمني والتعديل الجماعي للجرعات'
                    : 'Manage active smart reminders, view adherence audit trail, and bulk edit doses'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md">
            <button
              type="button"
              id="tab-btn-med-schedule"
              onClick={() => {
                setActiveTab('schedule');
                setIsBulkEditMode(false);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'schedule'
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'text-teal-100 hover:bg-white/10'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>{language === 'ar' ? 'جدول اليوم والتنبيهات' : 'Schedule & Reminders'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'schedule' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/20 text-white'
              }`}>
                {pendingMedications.length > 0 ? `${pendingMedications.length} ${language === 'ar' ? 'متبقي' : 'pending'}` : '✓'}
              </span>
            </button>

            <button
              type="button"
              id="tab-btn-med-history"
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'history'
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'text-teal-100 hover:bg-white/10'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{language === 'ar' ? 'سجل الأدوية المتناولة' : 'Medication History'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'history' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/20 text-white'
              }`}>
                {takenMedications.length + skippedMedications.length} {language === 'ar' ? 'مسجلة' : 'Logged'}
              </span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* ========================================================= */}
          {/* TAB 1: SCHEDULE & ACTIVE REMINDERS                       */}
          {/* ========================================================= */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Adherence & Status Banner */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-lg shadow-xs border border-emerald-200 dark:border-emerald-800">
                    {takenMedications.length}/{safeMedications.length}
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

                {pendingMedications.length > 0 ? (
                  <button
                    type="button"
                    id="btn-trigger-all-reminders"
                    onClick={handleTriggerAllPending}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إرسال تنبيه بالجرعات المتبقية' : 'Trigger Pending Reminders'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors hover:bg-emerald-100"
                  >
                    <History className="w-4 h-4" />
                    <span>{language === 'ar' ? 'عرض السجل والملاحظات' : 'View History & Notes'}</span>
                  </button>
                )}
              </div>

              {/* Browser Push & Sound Permissions Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Push Notifications Card */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
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
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
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

              {/* Schedule List */}
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
                    const isPending = !med.isTakenToday && !med.isSkippedToday;
                    const hasAcb = med.acbScore > 0;

                    return (
                      <div
                        key={med.id}
                        id={`modal-med-row-${med.id}`}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                          med.isTakenToday
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                            : med.isSkippedToday
                            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                            : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
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
                              {med.isSkippedToday && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                                  {language === 'ar' ? 'تم التخطي' : 'Skipped'}
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
          )}

          {/* ========================================================= */}
          {/* TAB 2: MEDICATION HISTORY & AUDIT TRAIL                   */}
          {/* ========================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-fadeIn" id="medication-history-section">
              
              {/* Adherence Audit Overview Header Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center justify-center shadow-xs">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {language === 'ar' ? 'سجل الالتزام الدوائي اليومي' : 'Daily Adherence Audit Trail'}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {adherenceRate}% {language === 'ar' ? 'مكتمل' : 'Complete'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {language === 'ar'
                          ? `توثيق زمني دقيق للجرعات المتناولة والمتخطاة (${takenMedications.length} أُخذت، ${skippedMedications.length} تم تخطيها)`
                          : `Chronological record of doses taken & skipped (${takenMedications.length} taken, ${skippedMedications.length} skipped)`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Bulk Edit Toggle Button */}
                    <button
                      type="button"
                      id="btn-toggle-bulk-edit"
                      onClick={() => {
                        setIsBulkEditMode(!isBulkEditMode);
                        setSelectedMedIds([]);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                        isBulkEditMode
                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                          : 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800'
                      }`}
                    >
                      <ListChecks className="w-4 h-4" />
                      <span>{isBulkEditMode ? (language === 'ar' ? 'إنهاء التعديل الجماعي' : 'Exit Bulk Edit') : (language === 'ar' ? 'تعديل جماعي' : 'Bulk Edit')}</span>
                    </button>

                    {/* Print Audit Trail */}
                    <button
                      type="button"
                      id="btn-print-audit-trail"
                      onClick={handlePrintAuditTrail}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{language === 'ar' ? 'طباعة التقرير' : 'Print / Export'}</span>
                    </button>
                  </div>
                </div>

                {/* Micro Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      {language === 'ar' ? 'الجرعات المتناولة' : 'Doses Taken'}
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
                      {takenMedications.length} / {safeMedications.length}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      {language === 'ar' ? 'تم تخطيها' : 'Skipped Doses'}
                    </span>
                    <span className={`text-lg font-black mt-0.5 block ${
                      skippedMedications.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {skippedMedications.length}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      {language === 'ar' ? 'عبء الـ ACB المتناول' : 'Taken ACB'}
                    </span>
                    <span className={`text-lg font-black mt-0.5 block ${
                      takenAcbScore >= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      +{takenAcbScore}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      {language === 'ar' ? 'آخر جرعة موثقة' : 'Latest Log'}
                    </span>
                    <span className="text-xs font-bold text-teal-700 dark:text-teal-300 mt-1 block truncate">
                      {intakeHistory[0]?.takenAt || (language === 'ar' ? 'لا يوجد' : 'None')}
                    </span>
                  </div>
                </div>

                {exportNotice && (
                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
                    <span>{exportNotice}</span>
                  </div>
                )}
              </div>

              {/* ======================================================= */}
              {/* BULK EDIT CONTROL PANEL (When Active)                   */}
              {/* ======================================================= */}
              {isBulkEditMode && (
                <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400/80 dark:border-amber-700/80 shadow-md space-y-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <ListChecks className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                      <div>
                        <h5 className="font-extrabold text-sm text-amber-950 dark:text-amber-100">
                          {language === 'ar' ? 'لوحة التعديل الجماعي للجرعات' : 'Bulk Medication History Editor'}
                        </h5>
                        <p className="text-xs text-amber-800 dark:text-amber-300">
                          {language === 'ar' 
                            ? 'حدد الأدوية لتحديث حالتها معاً (مفيد عند تفويت فترة جرعات كاملة أو تناولها سوياً)'
                            : 'Select multiple doses to mark as Taken or Skipped if an entire dosing block was missed'}
                        </p>
                      </div>
                    </div>

                    {/* Quick Selection Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        id="btn-bulk-select-all"
                        onClick={handleSelectAllMeds}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-850 text-xs font-bold text-slate-800 dark:text-slate-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-100"
                      >
                        {language === 'ar' ? 'تحديد الكل' : 'Select All'}
                      </button>

                      <button
                        type="button"
                        id="btn-bulk-deselect-all"
                        onClick={handleDeselectAllMeds}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-850 text-xs font-bold text-slate-800 dark:text-slate-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-100"
                      >
                        {language === 'ar' ? 'إلغاء التحديد' : 'Deselect All'}
                      </button>
                    </div>
                  </div>

                  {/* Optional Bulk Context Note Field */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="input-bulk-note"
                      className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5"
                    >
                      <StickyNote className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'ملاحظة جماعية مرفقة (اختياري):' : 'Batch Context Note (Optional):'}</span>
                    </label>
                    <input
                      id="input-bulk-note"
                      type="text"
                      value={bulkCustomNote}
                      onChange={(e) => setBulkCustomNote(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: تم تفويت فترة الصباح بسبب مراجعة العيادة...' : 'e.g., Missed morning dosing block due to clinic visit...'}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Bulk Action Buttons Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-amber-200 dark:border-amber-800/60">
                    <span className="text-xs font-extrabold text-amber-900 dark:text-amber-200">
                      {selectedMedIds.length} {language === 'ar' ? 'أدوية محددة' : 'medication(s) selected'}
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Mark as Taken */}
                      <button
                        type="button"
                        id="btn-bulk-mark-taken"
                        disabled={selectedMedIds.length === 0}
                        onClick={handleBulkMarkAsTaken}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{language === 'ar' ? 'تحديد كـ "تم الأخذ"' : 'Mark Selected Taken'}</span>
                      </button>

                      {/* Mark as Skipped */}
                      <button
                        type="button"
                        id="btn-bulk-mark-skipped"
                        disabled={selectedMedIds.length === 0}
                        onClick={() => setIsBulkSkipModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                      >
                        <Ban className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تحديد كـ "تم التخطي"' : 'Mark Selected Skipped'}</span>
                      </button>

                      {/* Reset to Pending */}
                      <button
                        type="button"
                        id="btn-bulk-reset"
                        disabled={selectedMedIds.length === 0}
                        onClick={handleBulkReset}
                        className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'إعادة كمجدول' : 'Reset'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Skip Reason Selection Sub-Modal / Popover */}
                  {isBulkSkipModalOpen && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>{language === 'ar' ? 'اختر سبب تخطي هذه الجرعات:' : 'Select reason for skipping these doses:'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsBulkSkipModalOpen(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {currentSkipReasons.map((reason, rIdx) => (
                          <label
                            key={rIdx}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                              selectedSkipReason === reason
                                ? 'bg-rose-50 dark:bg-rose-950 border-rose-300 text-rose-950 dark:text-rose-100 font-bold'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="skip-reason"
                              checked={selectedSkipReason === reason}
                              onChange={() => setSelectedSkipReason(reason)}
                              className="text-rose-600 focus:ring-rose-500"
                            />
                            <span>{reason}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsBulkSkipModalOpen(false)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>

                        <button
                          type="button"
                          onClick={handleBulkMarkAsSkipped}
                          className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs"
                        >
                          {language === 'ar' ? 'تأكيد التخطي' : 'Confirm Skip'}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
                  <input
                    type="text"
                    id="input-search-med-history"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder={language === 'ar' ? 'بحث بالاسم، الدواعي، أو ملاحظات السياق...' : 'Search past doses by name, notes, or indication...'}
                    className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-xs"
                  />
                  {historySearch && (
                    <button
                      type="button"
                      onClick={() => setHistorySearch('')}
                      className="absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setTimeFilter('all')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      timeFilter === 'all'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'ar' ? 'الكل' : 'All'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimeFilter('morning')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      timeFilter === 'morning'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'ar' ? 'الصباح' : 'Morning'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimeFilter('evening')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      timeFilter === 'evening'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'ar' ? 'المساء/النوم' : 'Evening/Night'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimeFilter('skipped_only')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      timeFilter === 'skipped_only'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50'
                    }`}
                  >
                    {language === 'ar' ? 'تم التخطي' : 'Skipped'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimeFilter('acb_only')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      timeFilter === 'acb_only'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    {language === 'ar' ? 'أدوية ACB' : 'ACB Meds'}
                  </button>
                </div>
              </div>

              {/* Chronological History List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-teal-600" />
                    <span>
                      {language === 'ar' ? 'السجل الزمني للأدوية المتناولة اليوم مع الملاحظات' : 'Chronological Intake Timeline & Notes'}
                    </span>
                  </h5>
                  <span className="text-xs text-slate-400">
                    {filteredHistory.length} {language === 'ar' ? 'جرعات موثقة' : 'recorded doses'}
                  </span>
                </div>

                {filteredHistory.length === 0 && !isBulkEditMode ? (
                  /* Empty State */
                  <div className="p-8 rounded-3xl bg-white dark:bg-slate-850 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <History className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                      <h6 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {language === 'ar' ? 'لا توجد جرعات مسجلة في هذا التصنيف' : 'No medication records found'}
                      </h6>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {takenMedications.length === 0
                          ? (language === 'ar' 
                              ? 'لم يتم تأكيد أخذ أي دواء بعد اليوم. يمكنك الانتقال إلى تبويب الجدول لتأكيد جرعاتك أو استخدام التعديل الجماعي.'
                              : 'No medications have been marked as taken yet today. Switch to the Schedule tab or use Bulk Edit.')
                          : (language === 'ar'
                              ? 'لا توجد نتائج تطابق خيارات البحث أو الفلتر المحددة.'
                              : 'No intake records match your active search and filter criteria.')}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      {takenMedications.length === 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('schedule')}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs inline-flex items-center gap-2 transition-transform active:scale-95"
                        >
                          <Pill className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'الانتقال إلى جدول اليوم' : 'Go to Today’s Schedule'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsBulkEditMode(true);
                          handleSelectAllMeds();
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-transform active:scale-95"
                      >
                        <ListChecks className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'تعديل جماعي للجرعات' : 'Bulk Edit Missed Doses'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Timeline & Bulk Edit Entries */
                  <div className="relative border-l-2 border-teal-500/30 rtl:border-l-0 rtl:border-r-2 rtl:border-teal-500/30 ml-4 rtl:ml-0 rtl:mr-4 space-y-4 py-1">
                    {(isBulkEditMode ? safeMedications : filteredHistory.map(h => safeMedications.find(m => m.id === h.medicationId)!)).filter(Boolean).map((med) => {
                      const item = intakeHistory.find(h => h.medicationId === med.id) || {
                        id: `med-row-${med.id}`,
                        medicationId: med.id,
                        medicationName: med.name,
                        dosage: med.dosage,
                        genericName: med.genericName,
                        takenAt: med.lastTaken || 'Scheduled',
                        timeOfDay: 'morning',
                        acbScore: med.acbScore,
                        indication: med.indication,
                        status: med.isSkippedToday ? 'SKIPPED' : med.isTakenToday ? 'TAKEN_ON_TIME' : 'TAKEN_ON_TIME',
                        loggedVia: 'MANUAL_MODAL',
                        imageUrl: med.imageUrl,
                        notes: savedNotes[med.id] || med.notes,
                        isSkipped: med.isSkippedToday,
                        skippedReason: med.skippedReason
                      };

                      const isSelected = selectedMedIds.includes(med.id);
                      const isSpeaking = speakingHistoryId === item.id;
                      const isEditingNote = editingNoteMedId === med.id;
                      const hasNote = Boolean(item.notes && item.notes.trim());

                      return (
                        <div
                          key={med.id}
                          id={`history-row-${med.id}`}
                          className={`relative pl-6 rtl:pl-0 rtl:pr-6 group animate-fadeIn ${
                            isBulkEditMode && isSelected ? 'scale-[1.01] transition-transform' : ''
                          }`}
                        >
                          {/* Timeline Marker Dot */}
                          <div className={`absolute -left-[9px] rtl:-left-auto rtl:-right-[9px] top-4 w-4 h-4 rounded-full border-3 border-white dark:border-slate-900 shadow-xs flex items-center justify-center text-white ${
                            med.isSkippedToday
                              ? 'bg-rose-500'
                              : med.isTakenToday
                              ? 'bg-emerald-500'
                              : 'bg-amber-400'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          </div>

                          {/* Record Card */}
                          <div className={`p-4 rounded-2xl border shadow-xs transition-all space-y-3 ${
                            isBulkEditMode && isSelected
                              ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/40'
                              : med.isSkippedToday
                              ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                              : med.isTakenToday
                              ? 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-700'
                              : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                          }`}>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                              
                              <div className="flex items-center gap-3.5 min-w-0">
                                
                                {/* Bulk Selection Checkbox */}
                                {isBulkEditMode && (
                                  <button
                                    type="button"
                                    id={`chk-bulk-med-${med.id}`}
                                    onClick={() => handleToggleSelectMed(med.id)}
                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${
                                      isSelected
                                        ? 'bg-amber-500 border-amber-600 text-slate-950'
                                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-transparent'
                                    }`}
                                  >
                                    <Check className="w-4 h-4 stroke-[3]" />
                                  </button>
                                )}

                                {/* Medication Photo Thumbnail */}
                                {med.imageUrl ? (
                                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs">
                                    <img
                                      src={med.imageUrl}
                                      alt={med.name}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                      loading="lazy"
                                    />
                                  </div>
                                ) : (
                                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
                                    med.isSkippedToday
                                      ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 border-rose-200 dark:border-rose-800'
                                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                                  }`}>
                                    {med.isSkippedToday ? <Ban className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
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
                                    
                                    {/* Status Badge */}
                                    {med.isSkippedToday ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                        <Ban className="w-3 h-3 text-rose-600" />
                                        <span>{language === 'ar' ? 'تم التخطي' : 'Skipped'}</span>
                                      </span>
                                    ) : med.isTakenToday ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                        <Clock className="w-3 h-3 text-emerald-600" />
                                        <span>{item.takenAt}</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        {language === 'ar' ? 'مجدول / قيد الانتظار' : 'Pending'}
                                      </span>
                                    )}

                                    {med.acbScore > 0 && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                        ACB +{med.acbScore}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                                    <span>{med.indication}</span>
                                    <span>•</span>
                                    <span className="text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                                      {med.isSkippedToday
                                        ? (item.skippedReason || (language === 'ar' ? 'تم تفويت الجرعة' : 'Missed dosing block'))
                                        : item.loggedVia === 'VOICE_CHECKIN' 
                                        ? (language === 'ar' ? 'مؤكد عبر المحادثة الصوتية' : 'Logged via Voice Check-in')
                                        : item.loggedVia === 'IN_APP_TOAST'
                                        ? (language === 'ar' ? 'مؤكد عبر إشعار الشاشة' : 'Confirmed via Screen Toast')
                                        : item.loggedVia === 'BULK_EDIT'
                                        ? (language === 'ar' ? 'محدث عبر التعديل الجماعي' : 'Updated via Bulk Edit')
                                        : (language === 'ar' ? 'تأكيد يدوي مباشر' : 'Direct Confirmation')}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions: Voice Pronounce & Undo / Quick Toggle */}
                              {!isBulkEditMode && (
                                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                  <button
                                    type="button"
                                    id={`btn-speak-history-${med.id}`}
                                    onClick={() => handlePlayHistorySpeech(item as MedicationIntakeRecord)}
                                    className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                                      isSpeaking
                                        ? 'bg-teal-600 text-white animate-pulse'
                                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}
                                    title={language === 'ar' ? 'استمع إلى تفاصيل التناول' : 'Pronounce intake confirmation'}
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    id={`btn-undo-med-${med.id}`}
                                    onClick={() => {
                                      onToggleMedicationTaken(med.id);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                                    title={language === 'ar' ? 'إلغاء التأكيد وإعادة الجرعة إلى الجدول' : 'Undo and mark as pending again'}
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>{language === 'ar' ? 'تراجع' : 'Undo'}</span>
                                  </button>
                                </div>
                              )}

                            </div>

                            {/* ======================================================= */}
                            {/* INLINE CONTEXT NOTE DISPLAY & EDITING SECTION           */}
                            {/* ======================================================= */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                              
                              {/* MODE A: Active Inline Note Editing Form */}
                              {isEditingNote ? (
                                <div className="space-y-2.5 p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 animate-fadeIn">
                                  
                                  <div className="flex items-center justify-between">
                                    <label 
                                      htmlFor={`input-note-${med.id}`}
                                      className="text-xs font-extrabold text-teal-900 dark:text-teal-200 flex items-center gap-1.5"
                                    >
                                      <StickyNote className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                      <span>{language === 'ar' ? 'إضافة / تعديل ملاحظة الجرعة' : 'Add / Edit Dose Context Note'}</span>
                                    </label>

                                    <span className="text-[11px] text-teal-700 dark:text-teal-300">
                                      {language === 'ar' ? 'سياق التناول، وجبات الطعام، أو الأعراض' : 'Context (meals, water, symptoms)'}
                                    </span>
                                  </div>

                                  {/* Text Input */}
                                  <div className="relative">
                                    <input
                                      id={`input-note-${med.id}`}
                                      type="text"
                                      value={noteDraftText}
                                      onChange={(e) => setNoteDraftText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveNote(med.id);
                                        if (e.key === 'Escape') handleCancelEditNote();
                                      }}
                                      placeholder={
                                        language === 'ar'
                                          ? 'مثال: تم التناول بعد وجبة الإفطار، مع كوب ماء، لا توجد أعراض...'
                                          : 'e.g. Taken after meal, with full glass of water, mild dizziness...'
                                      }
                                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
                                      autoFocus
                                    />
                                  </div>

                                  {/* Quick Selection Presets */}
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                                      {language === 'ar' ? 'خيارات سريعة:' : 'Quick Presets:'}
                                    </span>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {currentPresets.map((preset, pIdx) => (
                                        <button
                                          key={pIdx}
                                          type="button"
                                          onClick={() => handleSelectPresetNote(preset.text)}
                                          className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 hover:bg-teal-100 dark:hover:bg-teal-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-teal-200 dark:border-teal-800 transition-colors shadow-2xs"
                                        >
                                          {preset.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Form Actions */}
                                  <div className="flex items-center justify-between pt-1 gap-2">
                                    {hasNote ? (
                                      <button
                                        type="button"
                                        onClick={() => handleClearNote(med.id)}
                                        className="px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-xs font-semibold flex items-center gap-1 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>{language === 'ar' ? 'حذف الملاحظة' : 'Clear'}</span>
                                      </button>
                                    ) : <div></div>}

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={handleCancelEditNote}
                                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700"
                                      >
                                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                      </button>

                                      <button
                                        type="button"
                                        id={`btn-save-note-${med.id}`}
                                        onClick={() => handleSaveNote(med.id)}
                                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>{language === 'ar' ? 'حفظ الملاحظة' : 'Save Note'}</span>
                                      </button>
                                    </div>
                                  </div>

                                </div>
                              ) : (
                                /* MODE B: Static Display with Edit Trigger */
                                <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                                  {hasNote ? (
                                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 min-w-0 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex-1">
                                      <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                                      <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                                        {language === 'ar' ? 'ملاحظة السياق:' : 'Note:'}
                                      </span>
                                      <span className="truncate italic text-slate-600 dark:text-slate-300">
                                        {item.notes}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-slate-400 italic">
                                      {language === 'ar' ? 'لا توجد ملاحظات إضافية مسجلة لهذه الجرعة' : 'No context notes added for this dose'}
                                    </span>
                                  )}

                                  <button
                                    type="button"
                                    id={`btn-edit-note-${med.id}`}
                                    onClick={() => handleStartEditNote(med.id, item.notes)}
                                    className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-1 transition-colors border border-teal-200/70 dark:border-teal-800/70 shrink-0"
                                  >
                                    {hasNote ? (
                                      <>
                                        <Pencil className="w-3 h-3" />
                                        <span>{language === 'ar' ? 'تعديل الملاحظة' : 'Edit Note'}</span>
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-3 h-3" />
                                        <span>{language === 'ar' ? 'إضافة ملاحظة' : 'Add Note'}</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}

                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Adherence Verification Seal Footer */}
              <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80 flex items-center justify-between gap-3 text-xs text-teal-900 dark:text-teal-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>
                    {language === 'ar' 
                      ? 'سجل الالتزام والملاحظات متزامنة مع ملف الطبيب (Doctor Brief 2.0) وبوابة رعاية الأسرة'
                      : 'Audit records & context notes sync automatically with Doctor Brief 2.0 and Family Care Portal'}
                  </span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-teal-700 dark:text-teal-300 shrink-0">
                  WANEES-MED-LOG
                </span>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {activeTab === 'schedule'
                ? (language === 'ar' ? 'تنبيهات فورية متوافقة مع الذاكرة وخصوصية كبار السن' : 'Senior-friendly notification orchestration')
                : (language === 'ar' ? `تم توثيق ${takenMedications.length} جرعات مأخوذة، ${skippedMedications.length} متخطاة` : `${takenMedications.length} doses taken, ${skippedMedications.length} skipped today`)}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-bold text-xs transition-colors shadow-xs"
          >
            {language === 'ar' ? 'تم / إغلاق' : 'Done / Close'}
          </button>
        </div>

      </div>
    </div>
  );
};

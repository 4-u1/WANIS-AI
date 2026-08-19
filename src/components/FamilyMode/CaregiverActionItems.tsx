import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Pill,
  Brain,
  Bell,
  Phone,
  Send,
  Sparkles,
  ShieldCheck,
  Filter,
  Check,
  ChevronRight,
  Info,
  Calendar,
  UserCheck,
  FileText,
  ArrowUpDown,
  Search,
  CheckCheck,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import {
  SeniorProfile,
  Medication,
  CareLoopEvent,
  CareCircleTriageNotification,
  SupportedLanguage
} from '../../types';

export type ActionItemType = 'ALL' | 'MEDICATION' | 'CARE_LOOP' | 'WELLNESS_FOLLOWUP' | 'TRIAGE_ALERT';
export type ActionItemPriority = 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'ROUTINE';
export type ActionItemSort = 'PRIORITY_DESC' | 'DUE_TIME' | 'STATUS_PENDING_FIRST' | 'TITLE_AZ';

export interface ActionItem {
  id: string;
  sourceType: 'MEDICATION' | 'CARE_LOOP' | 'TRIAGE_ALERT' | 'WELLNESS_FOLLOWUP';
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'ROUTINE';
  dueTimeText: string;
  dueTimeTextAr: string;
  dueOrder: number; // for chronological sorting
  requiresConfirmation: boolean;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  relatedMedicationId?: string;
  relatedMedication?: Medication;
  relatedCareLoopId?: string;
  actionPayload?: any;
}

interface CaregiverActionItemsProps {
  senior: SeniorProfile;
  medications?: Medication[];
  careLoopEvents?: CareLoopEvent[];
  triageNotifications?: CareCircleTriageNotification[];
  language: SupportedLanguage;
  totalAcbScore?: number;
  onToggleMedicationTaken?: (id: string) => void;
  onTriggerMedicationReminder?: (med: Medication) => void;
  onOpenDoctorBrief?: () => void;
}

export const CaregiverActionItems: React.FC<CaregiverActionItemsProps> = ({
  senior,
  medications = [],
  careLoopEvents = [],
  triageNotifications = [],
  language,
  totalAcbScore = 0,
  onToggleMedicationTaken,
  onTriggerMedicationReminder,
  onOpenDoctorBrief
}) => {
  const isRtl = language === 'ar';
  const [selectedType, setSelectedType] = useState<ActionItemType>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<ActionItemPriority>('ALL');
  const [sortBy, setSortBy] = useState<ActionItemSort>('PRIORITY_DESC');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const [manualCompletedIds, setManualCompletedIds] = useState<Record<string, { time: string; user: string }>>({});
  const [sentReminders, setSentReminders] = useState<Record<string, boolean>>({});

  // Dynamically synthesize action items from live medications, careLoopEvents, and notifications
  const rawActionItems = useMemo<ActionItem[]>(() => {
    const items: ActionItem[] = [];

    // 1. Medication confirmations
    medications.forEach((med, index) => {
      const isTaken = med.isTakenToday;
      const isManualDone = !!manualCompletedIds[`med-${med.id}`];
      const isDone = isTaken || isManualDone;

      const isHighAcb = med.acbScore >= 2;
      const priority = isHighAcb ? 'HIGH' : 'MEDIUM';
      const isEvening = med.frequency.toLowerCase().includes('evening') || med.frequency.toLowerCase().includes('night');

      items.push({
        id: `med-${med.id}`,
        sourceType: 'MEDICATION',
        title: `${med.name} (${med.dosage})`,
        titleAr: `${med.name} (${med.dosage})`,
        subtitle: isHighAcb
          ? `High Cognitive Burden (ACB ${med.acbScore}) • Needs manual caregiver confirmation for evening routine`
          : `${med.frequency} • Verify senior intake after meal`,
        subtitleAr: isHighAcb
          ? `عبء معرفي مرتفع (ACB ${med.acbScore}) • يتطلب تأكيداً يدوياً من مقدم الرعاية قبل موعد النوم`
          : `${med.frequency} • التحقق من تناول الوالدة للجرعة بعد الوجبة`,
        priority: isHighAcb ? 'HIGH' : 'MEDIUM',
        dueTimeText: isEvening ? 'Tonight 09:00 PM' : 'Today 08:30 AM',
        dueTimeTextAr: isEvening ? 'الليلة 09:00 م' : 'اليوم 08:30 ص',
        dueOrder: isEvening ? 2100 + index : 830 + index,
        requiresConfirmation: true,
        isCompleted: isDone,
        completedAt: isDone ? (manualCompletedIds[`med-${med.id}`]?.time || 'Today 08:45 AM') : undefined,
        completedBy: isDone ? (manualCompletedIds[`med-${med.id}`]?.user || 'Maryam (Daughter)') : undefined,
        relatedMedicationId: med.id,
        relatedMedication: med
      });
    });

    // 2. Care Loop Follow-ups requiring human review
    careLoopEvents.forEach((ev, index) => {
      if (ev.requiresHumanReview || ev.stage === 'ASSESS' || ev.stage === 'RECOMMEND') {
        const isDone = !!manualCompletedIds[`careloop-${ev.id}`] || !!ev.isOverridden;
        items.push({
          id: `careloop-${ev.id}`,
          sourceType: 'CARE_LOOP',
          title: ev.title,
          titleAr: ev.title,
          subtitle: ev.description,
          subtitleAr: ev.description,
          priority: ev.triage === 'RED' ? 'CRITICAL' : ev.triage === 'YELLOW' ? 'HIGH' : 'MEDIUM',
          dueTimeText: 'Pending Human Verification',
          dueTimeTextAr: 'بانتظار التحقق البشري',
          dueOrder: 700 + index,
          requiresConfirmation: true,
          isCompleted: isDone,
          completedAt: isDone ? (manualCompletedIds[`careloop-${ev.id}`]?.time || 'Today') : undefined,
          completedBy: isDone ? 'Caregiver Verified' : undefined,
          relatedCareLoopId: ev.id
        });
      }
    });

    // 3. High ACB Warning item if total burden >= 3
    if (totalAcbScore >= 3) {
      const isDone = !!manualCompletedIds['acb-threshold-review'];
      items.push({
        id: 'acb-threshold-review',
        sourceType: 'CARE_LOOP',
        title: 'ACB Burden Review: Amitriptyline & Antihistamines',
        titleAr: 'مراجعة العبء الكوليني التراكمي: أميتريبتيلين ومضادات الحساسية',
        subtitle: `Cumulative score is ${totalAcbScore} (High Risk). Review deprescribing recommendations with Dr. Sarah.`,
        subtitleAr: `العبء التراكمي الحالي ${totalAcbScore} (خطورة عالية). مناقشة خطة التخفيف الدوائي مع د. سارة في ملخص الطبيب.`,
        priority: 'CRITICAL',
        dueTimeText: 'Action Required Before Next Clinic Visit',
        dueTimeTextAr: 'إجراء مطلوب قبل موعد العيادة القادم',
        dueOrder: 600,
        requiresConfirmation: true,
        isCompleted: isDone,
        completedAt: isDone ? manualCompletedIds['acb-threshold-review']?.time : undefined,
        completedBy: isDone ? manualCompletedIds['acb-threshold-review']?.user : undefined
      });
    }

    // 4. Check-in voice follow-up
    const isVoiceFollowupDone = !!manualCompletedIds['wellness-voice-followup'];
    items.push({
      id: 'wellness-voice-followup',
      sourceType: 'WELLNESS_FOLLOWUP',
      title: 'Afternoon Hydration & Wellbeing Call',
      titleAr: 'مكالمة الاطمئنان وشرب السوائل بعد الظهر',
      subtitle: `Call ${senior.preferredName || senior.fullName} to confirm adequate water intake and check on morning grogginess.`,
      subtitleAr: `الاتصال بـ ${senior.preferredName || senior.fullName} للاطمئنان والتأكد من شرب الماء الكافي بعد خمول الصباح.`,
      priority: 'MEDIUM',
      dueTimeText: 'Today 04:30 PM',
      dueTimeTextAr: 'اليوم 04:30 م',
      dueOrder: 1630,
      requiresConfirmation: true,
      isCompleted: isVoiceFollowupDone,
      completedAt: isVoiceFollowupDone ? manualCompletedIds['wellness-voice-followup']?.time : undefined,
      completedBy: isVoiceFollowupDone ? manualCompletedIds['wellness-voice-followup']?.user : undefined
    });

    return items;
  }, [medications, careLoopEvents, totalAcbScore, senior, manualCompletedIds, language]);

  // Priority weight map for sorting
  const priorityWeight: Record<ActionItem['priority'], number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    ROUTINE: 1
  };

  // Filtered & Sorted items
  const processedItems = useMemo(() => {
    let result = rawActionItems.filter((item) => {
      // 1. Filter by Type
      if (selectedType !== 'ALL' && item.sourceType !== selectedType) {
        return false;
      }

      // 2. Filter by Priority
      if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) {
        return false;
      }

      // 3. Filter by Status
      if (statusFilter === 'PENDING' && item.isCompleted) return false;
      if (statusFilter === 'COMPLETED' && !item.isCompleted) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q) || item.titleAr.toLowerCase().includes(q);
        const matchesSubtitle = item.subtitle.toLowerCase().includes(q) || item.subtitleAr.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubtitle) return false;
      }

      return true;
    });

    // Sort items
    result.sort((a, b) => {
      switch (sortBy) {
        case 'PRIORITY_DESC':
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1; // Keep uncompleted first
          }
          return priorityWeight[b.priority] - priorityWeight[a.priority];

        case 'DUE_TIME':
          return a.dueOrder - b.dueOrder;

        case 'STATUS_PENDING_FIRST':
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
          }
          return priorityWeight[b.priority] - priorityWeight[a.priority];

        case 'TITLE_AZ':
          return a.title.localeCompare(b.title);

        default:
          return 0;
      }
    });

    return result;
  }, [rawActionItems, selectedType, selectedPriority, statusFilter, searchQuery, sortBy]);

  // Calculate stats
  const totalCount = rawActionItems.length;
  const completedCount = rawActionItems.filter(i => i.isCompleted).length;
  const pendingCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  // Handlers for completing an action item
  const handleConfirmItem = (item: ActionItem) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (item.sourceType === 'MEDICATION' && item.relatedMedicationId) {
      if (onToggleMedicationTaken) {
        onToggleMedicationTaken(item.relatedMedicationId);
      }
    }

    setManualCompletedIds(prev => ({
      ...prev,
      [item.id]: {
        time: `Today ${nowStr}`,
        user: 'Maryam (Daughter)'
      }
    }));
  };

  const handleSendReminder = (item: ActionItem) => {
    if (item.relatedMedication && onTriggerMedicationReminder) {
      onTriggerMedicationReminder(item.relatedMedication);
    }
    setSentReminders(prev => ({
      ...prev,
      [item.id]: true
    }));
  };

  const handleConfirmAllRoutine = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updates: Record<string, { time: string; user: string }> = {};

    rawActionItems.forEach(item => {
      if (!item.isCompleted && item.priority !== 'CRITICAL') {
        updates[item.id] = {
          time: `Today ${nowStr}`,
          user: 'Maryam (Daughter)'
        };
        if (item.sourceType === 'MEDICATION' && item.relatedMedicationId && onToggleMedicationTaken) {
          onToggleMedicationTaken(item.relatedMedicationId);
        }
      }
    });

    setManualCompletedIds(prev => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setSelectedType('ALL');
    setSelectedPriority('ALL');
    setStatusFilter('ALL');
    setSearchQuery('');
    setSortBy('PRIORITY_DESC');
  };

  const hasActiveFilters = selectedType !== 'ALL' || selectedPriority !== 'ALL' || statusFilter !== 'ALL' || searchQuery.trim() !== '';

  return (
    <div
      id="section-caregiver-action-items"
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-xs shrink-0 mt-0.5">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {language === 'ar' ? 'مهام وإجراءات الرعاية الأسرية المعلقة' : 'Caregiver Action Items & Verification Queue'}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                pendingCount > 0
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
              }`}>
                {pendingCount > 0 
                  ? (language === 'ar' ? `${pendingCount} إجراءات بانتظار التأكيد` : `${pendingCount} Pending Confirmation`)
                  : (language === 'ar' ? 'تم تأكيد جميع المهام' : 'All Tasks Confirmed')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {language === 'ar'
                ? 'قائمة ذكية لفرز وتأكيد جرعات الأدوية والملاحظات السريرية المعلقة مع خيارات الترتيب والتصفية السريعة.'
                : 'Smart triage queue to verify medication intakes and clinical follow-ups with sorting and high-volume alert filters.'}
            </p>
          </div>
        </div>

        {/* Action Progress Bar & Bulk Complete */}
        <div className="flex flex-col gap-2 min-w-[200px] self-start sm:self-center">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>{language === 'ar' ? 'نسبة الإنجاز اليومي:' : 'Daily Completion:'}</span>
            <span className="font-mono text-teal-600 dark:text-teal-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>{completedCount} of {totalCount} {language === 'ar' ? 'مهام مكتملة' : 'verified'}</span>
            {pendingCount > 1 && (
              <button
                type="button"
                id="btn-confirm-all-routine"
                onClick={handleConfirmAllRoutine}
                className="text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                <span>{language === 'ar' ? 'تأكيد الروتينية دفعة واحدة' : 'Confirm Routine'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FILTER & SORTING TOOLBAR */}
      <div className="bg-slate-50/80 dark:bg-slate-850/60 p-3.5 sm:p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* 1. Filter by Type Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>{language === 'ar' ? 'تصفية حسب النوع:' : 'Filter by Type:'}</span>
            </label>
            <select
              id="select-filter-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ActionItemType)}
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 shadow-2xs"
            >
              <option value="ALL">{language === 'ar' ? 'جميع الأنواع (All Types)' : 'All Types'}</option>
              <option value="MEDICATION">{language === 'ar' ? '💊 تأكيدات الأدوية (Medications)' : '💊 Medications'}</option>
              <option value="CARE_LOOP">{language === 'ar' ? '🧠 العبء المعرفي والفرز (Cognitive & ACB)' : '🧠 Cognitive & ACB'}</option>
              <option value="WELLNESS_FOLLOWUP">{language === 'ar' ? '💧 مكالمات ومتابعات الاطمئنان (Wellness)' : '💧 Wellness & Calls'}</option>
            </select>
          </div>

          {/* 2. Sorting Options Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'ar' ? 'ترتيب النتائج حسب:' : 'Sort Options:'}</span>
            </label>
            <select
              id="select-sort-options"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ActionItemSort)}
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 shadow-2xs"
            >
              <option value="PRIORITY_DESC">{language === 'ar' ? '🔥 الأولوية: الأعلى خطورة أولاً' : '🔥 Priority: Highest First'}</option>
              <option value="DUE_TIME">{language === 'ar' ? '⏰ موعد الاستحقاق / التوقيت' : '⏰ Due Time (Earliest First)'}</option>
              <option value="STATUS_PENDING_FIRST">{language === 'ar' ? '⏳ المعلقة أولاً ثم المكتملة' : '⏳ Pending First'}</option>
              <option value="TITLE_AZ">{language === 'ar' ? '🔤 الاسم أبجدياً (A-Z)' : '🔤 Title (A–Z)'}</option>
            </select>
          </div>

          {/* 3. Filter by Priority Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>{language === 'ar' ? 'حسب مستوى الخطورة:' : 'Priority Level:'}</span>
            </label>
            <select
              id="select-filter-priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as ActionItemPriority)}
              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 shadow-2xs"
            >
              <option value="ALL">{language === 'ar' ? 'جميع المستويات' : 'All Priorities'}</option>
              <option value="CRITICAL">{language === 'ar' ? '🔴 حرجة (Critical)' : '🔴 Critical Only'}</option>
              <option value="HIGH">{language === 'ar' ? '🟡 مرتفعة (High)' : '🟡 High Priority'}</option>
              <option value="MEDIUM">{language === 'ar' ? '🔵 اعتيادية (Medium/Routine)' : '🔵 Medium / Routine'}</option>
            </select>
          </div>

          {/* 4. Search input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Search className="w-3 h-3 text-slate-400" />
              <span>{language === 'ar' ? 'بحث سريع:' : 'Search Action Items:'}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="input-search-action-items"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث عن اسم الدواء أو الإجراء...' : 'Search med or task name...'}
                className="w-full py-2 pl-3 pr-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Status Filter Pills & Reset */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {language === 'ar' ? 'الكل' : 'All'} ({rawActionItems.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PENDING')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-500 text-amber-950 font-black'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {language === 'ar' ? 'بانتظار التأكيد' : 'Pending'} ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('COMPLETED')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                statusFilter === 'COMPLETED'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {language === 'ar' ? 'المكتملة' : 'Completed'} ({completedCount})
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              id="btn-reset-filters"
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {processedItems.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'ar' ? 'لا توجد مهام تطابق الفلاتر المحددة' : 'No action items match the selected criteria'}
            </p>
            <p className="text-[11px] text-slate-400">
              {hasActiveFilters
                ? (language === 'ar' ? 'جرب تغيير خيارات التصفية أو البحث لعرض باقي الإجراءات.' : 'Try adjusting the type, priority, or search filters.')
                : (language === 'ar' ? 'جميع المتابعات والتأكيدات مكتملة بشكل سليم.' : 'All clinical protocols and medication intakes are verified.')}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'ar' ? 'إظهار جميع المهام' : 'Show All Items'}</span>
              </button>
            )}
          </div>
        ) : (
          processedItems.map((item) => {
            const isCompleted = item.isCompleted;

            return (
              <div
                key={item.id}
                id={`action-item-${item.id}`}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-50/60 dark:bg-slate-850/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                    : item.priority === 'CRITICAL'
                    ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 shadow-xs'
                    : item.priority === 'HIGH'
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 shadow-xs'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700/80 shadow-xs'
                }`}
              >
                {/* Left Side: Icon & Details */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : item.sourceType === 'MEDICATION'
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                      : item.priority === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : item.sourceType === 'MEDICATION' ? (
                      <Pill className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-bold text-sm ${isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {language === 'ar' ? item.titleAr : item.title}
                      </h4>

                      {/* Priority Badge */}
                      {!isCompleted && (
                        <span className={`px-2 py-0.2 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          item.priority === 'CRITICAL'
                            ? 'bg-rose-500 text-white'
                            : item.priority === 'HIGH'
                            ? 'bg-amber-500 text-amber-950 font-bold'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {item.priority}
                        </span>
                      )}

                      {/* Due Time */}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{language === 'ar' ? item.dueTimeTextAr : item.dueTimeText}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                      {language === 'ar' ? item.subtitleAr : item.subtitle}
                    </p>

                    {/* Completion Provenance */}
                    {isCompleted && (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>
                          {language === 'ar'
                            ? `تم التحقق بواسطة ${item.completedBy || 'مريم'} (${item.completedAt || 'اليوم'})`
                            : `Verified by ${item.completedBy || 'Maryam'} (${item.completedAt || 'Today'})`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Interactive Action Buttons */}
                <div className="flex items-center gap-2 self-start md:self-center shrink-0 pt-2 md:pt-0">
                  {!isCompleted ? (
                    <>
                      {/* Secondary: Send voice reminder if medication */}
                      {item.sourceType === 'MEDICATION' && (
                        <button
                          type="button"
                          id={`btn-remind-${item.id}`}
                          onClick={() => handleSendReminder(item)}
                          disabled={sentReminders[item.id]}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            sentReminders[item.id]
                              ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                          title="Trigger dial/push reminder"
                        >
                          <Send className="w-3 h-3" />
                          <span>{sentReminders[item.id] ? (language === 'ar' ? 'تم إرسال التذكير ✓' : 'Reminder Sent ✓') : (language === 'ar' ? 'إرسال تذكير' : 'Send Reminder')}</span>
                        </button>
                      )}

                      {/* Secondary: Quick Call if wellness follow-up */}
                      {item.sourceType === 'WELLNESS_FOLLOWUP' && (
                        <a
                          href="tel:+966501234567"
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{language === 'ar' ? 'اتصال مباشر' : 'Call Direct'}</span>
                        </a>
                      )}

                      {/* Primary: Confirm & Mark Complete */}
                      <button
                        type="button"
                        id={`btn-confirm-${item.id}`}
                        onClick={() => handleConfirmItem(item)}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-teal-600/20 active:scale-95 transition-transform cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'تأكيد أخذ الجرعة / الإجراء' : 'Confirm & Complete'}</span>
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'مؤكد ومعتمد' : 'Verified'}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Banner linking to Doctor Brief for clinical escalation */}
      {onOpenDoctorBrief && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block font-bold">
                {language === 'ar' ? 'تصدير قائمة المهام والملاحظات إلى الطبيب' : 'Clinical Handoff & Doctor Brief Export'}
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'جميع تأكيدات وملاحظات العائلة تدرج آلياً في ملخص الطبيب 2.0.' : 'All caregiver confirmations and flagged items are summarized in the clinical SBAR brief.'}
              </span>
            </div>
          </div>

          <button
            type="button"
            id="btn-action-items-open-brief"
            onClick={onOpenDoctorBrief}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all self-start sm:self-center shrink-0 cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض ملخص الطبيب' : 'Open Doctor Brief'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

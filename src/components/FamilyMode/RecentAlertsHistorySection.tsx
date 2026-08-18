import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  Send, 
  Phone, 
  Copy, 
  Check, 
  CheckCheck,
  Eye,
  EyeOff,
  Share2, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  FileText, 
  Info,
  Calendar,
  Activity,
  Flame,
  Radio,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { CareCircleTriageNotification, SupportedLanguage, TriageLevel } from '../../types';

interface RecentAlertsHistorySectionProps {
  notifications: CareCircleTriageNotification[];
  seniorName: string;
  language: SupportedLanguage;
  onSimulateShift?: (targetTriage: 'YELLOW' | 'RED') => void;
  onOpenDoctorBrief?: () => void;
  onToggleNotificationRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
}

export const RecentAlertsHistorySection: React.FC<RecentAlertsHistorySectionProps> = ({
  notifications = [],
  seniorName,
  language,
  onSimulateShift,
  onOpenDoctorBrief,
  onToggleNotificationRead,
  onMarkAllNotificationsAsRead
}) => {
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [viewFilterMode, setViewFilterMode] = useState<'ALL' | 'CRITICAL_ONLY' | 'UNREAD_ONLY' | 'YELLOW'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  
  // Local read status fallback map for instant visual reactivity
  const [localReadOverrides, setLocalReadOverrides] = useState<Record<string, boolean>>({});

  // Helper to determine whether an item is read
  const isItemRead = (notif: CareCircleTriageNotification): boolean => {
    if (localReadOverrides[notif.id] !== undefined) {
      return localReadOverrides[notif.id];
    }
    return Boolean(notif.isRead);
  };

  // Toggle individual alert read status
  const handleToggleReadStatus = (notif: CareCircleTriageNotification) => {
    const currentRead = isItemRead(notif);
    const nextRead = !currentRead;
    setLocalReadOverrides(prev => ({
      ...prev,
      [notif.id]: nextRead
    }));
    onToggleNotificationRead?.(notif.id);
  };

  // Mark all alerts as read
  const handleMarkAllRead = () => {
    const newOverrides: Record<string, boolean> = {};
    notifications.forEach(n => {
      newOverrides[n.id] = true;
    });
    setLocalReadOverrides(newOverrides);
    onMarkAllNotificationsAsRead?.();
  };

  // Analytics & Trend Calculations
  const metrics = useMemo(() => {
    const total = notifications.length;
    const redCount = notifications.filter(n => n.newTriage === 'RED').length;
    const orangeCount = notifications.filter(n => n.newTriage === 'ORANGE').length;
    const yellowCount = notifications.filter(n => n.newTriage === 'YELLOW').length;
    const unreadCount = notifications.filter(n => !isItemRead(n)).length;
    const readCount = total - unreadCount;
    
    // Average alerts per time window & primary reason extraction
    const primaryObservation = notifications.length > 0
      ? notifications[0].keyObservations?.[0] || notifications[0].reason
      : (language === 'ar' ? 'استقرار تام لخط الأساس' : 'Baseline stability maintained');

    return {
      total,
      redCount,
      orangeCount,
      yellowCount,
      unreadCount,
      readCount,
      primaryObservation
    };
  }, [notifications, localReadOverrides, language]);

  // Filtered Notifications List based on View Filter Mode and Search Query
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      const readState = isItemRead(notif);

      // Filter Mode
      if (viewFilterMode === 'CRITICAL_ONLY') {
        if (notif.newTriage !== 'RED') {
          return false;
        }
      } else if (viewFilterMode === 'UNREAD_ONLY') {
        if (readState) {
          return false;
        }
      } else if (viewFilterMode === 'YELLOW') {
        if (notif.newTriage !== 'YELLOW' && notif.newTriage !== 'ORANGE') {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchReason = notif.reason.toLowerCase().includes(q);
        const matchTranscript = notif.transcriptSnippet?.toLowerCase().includes(q) || false;
        const matchObservations = notif.keyObservations?.some(obs => obs.toLowerCase().includes(q)) || false;
        const matchMembers = notif.notifiedMembers.some(m => m.name.toLowerCase().includes(q));
        if (!matchReason && !matchTranscript && !matchObservations && !matchMembers) {
          return false;
        }
      }

      return true;
    });
  }, [notifications, viewFilterMode, searchQuery, localReadOverrides]);

  // Copy clinical summary to clipboard
  const handleCopySummary = (notif: CareCircleTriageNotification) => {
    const readState = isItemRead(notif);
    const textToCopy = `[WANIS-AI Triage Alert]
Senior: ${notif.seniorName}
Time: ${notif.timestamp}
Triage Shift: ${notif.previousTriage} -> ${notif.newTriage}
Status: ${readState ? 'Acknowledged (Read)' : 'Unread (Pending Review)'}
Reason: ${notif.reason}
${notif.transcriptSnippet ? `Transcript: "${notif.transcriptSnippet}"` : ''}
Key Observations: ${notif.keyObservations?.join(', ') || 'N/A'}
Dispatched To: ${notif.notifiedMembers.map(m => `${m.name} (${m.channel})`).join(', ')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(notif.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section 
      id="recent-alerts-history-section" 
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
    >
      {/* 1. Header & Summary Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-sm">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {language === 'ar' ? 'سجل التنبيهات السريرية وتحولات الفرز' : 'Recent Alerts & Triage History'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {notifications.length} {language === 'ar' ? 'تنبيه مسجل' : 'Alerts Tracked'}
              </span>
              {metrics.unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>{metrics.unreadCount} {language === 'ar' ? 'قيد المتابعة' : 'Unread'}</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ar' 
                ? 'متابعة طولية لجميع إشعارات دائرة الرعاية الصادرة تلقائياً عند رصد تغيرات في الفحص الصوتي أو نمط النوم.'
                : 'Longitudinal audit log of automated alerts dispatched to caregivers upon detecting cognitive, sleep, or pain variance.'}
            </p>
          </div>
        </div>

        {/* Header Action Controls & Simulation Triggers */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {metrics.unreadCount > 0 && (
            <button
              type="button"
              id="mark-all-alerts-read-btn"
              onClick={handleMarkAllRead}
              className="py-2 px-3 rounded-2xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title="Mark all alerts as acknowledged"
            >
              <CheckCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark All as Read'}</span>
            </button>
          )}

          {onSimulateShift && (
            <>
              <button
                type="button"
                id="history-simulate-yellow-btn"
                onClick={() => onSimulateShift('YELLOW')}
                className="py-2 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs"
                title="Trigger simulated Yellow triage shift"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'ar' ? 'تنبيه أصفر' : '+ Yellow Alert'}</span>
              </button>
              <button
                type="button"
                id="history-simulate-red-btn"
                onClick={() => onSimulateShift('RED')}
                className="py-2 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs"
                title="Trigger simulated Red emergency alert"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                <span>{language === 'ar' ? 'طوارئ أحمر' : '+ Red Alert'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Longitudinal Metrics & KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Alerts */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
            {language === 'ar' ? 'إجمالي التنبيهات' : 'Total Alerts Logged'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {metrics.total}
            </span>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              {metrics.readCount}/{metrics.total} {language === 'ar' ? 'مقروء' : 'Read'}
            </span>
          </div>
        </div>

        {/* Red Emergencies */}
        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-1">
          <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 block uppercase tracking-wider flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" />
            {language === 'ar' ? 'طوارئ حرجة (أحمر)' : 'Red Emergencies'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
              {metrics.redCount}
            </span>
            <span className="text-[11px] font-medium text-rose-600/80 dark:text-rose-400/80">
              {metrics.redCount > 0 ? (language === 'ar' ? 'تستوجب تدخلاً' : 'High Priority') : (language === 'ar' ? 'لا توجد' : 'None')}
            </span>
          </div>
        </div>

        {/* Unread / Pending Review Alerts */}
        <div className={`p-4 rounded-2xl border transition-colors space-y-1 ${
          metrics.unreadCount > 0
            ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
            : 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40'
        }`}>
          <span className={`text-[11px] font-bold block uppercase tracking-wider flex items-center gap-1 ${
            metrics.unreadCount > 0 ? 'text-amber-800 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-400'
          }`}>
            {metrics.unreadCount > 0 ? (
              <>
                <Bell className="w-3 h-3 animate-bounce text-amber-600 dark:text-amber-400" />
                {language === 'ar' ? 'تنبيهات غير مقروءة' : 'Unread Alerts'}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {language === 'ar' ? 'تم الاطلاع على الكل' : 'All Acknowledged'}
              </>
            )}
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl sm:text-3xl font-black ${
              metrics.unreadCount > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-400'
            }`}>
              {metrics.unreadCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {metrics.unreadCount > 0 ? (language === 'ar' ? 'بانتظار التأكيد' : 'Pending Review') : (language === 'ar' ? 'مكتمل' : 'Up to date')}
            </span>
          </div>
        </div>

        {/* Trend Summary Note */}
        <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40 space-y-1">
          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 block uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3" />
            {language === 'ar' ? 'السبب الأبرز للرصد' : 'Primary Detection Driver'}
          </span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate pt-0.5" title={metrics.primaryObservation}>
            {metrics.primaryObservation}
          </p>
        </div>

      </div>

      {/* 3. Filtering Interface: Toggle between 'Show Critical Only' (RED alerts), 'Unread Only', and 'Show All' */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Main Segmented Toggle Bar */}
          <div 
            id="alerts-filter-segmented-controls"
            className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto border border-slate-200/80 dark:border-slate-700/60"
          >
            {/* Show All Toggle Option */}
            <button
              type="button"
              id="filter-show-all-btn"
              onClick={() => setViewFilterMode('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                viewFilterMode === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-950/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{language === 'ar' ? 'عرض الكل' : 'Show All'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                viewFilterMode === 'ALL'
                  ? 'bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white'
                  : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {metrics.total}
              </span>
            </button>
            
            {/* Show Critical Only (RED alerts) Primary Toggle Option */}
            <button
              type="button"
              id="filter-critical-only-btn"
              onClick={() => setViewFilterMode('CRITICAL_ONLY')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                viewFilterMode === 'CRITICAL_ONLY'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400/40 font-black'
                  : 'text-rose-700 dark:text-rose-300 hover:bg-rose-500/10'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 ${
                  viewFilterMode === 'CRITICAL_ONLY' ? 'inline-flex' : 'hidden'
                }`}></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الحالات الحرجة فقط (أحمر)' : 'Show Critical Only (RED alerts)'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                viewFilterMode === 'CRITICAL_ONLY'
                  ? 'bg-white/20 text-white'
                  : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
              }`}>
                {metrics.redCount}
              </span>
            </button>

            {/* Unread Alerts Filter Option */}
            <button
              type="button"
              id="filter-unread-only-btn"
              onClick={() => setViewFilterMode('UNREAD_ONLY')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                viewFilterMode === 'UNREAD_ONLY'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-1 ring-amber-600/20'
                  : 'text-amber-800 dark:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'غير مقروء فقط' : 'Unread Only'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                viewFilterMode === 'UNREAD_ONLY'
                  ? 'bg-amber-950/20 text-amber-950'
                  : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
              }`}>
                {metrics.unreadCount}
              </span>
            </button>

            {/* Secondary Shift Option: Yellow/Orange Shifts */}
            <button
              type="button"
              id="filter-yellow-shifts-btn"
              onClick={() => setViewFilterMode('YELLOW')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                viewFilterMode === 'YELLOW'
                  ? 'bg-slate-700 text-white font-black shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{language === 'ar' ? 'تغيرات اعتيادية' : 'Yellow Shifts'}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                viewFilterMode === 'YELLOW'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {metrics.yellowCount + metrics.orangeCount}
              </span>
            </button>
          </div>

          {/* Search Bar & Quick Toggle */}
          <div className="flex items-center gap-2 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'بحث في التنبيهات والأسباب...' : 'Search alerts by keyword or reason...'}
                className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 -translate-y-1/2 right-2.5 rtl:right-auto rtl:left-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick 1-Click Critical Toggle Shortcut */}
            <button
              type="button"
              id="quick-critical-toggle-btn"
              onClick={() => setViewFilterMode(prev => prev === 'CRITICAL_ONLY' ? 'ALL' : 'CRITICAL_ONLY')}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                viewFilterMode === 'CRITICAL_ONLY'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
              title={viewFilterMode === 'CRITICAL_ONLY' ? 'Switch to Show All' : 'Filter: Show Critical Only (RED)'}
            >
              <Filter className={`w-4 h-4 ${viewFilterMode === 'CRITICAL_ONLY' ? 'text-rose-600 dark:text-rose-400' : ''}`} />
            </button>
          </div>

        </div>

        {/* Active Filter Mode Banner */}
        {viewFilterMode === 'CRITICAL_ONLY' && (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-900 dark:text-rose-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse shrink-0"></span>
              <span className="font-bold">
                {language === 'ar'
                  ? `تصفية نشطة: عرض الحالات الحرجة فقط (أحمر) — ${filteredNotifications.length} تنبيه ظاهر`
                  : `Active Filter: Showing Critical Only (RED alerts) — ${filteredNotifications.length} alerts visible`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setViewFilterMode('ALL')}
              className="text-rose-700 dark:text-rose-300 hover:underline font-extrabold text-[11px] shrink-0"
            >
              {language === 'ar' ? 'إلغاء التصفية وعرض الكل' : 'Switch to Show All'}
            </button>
          </div>
        )}

        {viewFilterMode === 'UNREAD_ONLY' && (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-bold">
                {language === 'ar'
                  ? `تصفية نشطة: عرض التنبيهات غير المقروءة فقط — ${filteredNotifications.length} تنبيه بانتظار التأكيد`
                  : `Active Filter: Showing Unread Alerts Only — ${filteredNotifications.length} alerts pending caregiver review`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {filteredNotifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-amber-800 dark:text-amber-300 font-extrabold text-[11px] hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>{language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark All Read'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewFilterMode('ALL')}
                className="text-slate-600 dark:text-slate-400 hover:underline font-bold text-[11px] shrink-0"
              >
                {language === 'ar' ? 'عرض الكل' : 'Show All'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Scrollable Alert History List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {viewFilterMode === 'CRITICAL_ONLY'
                  ? (language === 'ar' ? 'لا توجد أي تنبيهات طوارئ حرجة (أحمر) مسجلة' : 'No Critical (RED alerts) recorded in history')
                  : viewFilterMode === 'UNREAD_ONLY'
                  ? (language === 'ar' ? 'تم الاطلاع على جميع التنبيهات واكتمال المتابعة!' : 'All triage alerts have been acknowledged by caregivers!')
                  : searchQuery || viewFilterMode !== 'ALL'
                  ? (language === 'ar' ? 'لا توجد تنبيهات مطابقة للمعايير المحددة' : 'No alerts match current search or filter criteria')
                  : (language === 'ar' ? 'حالة الوالدة مستقرة تماماً ولا توجد تحولات سلبية مسجلة' : 'Senior is steady within healthy baseline — No past negative triage shifts')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {viewFilterMode === 'UNREAD_ONLY'
                  ? (language === 'ar'
                      ? 'جميع الإشعارات السابقة تم الاطمئنان عليها وتأكيد استلامها من قِبل الفريق المعالج والأسرة.'
                      : 'Every past notification has been confirmed and reviewed by the family care circle.')
                  : viewFilterMode === 'CRITICAL_ONLY'
                  ? (language === 'ar' 
                      ? 'جميع التنبيهات السابقة كانت ضمن التغيرات البسيطة أو الاستقرار الاعتيادي.' 
                      : 'All past recordings were either routine baseline shifts or steady check-ins.')
                  : (language === 'ar'
                      ? 'يقوم ونيس تلقائياً برصد أي انحرافات في النوم أو الإجهاد الصوتي وتوثيقها هنا فور حدوثها.'
                      : 'Wanis AI actively monitors voice check-ins and will log automated alerts here whenever a triage variance is detected.')}
              </p>
              {viewFilterMode !== 'ALL' && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setViewFilterMode('ALL');
                      setSearchQuery('');
                    }}
                    className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                  >
                    {language === 'ar' ? 'عرض جميع التنبيهات' : 'Show All Alerts'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div 
            id="alerts-scrollable-container" 
            className="space-y-3 max-h-[580px] overflow-y-auto pr-1 sm:pr-2 focus:outline-hidden"
          >
            {filteredNotifications.map((notif) => {
              const isRed = notif.newTriage === 'RED';
              const isOrange = notif.newTriage === 'ORANGE';
              const isRead = isItemRead(notif);

              return (
                <div
                  key={notif.id}
                  id={`alert-card-${notif.id}`}
                  className={`rounded-3xl border transition-all duration-200 p-5 space-y-3.5 shadow-xs relative ${
                    isRead
                      ? 'bg-slate-50/70 dark:bg-slate-850/50 border-slate-200 dark:border-slate-800/80 opacity-85 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700'
                      : isRed
                      ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 ring-1 ring-rose-400/20 hover:border-rose-400 shadow-sm'
                      : isOrange
                      ? 'bg-orange-50/50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800 ring-1 ring-orange-400/20 hover:border-orange-400 shadow-sm'
                      : 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 ring-1 ring-amber-400/20 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  {/* Top Bar: Triage Shift Badges, Acknowledged Indicator & Timestamp */}
                  <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      
                      {/* Transition Badge: e.g. GREEN -> YELLOW */}
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{notif.previousTriage}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className={`w-2.5 h-2.5 rounded-full ${isRed ? 'bg-rose-500 animate-ping' : isOrange ? 'bg-orange-500' : 'bg-amber-400'}`}></span>
                        <span className={isRed ? 'text-rose-600 dark:text-rose-400 font-black' : isOrange ? 'text-orange-600 dark:text-orange-400 font-black' : 'text-amber-600 dark:text-amber-400 font-black'}>
                          {notif.newTriage}
                        </span>
                      </span>

                      {/* Urgency Badge */}
                      <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider ${
                        isRed
                          ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                          : isOrange
                          ? 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/30'
                          : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                      }`}>
                        {isRed ? (language === 'ar' ? 'طوارئ حرجة' : 'Critical Escalation') : (language === 'ar' ? 'تغير ملحوظ' : 'Meaningful Shift')}
                      </span>

                      {/* Visual Indicator: Unread (Pending Review) vs Acknowledged (Read) Badge */}
                      {isRead ? (
                        <span 
                          id={`alert-acknowledged-badge-${notif.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{language === 'ar' ? 'تم الاطلاع والاطمئنان' : 'Acknowledged'}</span>
                        </span>
                      ) : (
                        <span 
                          id={`alert-unread-badge-${notif.id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700 shadow-xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                          <span>{language === 'ar' ? 'تنبيه جديد (غير مقروء)' : 'New / Unread'}</span>
                        </span>
                      )}

                    </div>

                    {/* Timestamp & Relative Tag */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>

                  {/* Primary Reason Headline */}
                  <div className="space-y-1">
                    <h4 className={`text-sm sm:text-base font-bold leading-snug ${
                      isRead ? 'text-slate-700 dark:text-slate-200' : 'text-slate-950 dark:text-white'
                    }`}>
                      {notif.reason}
                    </h4>

                    {/* Spoken Dialect Transcript Snippet */}
                    {notif.transcriptSnippet && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
                        "{notif.transcriptSnippet}"
                      </p>
                    )}
                  </div>

                  {/* Key Clinical Observations Tags */}
                  {notif.keyObservations && notif.keyObservations.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {language === 'ar' ? 'الملاحظات المستخلصة:' : 'Observations:'}
                      </span>
                      {notif.keyObservations.map((obs, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs"
                        >
                          • {obs}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dispatched Recipients Footer & Interactive Action Controls */}
                  <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Dispatched Members Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                        <Send className="w-3.5 h-3.5 text-teal-500" />
                        {language === 'ar' ? 'المستلمون:' : 'Dispatched to:'}
                      </span>
                      {notif.notifiedMembers.map((m, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{m.name}</span>
                          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">({m.channel})</span>
                        </span>
                      ))}
                    </div>

                    {/* Interactive Actions: Mark as Read, Copy Summary & Direct Call */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      
                      {/* Individual 'Mark as Read' / 'Acknowledged' Toggle Button */}
                      <button
                        type="button"
                        id={`mark-read-btn-${notif.id}`}
                        onClick={() => handleToggleReadStatus(notif)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                          isRead
                            ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
                        }`}
                        title={isRead ? (language === 'ar' ? 'اضغط لتغييره إلى غير مقروء' : 'Click to mark as unread') : (language === 'ar' ? 'تأكيد قراءة التنبيه والاطلاع عليه' : 'Acknowledge and mark alert as read')}
                      >
                        {isRead ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{language === 'ar' ? 'تم الاطلاع ✓' : 'Acknowledged ✓'}</span>
                          </>
                        ) : (
                          <>
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>{language === 'ar' ? 'تحديد كمقروء' : 'Mark as Read'}</span>
                          </>
                        )}
                      </button>

                      {/* Copy Clinical Summary */}
                      <button
                        type="button"
                        id={`copy-summary-btn-${notif.id}`}
                        onClick={() => handleCopySummary(notif)}
                        className="py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                        title="Copy alert clinical summary"
                      >
                        {copiedId === notif.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {language === 'ar' ? 'تم النسخ' : 'Copied'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>{language === 'ar' ? 'نسخ الموجز' : 'Copy'}</span>
                          </>
                        )}
                      </button>

                      {/* Direct Call Trigger */}
                      <a
                        href="tel:+966505123456"
                        id={`call-lead-btn-${notif.id}`}
                        className="py-1.5 px-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Call Caregiver Lead"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{language === 'ar' ? 'اتصال بالعائلة' : 'Call Lead'}</span>
                      </a>

                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Bottom Informational Footer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-500 shrink-0" />
          <span>
            {language === 'ar' 
              ? 'تخضع جميع التنبيهات لبروتوكول الموافقة المشفر من الدرجة الثانية (Tier 2 Family Consent).'
              : 'All dispatched alerts strictly adhere to encrypted Tier 2 Family Consent governance.'}
          </span>
        </div>

        {onOpenDoctorBrief && (
          <button
            type="button"
            onClick={onOpenDoctorBrief}
            className="text-xs font-extrabold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تضمين في موجز الطبيب 2.0' : 'Include in Doctor Brief 2.0'}</span>
          </button>
        )}
      </div>

    </section>
  );
};


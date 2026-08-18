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
}

export const RecentAlertsHistorySection: React.FC<RecentAlertsHistorySectionProps> = ({
  notifications = [],
  seniorName,
  language,
  onSimulateShift,
  onOpenDoctorBrief
}) => {
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTriageFilter, setSelectedTriageFilter] = useState<'ALL' | 'RED' | 'ORANGE' | 'YELLOW'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  // Analytics & Trend Calculations
  const metrics = useMemo(() => {
    const total = notifications.length;
    const redCount = notifications.filter(n => n.newTriage === 'RED').length;
    const orangeCount = notifications.filter(n => n.newTriage === 'ORANGE').length;
    const yellowCount = notifications.filter(n => n.newTriage === 'YELLOW').length;
    
    // Average alerts per time window & primary reason extraction
    const primaryObservation = notifications.length > 0
      ? notifications[0].keyObservations?.[0] || notifications[0].reason
      : (language === 'ar' ? 'استقرار تام لخط الأساس' : 'Baseline stability maintained');

    return {
      total,
      redCount,
      orangeCount,
      yellowCount,
      primaryObservation
    };
  }, [notifications, language]);

  // Filtered Notifications List
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // Triage Filter
      if (selectedTriageFilter !== 'ALL' && notif.newTriage !== selectedTriageFilter) {
        return false;
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
  }, [notifications, selectedTriageFilter, searchQuery]);

  // Copy clinical summary to clipboard
  const handleCopySummary = (notif: CareCircleTriageNotification) => {
    const textToCopy = `[WANIS-AI Triage Alert]
Senior: ${notif.seniorName}
Time: ${notif.timestamp}
Triage Shift: ${notif.previousTriage} -> ${notif.newTriage}
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
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ar' 
                ? 'متابعة طولية لجميع إشعارات دائرة الرعاية الصادرة تلقائياً عند رصد تغيرات في الفحص الصوتي أو نمط النوم.'
                : 'Longitudinal audit log of automated alerts dispatched to caregivers upon detecting cognitive, sleep, or pain variance.'}
            </p>
          </div>
        </div>

        {/* Quick Simulation & Test Triggers */}
        {onSimulateShift && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              id="history-simulate-yellow-btn"
              onClick={() => onSimulateShift('YELLOW')}
              className="py-2.5 px-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs"
              title="Trigger simulated Yellow triage shift"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{language === 'ar' ? 'محاكاة تنبيه (أصفر)' : 'Test Yellow Alert'}</span>
            </button>
            <button
              type="button"
              id="history-simulate-red-btn"
              onClick={() => onSimulateShift('RED')}
              className="py-2.5 px-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs"
              title="Trigger simulated Red emergency alert"
            >
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              <span>{language === 'ar' ? 'محاكاة طوارئ (أحمر)' : 'Test Red Alert'}</span>
            </button>
          </div>
        )}
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
              100% Dispatched
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

        {/* Yellow/Orange Shifts */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-1">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {language === 'ar' ? 'تغيرات اعتيادية (أصفر/برتقالي)' : 'Baseline Shifts'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {metrics.yellowCount + metrics.orangeCount}
            </span>
            <span className="text-[11px] font-medium text-amber-600/80 dark:text-amber-400/80">
              {language === 'ar' ? 'متابعة أسرية' : 'Family Follow-up'}
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

      {/* 3. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        
        {/* Triage Level Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedTriageFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedTriageFilter === 'ALL'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'ar' ? 'كافة التنبيهات' : 'All Alerts'} ({notifications.length})
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedTriageFilter('YELLOW')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              selectedTriageFilter === 'YELLOW'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-amber-700 dark:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>{language === 'ar' ? 'أصفر (تغير ملحوظ)' : 'Yellow'} ({metrics.yellowCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTriageFilter('RED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              selectedTriageFilter === 'RED'
                ? 'bg-rose-600 text-white font-black shadow-xs'
                : 'text-rose-700 dark:text-rose-300 hover:bg-rose-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>{language === 'ar' ? 'أحمر (طوارئ)' : 'Red Emergency'} ({metrics.redCount})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث في الملاحظات والسبب...' : 'Search alerts, reason, notes...'}
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
                {searchQuery || selectedTriageFilter !== 'ALL'
                  ? (language === 'ar' ? 'لا توجد تنبيهات مطابقة للمعايير المحددة' : 'No alerts match current search or filter criteria')
                  : (language === 'ar' ? 'حالة الوالدة مستقرة تماماً ولا توجد تحولات سلبية مسجلة' : 'Senior is steady within healthy baseline — No past negative triage shifts')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar'
                  ? 'يقوم ونيس تلقائياً برصد أي انحرافات في النوم أو الإجهاد الصوتي وتوثيقها هنا فور حدوثها.'
                  : 'Wanis AI actively monitors voice check-ins and will log automated alerts here whenever a triage variance is detected.'}
              </p>
            </div>
          </div>
        ) : (
          <div 
            id="alerts-scrollable-container" 
            className="space-y-3 max-h-[560px] overflow-y-auto pr-1 sm:pr-2 focus:outline-hidden"
          >
            {filteredNotifications.map((notif) => {
              const isRed = notif.newTriage === 'RED';
              const isOrange = notif.newTriage === 'ORANGE';
              const isExpanded = expandedAlertId === notif.id;

              return (
                <div
                  key={notif.id}
                  id={`alert-card-${notif.id}`}
                  className={`rounded-3xl border transition-all duration-200 p-5 space-y-3.5 shadow-xs ${
                    isRed
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60 hover:border-rose-300'
                      : isOrange
                      ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/60 hover:border-orange-300'
                      : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 hover:border-amber-300'
                  }`}
                >
                  {/* Top Bar: Triage Shift Badges & Timestamp */}
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

                    </div>

                    {/* Timestamp & Relative Tag */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>

                  {/* Primary Reason Headline */}
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
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

                  {/* Dispatched Recipients Footer & Quick Actions */}
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

                    {/* Quick Interactive Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      
                      {/* Copy Clinical Summary */}
                      <button
                        type="button"
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

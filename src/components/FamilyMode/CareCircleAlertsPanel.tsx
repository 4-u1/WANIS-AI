import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  ArrowRight, 
  Smartphone, 
  Clock, 
  Users, 
  ChevronRight,
  Send
} from 'lucide-react';
import { CareCircleTriageNotification, SupportedLanguage, TriageLevel } from '../../types';

interface CareCircleAlertsPanelProps {
  notifications: CareCircleTriageNotification[];
  seniorName: string;
  currentTriage: TriageLevel;
  language: SupportedLanguage;
  onSimulateShift?: (targetTriage: 'YELLOW' | 'RED') => void;
}

export const CareCircleAlertsPanel: React.FC<CareCircleAlertsPanelProps> = ({
  notifications = [],
  seniorName,
  currentTriage,
  language,
  onSimulateShift
}) => {
  const isRtl = language === 'ar';

  return (
    <div id="care-circle-alerts-panel" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      
      {/* Header Protocol Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {language === 'ar' ? 'بروتوكول إشعارات دائرة الرعاية التلقائي' : 'Care Circle Automated Triage Protocol'}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                {language === 'ar' ? 'مفعّل ونشط' : 'Active & Armed'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'ar' 
                ? 'إرسال تنبيهات SMS وإشعارات دفع فورية لأفراد العائلة والأطباء بمجرد تحول مستوى الاطمئنان من الأخضر إلى الأصفر أو الأحمر.'
                : 'Instant automated SMS & push dispatch to family and clinicians when senior triage shifts from GREEN to YELLOW or RED.'}
            </p>
          </div>
        </div>

        {/* Quick Simulation Trigger Button for Demo/Testing */}
        {onSimulateShift && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="simulate-yellow-shift-btn"
              onClick={() => onSimulateShift('YELLOW')}
              className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Test automated alert for Yellow triage shift"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'ar' ? 'تجربة تنبيه (أصفر)' : 'Test Yellow Alert'}</span>
            </button>
            <button
              type="button"
              id="simulate-red-shift-btn"
              onClick={() => onSimulateShift('RED')}
              className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Test automated alert for Red emergency shift"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
              <span>{language === 'ar' ? 'تجربة طوارئ (أحمر)' : 'Test Red Alert'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Broadcast Rule Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Yellow Trigger Protocol */}
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="font-extrabold text-xs text-amber-900 dark:text-amber-200">
                {language === 'ar' ? 'تحول المستوى إلى أصفر (تغير ملحوظ)' : 'Shift to YELLOW (Meaningful Change)'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded">
              Tier 2 Family Consent
            </span>
          </div>
          <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
            {language === 'ar'
              ? 'يتم إشعار مريم (الابنة) فوراً مع إرسال موجز خفيف عن ساعات النوم ونبرة التعب لمتابعة الوالدة دون إشعارها بالقلق.'
              : 'Triggers automated SMS and push notification to Maryam (Daughter) with non-alarmist fatigue & sleep analysis.'}
          </p>
        </div>

        {/* Red Trigger Protocol */}
        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
              <span className="font-extrabold text-xs text-rose-900 dark:text-rose-200">
                {language === 'ar' ? 'تحول المستوى إلى أحمر (طوارئ/سقوط)' : 'Shift to RED (Acute Emergency / Fall)'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded">
              Tier 3 Clinical Override
            </span>
          </div>
          <p className="text-xs text-rose-900/80 dark:text-rose-200/80 leading-relaxed">
            {language === 'ar'
              ? 'بث فوري عاجل لكافة أعضاء دائرة الرعاية مع فتح قناة الطوارئ والاتصال التلقائي بالدكتور طارق ومطوف الحملة.'
              : 'Immediate high-priority broadcast to all Care Circle members + Dr. Tariq with GPS location and clinical escalation brief.'}
          </p>
        </div>

      </div>

      {/* Dispatched Notification History */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'سجل التنبيهات المرسلة تلقائياً' : 'Automated Care Circle Dispatch History'}</span>
          </h4>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {notifications.length} {language === 'ar' ? 'تنبيهات مسجلة' : 'alerts logged'}
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'ar' ? 'لا توجد تحولات سلبية سابقة — حالة الوالدة مستقرة بطمأنينة.' : 'No recent negative triage shifts. Senior is within steady baseline.'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'ar' ? 'سيبدأ النظام تلقائياً بإشعارك عند حدوث أي تغير في الفحص الصوتي.' : 'Wanis AI will automatically dispatch circle alerts if check-in records detect health shifts.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const isRed = notif.newTriage === 'RED';
              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isRed
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                      : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{notif.previousTriage}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className={`w-2 h-2 rounded-full ${isRed ? 'bg-rose-500' : 'bg-amber-400'}`}></span>
                          <span className={isRed ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-amber-600 dark:text-amber-400 font-extrabold'}>
                            {notif.newTriage}
                          </span>
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {notif.timestamp}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pt-1">
                        {notif.reason}
                      </p>

                      {notif.transcriptSnippet && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                          "{notif.transcriptSnippet}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dispatched recipients */}
                  <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <Send className="w-3 h-3 text-teal-500" />
                      {language === 'ar' ? 'تم الإشعار:' : 'Dispatched to:'}
                    </span>
                    {notif.notifiedMembers.map((m, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>{m.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({m.channel})</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

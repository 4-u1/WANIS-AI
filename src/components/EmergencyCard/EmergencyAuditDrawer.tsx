import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Smartphone, 
  Lock, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Eye
} from 'lucide-react';
import { EmergencyAccessLog, SupportedLanguage } from '../../types';
import { EMERGENCY_TRANSLATIONS } from '../../data/emergencyCardData';

interface EmergencyAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: EmergencyAccessLog[];
  language: SupportedLanguage;
}

export const EmergencyAuditDrawer: React.FC<EmergencyAuditDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  language
}) => {
  if (!isOpen) return null;

  const t = EMERGENCY_TRANSLATIONS[language] || EMERGENCY_TRANSLATIONS.en;
  const isRtl = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      
      <div 
        id="emergency-audit-drawer-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 max-h-[85vh]"
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                {t.auditLogs}
              </h2>
              <p className="text-teal-200 text-xs font-medium">
                {language === 'ar' ? 'سجل تدقيق أمني مشفر لكل عملية وصول أو مسح للبطاقة' : 'Cryptographic audit log of every card view, QR scan & pass'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Stats Banner */}
        <div className="px-6 py-3 bg-teal-50 dark:bg-teal-950/40 border-b border-teal-200 dark:border-teal-900/50 flex items-center justify-between text-xs">
          <span className="font-extrabold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            {language === 'ar' ? 'جميع عمليات الوصول مسجلة وموثقة' : 'All accesses are audited and immutable'}
          </span>
          <span className="font-bold text-slate-600 dark:text-slate-400">
            {logs.length} {language === 'ar' ? 'سجلات موثقة' : 'Events recorded'}
          </span>
        </div>

        {/* Scrollable Audit Log Entries */}
        <div className={`p-5 sm:p-6 overflow-y-auto space-y-3 ${isRtl ? 'rtl' : 'ltr'}`}>
          {logs.map((log) => (
            <div 
              key={log.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>
                    {log.accessorType === 'RUFQA_LEADER' 
                      ? (language === 'ar' ? 'مرشد حملة رفقة للحج' : 'Rufqa Hajj Guide Team')
                      : log.accessorType === 'EMERGENCY_RESPONDER_QR'
                      ? (language === 'ar' ? 'مسح QR للطوارئ (مسعف خارجي)' : 'Emergency QR Scan (Responder)')
                      : (language === 'ar' ? 'تطبيق الأسرة والمشرف' : 'Family App & Caregiver')}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                  {log.timestamp}
                </span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-xs">
                <strong>Data Exposed:</strong> {log.dataAccessedSummary}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  {log.deviceInfo}
                </span>
                {log.locationCity && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {log.locationCity}
                  </span>
                )}
                <span className="font-mono">{log.ipMasked}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'ar' ? 'يتوافق نظام تدقيق ونيس مع معايير حماية البيانات والسرية الصحية الدولية.' : 'Complies with healthcare privacy, GDPR & Saudi National Cybersecurity standards.'}
          </p>
        </div>

      </div>

    </div>
  );
};

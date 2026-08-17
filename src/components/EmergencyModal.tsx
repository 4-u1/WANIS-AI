import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  MapPin, 
  Radio, 
  AlertTriangle, 
  X, 
  CheckCircle2,
  Heart,
  Users
} from 'lucide-react';
import { SeniorProfile, SupportedLanguage } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  senior: SeniorProfile;
  language: SupportedLanguage;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  senior,
  language
}) => {
  const [isCallingEMS, setIsCallingEMS] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-rose-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        id="emergency-sos-modal"
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border-2 border-rose-500 shadow-2xl overflow-hidden animate-fadeIn"
      >
        
        {/* Urgent Header */}
        <div className="bg-rose-600 p-6 text-white text-center space-y-2 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto animate-pulse">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-black uppercase tracking-wider">
            {language === 'ar' ? 'طوارئ ونداء إغاثة عاجل' : 'Critical Emergency SOS'}
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm font-medium">
            {language === 'ar' ? 'جاري بث الإحداثيات الطارئة للهلال الأحمر والأسرة' : 'Broadcasting Live Coordinates to Emergency Services & Family'}
          </p>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Action: Big Direct Call Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:997"
              onClick={() => setIsCallingEMS(true)}
              className="py-4 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-center flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-transform active:scale-95 text-base"
            >
              <Phone className="w-5 h-5 animate-bounce" />
              <span>{language === 'ar' ? 'اتصال بالهلال الأحمر (997)' : 'Call Red Crescent (997)'}</span>
            </a>

            <a
              href="tel:911"
              className="py-4 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-center flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 text-base"
            >
              <Phone className="w-5 h-5" />
              <span>{language === 'ar' ? 'طوارئ موحدة (911)' : 'Emergency Unified (911)'}</span>
            </a>
          </div>

          {/* Live Coordinates Broadcast */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                Live GPS Broadcast Location
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                High Precision GPS
              </span>
            </div>
            <p className="font-mono text-slate-800 dark:text-slate-200 font-bold text-sm">
              21.4225° N, 39.8262° E
            </p>
            <p className="text-slate-500">
              Landmark: Swissôtel Makkah Clock Tower / King Fahd Gate #79 Corridor
            </p>
          </div>

          {/* Care Circle Notification Status */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              Family Circle Auto-Alerts Dispatched:
            </span>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span>Maryam Al-Hashemi (Daughter)</span>
                <span className="font-bold flex items-center gap-1 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5" /> SMS & Call Alert Sent</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span>Ahmad Al-Ghamdi (Tawafa Leader)</span>
                <span className="font-bold flex items-center gap-1 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5" /> Direct Beacon Dispatched</span>
              </div>
            </div>
          </div>

          {/* Quick Medical Alert Card for First Responders */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
            <span className="font-bold text-amber-900 dark:text-amber-200 block">Critical Medical Memo:</span>
            <p className="text-amber-800 dark:text-amber-300">
              Patient: <strong>{senior.fullName}</strong> (76 y/o) • Allergies: Penicillin, Sulfa • Chronic: Hypertension, Mild Cognitive Latency.
            </p>
          </div>

          {/* Cancel / Stand down Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
            >
              {language === 'ar' ? 'إلغاء التنبيه والعودة (وضع آمن)' : 'False Alarm / Stand Down SOS'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { Pill, Check, Clock, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { Medication, SupportedLanguage } from '../../types';
import { DICTIONARY } from '../../data/i18n';

interface SeniorMedicationViewProps {
  medications: Medication[];
  onToggleTaken: (id: string) => void;
  language: SupportedLanguage;
  totalAcbScore: number;
}

export const SeniorMedicationView: React.FC<SeniorMedicationViewProps> = ({
  medications,
  onToggleTaken,
  language,
  totalAcbScore
}) => {
  const t = DICTIONARY[language];
  const isRtl = language === 'ar';

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

      {/* Medication List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map((med) => {
          const hasAcb = med.acbScore > 0;
          return (
            <div
              key={med.id}
              id={`med-card-${med.id}`}
              className={`p-5 rounded-3xl border transition-all ${med.isTakenToday ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {med.name}
                    </h4>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {med.dosage}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {med.indication} • {med.frequency}
                  </p>

                  {hasAcb && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200/80 dark:border-amber-900/60">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {language === 'ar' 
                          ? `تأثير على الذاكرة: درجة ${med.acbScore}` 
                          : `Cognitive Burden Score: +${med.acbScore}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Take/Untake Action Button */}
                <button
                  id={`toggle-med-${med.id}`}
                  onClick={() => onToggleTaken(med.id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-transform active:scale-90 ${med.isTakenToday ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'}`}
                  title={med.isTakenToday ? 'Mark as not taken' : 'Mark as taken'}
                >
                  <Check className={`w-6 h-6 ${med.isTakenToday ? 'stroke-[3]' : 'opacity-40'}`} />
                </button>
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

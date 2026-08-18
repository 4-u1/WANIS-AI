import React, { useState } from 'react';
import { 
  Sparkles, 
  HeartHandshake, 
  Pill, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ChevronRight, 
  ChevronLeft,
  Smile, 
  Moon, 
  Activity, 
  Send, 
  UserCheck, 
  Calendar,
  Eye,
  Info
} from 'lucide-react';
import { SeniorProfile, CheckInRecord, Medication, SupportedLanguage } from '../../types';
import { generateDailyWellnessSummary } from '../../services/wellnessSummaryService';

interface DailyWellnessSummaryCardProps {
  senior: SeniorProfile;
  latestCheckin?: CheckInRecord;
  medications: Medication[];
  totalAcbScore: number;
  language: SupportedLanguage;
  onOpenFullModal: () => void;
  onToggleMedicationTaken?: (id: string) => void;
  onTriggerMedicationReminder?: (med: Medication) => void;
}

export const DailyWellnessSummaryCard: React.FC<DailyWellnessSummaryCardProps> = ({
  senior,
  latestCheckin,
  medications = [],
  totalAcbScore,
  language,
  onOpenFullModal,
  onToggleMedicationTaken,
  onTriggerMedicationReminder
}) => {
  const isRtl = language === 'ar';
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;
  const summary = generateDailyWellnessSummary(senior, latestCheckin, medications, totalAcbScore, language);

  const [copied, setCopied] = useState(false);
  const seniorName = senior.preferredName || senior.fullName;

  const handleCopy = () => {
    const textToCopy = `📋 ${language === 'ar' ? 'ملخص الاطمئنان والعافية اليومي' : 'Daily Wellness Summary'} - ${seniorName}\n` +
      `✨ ${summary.headline}\n` +
      `💊 ${language === 'ar' ? 'الالتزام بالأدوية' : 'Medication Adherence'}: ${summary.medicationSummary.takenCount}/${summary.medicationSummary.totalCount} (${summary.medicationSummary.compliancePercentage}%)\n` +
      `💡 ${summary.caregiverRecommendations.join(' | ')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="daily-wellness-summary-card"
      className="bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-7 text-white border-2 border-teal-500/30 shadow-xl shadow-teal-950/20 relative overflow-hidden space-y-6"
    >
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

      {/* Top Banner Row */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-extrabold backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              {language === 'ar' ? 'ملخص الاطمئنان والعافية اليومي (موجز العائلة)' : 'Daily Wellness & Adherence Summary'}
            </span>
            <span className="text-xs text-teal-200/80 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {summary.dateStr}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {summary.headline}
          </h3>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            id="btn-copy-wellness-card"
            onClick={handleCopy}
            className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-colors"
            title="Copy summary"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-teal-300" />}
            <span>{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
          </button>

          <button
            type="button"
            id="btn-open-wellness-modal-from-card"
            onClick={onOpenFullModal}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-400/20 transition-transform active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span>{language === 'ar' ? 'عرض التقرير الكامل' : 'View Full Summary'}</span>
            <ChevronIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Pillars Grid: Check-in Notes, Medication Status, & Care Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">

        {/* Pillar 1: Check-in Spoken Notes & Observations */}
        <div className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur transition-colors space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-xs sm:text-sm">
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              <span>{language === 'ar' ? 'ملاحظات الاطمئنان الصباحي' : 'Check-in Notes & Voice'}</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-teal-200 font-semibold">
              {summary.checkinSummary.moodScore ? `${summary.checkinSummary.moodScore}/10 Mood` : '8.5/10'}
            </span>
          </div>

          {summary.checkinSummary.transcript ? (
            <p className="text-xs text-teal-100/90 italic line-clamp-3 bg-black/20 p-2.5 rounded-xl border border-white/5">
              "{summary.checkinSummary.transcript}"
            </p>
          ) : (
            <p className="text-xs text-teal-200/70 italic">
              {language === 'ar' ? 'تم تسجيل مؤشرات الاستقرار اليومي' : 'Daily baseline indicators recorded'}
            </p>
          )}

          <div className="space-y-1">
            {summary.checkinSummary.keyObservations.slice(0, 2).map((obs, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
                <span className="line-clamp-1">{obs}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 2: Medication Adherence & Pill Thumbnails */}
        <div className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur transition-colors space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-xs sm:text-sm">
              <Pill className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? 'الالتزام بالأدوية' : 'Medication Adherence'}</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              {summary.medicationSummary.takenCount}/{summary.medicationSummary.totalCount} ({summary.medicationSummary.compliancePercentage}%)
            </span>
          </div>

          {/* Adherence Bar */}
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${summary.medicationSummary.compliancePercentage}%` }}
            ></div>
          </div>

          {/* Medication Mini Avatars */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {medications.slice(0, 4).map((med) => (
              <div 
                key={med.id} 
                className={`relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border ${med.isTakenToday ? 'border-emerald-400 ring-2 ring-emerald-400/30' : 'border-amber-400/80 ring-2 ring-amber-400/20'}`}
                title={`${med.name} (${med.dosage}) - ${med.isTakenToday ? 'Taken' : 'Pending'}`}
              >
                {med.imageUrl ? (
                  <img src={med.imageUrl} alt={med.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                    {med.name[0]}
                  </div>
                )}
                {med.isTakenToday && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-white">
                    ✓
                  </span>
                )}
              </div>
            ))}
            {medications.length > 4 && (
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-teal-200 shrink-0">
                +{medications.length - 4}
              </div>
            )}
          </div>

          <p className="text-[11px] text-teal-200/80 flex items-center justify-between">
            <span>
              {summary.medicationSummary.pendingCount > 0 
                ? (language === 'ar' ? `⚠️ يتبقى ${summary.medicationSummary.pendingCount} جرعة اليوم` : `⚠️ ${summary.medicationSummary.pendingCount} dose(s) pending`)
                : (language === 'ar' ? '✓ تم تناول جميع الأدوية' : '✓ All scheduled doses taken')}
            </span>
            <span className="text-amber-300 font-semibold">ACB: {totalAcbScore}</span>
          </p>
        </div>

        {/* Pillar 3: Actionable Caregiver Recommendations */}
        <div className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur transition-colors space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{language === 'ar' ? 'توصيات فريق الرعاية' : 'Action Recommendations'}</span>
            </div>
            <span className="text-[10px] text-teal-200 font-semibold uppercase tracking-wider">
              {language === 'ar' ? 'إجراءات اليوم' : 'Today'}
            </span>
          </div>

          <div className="space-y-1.5">
            {summary.caregiverRecommendations.slice(0, 2).map((rec, i) => (
              <div key={i} className="text-xs text-teal-100/90 flex items-start gap-2 bg-black/20 p-2 rounded-xl border border-white/5">
                <span className="w-4 h-4 rounded-full bg-teal-500/30 text-teal-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="line-clamp-2">{rec}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenFullModal}
            className="text-[11px] text-teal-300 hover:text-white font-bold flex items-center gap-1 transition-colors group"
          >
            <span>{language === 'ar' ? 'مراجعة كافة التوصيات والإشعارات ←' : 'Review all caregiver recommendations →'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

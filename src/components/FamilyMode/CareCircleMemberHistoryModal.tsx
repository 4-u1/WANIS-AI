import React, { useState, useMemo } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Shield,
  Clock,
  CheckCircle2,
  BellRing,
  Pill,
  Heart,
  Calendar,
  Sparkles,
  Smartphone,
  Hospital,
  Activity,
  UserCheck,
  Send,
  Filter,
  FileText,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react';
import {
  CareCircleMember,
  SupportedLanguage,
  ConsentTier
} from '../../types';
import { EnhancedMemberEngagement } from './CareCircleMembersList';

export interface CaregiverTaskHistoryItem {
  id: string;
  timestamp: string;
  timestampAr: string;
  relativeTimeEn: string;
  relativeTimeAr: string;
  category: 'MEDICATION' | 'VISIT_CALL' | 'CLINICAL_NOTE' | 'EMERGENCY_TRIAGE' | 'MEAL_HYDRATION';
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  status: 'VERIFIED' | 'COMPLETED' | 'REVIEWED' | 'DISPATCHED';
  deviceUsedEn: string;
  deviceUsedAr: string;
  metricBadgeEn?: string;
  metricBadgeAr?: string;
}

interface CareCircleMemberHistoryModalProps {
  member: CareCircleMember | null;
  presence: EnhancedMemberEngagement | null;
  seniorName: string;
  language: SupportedLanguage;
  onClose: () => void;
  onOpenDoctorBrief?: () => void;
}

export const CareCircleMemberHistoryModal: React.FC<CareCircleMemberHistoryModalProps> = ({
  member,
  presence,
  seniorName,
  language,
  onClose,
  onOpenDoctorBrief
}) => {
  const isRtl = language === 'ar';
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'MEDICATION' | 'VISIT_CALL' | 'CLINICAL_NOTE'>('ALL');
  const [pingSent, setPingSent] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Generate rich historical log tailored to the member's role and identity
  const historyItems = useMemo<CaregiverTaskHistoryItem[]>(() => {
    if (!member) return [];

    if (member.role === 'PRIMARY_CAREGIVER') {
      return [
        {
          id: 'hist-maryam-01',
          timestamp: 'Today, 08:30 AM',
          timestampAr: 'اليوم، 08:30 ص',
          relativeTimeEn: '2 hours ago',
          relativeTimeAr: 'منذ ساعتين',
          category: 'MEDICATION',
          titleEn: 'Confirmed Morning Lisinopril (10mg) Dose',
          titleAr: 'تأكيد إعطاء جرعة دواء ليزينوبريل (10 ملغ) الصباحية',
          descriptionEn: `Verified intake after breakfast and recorded senior blood pressure at 124/82 mmHg with pulse 74 bpm.`,
          descriptionAr: `التحقق من تناول الجرعة بعد وجبة الإفطار وتسجيل ضغط الدم 124/82 مم زئبق والنبض 74 ن/د.`,
          status: 'VERIFIED',
          deviceUsedEn: 'iPhone 15 Pro • Care App v2.4',
          deviceUsedAr: 'آيفون 15 برو • تطبيق رعاية v2.4',
          metricBadgeEn: 'BP: 124/82 mmHg',
          metricBadgeAr: 'الضغط: 124/82'
        },
        {
          id: 'hist-maryam-02',
          timestamp: 'Yesterday, 07:15 PM',
          timestampAr: 'أمس، 07:15 م',
          relativeTimeEn: 'Yesterday',
          relativeTimeAr: 'أمس',
          category: 'MEAL_HYDRATION',
          titleEn: 'Evening Meal & Hydration Verification Visit',
          titleAr: 'زيارة المساء وتأكيد وجبة العشاء وتناول السوائل',
          descriptionEn: `Brought home-cooked lentil soup. Verified 500ml water intake and inspected medication dispenser for night dose.`,
          descriptionAr: `تقديم شوربة العدس المحضرة منزلياً، والتأكد من شرب 500 مل ماء وفحص منظم الأدوية لموعد المساء.`,
          status: 'COMPLETED',
          deviceUsedEn: 'In-Person Home Visit',
          deviceUsedAr: 'زيارة منزلية مباشرة',
          metricBadgeEn: 'Hydration: 1.8L Total',
          metricBadgeAr: 'السوائل: 1.8 لتر'
        },
        {
          id: 'hist-maryam-03',
          timestamp: 'Yesterday, 02:10 PM',
          timestampAr: 'أمس، 02:10 م',
          relativeTimeEn: 'Yesterday',
          relativeTimeAr: 'أمس',
          category: 'VISIT_CALL',
          titleEn: 'Handled Midday Grogginess Voice Follow-up',
          titleAr: 'متابعة نوبة الخمول بعد الظهيرة عبر الاتصال الصوتي',
          descriptionEn: `Called ${seniorName} following Wanees check-in alert. Ensured she was resting comfortably and refreshed.`,
          descriptionAr: `الاتصال بالوالدة بعد تنبيه ونيس للاطمئنان، والتأكد من أخذ قسط من الراحة واستعادة النشاط.`,
          status: 'COMPLETED',
          deviceUsedEn: 'Wanees Voice Gateway (3m 42s)',
          deviceUsedAr: 'بوابة ونيس الصوتية (3 د 42 ث)',
          metricBadgeEn: 'Duration: 3m 42s',
          metricBadgeAr: 'المدة: 3 د 42 ث'
        },
        {
          id: 'hist-maryam-04',
          timestamp: 'Aug 17, 10:00 AM',
          timestampAr: '17 أغسطس، 10:00 ص',
          relativeTimeEn: '2 days ago',
          relativeTimeAr: 'منذ يومين',
          category: 'CLINICAL_NOTE',
          titleEn: 'Cardiology Clinic Appointment Escort',
          titleAr: 'مرافقة الوالدة لموعد عيادة القلب والأوعية',
          descriptionEn: `Accompanied senior to King Faisal Specialist Hospital. Shared Wanees 14-day Doctor Brief with Dr. Sarah.`,
          descriptionAr: `مرافقة الوالدة إلى مستشفى الملك فيصل التخصصي ومشاركة ملخص الطبيب لـ 14 يوماً مع د. سارة.`,
          status: 'REVIEWED',
          deviceUsedEn: 'Hospital Clinical Check-in',
          deviceUsedAr: 'تسجيل العيادة الخارجية',
          metricBadgeEn: 'Brief 2.0 Shared',
          metricBadgeAr: 'تمت مشاركة التقرير'
        },
        {
          id: 'hist-maryam-05',
          timestamp: 'Aug 16, 04:30 PM',
          timestampAr: '16 أغسطس، 04:30 م',
          relativeTimeEn: '3 days ago',
          relativeTimeAr: 'منذ 3 أيام',
          category: 'MEDICATION',
          titleEn: 'Prescription Refill & Cloud Sync at Community Pharmacy',
          titleAr: 'إعادة صرف الأدوية وتحديث المزامنة السحابية من الصيدلية',
          descriptionEn: `Picked up 30-day supply of Metformin (500mg) and Rosuvastatin (10mg). Synced barcode via Care app.`,
          descriptionAr: `استلام عبوة شهرية من ميتفورمين (500 ملغ) وروسوفاستاتين (10 ملغ) ومزامنة الباركود عبر التطبيق.`,
          status: 'VERIFIED',
          deviceUsedEn: 'Al-Dawaa Pharmacy NFC Sync',
          deviceUsedAr: 'صيدليات الدواء • مزامنة فورية',
          metricBadgeEn: '30-Day Refill',
          metricBadgeAr: 'صرف 30 يوماً'
        }
      ];
    }

    if (member.role === 'CLINICIAN') {
      return [
        {
          id: 'hist-doc-01',
          timestamp: 'Yesterday, 04:15 PM',
          timestampAr: 'أمس، 04:15 م',
          relativeTimeEn: 'Yesterday',
          relativeTimeAr: 'أمس',
          category: 'CLINICAL_NOTE',
          titleEn: 'EHR Review: 14-Day Doctor Brief 2.0 & ACB Score',
          titleAr: 'مراجعة السجل الصحي: ملخص الطبيب ومؤشر العبء الدوائي ACB',
          descriptionEn: `Reviewed senior longitudinal mood and vital stability. Flagged cumulative anticholinergic burden (ACB 3) and recommended tapering Amitriptyline.`,
          descriptionAr: `مراجعة استقرار المؤشرات الحيوية والمزاج للوالدة. رصد العبء الكوليني التراكمي ACB 3 والتوصية بتخفيف جرعة أميتريبتيلين.`,
          status: 'REVIEWED',
          deviceUsedEn: 'Hospital Epic EHR Workstation',
          deviceUsedAr: 'محطة السجل الإلكتروني Epic للمستشفى',
          metricBadgeEn: 'ACB Deprescribing Note',
          metricBadgeAr: 'ملاحظة تخفيف ACB'
        },
        {
          id: 'hist-doc-02',
          timestamp: 'Aug 14, 11:00 AM',
          timestampAr: '14 أغسطس، 11:00 ص',
          relativeTimeEn: '5 days ago',
          relativeTimeAr: 'منذ 5 أيام',
          category: 'CLINICAL_NOTE',
          titleEn: 'Approved Medication Time Adjustment for Lisinopril',
          titleAr: 'اعتماد تعديل موعد تناول دواء ليزينوبريل',
          descriptionEn: `Adjusted diuretic/antihypertensive dose timing from late afternoon to morning 08:30 AM to mitigate nocturia and sleep fragmentation.`,
          descriptionAr: `تعديل توقيت الدواء من المساء إلى الصباح الباكر 08:30 ص لتجنب الاستيقاظ الليلي وتقطع النوم.`,
          status: 'VERIFIED',
          deviceUsedEn: 'Clinical Portal Protocol Engine',
          deviceUsedAr: 'بوابة البروتوكول السريري',
          metricBadgeEn: 'Regimen Updated',
          metricBadgeAr: 'تم تحديث الجدول'
        },
        {
          id: 'hist-doc-03',
          timestamp: 'Aug 10, 09:30 AM',
          timestampAr: '10 أغسطس، 09:30 ص',
          relativeTimeEn: '9 days ago',
          relativeTimeAr: 'منذ 9 أيام',
          category: 'VISIT_CALL',
          titleEn: 'Geriatric Telehealth Consultation with Caregiver',
          titleAr: 'استشارة طب الشيخوخة عن بُعد مع مقدم الرعاية',
          descriptionEn: `15-minute video follow-up discussing senior cognitive vitality, daytime alertness, and hydration benchmarks.`,
          descriptionAr: `متابعة مرئية لمدة 15 دقيقة لمناقشة اليقظة المعرفية والنشاط النهاري ومعايير شرب السوائل.`,
          status: 'COMPLETED',
          deviceUsedEn: 'Telehealth Video Gateway (15m)',
          deviceUsedAr: 'بوابة الطب الاتصالي (15 د)',
          metricBadgeEn: 'Telehealth Completed',
          metricBadgeAr: 'استشارة مكتملة'
        }
      ];
    }

    // Default / Tariq / Family Member
    return [
      {
        id: 'hist-tariq-01',
        timestamp: 'Today, 08:30 AM',
        timestampAr: 'اليوم، 08:30 ص',
        relativeTimeEn: '2 hours ago',
        relativeTimeAr: 'منذ ساعتين',
        category: 'VISIT_CALL',
        titleEn: 'Listened to Morning Voice Check-in Recording',
        titleAr: 'الاستماع للتسجيل الصوتي للاطمئنان الصباحي',
        descriptionEn: `Reviewed audio playback from Wanees senior speaker. Verified senior voice energy, clear speech articulation, and cheerful tone.`,
        descriptionAr: `مراجعة التسجيل الصوتي من جهاز ونيس المنزلي والتأكد من نبرة الصوت المبهجة ووضوح الكلمات.`,
        status: 'COMPLETED',
        deviceUsedEn: 'Samsung Galaxy Tab S9 • Care Portal',
        deviceUsedAr: 'تاب سامسونج جالكسي S9 • بوابة الرعاية',
        metricBadgeEn: 'Audio Quality: Clear',
        metricBadgeAr: 'جودة الصوت: ممتازة'
      },
      {
        id: 'hist-tariq-02',
        timestamp: 'Aug 17, 06:00 PM',
        timestampAr: '17 أغسطس، 06:00 م',
        relativeTimeEn: '2 days ago',
        relativeTimeAr: 'منذ يومين',
        category: 'VISIT_CALL',
        titleEn: 'Family Video Call & Grandchildren Catch-up',
        titleAr: 'مكالمة فيديو عائلية ومحادثة الأحفاد',
        descriptionEn: `20-minute video call through Wanees senior tablet. Senior engaged happily in family conversation and memory storytelling.`,
        descriptionAr: `مكالمة مرئية لمدة 20 دقيقة عبر شاشة ونيس. تفاعلت الوالدة بسعادة وشاركت ذكريات جميلة مع الأحفاد.`,
        status: 'COMPLETED',
        deviceUsedEn: 'Wanees Video Gateway (20m)',
        deviceUsedAr: 'بوابة ونيس المرئية (20 د)',
        metricBadgeEn: 'Mood Impact: High (+2)',
        metricBadgeAr: 'أثر المزاج: مبهج (+2)'
      },
      {
        id: 'hist-tariq-03',
        timestamp: 'Aug 15, 11:30 AM',
        timestampAr: '15 أغسطس، 11:30 ص',
        relativeTimeEn: '4 days ago',
        relativeTimeAr: 'منذ 4 أيام',
        category: 'MEAL_HYDRATION',
        titleEn: 'Organized Fresh Low-Sodium Grocery Delivery',
        titleAr: 'تنسيق توصيل طلبات البقالة الطازجة قليلة الصوديوم',
        descriptionEn: `Arranged fresh fruits, vegetables, olive oil, and mineral water delivery to senior residence.`,
        descriptionAr: `ترتيب توصيل فواكه طازجة وخضار وزيت زيتون ومياه معدنية إلى منزل الوالدة.`,
        status: 'VERIFIED',
        deviceUsedEn: 'Jahez Delivery Integration',
        deviceUsedAr: 'تطبيق التوصيل المعتمد',
        metricBadgeEn: 'Delivered & Stored',
        metricBadgeAr: 'تم التسليم والتخزين'
      }
    ];
  }, [member, seniorName]);

  // Filter items
  const filteredHistory = useMemo(() => {
    if (activeCategory === 'ALL') return historyItems;
    if (activeCategory === 'MEDICATION') return historyItems.filter(h => h.category === 'MEDICATION');
    if (activeCategory === 'VISIT_CALL') return historyItems.filter(h => h.category === 'VISIT_CALL' || h.category === 'MEAL_HYDRATION');
    if (activeCategory === 'CLINICAL_NOTE') return historyItems.filter(h => h.category === 'CLINICAL_NOTE' || h.category === 'EMERGENCY_TRIAGE');
    return historyItems;
  }, [historyItems, activeCategory]);

  const handlePing = () => {
    setPingSent(true);
    setTimeout(() => {
      setPingSent(false);
    }, 3500);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };

  if (!member) return null;

  return (
    <div
      id={`modal-member-history-${member.id}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            id="btn-close-member-history-modal"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar with Status Ring */}
            <div className="relative shrink-0">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                presence?.status === 'ONLINE' ? 'bg-emerald-500' : presence?.status === 'AWAY' ? 'bg-amber-500' : 'bg-slate-400'
              }`} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-lg sm:text-xl text-white">
                  {member.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {member.relation} • {member.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
                <span className="font-mono">{member.phone}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-teal-300">
                  <Shield className="w-3 h-3" />
                  <span>{member.consentTierGranted}</span>
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">
                  {language === 'ar' ? presence?.statusTextAr : presence?.statusTextEn}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 3 Key Coordination KPI Stats */}
        <div className="grid grid-cols-3 gap-2.5 p-4 sm:p-5 bg-slate-50 dark:bg-slate-850/60 border-b border-slate-200 dark:border-slate-800 text-center">
          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'ar' ? 'مهام تم إنجازها:' : 'Tasks Completed:'}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono">
              {member.role === 'PRIMARY_CAREGIVER' ? '38' : member.role === 'CLINICIAN' ? '12' : '19'}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'ar' ? 'نسبة الالتزام:' : 'On-Time Rate:'}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-teal-600 dark:text-teal-400 font-mono">
              99.2%
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'ar' ? 'متوسط سرعة الرد:' : 'Avg Response:'}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {member.role === 'PRIMARY_CAREGIVER' ? '3 mins' : '15 mins'}
            </span>
          </div>
        </div>

        {/* History Log Controls: Category Filter Chips & Export */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between gap-3 flex-wrap border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'جميع الأنشطة' : 'All Activities'} ({historyItems.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('MEDICATION')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeCategory === 'MEDICATION'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Pill className="w-3 h-3" />
              <span>{language === 'ar' ? 'تأكيدات الأدوية' : 'Medications'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('VISIT_CALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeCategory === 'VISIT_CALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Phone className="w-3 h-3" />
              <span>{language === 'ar' ? 'المكالمات والزيارات' : 'Visits & Calls'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('CLINICAL_NOTE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeCategory === 'CLINICAL_NOTE'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>{language === 'ar' ? 'التقارير الطبية' : 'Clinical Notes'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>{isExporting ? (language === 'ar' ? 'جاري التصدير...' : 'Exporting...') : (language === 'ar' ? 'تصدير السجل' : 'Export Log')}</span>
          </button>
        </div>

        {/* Scrollable Timeline of Activities */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {language === 'ar' ? 'لا توجد أنشطة مسجلة في هذا القسم' : 'No records under this category'}
              </p>
            </div>
          ) : (
            filteredHistory.map((item, index) => {
              const isMed = item.category === 'MEDICATION';
              const isClinical = item.category === 'CLINICAL_NOTE';
              const isMeal = item.category === 'MEAL_HYDRATION';

              return (
                <div
                  key={item.id}
                  id={`history-item-${item.id}`}
                  className="relative flex items-start gap-3.5 group"
                >
                  {/* Timeline connector dot */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs ${
                      isMed
                        ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                        : isClinical
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : isMeal
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                    }`}>
                      {isMed ? (
                        <Pill className="w-4 h-4" />
                      ) : isClinical ? (
                        <FileText className="w-4 h-4" />
                      ) : isMeal ? (
                        <Heart className="w-4 h-4" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                    </div>
                    {index < filteredHistory.length - 1 && (
                      <div className="w-0.5 h-full min-h-[36px] bg-slate-200 dark:bg-slate-800 my-1" />
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="flex-1 bg-slate-50/80 dark:bg-slate-850/70 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-700/60 space-y-2 group-hover:border-teal-500/30 transition-all">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </h4>
                      
                      <div className="flex items-center gap-2">
                        {item.metricBadgeEn && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono">
                            {language === 'ar' ? item.metricBadgeAr : item.metricBadgeEn}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{language === 'ar' ? item.timestampAr : item.timestamp}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{item.status}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Smartphone className="w-3 h-3 text-slate-400" />
                        <span>{language === 'ar' ? item.deviceUsedAr : item.deviceUsedEn}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${member.phone}`}
              className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'اتصال مباشر' : 'Call Member'}</span>
            </a>

            <button
              type="button"
              id={`btn-modal-ping-${member.id}`}
              onClick={handlePing}
              className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{pingSent ? (language === 'ar' ? 'تم الإرسال ✓' : 'Ping Sent ✓') : (language === 'ar' ? 'تنبيه فوري' : 'Instant Ping')}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-extrabold text-xs transition-all cursor-pointer self-stretch sm:self-auto text-center"
          >
            {language === 'ar' ? 'إغلاق السجل' : 'Close Log'}
          </button>
        </div>

      </div>
    </div>
  );
};

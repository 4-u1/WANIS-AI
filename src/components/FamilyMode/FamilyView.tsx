import React, { useState, useMemo } from 'react';
import { 
  Users, 
  HeartHandshake, 
  Moon, 
  Smile, 
  AlertTriangle, 
  FileText, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Activity, 
  Pill,
  Send,
  Plus,
  TrendingDown,
  TrendingUp,
  ArrowDownRight,
  BedDouble,
  Info
} from 'lucide-react';
import { 
  SeniorProfile, 
  CheckInRecord, 
  CareCircleMember, 
  LongitudinalMetrics, 
  CareLoopEvent, 
  SupportedLanguage, 
  PersonaMode 
} from '../../types';
import { DICTIONARY } from '../../data/i18n';
import { CaregiverDigestCard } from './CaregiverDigestCard';

interface FamilyViewProps {
  senior: SeniorProfile;
  checkins: CheckInRecord[];
  careCircle: CareCircleMember[];
  longitudinalData: LongitudinalMetrics[];
  careLoopEvents: CareLoopEvent[];
  onOpenDoctorBrief: () => void;
  onNavigateToMode: (mode: PersonaMode) => void;
  language: SupportedLanguage;
  totalAcbScore: number;
}

export const FamilyView: React.FC<FamilyViewProps> = ({
  senior,
  checkins,
  careCircle,
  longitudinalData,
  careLoopEvents,
  onOpenDoctorBrief,
  onNavigateToMode,
  language,
  totalAcbScore
}) => {
  const t = DICTIONARY[language];
  const isRtl = language === 'ar';
  const latestCheckin = checkins[0];

  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'trends' | 'circle'>('timeline');
  const [quickNote, setQuickNote] = useState('');
  const [notesList, setNotesList] = useState<Array<{ author: string; text: string; time: string }>>([
    {
      author: 'Maryam (Daughter)',
      text: 'Dropped off fresh lentil soup and ensured mother took her morning Lisinopril. She seemed in good spirits but mentioned feeling a bit sleepy.',
      time: 'Today, 11:30 AM'
    }
  ]);

  const handleAddNote = () => {
    if (!quickNote.trim()) return;
    setNotesList([
      { author: 'Maryam (You)', text: quickNote.trim(), time: 'Just now' },
      ...notesList
    ]);
    setQuickNote('');
  };

  const longitudinalSummary = useMemo(() => {
    if (!longitudinalData || longitudinalData.length === 0) {
      return null;
    }

    const first = longitudinalData[0];
    const latest = longitudinalData[longitudinalData.length - 1];

    const sleepDelta = Number((latest.sleepHours - first.sleepHours).toFixed(1));
    const sleepPercent = Math.round(((latest.sleepHours - first.sleepHours) / first.sleepHours) * 100);
    const isSleepDeclining = sleepDelta < -0.4;

    const socialDelta = Number((latest.socialEngagementScore - first.socialEngagementScore).toFixed(1));
    const socialPercent = Math.round(((latest.socialEngagementScore - first.socialEngagementScore) / first.socialEngagementScore) * 100);
    const isSocialDeclining = socialDelta < -0.4;

    let sleepSummary = '';
    let socialSummary = '';
    let holisticNarrative = '';

    if (language === 'ar') {
      sleepSummary = isSleepDeclining
        ? `تراجع ملحوظ في استمرارية النوم من ${first.sleepHours} ساعات إلى ${latest.sleepHours} ساعات (${sleepPercent}%) مع تقطع ليلي متكرر وصعوبة في الاستغراق.`
        : `استقرار في نمط النوم بمعدل ${latest.sleepHours} ساعات يومياً مع جودة نوم متوازنة.`;

      socialSummary = isSocialDeclining
        ? `انخفاض تدريجي في مؤشر التفاعل الاجتماعي من ${first.socialEngagementScore}/10 إلى ${latest.socialEngagementScore}/10 (${socialPercent}%) مع ميل للهدوء المسائي.`
        : `تفاعل اجتماعي ممتاز واستجابة حيوية مستمرة خلال الاتصالات والزيارات العائلية.`;

      holisticNarrative = `خلال آخر ${longitudinalData.length} يوماً، يتزامن تراجع ساعات النوم بشكل مباشر مع هبوط النشاط الاجتماعي المسائي، مما يعكس إجهاداً صباحياً متصلاً بتأثير الأدوية ذات العبء المعرفي (ACB = ${totalAcbScore}). الوالدة تستجيب بشكل أكثر حيوية للزيارات والمحادثات في ساعات الصباح الباكر.`;
    } else if (language === 'fr') {
      sleepSummary = isSleepDeclining
        ? `Baisse notable de la durée du sommeil de ${first.sleepHours} h à ${latest.sleepHours} h (${sleepPercent}%) avec une fragmentation accrue ces derniers jours.`
        : `Sommeil régulier et stable avec une moyenne de ${latest.sleepHours} h par nuit.`;

      socialSummary = isSocialDeclining
        ? `Ralentissement modéré des interactions sociales de ${first.socialEngagementScore}/10 à ${latest.socialEngagementScore}/10 (${socialPercent}%), plus marqué en soirée.`
        : `Excellente réactivité sociale et bonne vitalité lors des échanges familiaux.`;

      holisticNarrative = `Sur les ${longitudinalData.length} derniers jours, la baisse de la qualité du sommeil coïncide directement avec un retrait social en soirée et une fatigue diurne liée à la charge anticholinergique (ACB = ${totalAcbScore}). Privilégiez les visites matinales.`;
    } else {
      sleepSummary = isSleepDeclining
        ? `Marked reduction in sleep duration from ${first.sleepHours} hrs to ${latest.sleepHours} hrs (${sleepPercent}%), accompanied by fragmented sleep architecture and morning grogginess.`
        : `Sleep duration remains stable at an average of ${latest.sleepHours} hrs per night with consistent restfulness.`;

      socialSummary = isSocialDeclining
        ? `Gradual softening in social engagement scores from ${first.socialEngagementScore}/10 to ${latest.socialEngagementScore}/10 (${socialPercent}%), reflecting lower conversational energy during late afternoons.`
        : `Social connectedness remains robust, with high verbal engagement during family check-ins and visits.`;

      holisticNarrative = `Over the past ${longitudinalData.length} evaluated days, the cumulative loss in sleep continuity is closely mirroring the softening in evening social engagement, strongly correlating with the elevated anticholinergic medication burden (ACB = ${totalAcbScore}). Morning family visits and quiet daylight routines provide the best comfort.`;
    }

    return {
      first,
      latest,
      sleepDelta,
      sleepPercent,
      isSleepDeclining,
      socialDelta,
      socialPercent,
      isSocialDeclining,
      sleepSummary,
      socialSummary,
      holisticNarrative
    };
  }, [longitudinalData, language, totalAcbScore]);

  return (
    <div id="family-portal-container" className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={senior.photoUrl}
              alt={senior.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {senior.preferredName}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {senior.age} y/o • Independent Living
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ar' ? 'بوابة رعاية العائلة — متابعة مستمرة وتنسيق فوري' : 'Family Care Circle — Continuous Wellbeing & Peace of Mind'}
            </p>
          </div>
        </div>

        {/* Doctor Brief CTA */}
        <div className="flex items-center gap-3">
          <button
            id="family-open-doctor-brief-btn"
            onClick={onOpenDoctorBrief}
            className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center gap-2 transition-transform active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>{t.doctorBrief}</span>
          </button>
        </div>
      </div>

      {/* TOP HERO: Dedicated High-Contrast Caregiver Digest Card */}
      <CaregiverDigestCard
        careLoopEvents={careLoopEvents}
        senior={senior}
        latestCheckin={latestCheckin}
        language={language}
        totalAcbScore={totalAcbScore}
        onOpenDoctorBrief={onOpenDoctorBrief}
        onNavigateToMode={onNavigateToMode}
      />

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeSubTab === 'timeline' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
        >
          {language === 'ar' ? 'اليوميات والاطمئنان' : 'Care Timeline'}
        </button>
        <button
          onClick={() => setActiveSubTab('trends')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeSubTab === 'trends' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
        >
          {language === 'ar' ? 'المؤشرات (14 يوماً)' : '14-Day Trends'}
        </button>
        <button
          onClick={() => setActiveSubTab('circle')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeSubTab === 'circle' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
        >
          {language === 'ar' ? 'فريق الرعاية والملاحظات' : 'Care Circle & Notes'}
        </button>
      </div>

      {/* TAB 1: TIMELINE & CARE LOOP */}
      {activeSubTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main 2-Columns: Today's Summary & 8-Stage Care Loop */}
          <div className="lg:col-span-2 space-y-6">

            {/* Daily Digest Card */}
            {latestCheckin && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {language === 'ar' ? 'ملخص الاطمئنان الصباحي' : 'Today\'s Morning Check-in Digest'}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(latestCheckin.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {language === 'ar' ? 'كلام الوالدة المفرغ صوتياً' : 'Senior Spoken Words'}
                  </span>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic">
                    "{latestCheckin.transcript}"
                  </p>
                </div>

                {/* Key Extracted Observations */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {language === 'ar' ? 'الملاحظات السريرية المستخرجة' : 'Clinical AI Observations'}
                  </span>
                  <ul className="space-y-1.5">
                    {latestCheckin.keyObservations.map((obs, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0"></span>
                        <span>{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Continuous 8-Stage Care Loop Feed */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {t.careLoopTitle}
                  </h3>
                </div>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  {language === 'ar' ? 'حلقة مستمرة ذاتية' : 'Autonomous Closed-Loop'}
                </span>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 before:z-0">
                {careLoopEvents.slice(0, 5).map((evt) => (
                  <div key={evt.id} className="relative z-10 flex items-start gap-3.5 pl-1">
                    <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                      {evt.stage[0]}
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          [{evt.stage}] {evt.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{evt.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Care Circle & Quick Coordination */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Contact Circle */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                {language === 'ar' ? 'فريق الرعاية المشترك' : 'Care Circle Members'}
              </h3>

              <div className="space-y-3">
                {careCircle.map((member) => (
                  <div key={member.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{member.name}</h4>
                        <p className="text-[10px] text-slate-500">{member.relation} • {member.lastActive}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a href={`tel:${member.phone}`} className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:text-teal-600">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Family Care Log */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                {language === 'ar' ? 'ملاحظات وتنسيق الأبناء' : 'Caregiver Coordination Notes'}
              </h3>

              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder={language === 'ar' ? 'أضيفي ملاحظة زيارة أو دواء...' : 'Add a note for other caregivers...'}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!quickNote.trim()}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'حفظ الملاحظة' : 'Post Note'}</span>
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {notesList.map((n, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{n.author}</span>
                      <span>{n.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{n.text}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 2: 14-DAY TRENDS & CHARTS */}
      {activeSubTab === 'trends' && (
        <div className="space-y-6">
          {/* Natural Language Longitudinal Summary Card (Sleep & Social Engagement) */}
          {longitudinalSummary && (
            <div id="family-longitudinal-summary-card" className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        {language === 'ar' ? 'التحليل الذكي الطولي: ملخص النوم والتفاعل الاجتماعي' : 'Longitudinal Wellbeing Digest: Sleep & Social Engagement'}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                        {language === 'ar' ? 'تفسير ذكي باللغة الطبيعية' : 'Natural Language AI Synthesis'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'ar' ? `قراءة تحليلية لتغيرات الأنماط السلوكية خلال آخر ${longitudinalData.length} يوماً` : `Empathetic interpretation of behavioral patterns across the last ${longitudinalData.length} evaluated days`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-[11px] font-medium text-slate-400">
                    {language === 'ar' ? 'موثوقية البيانات: 96.4%' : 'Data Provenance: 96.4%'}
                  </span>
                </div>
              </div>

              {/* Holistic Natural Language Summary Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                <p className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span>{longitudinalSummary.holisticNarrative}</span>
                </p>
              </div>

              {/* Side-by-side Dual Trajectory Panels: Sleep vs Social */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                
                {/* 1. Sleep Trajectory Summary */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Moon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {language === 'ar' ? 'نمط واستمرارية النوم' : 'Sleep Continuity & Duration'}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {language === 'ar' ? `المعدل الحالي: ${longitudinalSummary.latest.sleepHours} ساعات (الأساس: ${longitudinalSummary.first.sleepHours} س)` : `Current: ${longitudinalSummary.latest.sleepHours}h (Baseline: ${longitudinalSummary.first.sleepHours}h)`}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                      longitudinalSummary.isSleepDeclining
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {longitudinalSummary.isSleepDeclining ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                      <span>{longitudinalSummary.sleepDelta > 0 ? `+${longitudinalSummary.sleepDelta}h` : `${longitudinalSummary.sleepDelta}h`} ({longitudinalSummary.sleepPercent}%)</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {longitudinalSummary.sleepSummary}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      {language === 'ar' ? 'جودة النوم المسجلة:' : 'Sleep Restfulness Rating:'}
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {longitudinalSummary.latest.sleepQuality}/10 <span className="text-[10px] text-slate-400">({language === 'ar' ? 'سابقاً' : 'was'} {longitudinalSummary.first.sleepQuality}/10)</span>
                    </span>
                  </div>
                </div>

                {/* 2. Social Engagement Trajectory Summary */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {language === 'ar' ? 'التفاعل والتواصل الاجتماعي' : 'Social Engagement & Connectedness'}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {language === 'ar' ? `المعدل الحالي: ${longitudinalSummary.latest.socialEngagementScore}/10 (الأساس: ${longitudinalSummary.first.socialEngagementScore}/10)` : `Current: ${longitudinalSummary.latest.socialEngagementScore}/10 (Baseline: ${longitudinalSummary.first.socialEngagementScore}/10)`}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                      longitudinalSummary.isSocialDeclining
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {longitudinalSummary.isSocialDeclining ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                      <span>{longitudinalSummary.socialDelta > 0 ? `+${longitudinalSummary.socialDelta}` : `${longitudinalSummary.socialDelta}`} pts ({longitudinalSummary.socialPercent}%)</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {longitudinalSummary.socialSummary}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      {language === 'ar' ? 'حالة التجاوب الأسري:' : 'Care Circle Responsiveness:'}
                    </span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      {language === 'ar' ? 'تجاوب صباحي دافئ' : 'Active Morning Response'}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'المؤشرات الطولية المعرفية والفسيولوجية' : 'Longitudinal Cognitive & Wellbeing Signals'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'مقارنة يومية لمتوسط النوم، المزاج، وحوادث النسيان خلال آخر 14 يوماً' : '14-day window tracking baseline shifts in sleep, mood, fatigue, and memory'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {longitudinalData.length} Days Evaluated
            </span>
          </div>

          {/* Simple Visual Longitudinal Matrix Bar Chart */}
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-1">
              {longitudinalData.map((d, i) => (
                <div key={i}>{d.date}</div>
              ))}
            </div>

            {/* Sleep Hours Bars */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                {language === 'ar' ? 'ساعات النوم (المعيار: 7+ ساعات)' : 'Sleep Duration (Target: 7+ hrs)'}
              </span>
              <div className="grid grid-cols-7 gap-2 items-end h-24 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
                {longitudinalData.map((d, i) => {
                  const heightPercent = Math.min(100, Math.round((d.sleepHours / 9) * 100));
                  const isLow = d.sleepHours < 6;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{d.sleepHours}h</span>
                      <div 
                        style={{ height: `${heightPercent}%` }} 
                        className={`w-full rounded-t-lg transition-all ${isLow ? 'bg-amber-500' : 'bg-teal-500'}`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mood Index Bars */}
            <div className="space-y-1 pt-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                {language === 'ar' ? 'مؤشر المزاج والراحة (1-10)' : 'Mood & Emotional Index (1-10)'}
              </span>
              <div className="grid grid-cols-7 gap-2 items-end h-24 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
                {longitudinalData.map((d, i) => {
                  const heightPercent = Math.round(d.moodScore * 10);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{d.moodScore}</span>
                      <div 
                        style={{ height: `${heightPercent}%` }} 
                        className="w-full rounded-t-lg bg-indigo-500 transition-all"
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Engagement Score Bars */}
            <div className="space-y-1 pt-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                {language === 'ar' ? 'مؤشر التفاعل والتواصل الاجتماعي (1-10)' : 'Social Engagement & Connectedness (1-10)'}
              </span>
              <div className="grid grid-cols-7 gap-2 items-end h-24 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
                {longitudinalData.map((d, i) => {
                  const heightPercent = Math.round(d.socialEngagementScore * 10);
                  const isDip = d.socialEngagementScore < 7.0;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{d.socialEngagementScore}</span>
                      <div 
                        style={{ height: `${heightPercent}%` }} 
                        className={`w-full rounded-t-lg transition-all ${isDip ? 'bg-indigo-400 dark:bg-indigo-500' : 'bg-emerald-500'}`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACB Burden Overlay */}
            <div className="space-y-1 pt-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                {language === 'ar' ? 'العبء المعرفي للأدوية (ACB Score)' : 'Medication Cognitive Burden (ACB)'}
              </span>
              <div className="grid grid-cols-7 gap-2 text-center">
                {longitudinalData.map((d, i) => (
                  <div key={i} className={`p-2 rounded-xl text-xs font-bold border ${d.acbCumulative >= 3 ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    ACB {d.acbCumulative}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      )}

      {/* TAB 3: CARE CIRCLE */}
      {activeSubTab === 'circle' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careCircle.map((member) => (
            <div key={member.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{member.name}</h4>
                  <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{member.role}</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <p>Phone: {member.phone}</p>
                <p>Consent Tier: {member.consentTierGranted}</p>
                <p>Status: Active</p>
              </div>
              <a 
                href={`tel:${member.phone}`}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {member.relation}</span>
              </a>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

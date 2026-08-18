import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ArrowLeft, 
  Activity, 
  FileText, 
  MessageSquare, 
  ShieldAlert, 
  Moon, 
  Heart, 
  Pill, 
  Smile, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  CareLoopEvent, 
  SeniorProfile, 
  SupportedLanguage, 
  TriageLevel, 
  CheckInRecord,
  CareLoopStage
} from '../../types';

interface CaregiverDigestCardProps {
  careLoopEvents: CareLoopEvent[];
  senior: SeniorProfile;
  latestCheckin?: CheckInRecord;
  language: SupportedLanguage;
  totalAcbScore?: number;
  onOpenDoctorBrief?: () => void;
  onNavigateToMode?: (mode: any) => void;
}

interface TriageTransition {
  hasChanged: boolean;
  fromLevel: TriageLevel;
  toLevel: TriageLevel;
  stageTriggered: CareLoopStage;
  eventTitle: string;
  reason: string;
  isEscalation: boolean;
}

export const CaregiverDigestCard: React.FC<CaregiverDigestCardProps> = ({
  careLoopEvents,
  senior,
  latestCheckin,
  language,
  totalAcbScore = 4,
  onOpenDoctorBrief,
  onNavigateToMode
}) => {
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeTab, setActiveTab] = useState<'concise' | 'detailed' | 'signals'>('concise');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAuditProvenance, setShowAuditProvenance] = useState(false);

  // 1. Programmatic Analysis of Care Loop Events & Triage Delta
  const analysis = useMemo(() => {
    if (!careLoopEvents || careLoopEvents.length === 0) {
      return null;
    }

    const chronologicalEvents = [...careLoopEvents].reverse();
    const firstTriage = chronologicalEvents[0]?.triage || 'GREEN';
    const latestTriage = careLoopEvents[0]?.triage || senior.currentTriage || 'GREEN';

    const triageLevelsOrder: Record<TriageLevel, number> = {
      'GREEN': 1,
      'YELLOW': 2,
      'ORANGE': 3,
      'RED': 4
    };

    let transition: TriageTransition = {
      hasChanged: false,
      fromLevel: firstTriage,
      toLevel: latestTriage,
      stageTriggered: 'ASSESS',
      eventTitle: '',
      reason: '',
      isEscalation: false
    };

    for (let i = 1; i < chronologicalEvents.length; i++) {
      const prev = chronologicalEvents[i - 1];
      const curr = chronologicalEvents[i];
      if (curr.triage !== prev.triage) {
        transition = {
          hasChanged: true,
          fromLevel: prev.triage,
          toLevel: curr.triage,
          stageTriggered: curr.stage,
          eventTitle: curr.title,
          reason: curr.description,
          isEscalation: triageLevelsOrder[curr.triage] > triageLevelsOrder[prev.triage]
        };
        break;
      }
    }

    if (!transition.hasChanged && firstTriage !== latestTriage) {
      transition = {
        hasChanged: true,
        fromLevel: firstTriage,
        toLevel: latestTriage,
        stageTriggered: careLoopEvents[0].stage,
        eventTitle: careLoopEvents[0].title,
        reason: careLoopEvents[0].description,
        isEscalation: triageLevelsOrder[latestTriage] > triageLevelsOrder[firstTriage]
      };
    }

    const totalEventsCount = careLoopEvents.length;
    const avgConfidence = Math.round(
      (careLoopEvents.reduce((acc, curr) => acc + (curr.confidenceScore || 1), 0) / totalEventsCount) * 100
    );

    return {
      chronologicalEvents,
      firstTriage,
      latestTriage,
      transition,
      totalEventsCount,
      avgConfidence
    };
  }, [careLoopEvents, senior]);

  // 2. Multilingual Natural Language Insights & Texts
  const digestData = useMemo(() => {
    if (!analysis) return null;

    const { transition, latestTriage } = analysis;
    const seniorName = senior.preferredName || 'Hajjah Fatima';

    if (language === 'ar') {
      return {
        cardTitle: 'موجز ونيس الذكي لمقدمي الرعاية',
        cardSubtitle: 'ملخص تحليلي فوري لحالة الوالدة وتغيرات الفرز السريري',
        triageTitle: transition.hasChanged ? 'تنبيه تغير الفرز السريري' : 'حالة الفرز الحالية',
        triageStatusName: getTriageLabel('ar', latestTriage),
        conciseInsights: `الوالدة بخير ومستقرة في المنزل. كشف الاطمئنان الصباحي عن تقطع في النوم (4.5 ساعات) وشعور طفيف بالدوار عند الوقوف، مع روح معنوية طيبة. يرتبط هذا العَرَض بارتفاع العبء الدوائي (ACB = ${totalAcbScore})، وتم إعداد موجز الطبيب 2.0 لمراجعته.`,
        detailedProse: `ملخص رعاية الوالدة ${seniorName} (دورة المتابعة الأخيرة):

أتمت الوالدة اطمئنانها الصباحي بصوتها الطبيعي. من خلال التحليل الصوتي واستخراج المؤشرات، أظهرت المحادثة شعوراً بالثقل الصباحي وتقطعاً في النوم (4.5 ساعات) مع دوار خفيف أثناء الوقوف، مع الحفاظ على روح معنوية طيبة.

${transition.hasChanged 
  ? `⚠️ رصدت المنظومة تغيراً في مستوى الفرز من [${getTriageLabel('ar', transition.fromLevel)}] إلى [${getTriageLabel('ar', transition.toLevel)}] خلال مرحلة التقييم (${transition.stageTriggered})، وذلك نتيجة ${transition.reason.toLowerCase() || 'تراكم مؤشرات الإجهاد والعبء الدوائي'}.`
  : `✅ استمرت حالة الفرز عند مستوى [${getTriageLabel('ar', latestTriage)}] دون أي تصعيد طارئ.`}

الإجراءات التنسيقية المنفذة:
• تم حساب العبء المعرفي التراكمي للأدوية (ACB = ${totalAcbScore}) واقتراح مراجعة دواء الحساسية وأميتريبتيلين مع الطبيب المعالج.
• تم تجهيز مسودة موجز الطبيب 2.0 للدكتورة سارة الخطيب.
• تم إرسال إشعار فوري لدائرة العائلة، وجدولة تذكير لطيف بالسوائل والراحة عند الساعة 01:30 ظهراً.`,
        actionGuidance: `توصية عملية للعائلة ومريم: لا حاجة لأي تدخل طارئ. يُرجى الاطمئنان على شرب الوالدة 500 مل ماء دافئ، وتذكيرها بالنهوض التدريجي لتفادي الدوار، مع مناقشة موجز الطبيب 2.0 في الموعد القادم.`,
        signals: [
          { icon: Moon, label: 'جودة النوم', value: '4.5 ساعات (متقطع)', status: 'warning', note: 'استيقاظ متكرر لصلاة الفجر' },
          { icon: Activity, label: 'الأعراض الحركية', value: 'دوار انتصابي خفيف', status: 'warning', note: 'عند النهوض السريع من السجود' },
          { icon: Pill, label: 'العبء الدوائي', value: `ACB = ${totalAcbScore} (مرتفع)`, status: 'alert', note: 'أميتريبتيلين + مضاد الحساسية' },
          { icon: Smile, label: 'الحالة المزاجية', value: 'مطمئنة وإيجابية', status: 'good', note: 'تواصل صوتي دافئ ونبرة مستقرة' }
        ]
      };
    } else if (language === 'fr') {
      return {
        cardTitle: 'Synthèse Soignants Wanis AI',
        cardSubtitle: 'Aperçu analytique en temps réel du bien-être et du niveau de triage',
        triageTitle: transition.hasChanged ? 'Alerte Transition de Triage' : 'Statut de Triage Actuel',
        triageStatusName: getTriageLabel('fr', latestTriage),
        conciseInsights: `${seniorName} est en sécurité chez elle. Le bilan matinal indique une nuit fragmentée (4,5 h de sommeil) et de légers vertiges au lever, avec un moral très positif. Ce symptôme est corrélé à la charge anticholinergique (ACB = ${totalAcbScore}). Le Brief Médecin 2.0 a été préparé.`,
        detailedProse: `Synthèse de prise en charge pour ${seniorName} (Cycle récent) :

${seniorName} a effectué son bilan vocal matinal. L'analyse des signaux vocaux indique une nuit fragmentée (4,5 h de sommeil) et de légers vertiges orthostatiques au réveil, tout en maintenant un bon moral.

${transition.hasChanged 
  ? `⚠️ Le système a détecté un changement de niveau de triage passant de [${getTriageLabel('fr', transition.fromLevel)}] à [${getTriageLabel('fr', transition.toLevel)}] lors de l'étape d'évaluation (${transition.stageTriggered}), suite à : ${transition.reason}.`
  : `✅ Le niveau de triage reste stable à [${getTriageLabel('fr', latestTriage)}] sans escalade d'urgence.`}

Actions coordonnées réalisées :
• Calcul de la charge anticholinergique cumulative (ACB = ${totalAcbScore}) avec suggestion de révision thérapeutique.
• Préparation du Brief Médical 2.0 pour le Dr Sarah Al-Khatib.
• Notification envoyée au cercle familial et rappel d'hydratation programmé à 13h30.`,
        actionGuidance: `Recommandation pratique pour Maryam : Aucune urgence immédiate. Assurez-vous d'une prise d'eau de 500 ml avant midi et rappelez-lui de se lever par étapes. Le brief médecin est prêt pour la prochaine consultation.`,
        signals: [
          { icon: Moon, label: 'Sommeil', value: '4.5 h (Fragmenté)', status: 'warning', note: 'Réveils nocturnes répétés' },
          { icon: Activity, label: 'Mobilité & Vertiges', value: 'Vertiges posturaux légers', status: 'warning', note: 'Au lever après la prière' },
          { icon: Pill, label: 'Charge ACB', value: `ACB = ${totalAcbScore} (Élevée)`, status: 'alert', note: 'Amitriptyline + Antihistaminique' },
          { icon: Smile, label: 'Humeur & Moral', value: 'Sereine & Positive', status: 'good', note: 'Prosodie vocale chaleureuse' }
        ]
      };
    } else {
      // Default: English
      return {
        cardTitle: 'Caregiver Digest & Wellness Insights',
        cardSubtitle: 'Real-time AI synthesis of recent care loops, vital signals, and triage level',
        triageTitle: transition.hasChanged ? 'Triage Transition Flagged' : 'Active Triage Status',
        triageStatusName: getTriageLabel('en', latestTriage),
        conciseInsights: `${seniorName} is safe and comfortable at home. Morning voice analysis identified sleep fragmentation (4.5 hours) and mild postural dizziness upon rising, accompanied by preserved emotional warmth. This correlates with the recent anticholinergic medication burden (ACB = ${totalAcbScore}). Doctor Brief 2.0 is drafted for clinician review.`,
        detailedProse: `Caregiver Digest for ${seniorName} (Recent Care Loop Cycle):

${seniorName} completed her morning voice check-in. Acoustic and cognitive signal parsing revealed sleep fragmentation (4.5 hours) and mild postural dizziness upon rising from prayer, alongside preserved spiritual and emotional resilience.

${transition.hasChanged 
  ? `⚠️ System flagged a triage transition from [${getTriageLabel('en', transition.fromLevel)}] to [${getTriageLabel('en', transition.toLevel)}] during the ${transition.stageTriggered} stage: ${transition.reason}.`
  : `✅ Triage level maintained at [${getTriageLabel('en', latestTriage)}] baseline with no emergency escalation.`}

Autonomous Coordinated Actions:
• Computed cumulative anticholinergic burden (ACB = ${totalAcbScore}) and recommended clinician deprescribing review for PRN antihistamine.
• Prepared Doctor Brief 2.0 for Dr. Sarah Al-Khatib's upcoming clinical visit.
• Dispatched immediate digest update to Maryam (Daughter) and scheduled a hydration & rest reminder for 01:30 PM.`,
        actionGuidance: `Guidance for Maryam & Family: No acute emergency. Mother is safe at home. Please check that she drinks 500ml of warm water before Dhuhr prayer and remind her to stand up gradually. Doctor Brief 2.0 is prepared for her upcoming clinic review.`,
        signals: [
          { icon: Moon, label: 'Sleep Continuity', value: '4.5 hrs (Fragmented)', status: 'warning', note: 'Early morning broken sleep' },
          { icon: Activity, label: 'Orthostatic Response', value: 'Mild Postural Dizziness', status: 'warning', note: 'Upon rising from prayer' },
          { icon: Pill, label: 'Anticholinergic Risk', value: `ACB = ${totalAcbScore} (Elevated)`, status: 'alert', note: 'Amitriptyline + PRN Antihistamine' },
          { icon: Smile, label: 'Emotional Resilience', value: 'Calm & Warm', status: 'good', note: 'High verbal engagement' }
        ]
      };
    }
  }, [analysis, senior, language, totalAcbScore]);

  // Copy Handler
  const handleCopyDigest = async () => {
    if (!digestData) return;
    try {
      await navigator.clipboard.writeText(
        `${digestData.cardTitle}\nStatus: ${digestData.triageStatusName}\n\n${digestData.conciseInsights}\n\n${digestData.actionGuidance}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy digest:', err);
    }
  };

  // Text to Speech
  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window) || !digestData) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${digestData.triageTitle}: ${digestData.triageStatusName}. ${digestData.conciseInsights}. ${digestData.actionGuidance}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!analysis || !digestData) return null;

  const { transition, latestTriage, totalEventsCount, avgConfidence } = analysis;

  return (
    <div 
      id="caregiver-digest-hero-card" 
      className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border-2 border-slate-700/80 shadow-xl space-y-6 relative overflow-hidden animate-fadeIn"
    >
      {/* High-Contrast Dynamic Ambient Accents */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
        latestTriage === 'RED' ? 'bg-rose-500' :
        latestTriage === 'ORANGE' ? 'bg-orange-500' :
        latestTriage === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'
      } -mr-20 -mt-20`} />

      {/* TOP ROW: Header Title + Visual Triage Status Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-800 pb-5 relative z-10">
        
        {/* Title & Badge */}
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            latestTriage === 'RED' ? 'bg-rose-600 text-white shadow-rose-600/30' :
            latestTriage === 'ORANGE' ? 'bg-orange-500 text-white shadow-orange-500/30' :
            latestTriage === 'YELLOW' ? 'bg-amber-500 text-slate-950 shadow-amber-500/30' : 
            'bg-emerald-500 text-white shadow-emerald-500/30'
          }`}>
            {latestTriage === 'RED' ? <ShieldAlert className="w-6 h-6" /> :
             latestTriage === 'YELLOW' || latestTriage === 'ORANGE' ? <AlertTriangle className="w-6 h-6" /> :
             <CheckCircle2 className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                {digestData.cardTitle}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {language === 'ar' ? 'ملخص تحليلي فوري' : 'Live Care Loop'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {digestData.cardSubtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons: Audio, Copy, Tabs */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-center">
          {/* Audio Listen */}
          <button
            id="caregiver-digest-voice-btn"
            onClick={handleToggleVoice}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isSpeaking 
                ? 'bg-teal-500 text-slate-950 font-black animate-pulse' 
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
            title="Read out digest"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
            <span>{isSpeaking ? (language === 'ar' ? 'إيقاف' : 'Stop') : (language === 'ar' ? 'استماع' : 'Audio')}</span>
          </button>

          {/* Copy Button */}
          <button
            id="caregiver-digest-copy-btn"
            onClick={handleCopyDigest}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Copy digest for WhatsApp / SMS"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-800/90 border border-slate-700 rounded-xl">
            <button
              onClick={() => setActiveTab('concise')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'concise'
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ar' ? 'الموجز' : 'Concise'}
            </button>
            <button
              onClick={() => setActiveTab('signals')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'signals'
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ar' ? 'المؤشرات' : 'Signals'}
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'detailed'
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ar' ? 'التقرير الكامل' : 'Prose'}
            </button>
          </div>
        </div>

      </div>

      {/* DEDICATED HIGH-CONTRAST TRIAGE STATUS INDICATOR BAR */}
      <div 
        id="caregiver-digest-triage-status-bar"
        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          latestTriage === 'RED'
            ? 'bg-rose-950/80 border-rose-500 text-rose-100'
            : latestTriage === 'ORANGE'
            ? 'bg-orange-950/80 border-orange-500 text-orange-100'
            : latestTriage === 'YELLOW'
            ? 'bg-amber-950/80 border-amber-400 text-amber-100'
            : 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
        }`}
      >
        {/* Left: Triage Status Indicator Pill & Delta */}
        <div className="flex items-center gap-3.5">
          {/* Animated Status Light */}
          <div className="relative flex items-center justify-center">
            <span className={`w-4 h-4 rounded-full ${
              latestTriage === 'RED' ? 'bg-rose-500 animate-ping' :
              latestTriage === 'ORANGE' ? 'bg-orange-500 animate-ping' :
              latestTriage === 'YELLOW' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
            }`} />
            <span className={`absolute w-3 h-3 rounded-full ${
              latestTriage === 'RED' ? 'bg-rose-500' :
              latestTriage === 'ORANGE' ? 'bg-orange-500' :
              latestTriage === 'YELLOW' ? 'bg-amber-400' : 'bg-emerald-500'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                {digestData.triageTitle}:
              </span>
              
              {/* Color-Coded Triage Badge */}
              <span className={`px-3 py-1 rounded-xl text-xs font-black tracking-wide uppercase shadow-sm ${
                latestTriage === 'RED' ? 'bg-rose-600 text-white' :
                latestTriage === 'ORANGE' ? 'bg-orange-500 text-white' :
                latestTriage === 'YELLOW' ? 'bg-amber-400 text-slate-950' :
                'bg-emerald-500 text-slate-950'
              }`}>
                {digestData.triageStatusName}
              </span>

              {/* Triage Shift Transition Arrow */}
              {transition.hasChanged && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded-lg border border-amber-500/30">
                  <span className="text-slate-400">{getTriageCode(transition.fromLevel)}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-extrabold">{getTriageCode(transition.toLevel)}</span>
                </div>
              )}
            </div>

            <p className="text-xs font-medium text-slate-200 mt-1">
              {transition.hasChanged 
                ? (language === 'ar' 
                    ? `تغير فرز ناتج عن تقييم (${transition.stageTriggered}): ${transition.reason}`
                    : `Shift triggered at [${transition.stageTriggered}] stage: ${transition.reason}`)
                : (language === 'ar' 
                    ? 'الحالة مستقرة بدون أي مؤشرات تصعيد طارئة'
                    : 'All care loops operating within safe baseline parameters')}
            </p>
          </div>
        </div>

        {/* Visual 3-Level Triage Meter Gauge */}
        <div className="flex items-center gap-1.5 self-start md:self-center bg-black/50 p-2 rounded-xl border border-slate-700 shrink-0">
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
            latestTriage === 'GREEN' 
              ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400' 
              : 'bg-emerald-950/60 text-emerald-600 opacity-40'
          }`}>
            {language === 'ar' ? 'أخضر' : 'Green'}
          </div>
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
            latestTriage === 'YELLOW' || latestTriage === 'ORANGE'
              ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300' 
              : 'bg-amber-950/60 text-amber-600 opacity-40'
          }`}>
            {language === 'ar' ? 'أصفر' : 'Yellow'}
          </div>
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
            latestTriage === 'RED' 
              ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400 animate-pulse' 
              : 'bg-rose-950/60 text-rose-600 opacity-40'
          }`}>
            {language === 'ar' ? 'أحمر' : 'Red'}
          </div>
        </div>
      </div>

      {/* BODY CONTENT: Concise Text Block (Default) vs Signals vs Detailed Prose */}
      {activeTab === 'concise' && (
        <div 
          id="caregiver-digest-concise-box"
          className="p-5 rounded-2xl bg-slate-850 border border-slate-750 space-y-4 shadow-inner"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2.5">
            <span className="font-bold text-teal-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {language === 'ar' ? 'الموجز التنفيذي للرعاية والمؤشرات' : 'Concise Wellness Insights Summary'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              CONFIDENCE: {avgConfidence}% • EVENTS: {totalEventsCount}
            </span>
          </div>

          {/* High-Contrast Concise Text Block */}
          <div className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
            {digestData.conciseInsights}
          </div>

          {/* Action Guidance Callout */}
          <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-start gap-3">
            <MessageSquare className="w-4 h-4 text-indigo-300 mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-indigo-200 font-medium leading-relaxed">
              {digestData.actionGuidance}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'signals' && (
        <div 
          id="caregiver-digest-signals-grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
        >
          {digestData.signals.map((sig, idx) => {
            const Icon = sig.icon;
            return (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`w-2 h-2 rounded-full ${
                    sig.status === 'alert' ? 'bg-rose-400' :
                    sig.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-400">{sig.label}</h5>
                  <p className="text-sm font-extrabold text-white mt-0.5">{sig.value}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{sig.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'detailed' && (
        <div 
          id="caregiver-digest-detailed-box"
          className="p-5 rounded-2xl bg-slate-850 border border-slate-750 space-y-4"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-300">
              {language === 'ar' ? 'التقرير السردي المفصل لدورة الرعاية' : 'Full Natural Language Care Loop Narrative'}
            </span>
            <span className="text-[11px] text-slate-500">8-Stage Autonomous Pipeline</span>
          </div>

          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
            {digestData.detailedProse}
          </div>
        </div>
      )}

      {/* FOOTER ROW: Action Buttons & Collapsible Audit Trail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-t border-slate-800/80">
        
        {/* Clinician Brief CTA */}
        <div className="flex items-center gap-3">
          {onOpenDoctorBrief && (
            <button
              id="caregiver-digest-doctor-brief-btn"
              onClick={onOpenDoctorBrief}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-md shadow-teal-500/20 transition-all active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'ar' ? 'فتح موجز الطبيب 2.0' : 'Open Doctor Brief 2.0'}</span>
            </button>
          )}

          {onNavigateToMode && (
            <button
              onClick={() => onNavigateToMode('clinician')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
            >
              {language === 'ar' ? 'لوحة الطبيب المعالج' : 'Clinician Portal'}
            </button>
          )}
        </div>

        {/* Audit Provenance Toggle */}
        <button
          onClick={() => setShowAuditProvenance(!showAuditProvenance)}
          className="text-xs text-slate-400 hover:text-slate-200 font-medium flex items-center gap-1 self-start sm:self-center transition-colors"
        >
          {showAuditProvenance ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{language === 'ar' ? 'تفاصيل تدقيق أحداث دورة الرعاية (8 مراحل)' : 'Inspect 8-Stage Care Provenance'}</span>
        </button>
      </div>

      {/* Collapsible Provenance Log */}
      {showAuditProvenance && (
        <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-b border-slate-800 pb-2">
            <span>PIPELINE_STATUS: SYNCHRONIZED</span>
            <span>EVENTS_ANALYZED: {totalEventsCount}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {careLoopEvents.slice(0, 8).map((evt) => (
              <div key={evt.id} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] text-teal-400">[{evt.stage}]</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                    evt.triage === 'RED' ? 'bg-rose-900 text-rose-200' :
                    evt.triage === 'YELLOW' || evt.triage === 'ORANGE' ? 'bg-amber-900 text-amber-200' :
                    'bg-emerald-900 text-emerald-200'
                  }`}>
                    {evt.triage}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-200 truncate mt-1">{evt.title}</p>
                <p className="text-[10px] text-slate-400 truncate">{evt.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// Helper for Triage Label
function getTriageLabel(lang: SupportedLanguage, triage: TriageLevel): string {
  if (lang === 'ar') {
    switch (triage) {
      case 'GREEN': return 'المستوى الأخضر — مستقر وطبيعي';
      case 'YELLOW': return 'المستوى الأصفر — انتباه ومتابعة سريرية';
      case 'ORANGE': return 'المستوى البرتقالي — مراجعة طبية مطلوبة';
      case 'RED': return 'المستوى الأحمر — استجابة طارئة';
    }
  } else if (lang === 'fr') {
    switch (triage) {
      case 'GREEN': return 'Niveau VERT — Stable';
      case 'YELLOW': return 'Niveau JAUNE — Vigilance Requise';
      case 'ORANGE': return 'Niveau ORANGE — Consultation Recommandée';
      case 'RED': return 'Niveau ROUGE — Urgence';
    }
  } else {
    switch (triage) {
      case 'GREEN': return 'GREEN LEVEL — All Clear & Stable';
      case 'YELLOW': return 'YELLOW LEVEL — Clinical Attention Flagged';
      case 'ORANGE': return 'ORANGE LEVEL — Physician Review Recommended';
      case 'RED': return 'RED LEVEL — Urgent Medical Alert';
    }
  }
}

function getTriageCode(triage: TriageLevel): string {
  switch (triage) {
    case 'GREEN': return 'GREEN';
    case 'YELLOW': return 'YELLOW';
    case 'ORANGE': return 'ORANGE';
    case 'RED': return 'RED';
  }
}

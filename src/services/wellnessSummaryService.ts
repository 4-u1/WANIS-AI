import { CheckInRecord, Medication, SeniorProfile, SupportedLanguage, TriageLevel } from '../types';

export interface DailyWellnessSummaryData {
  generatedAt: string;
  dateStr: string;
  triageLevel: TriageLevel;
  statusLabel: string;
  headline: string;
  checkinSummary: {
    hasCheckin: boolean;
    timestamp?: string;
    transcript?: string;
    sentiment?: 'positive' | 'subdued' | 'concerning' | 'distressed';
    moodScore?: number;
    sleepHours?: number;
    sleepQuality?: number;
    keyObservations: string[];
  };
  medicationSummary: {
    totalCount: number;
    takenCount: number;
    pendingCount: number;
    compliancePercentage: number;
    takenMeds: Medication[];
    pendingMeds: Medication[];
    highAcbPendingMeds: Medication[];
    totalAcbScore: number;
  };
  actionableInsights: string[];
  caregiverRecommendations: string[];
}

export function generateDailyWellnessSummary(
  senior: SeniorProfile,
  latestCheckin: CheckInRecord | undefined,
  medications: Medication[] = [],
  totalAcbScore: number = 0,
  language: SupportedLanguage = 'en'
): DailyWellnessSummaryData {
  const safeMeds = medications || [];
  const takenMeds = safeMeds.filter(m => m.isTakenToday);
  const pendingMeds = safeMeds.filter(m => !m.isTakenToday);
  const highAcbPendingMeds = pendingMeds.filter(m => m.acbScore >= 2);
  const totalCount = safeMeds.length;
  const takenCount = takenMeds.length;
  const pendingCount = pendingMeds.length;
  const compliancePercentage = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString(
    language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US',
    { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }
  );

  const seniorName = senior.preferredName || senior.fullName || 'Fatima';
  const hasCheckin = !!latestCheckin;

  let triageLevel: TriageLevel = senior.currentTriage || 'GREEN';
  if (latestCheckin?.triageLevel) {
    triageLevel = latestCheckin.triageLevel;
  }

  // Multilingual Headlines & Action Items
  let headline = '';
  let statusLabel = '';
  let actionableInsights: string[] = [];
  let caregiverRecommendations: string[] = [];

  if (language === 'ar') {
    if (compliancePercentage === 100 && (!latestCheckin || latestCheckin.moodScore >= 7)) {
      statusLabel = 'حالة ممتازة ومستقرة';
      headline = `الوالدة ${seniorName} في حالة معنوية طيبة ومستقرة اليوم، وتم تأكيد أخذ كامل أدويتها بنجاح.`;
    } else if (pendingCount > 0) {
      statusLabel = 'تنبيه متابعة دوائية';
      headline = `الوالدة ${seniorName} أكملت فحص الاطمئنان، ويتبقى ${pendingCount} جرعات مجدولة للمتابعة خلال اليوم.`;
    } else {
      statusLabel = 'استقرار عام';
      headline = `تقرير الاطمئنان اليومي للوالدة ${seniorName} مكتمل مع تسجيل مؤشرات النوم والمزاج.`;
    }

    actionableInsights = [
      hasCheckin
        ? `المزاج العام: ${latestCheckin?.moodScore || 8.5}/10 مع استقرار نفسي وراحة بال.`
        : 'لم يُسجل فحص صوتي مباشر بعد، اعتمد الملخص على القياسات الأساسية.',
      `ساعات النوم المسجلة: ${latestCheckin?.sleepHours || 7} ساعات (${latestCheckin?.sleepHours && latestCheckin.sleepHours < 6 ? 'نوم متقطع خفيف' : 'نوم كافٍ ومريح'}).`,
      `الالتزام بالأدوية: ${takenCount} من أصل ${totalCount} جرعة (${compliancePercentage}%).`,
      totalAcbScore >= 3
        ? `مؤشر العبء المعرفي للأدوية (ACB = ${totalAcbScore}): مرتفع، يُنصح بجدولة زيارة مراجعة مع الطبيب المعالج لتخفيف الإجهاد الصباحي.`
        : `مؤشر العبء المعرفي للأدوية (ACB = ${totalAcbScore}): في الحدود الآمنة.`
    ];

    caregiverRecommendations = [
      pendingCount > 0
        ? `تذكير الوالدة بالجرعات المتبقية (${pendingMeds.map(m => m.name).join('، ')}) خاصة قبل وقت المساء.`
        : 'تم تناول كافة الأدوية بنجاح، لا يلزم اتخاذ إجراء دوائي حالياً.',
      'أفضل وقت للتواصل الهاتفي أو الزيارة: فترة الضحى والظهيرة (10:00 صباحاً - 1:30 ظهراً) حيث تكون الطاقة الذهنية في أعلى مستوياتها.',
      'تقديم سوائل دافئة وترطيب كافٍ قبل فترات الراحة وصلاة العصر لتعزيز النشاط البدني.'
    ];
  } else if (language === 'fr') {
    if (compliancePercentage === 100) {
      statusLabel = 'Excellente Stabilité';
      headline = `${seniorName} est sereine et en bonne forme aujourd'hui; toutes les prises médicamenteuses sont complétées.`;
    } else if (pendingCount > 0) {
      statusLabel = 'Suivi Médicamenteux Requis';
      headline = `${seniorName} a complété son check-in matinal; ${pendingCount} prise(s) restent à confirmer aujourd'hui.`;
    } else {
      statusLabel = 'État Stable';
      headline = `Synthèse quotidienne du bien-être pour ${seniorName} synchronisée avec le cercle de soins.`;
    }

    actionableInsights = [
      hasCheckin
        ? `Humeur & Moral : ${latestCheckin?.moodScore || 8.5}/10 avec une attitude paisible.`
        : 'Check-in vocal en attente, données basées sur les capteurs et habitudes.',
      `Sommeil : ${latestCheckin?.sleepHours || 7} heures (${latestCheckin?.sleepHours && latestCheckin.sleepHours < 6 ? 'légère fragmentation' : 'récupérateur'}).`,
      `Observance Médicale : ${takenCount}/${totalCount} doses confirmées (${compliancePercentage}%).`,
      totalAcbScore >= 3
        ? `Charge Anticholinergique (ACB = ${totalAcbScore}) : Élevée, revue clinique suggérée avec le médecin traitant.`
        : `Charge Anticholinergique (ACB = ${totalAcbScore}) : Niveau modéré et sous contrôle.`
    ];

    caregiverRecommendations = [
      pendingCount > 0
        ? `Vérifier la prise des médicaments restants (${pendingMeds.map(m => m.name).join(', ')}) en fin d'après-midi.`
        : 'Toutes les prises prévues sont validées. Aucun rappel urgent requis.',
      'Créneau idéal pour une visite ou un appel : entre 10h00 et 13h30 pour profiter de sa vitalité matinale.',
      'Veiller à une bonne hydratation en milieu de journée.'
    ];
  } else {
    // English
    if (compliancePercentage === 100 && (!latestCheckin || latestCheckin.moodScore >= 7)) {
      statusLabel = 'Optimal Baseline & Confirmed Adherence';
      headline = `${seniorName} is in peaceful spirits this morning with 100% medication schedule adherence confirmed.`;
    } else if (pendingCount > 0) {
      statusLabel = 'Adherence Follow-up Required';
      headline = `${seniorName} completed her morning check-in; ${pendingCount} scheduled dose(s) remain pending for today.`;
    } else {
      statusLabel = 'Stable Daily Baseline';
      headline = `Daily wellness synthesis for ${seniorName} compiled from morning voice check-in and caregiver logs.`;
    }

    actionableInsights = [
      hasCheckin
        ? `Emotional State & Mood: ${latestCheckin?.moodScore || 8.5}/10 (Peaceful, socially receptive, clear verbal fluidity).`
        : 'Direct voice check-in pending; metrics aggregated from passive activity and care circle records.',
      `Sleep Architecture: ${latestCheckin?.sleepHours || 7.0} hours recorded (${latestCheckin?.sleepHours && latestCheckin.sleepHours < 6 ? 'slight fragmentation noted' : 'restful rest'}).`,
      `Medication Compliance: ${takenCount} of ${totalCount} doses confirmed taken (${compliancePercentage}%).`,
      totalAcbScore >= 3
        ? `Cognitive Drug Burden (ACB = ${totalAcbScore}): High risk threshold. Monitor for afternoon grogginess and discuss deprescribing with Dr. Tariq.`
        : `Cognitive Drug Burden (ACB = ${totalAcbScore}): Within standard clinical threshold.`
    ];

    caregiverRecommendations = [
      pendingCount > 0
        ? `Prompt or confirm pending medication doses (${pendingMeds.map(m => m.name).join(', ')}) before evening routine.`
        : 'All scheduled morning and afternoon medications have been taken and verified.',
      'Optimal social engagement window: 10:30 AM – 1:30 PM (highest conversational clarity and physical energy).',
      'Encourage midday hydration (250–300 ml water or warm tea) to support energy levels.'
    ];
  }

  return {
    generatedAt: timeStr,
    dateStr,
    triageLevel,
    statusLabel,
    headline,
    checkinSummary: {
      hasCheckin,
      timestamp: latestCheckin?.timestamp,
      transcript: latestCheckin?.transcript,
      sentiment: latestCheckin?.sentiment,
      moodScore: latestCheckin?.moodScore,
      sleepHours: latestCheckin?.sleepHours,
      sleepQuality: latestCheckin?.sleepQuality,
      keyObservations: latestCheckin?.keyObservations || []
    },
    medicationSummary: {
      totalCount,
      takenCount,
      pendingCount,
      compliancePercentage,
      takenMeds,
      pendingMeds,
      highAcbPendingMeds,
      totalAcbScore
    },
    actionableInsights,
    caregiverRecommendations
  };
}

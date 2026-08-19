export interface DailyMedicationAdherenceRecord {
  dayIndex: number;
  date: string; // e.g. "Jul 21", "Aug 19"
  fullDate: string; // "2026-07-21"
  dayOfWeek: 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  scheduledDoses: number;
  takenDoses: number;
  missedDoses: number;
  delayedDoses: number;
  adherencePercentage: number; // 0 - 100
  rolling7DayAvg: number;
  primaryMissedDrug?: string;
  timeSlotGap?: 'morning' | 'afternoon' | 'evening' | 'bedtime';
  patternNote?: {
    en: string;
    ar: string;
    fr: string;
  };
}

export interface AdherencePatternInsight {
  id: string;
  type: 'recurring_gap' | 'streak_positive' | 'drug_specific' | 'circadian_shift';
  severity: 'high' | 'medium' | 'low' | 'positive';
  title: {
    en: string;
    ar: string;
    fr: string;
  };
  description: {
    en: string;
    ar: string;
    fr: string;
  };
  statHighlight: string;
  recommendedAction: {
    en: string;
    ar: string;
    fr: string;
  };
}

// 30-Day detailed longitudinal adherence dataset leading up to Aug 19, 2026
export const THIRTY_DAY_MEDICATION_ADHERENCE: DailyMedicationAdherenceRecord[] = [
  // Week 1 (July 21 - July 27) - Baseline stability
  {
    dayIndex: 1,
    date: 'Jul 21',
    fullDate: '2026-07-21',
    dayOfWeek: 'Tue',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 100,
    patternNote: {
      en: 'All 5 prescribed doses confirmed on schedule.',
      ar: 'تم تأكيد تناول كافة الجرعات الخمس في مواعيدها.',
      fr: 'Toutes les 5 doses prises à l\'heure.'
    }
  },
  {
    dayIndex: 2,
    date: 'Jul 22',
    fullDate: '2026-07-22',
    dayOfWeek: 'Wed',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 100
  },
  {
    dayIndex: 3,
    date: 'Jul 23',
    fullDate: '2026-07-23',
    dayOfWeek: 'Thu',
    scheduledDoses: 5,
    takenDoses: 4,
    missedDoses: 1,
    delayedDoses: 0,
    adherencePercentage: 80,
    rolling7DayAvg: 93.3,
    primaryMissedDrug: 'Amitriptyline (25mg)',
    timeSlotGap: 'bedtime',
    patternNote: {
      en: 'Fell asleep early at 8:45 PM before evening dose.',
      ar: 'نوم مبكر الساعة 8:45 مساءً قبل موعد جرعة النوم.',
      fr: 'Endormissement précoce avant la dose du soir.'
    }
  },
  {
    dayIndex: 4,
    date: 'Jul 24',
    fullDate: '2026-07-24',
    dayOfWeek: 'Fri',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 1,
    adherencePercentage: 100,
    rolling7DayAvg: 95.0,
    timeSlotGap: 'morning',
    patternNote: {
      en: 'Friday family gathering; morning Metformin taken 45 min delayed.',
      ar: 'اجتماع العائلة يوم الجمعة؛ تأخر دواء السكري الصباحي 45 دقيقة.',
      fr: 'Réunion familiale du vendredi; dose matinale décalée de 45 min.'
    }
  },
  {
    dayIndex: 5,
    date: 'Jul 25',
    fullDate: '2026-07-25',
    dayOfWeek: 'Sat',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 96.0
  },
  {
    dayIndex: 6,
    date: 'Jul 26',
    fullDate: '2026-07-26',
    dayOfWeek: 'Sun',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 96.7
  },
  {
    dayIndex: 7,
    date: 'Jul 27',
    fullDate: '2026-07-27',
    dayOfWeek: 'Mon',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 97.1
  },

  // Week 2 (July 28 - Aug 03)
  {
    dayIndex: 8,
    date: 'Jul 28',
    fullDate: '2026-07-28',
    dayOfWeek: 'Tue',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 97.1
  },
  {
    dayIndex: 9,
    date: 'Jul 29',
    fullDate: '2026-07-29',
    dayOfWeek: 'Wed',
    scheduledDoses: 5,
    takenDoses: 4,
    missedDoses: 1,
    delayedDoses: 0,
    adherencePercentage: 80,
    rolling7DayAvg: 94.3,
    primaryMissedDrug: 'Chlorpheniramine (4mg)',
    timeSlotGap: 'afternoon',
    patternNote: {
      en: 'Afternoon rhinitis dose omitted due to absence of allergic symptoms.',
      ar: 'تخطي جرعة حساسية الأنف لعدم وجود أعراض احتقان.',
      fr: 'Dose d\'antihistaminique omise en l\'absence de symptômes.'
    }
  },
  {
    dayIndex: 10,
    date: 'Jul 30',
    fullDate: '2026-07-30',
    dayOfWeek: 'Thu',
    scheduledDoses: 5,
    takenDoses: 3,
    missedDoses: 2,
    delayedDoses: 0,
    adherencePercentage: 60,
    rolling7DayAvg: 91.4,
    primaryMissedDrug: 'Amitriptyline & Atorvastatin',
    timeSlotGap: 'bedtime',
    patternNote: {
      en: 'Evening fatigue recurrence: missed both bedtime medications.',
      ar: 'تكرار النعاس المبكر: نسيان جرعتي المساء وقبل النوم.',
      fr: 'Fatigue en soirée: deux doses du coucher oubliées.'
    }
  },
  {
    dayIndex: 11,
    date: 'Jul 31',
    fullDate: '2026-07-31',
    dayOfWeek: 'Fri',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 91.4,
    patternNote: {
      en: 'Maryam verified all evening doses in person.',
      ar: 'أكدت الابنة مريم تناول كافة الجرعات شخصياً أثناء الزيارة.',
      fr: 'Maryam a confirmé toutes les prises lors de sa visite.'
    }
  },
  {
    dayIndex: 12,
    date: 'Aug 01',
    fullDate: '2026-08-01',
    dayOfWeek: 'Sat',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 91.4
  },
  {
    dayIndex: 13,
    date: 'Aug 02',
    fullDate: '2026-08-02',
    dayOfWeek: 'Sun',
    scheduledDoses: 5,
    takenDoses: 4,
    missedDoses: 1,
    delayedDoses: 1,
    adherencePercentage: 80,
    rolling7DayAvg: 88.6,
    primaryMissedDrug: 'Lisinopril (10mg)',
    timeSlotGap: 'morning',
    patternNote: {
      en: 'Morning BP tablet delayed, taken after 11:30 AM telephone reminder.',
      ar: 'تأخر دواء الضغط الصباحي حتى تذكير الهاتف عند 11:30 صباحاً.',
      fr: 'Dose d\'antihypertenseur prise en retard après appel.'
    }
  },
  {
    dayIndex: 14,
    date: 'Aug 03',
    fullDate: '2026-08-03',
    dayOfWeek: 'Mon',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 88.6
  },

  // Week 3 (Aug 04 - Aug 10) - Anticholinergic spike period
  {
    dayIndex: 15,
    date: 'Aug 04',
    fullDate: '2026-08-04',
    dayOfWeek: 'Tue',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 88.6
  },
  {
    dayIndex: 16,
    date: 'Aug 05',
    fullDate: '2026-08-05',
    dayOfWeek: 'Wed',
    scheduledDoses: 5,
    takenDoses: 4,
    missedDoses: 1,
    delayedDoses: 0,
    adherencePercentage: 80,
    rolling7DayAvg: 88.6,
    primaryMissedDrug: 'Amitriptyline (25mg)',
    timeSlotGap: 'bedtime'
  },
  {
    dayIndex: 17,
    date: 'Aug 06',
    fullDate: '2026-08-06',
    dayOfWeek: 'Thu',
    scheduledDoses: 5,
    takenDoses: 3,
    missedDoses: 2,
    delayedDoses: 0,
    adherencePercentage: 60,
    rolling7DayAvg: 88.6,
    primaryMissedDrug: 'Amitriptyline & Chlorpheniramine',
    timeSlotGap: 'bedtime',
    patternNote: {
      en: 'Thursday compliance gap: second consecutive Thursday dip.',
      ar: 'فجوة التزام مساء الخميس: هبوط متكرر للأسبوع الثاني على التوالي.',
      fr: 'Baisse d\'observance récurrente le jeudi soir.'
    }
  },
  {
    dayIndex: 18,
    date: 'Aug 07',
    fullDate: '2026-08-07',
    dayOfWeek: 'Fri',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 88.6
  },
  {
    dayIndex: 19,
    date: 'Aug 08',
    fullDate: '2026-08-08',
    dayOfWeek: 'Sat',
    scheduledDoses: 5,
    takenDoses: 4,
    missedDoses: 1,
    delayedDoses: 0,
    adherencePercentage: 80,
    rolling7DayAvg: 85.7,
    primaryMissedDrug: 'Chlorpheniramine',
    timeSlotGap: 'afternoon'
  },
  {
    dayIndex: 20,
    date: 'Aug 09',
    fullDate: '2026-08-09',
    dayOfWeek: 'Sun',
    scheduledDoses: 5,
    takenDoses: 4,
    missedDoses: 1,
    delayedDoses: 1,
    adherencePercentage: 80,
    rolling7DayAvg: 85.7,
    primaryMissedDrug: 'Lisinopril',
    timeSlotGap: 'morning'
  },
  {
    dayIndex: 21,
    date: 'Aug 10',
    fullDate: '2026-08-10',
    dayOfWeek: 'Mon',
    scheduledDoses: 5,
    takenDoses: 4,
    missedDoses: 1,
    delayedDoses: 0,
    adherencePercentage: 80,
    rolling7DayAvg: 82.9,
    primaryMissedDrug: 'Amitriptyline',
    timeSlotGap: 'bedtime'
  },

  // Week 4 & Recent (Aug 11 - Aug 19)
  {
    dayIndex: 22,
    date: 'Aug 11',
    fullDate: '2026-08-11',
    dayOfWeek: 'Tue',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 82.9
  },
  {
    dayIndex: 23,
    date: 'Aug 12',
    fullDate: '2026-08-12',
    dayOfWeek: 'Wed',
    scheduledDoses: 5,
    takenDoses: 4,
    missedDoses: 1,
    delayedDoses: 0,
    adherencePercentage: 80,
    rolling7DayAvg: 82.9,
    primaryMissedDrug: 'Chlorpheniramine',
    timeSlotGap: 'afternoon'
  },
  {
    dayIndex: 24,
    date: 'Aug 13',
    fullDate: '2026-08-13',
    dayOfWeek: 'Thu',
    scheduledDoses: 5,
    takenDoses: 3,
    missedDoses: 2,
    delayedDoses: 0,
    adherencePercentage: 60,
    rolling7DayAvg: 82.9,
    primaryMissedDrug: 'Amitriptyline & Atorvastatin',
    timeSlotGap: 'bedtime',
    patternNote: {
      en: 'Clear recurring Thursday night bedtime gap pattern confirmed.',
      ar: 'تأكيد وجود نمط فجوة متكرر مساء كل خميس في أدوية ما قبل النوم.',
      fr: 'Confirmation d\'un modèle d\'oubli récurrent le jeudi soir.'
    }
  },
  {
    dayIndex: 25,
    date: 'Aug 14',
    fullDate: '2026-08-14',
    dayOfWeek: 'Fri',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 82.9
  },
  {
    dayIndex: 26,
    date: 'Aug 15',
    fullDate: '2026-08-15',
    dayOfWeek: 'Sat',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 85.7
  },
  {
    dayIndex: 27,
    date: 'Aug 16',
    fullDate: '2026-08-16',
    dayOfWeek: 'Sun',
    scheduledDoses: 5,
    takenDoses: 4,
    missedDoses: 1,
    delayedDoses: 0,
    adherencePercentage: 80,
    rolling7DayAvg: 85.7,
    primaryMissedDrug: 'Chlorpheniramine',
    timeSlotGap: 'afternoon'
  },
  {
    dayIndex: 28,
    date: 'Aug 17',
    fullDate: '2026-08-17',
    dayOfWeek: 'Mon',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 88.6
  },
  {
    dayIndex: 29,
    date: 'Aug 18',
    fullDate: '2026-08-18',
    dayOfWeek: 'Tue',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 88.6
  },
  {
    dayIndex: 30,
    date: 'Aug 19',
    fullDate: '2026-08-19',
    dayOfWeek: 'Wed',
    scheduledDoses: 5,
    takenDoses: 5,
    missedDoses: 0,
    delayedDoses: 0,
    adherencePercentage: 100,
    rolling7DayAvg: 91.4,
    patternNote: {
      en: 'Today: 100% adherence maintained with automated voice check-in.',
      ar: 'اليوم: التزام كامل بنسبة 100% بدعم التذكير الصوتي التلقائي.',
      fr: 'Aujourd\'hui: 100% d\'observance avec l\'accompagnement vocal.'
    }
  }
];

export const ADHERENCE_PATTERN_INSIGHTS: AdherencePatternInsight[] = [
  {
    id: 'pattern-thursday-bedtime',
    type: 'recurring_gap',
    severity: 'high',
    title: {
      en: 'Recurring Thursday Bedtime Gap Pattern',
      ar: 'نمط فجوة متكرر مساء كل خميس قبل النوم',
      fr: 'Oubli récurrent du jeudi soir au coucher'
    },
    description: {
      en: 'Adherence drops to 60% on 3 out of the last 4 Thursdays due to early fatigue before the 10:00 PM Amitriptyline/Atorvastatin dosage window.',
      ar: 'ينخفض معدل الالتزام إلى 60% في 3 من آخر 4 أيام خميس بسبب استغراق الوالدة في النوم مبكراً قبل نافذة جرعات الساعة 10:00 مساءً.',
      fr: 'L\'observance chute à 60% 3 jeudis sur 4 en raison d\'une fatigue précoce avant 22h00.'
    },
    statHighlight: '75% gap rate on Thursday evenings',
    recommendedAction: {
      en: 'Shift bedtime voice prompt 45 minutes earlier (9:15 PM) on Thursdays, or have Maryam confirm via smart speaker.',
      ar: 'تقديم موعد التنبيه الصوتي لجرعات الخميس 45 دقيقة (الساعة 9:15 مساءً) أو تفعيل التذكير عبر المساعد الذكي.',
      fr: 'Avancer le rappel vocal du jeudi de 45 min (21h15) ou confirmation par un proche.'
    }
  },
  {
    id: 'pattern-afternoon-rhinitis',
    type: 'drug_specific',
    severity: 'medium',
    title: {
      en: 'Selective Omission of PRN Antihistamine',
      ar: 'تخطي انتقائي لدواء الحساسية غير المجدول',
      fr: 'Omission sélective de l\'antihistaminique PRN'
    },
    description: {
      en: 'Chlorpheniramine (4mg) accounts for 44% of all missed doses over 30 days, primarily when the senior experiences no acute allergic rhinitis.',
      ar: 'يمثل دواء Chlorpheniramine نسبة 44% من كافة الجرعات المتخطاة، وتحدث غالباً في الأيام الخالية من أعراض الحساسية.',
      fr: 'Le chlorphéniramine représente 44% des doses manquées lorsque les symptômes sont absents.'
    },
    statHighlight: '44% of total skipped doses',
    recommendedAction: {
      en: 'Discuss converting Chlorpheniramine to PRN status in EHR with Dr. Sarah to avoid false non-adherence alerts.',
      ar: 'مناقشة تحويل الدواء إلى وصفة عند اللزوم (PRN) في السجل الطبي مع الطبيب لتفادي احتسابها كفجوة التزام.',
      fr: 'Valider le statut "au besoin" dans le dossier médical avec le médecin traitant.'
    }
  },
  {
    id: 'pattern-positive-streak',
    type: 'streak_positive',
    severity: 'positive',
    title: {
      en: 'Strong 6-Day Active Compliance Streak',
      ar: 'سلسلة التزام ممتازة ومستقرة لـ 6 أيام متواصلة',
      fr: 'Excellente série d\'observance de 6 jours'
    },
    description: {
      en: 'Following the implementation of morning voice reminders, essential cardiovascular and glycemic medications achieved 100% compliance across the last 6 days.',
      ar: 'منذ تفعيل التذكيرات الصوتية الصباحية الذكية، حققت أدوية الضغط والسكري التزاماً تاماً بنسبة 100% خلال الأيام الستة الماضية.',
      fr: 'Grâce aux rappels vocaux matinaux, 100% de conformité sur les médicaments essentiels ces 6 derniers jours.'
    },
    statHighlight: '100% over the last 6 consecutive days',
    recommendedAction: {
      en: 'Maintain current morning conversational prompts and positive reinforcement through the Family Portal.',
      ar: 'الاستمرار في نبرة التشجيع الصباحية الدافئة والتأكيد عبر بوابة العائلة.',
      fr: 'Maintenir la routine de rappels matinaux positifs.'
    }
  }
];

export const TIME_OF_DAY_COMPLIANCE_BREAKDOWN = [
  { slot: 'Morning (08:00 AM)', nameEn: 'Morning (8:00 AM)', nameAr: 'الصباح (8:00 ص)', adherence: 96.7, scheduledCount: 60, takenCount: 58, primaryMeds: 'Lisinopril, Metformin' },
  { slot: 'Afternoon (02:00 PM)', nameEn: 'Afternoon (2:00 PM)', nameAr: 'الظهيرة (2:00 م)', adherence: 80.0, scheduledCount: 30, takenCount: 24, primaryMeds: 'Chlorpheniramine' },
  { slot: 'Evening / Bedtime (10:00 PM)', nameEn: 'Bedtime (10:00 PM)', nameAr: 'المساء وقبل النوم (10:00 م)', adherence: 76.7, scheduledCount: 60, takenCount: 46, primaryMeds: 'Amitriptyline, Atorvastatin' },
];

export const DAY_OF_WEEK_ADHERENCE = [
  { day: 'Sun', nameEn: 'Sunday', nameAr: 'الأحد', avgAdherence: 85.0, riskLevel: 'moderate' },
  { day: 'Mon', nameEn: 'Monday', nameAr: 'الاثنين', avgAdherence: 95.0, riskLevel: 'low' },
  { day: 'Tue', nameEn: 'Tuesday', nameAr: 'الثلاثاء', avgAdherence: 100.0, riskLevel: 'low' },
  { day: 'Wed', nameEn: 'Wednesday', nameAr: 'الأربعاء', avgAdherence: 85.0, riskLevel: 'moderate' },
  { day: 'Thu', nameEn: 'Thursday', nameAr: 'الخميس', avgAdherence: 65.0, riskLevel: 'high' },
  { day: 'Fri', nameEn: 'Friday', nameAr: 'الجمعة', avgAdherence: 100.0, riskLevel: 'low' },
  { day: 'Sat', nameEn: 'Saturday', nameAr: 'السبت', avgAdherence: 95.0, riskLevel: 'low' },
];

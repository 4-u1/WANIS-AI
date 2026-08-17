import { 
  SeniorProfile, 
  Medication, 
  LongitudinalMetrics, 
  CheckInRecord, 
  CareCircleMember, 
  DoctorBriefData, 
  RufqaPilgrimState, 
  CareLoopEvent, 
  ConsentSetting,
  ConsentMatrix
} from '../types';

export const INITIAL_SENIOR_PROFILE: SeniorProfile = {
  id: 'senior-001',
  fullName: 'Fatima Al-Hashemi',
  preferredName: 'Hajjah Fatima',
  age: 76,
  gender: 'female',
  languages: ['ar', 'en'],
  primaryLanguage: 'ar',
  photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
  baselineSummary: 'Independent older adult, high baseline social engagement, mild forgetfulness during evenings, history of controlled hypertension and seasonal allergies.',
  currentTriage: 'YELLOW',
  lastCheckInTime: 'Today at 08:30 AM',
  emergencyContacts: [
    {
      name: 'Maryam Al-Hashemi',
      relationship: 'Daughter & Primary Caregiver',
      phone: '+966 50 123 4567',
      isPrimary: true,
      notifyOnTriage: ['YELLOW', 'ORANGE', 'RED']
    },
    {
      name: 'Tariq Al-Hashemi',
      relationship: 'Son (Emergency Standby)',
      phone: '+966 55 987 6543',
      isPrimary: false,
      notifyOnTriage: ['ORANGE', 'RED']
    }
  ],
  primaryPhysician: {
    name: 'Dr. Sarah Al-Khatib, MD',
    specialty: 'Geriatric Medicine & Neuro-Cognitive Care',
    clinic: 'King Faisal Specialist Hospital Geriatric Clinic',
    phone: '+966 11 464 7272',
    ehrId: 'KFSH-GER-94821'
  }
};

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-01',
    name: 'Amitriptyline',
    genericName: 'Amitriptyline Hydrochloride',
    dosage: '25 mg',
    frequency: 'Once nightly at bedtime',
    acbScore: 3,
    drugClass: 'Tricyclic Antidepressant / Neuropathic Pain Modulator',
    indication: 'Peripheral tingling & sleep initiation',
    clinicalExplanation: 'Potent central and peripheral anticholinergic agent (Score 3). May induce morning confusion, delayed processing speed, dry mouth, and postural dizziness in older adults.',
    saferAlternatives: ['Melatonin receptor agonists', 'SSRI/SNRI with ACB=0 (e.g. Escitalopram)', 'Gabapentin (low dose with renal monitoring)'],
    lastTaken: 'Yesterday 10:15 PM',
    isTakenToday: true
  },
  {
    id: 'med-02',
    name: 'Chlorpheniramine',
    genericName: 'Chlorpheniramine Maleate',
    dosage: '4 mg',
    frequency: 'As needed for seasonal rhinitis',
    acbScore: 1,
    drugClass: 'First-Generation H1 Antihistamine',
    indication: 'Allergic rhinitis & eye irritation',
    clinicalExplanation: 'Mild anticholinergic activity (Score 1). Crosses blood-brain barrier readily, compounding sedation and additive anticholinergic cognitive burden when combined with Amitriptyline.',
    saferAlternatives: ['Cetirizine (2nd gen, ACB 0)', 'Fexofenadine (ACB 0)', 'Fluticasone nasal spray'],
    lastTaken: 'Yesterday 02:00 PM',
    isTakenToday: false
  },
  {
    id: 'med-03',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    dosage: '500 mg',
    frequency: 'Twice daily with meals',
    acbScore: 0,
    drugClass: 'Biguanide Antidiabetic',
    indication: 'Type 2 Diabetes Glycemic Control',
    clinicalExplanation: 'Zero anticholinergic burden (Score 0). Safe for cognitive baseline, maintains metabolic stability.',
    saferAlternatives: [],
    lastTaken: 'Today 08:45 AM',
    isTakenToday: true
  },
  {
    id: 'med-04',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    dosage: '20 mg',
    frequency: 'Once daily in evening',
    acbScore: 0,
    drugClass: 'HMG-CoA Reductase Inhibitor',
    indication: 'Cardiovascular risk reduction & lipid control',
    clinicalExplanation: 'Zero anticholinergic burden (Score 0). Established neurovascular protective profile.',
    saferAlternatives: [],
    lastTaken: 'Yesterday 09:00 PM',
    isTakenToday: true
  },
  {
    id: 'med-05',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    dosage: '10 mg',
    frequency: 'Once daily in morning',
    acbScore: 0,
    drugClass: 'ACE Inhibitor',
    indication: 'Essential Hypertension',
    clinicalExplanation: 'Zero anticholinergic burden (Score 0). Supports steady blood pressure control.',
    saferAlternatives: [],
    lastTaken: 'Today 08:45 AM',
    isTakenToday: true
  }
];

export const INITIAL_LONGITUDINAL_DATA: LongitudinalMetrics[] = [
  { date: 'Aug 04', moodScore: 8.5, sleepQuality: 8.2, sleepHours: 7.5, fatigueScore: 2.1, memoryConcernCount: 0, socialEngagementScore: 8.8, functionalScore: 9.5, acbCumulative: 0, triageLevel: 'GREEN' },
  { date: 'Aug 06', moodScore: 8.2, sleepQuality: 8.0, sleepHours: 7.2, fatigueScore: 2.4, memoryConcernCount: 0, socialEngagementScore: 9.0, functionalScore: 9.2, acbCumulative: 0, triageLevel: 'GREEN' },
  { date: 'Aug 08', moodScore: 8.0, sleepQuality: 7.8, sleepHours: 7.0, fatigueScore: 2.8, memoryConcernCount: 0, socialEngagementScore: 8.5, functionalScore: 9.0, acbCumulative: 3, triageLevel: 'GREEN' },
  { date: 'Aug 10', moodScore: 7.4, sleepQuality: 6.9, sleepHours: 6.2, fatigueScore: 4.1, memoryConcernCount: 1, socialEngagementScore: 7.8, functionalScore: 8.8, acbCumulative: 3, triageLevel: 'YELLOW' },
  { date: 'Aug 12', moodScore: 6.8, sleepQuality: 5.8, sleepHours: 5.5, fatigueScore: 5.6, memoryConcernCount: 2, socialEngagementScore: 6.9, functionalScore: 8.2, acbCumulative: 4, triageLevel: 'YELLOW' },
  { date: 'Aug 14', moodScore: 6.2, sleepQuality: 5.1, sleepHours: 4.8, fatigueScore: 6.8, memoryConcernCount: 3, socialEngagementScore: 6.0, functionalScore: 7.8, acbCumulative: 4, triageLevel: 'YELLOW' },
  { date: 'Aug 16', moodScore: 6.0, sleepQuality: 4.6, sleepHours: 4.2, fatigueScore: 7.2, memoryConcernCount: 4, socialEngagementScore: 5.8, functionalScore: 7.5, acbCumulative: 4, triageLevel: 'YELLOW' }
];

export const INITIAL_CHECKINS: CheckInRecord[] = [
  {
    id: 'chk-01',
    timestamp: '2026-08-16T08:30:00Z',
    transcript: 'صباح الخير ونيس. نمت بشكل متقطع البارحة بسبب حساسية الأنف، واستيقظت وأنا أشعر بثقل خفيف في رأسي ونسيت أين وضعت مسبحتي لوهلة. لكن الحمد لله قرأت وردي الصباحي.',
    sentiment: 'subdued',
    moodScore: 6,
    sleepHours: 4.5,
    sleepQuality: 5,
    fatigueScore: 7,
    memoryMentioned: true,
    socialContact: true,
    triageLevel: 'YELLOW',
    agentResponse: 'صباح النور يا والدتي العزيزة. حفظكِ الله ويسّر أمرك. سجلت شعورك بالثقل الصباحي وتقطع النوم، وسأذكرك برشفات ماء دافئة مع راحة خفيفة بعد صلاة الظهر.',
    keyObservations: [
      'Sleep fragmentation (4.5h) following PRN antihistamine consumption',
      'Mild transient memory latency (misplaced prayer beads)',
      'Spiritual and emotional resilience maintained'
    ],
    consentTierUsed: 'FAMILY_SUPPORT'
  },
  {
    id: 'chk-02',
    timestamp: '2026-08-14T09:15:00Z',
    transcript: 'Hello Wanis, I am feeling a bit tired today. My daughter Maryam brought over lunch, but I felt slightly dizzy when standing up from the prayer rug.',
    sentiment: 'subdued',
    moodScore: 6.5,
    sleepHours: 5.2,
    sleepQuality: 5.5,
    fatigueScore: 6.2,
    memoryMentioned: false,
    socialContact: true,
    triageLevel: 'YELLOW',
    agentResponse: 'Blessings to you, Hajjah Fatima. It is wonderful that Maryam visited. Please take your time standing up slowly to let your blood pressure adjust comfortably.',
    keyObservations: [
      'Postural dizziness upon rising noted (potential orthostatic effect of anticholinergic burden)',
      'Positive family social interaction'
    ],
    consentTierUsed: 'FAMILY_SUPPORT'
  }
];

export const INITIAL_CARE_CIRCLE: CareCircleMember[] = [
  {
    id: 'circle-01',
    name: 'Maryam Al-Hashemi',
    relation: 'Daughter',
    role: 'PRIMARY_CAREGIVER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    phone: '+966 50 123 4567',
    consentTierGranted: 'FAMILY_SUPPORT',
    notificationsEnabled: true,
    lastActive: '12 mins ago'
  },
  {
    id: 'circle-02',
    name: 'Tariq Al-Hashemi',
    relation: 'Son',
    role: 'FAMILY_MEMBER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    phone: '+966 55 987 6543',
    consentTierGranted: 'FAMILY_SUPPORT',
    notificationsEnabled: true,
    lastActive: '2 hours ago'
  },
  {
    id: 'circle-03',
    name: 'Dr. Sarah Al-Khatib',
    relation: 'Geriatrician',
    role: 'CLINICIAN',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
    phone: '+966 11 464 7272',
    consentTierGranted: 'CLINICAL_SHARING',
    notificationsEnabled: true,
    lastActive: 'Yesterday'
  }
];

export const INITIAL_DOCTOR_BRIEF: DoctorBriefData = {
  id: 'db-2026-0816',
  patientName: 'Fatima Al-Hashemi',
  age: 76,
  gender: 'Female',
  generatedDate: '2026-08-16',
  reportingPeriod: '14-Day Longitudinal Window (Aug 02 - Aug 16, 2026)',
  summaryExecutive: 'Hajjah Fatima shows a noticeable 18% decline in self-reported sleep quality and morning alertness over the past 6 days, temporalizing with concurrent PRN Chlorpheniramine additions to baseline Amitriptyline. Total ACB score is 4 (High Risk). Patient notes mild dizziness upon standing and episodic delayed recall.',
  baselineDelta: {
    moodVariance: '-14% (mild evening fatigue)',
    sleepQualityDelta: '-22% (sleep fragmentation to 4.5h/night)',
    memoryLapseIncidents: 4,
    socialConnectedness: 'Stable (Active family engagement)',
    functionalIndependence: 'Independent with ADL score 8.2/10'
  },
  acbSummary: {
    totalScore: 4,
    riskCategory: 'High Risk Cognitive Burden (3+)',
    contributingDrugs: [
      {
        name: 'Amitriptyline 25mg (Nightly)',
        acb: 3,
        category: 'Tricyclic Antidepressant',
        impact: 'Potent central muscarinic M1/M3 antagonism; known to impair memory consolidation and cause orthostasis.'
      },
      {
        name: 'Chlorpheniramine 4mg (PRN)',
        acb: 1,
        category: '1st Gen Antihistamine',
        impact: 'Additive cholinergic blockade; exacerbates sedation, next-morning brain fog, and intra-ocular pressure.'
      }
    ]
  },
  patientVerbatimQuotes: [
    '"I felt like a heavy fog was in my head around 10 AM, and I hesitated before remembering where I left my glasses."',
    '"When standing up from my prayer mat yesterday, the room spun slightly for ten seconds."'
  ],
  clinicianDiscussionPrompts: [
    'Review indications for Amitriptyline: Consider deprescribing trial or switching to low-burden alternative (e.g. low-dose Melatonin agonist or Gabapentinoid with strict renal dosing).',
    'Deprescribe first-generation antihistamine Chlorpheniramine in favor of second-generation non-sedating Cetirizine (ACB=0) or nasal steroid.',
    'Perform orthostatic vitals check (supine vs standing BP) to evaluate fall risk from anticholinergic vasodilation.'
  ],
  suggestedAreasForReview: [
    'Cognitive screening (MoCA / Mini-Cog) reassessment',
    'Fall risk screening & home hazard check',
    'Medication reconciliation & deprescribing roadmap'
  ],
  safetyFlags: [
    'High ACB burden (Score = 4) carries statistically elevated hazard ratio (HR 1.48) for reversible cognitive impairment.',
    'Self-reported orthostatic dizziness during prayer transitions.'
  ],
  dataProvenance: {
    source: 'WanisAI Multi-Signal Continuous Care Loop (14 daily voice check-ins & sensor baseline)',
    dataPointsAnalyzed: 56,
    confidenceRating: '97.2%',
    hash: 'SHA256: 9e4a8b71d23f8c09a834e56b',
    auditStatus: 'Patient Consented (Tier 3: Clinical Sharing Granted)'
  }
};

export const INITIAL_RUFQA_STATE: RufqaPilgrimState = {
  pilgrimName: 'Fatima Al-Hashemi',
  passportCountry: 'Saudi Arabia / Jeddah Resident',
  campaignNumber: 'Tawafa Campaign #420 (Al-Wafaa VIP)',
  tawafaGroupLeader: {
    name: 'Ustadh Ahmad Al-Ghamdi',
    phone: '+966 50 555 1212',
    campNumberMina: 'Camp 42, Street 204 (Near Jamarat Plaza)'
  },
  currentLocationName: 'Mecca - Grand Mosque Courtyard (Near King Fahd Gate #79)',
  gpsCoordinates: { lat: 21.4225, lng: 39.8262 },
  hotelDetails: {
    name: 'Swissôtel Makkah (Clock Tower Complex)',
    landmark: 'Abraj Al-Bait, King Abdulaziz Endowment',
    roomNumber: 'Tower 3, Room 1408',
    phone: '+966 12 571 8000'
  },
  meetingPointHaram: {
    gateNumber: 'Gate 79',
    gateName: 'King Fahd Main Gate',
    pillarId: 'Green Column Pillar #C-14 (Upper Plaza)'
  },
  criticalMedicalBadges: [
    'Hypertension (Controlled)',
    'Mild Heat Sensitivity / Hydration Alert',
    'Carries Nitroglycerin & Water Bottle'
  ],
  isLostModeActive: false,
  lastBeaconBroadcast: undefined,
  emergencyLanguageCards: [
    {
      language: 'العربية (Arabic)',
      title: 'بطاقة الحاج الطارئة',
      text: 'أنا الحاجة فاطمة الهاشمي، حملة رقم 420. يرجى مساعَدتي للوصول إلى فندق سويس أوتيل برج الساعة أو الاتصال بالمطوف: 0505551212',
      phonetic: 'Ana al-Hajjah Fatima, Hamla 420. Yurja mosa\'adati lil-wusul ila Swissotel.'
    },
    {
      language: 'English',
      title: 'Pilgrim Emergency Card',
      text: 'I am Pilgrim Fatima Al-Hashemi, Group #420. Please help guide me to Swissôtel Clock Tower or contact my group leader at +966 50 555 1212.',
      phonetic: 'Ay am pil-grim Fa-ti-ma, grup for-twen-ti.'
    },
    {
      language: 'اردو (Urdu)',
      title: 'حاجی ہنگامی کارڈ',
      text: 'میں حاجی فاطمہ الہاشمی ہوں، قافلہ نمبر 420۔ براہ کرم مجھے سوئس ہوٹل گھڑیال ٹاور پہنچانے میں مدد کریں یا امیر قافلہ سے 0505551212 پر رابطہ کریں۔',
      phonetic: 'Main Haji Fatima hoon, Qafila number 420.'
    },
    {
      language: 'Français (French)',
      title: 'Carte d\'Urgence Pèlerin',
      text: 'Je suis la pèlerine Fatima Al-Hashemi, Groupe #420. Veuillez m\'aider à rejoindre le Swissôtel Clock Tower ou appeler mon guide au +966 50 555 1212.'
    }
  ]
};

export const INITIAL_CARE_LOOP_EVENTS: CareLoopEvent[] = [
  {
    id: 'loop-08',
    timestamp: 'Just now',
    stage: 'LEARN',
    title: 'Model Parameter Calibration',
    description: 'Updated Fatima baseline: morning alertness is sensitive to ambient sleep noise & PRN antihistamine timing.',
    triage: 'GREEN',
    confidenceScore: 0.96,
    actor: 'AI_ORCHESTRATOR',
    consentTier: 'PRIVATE',
    requiresHumanReview: false
  },
  {
    id: 'loop-07',
    timestamp: '10 mins ago',
    stage: 'FOLLOW_UP',
    title: 'Post-Check-in Hydration & Rest Check',
    description: 'Scheduled gentle reminder at 01:30 PM to verify senior had 500ml water and rested.',
    triage: 'GREEN',
    confidenceScore: 0.94,
    actor: 'AI_ORCHESTRATOR',
    consentTier: 'FAMILY_SUPPORT',
    requiresHumanReview: false
  },
  {
    id: 'loop-06',
    timestamp: '25 mins ago',
    stage: 'SHARE',
    title: 'Care Circle Notification Dispatched',
    description: 'Sent summary digest to Maryam (Daughter): "Mother completed morning check-in; noted mild tiredness."',
    triage: 'YELLOW',
    confidenceScore: 0.98,
    actor: 'AI_ORCHESTRATOR',
    consentTier: 'FAMILY_SUPPORT',
    requiresHumanReview: false
  },
  {
    id: 'loop-05',
    timestamp: '35 mins ago',
    stage: 'ACT',
    title: 'Doctor Brief 2.0 Draft Prepared',
    description: 'Synthesized 14-day medication burden correlation ready for Dr. Sarah Al-Khatib review.',
    triage: 'YELLOW',
    confidenceScore: 0.95,
    actor: 'AI_ORCHESTRATOR',
    consentTier: 'CLINICAL_SHARING',
    requiresHumanReview: true
  },
  {
    id: 'loop-04',
    timestamp: '40 mins ago',
    stage: 'RECOMMEND',
    title: 'Clinician Deprescribing Review Suggested',
    description: 'Triggered suggestion to discuss replacing Amitriptyline / Chlorpheniramine with zero-ACB alternatives.',
    triage: 'YELLOW',
    confidenceScore: 0.93,
    actor: 'AI_ORCHESTRATOR',
    consentTier: 'CLINICAL_SHARING',
    requiresHumanReview: true
  },
  {
    id: 'loop-03',
    timestamp: '45 mins ago',
    stage: 'ASSESS',
    title: 'ACB Score Elevated (Score 4/3)',
    description: 'Calculated cumulative burden: Amitriptyline (3) + Chlorpheniramine (1). Flags high risk of anticholinergic sedation.',
    triage: 'YELLOW',
    confidenceScore: 0.99,
    actor: 'AI_ORCHESTRATOR',
    consentTier: 'PRIVATE',
    requiresHumanReview: false
  },
  {
    id: 'loop-02',
    timestamp: '50 mins ago',
    stage: 'UNDERSTAND',
    title: 'NLP Sentiment & Cognitive Signal Extraction',
    description: 'Voice transcript parsed: sleep fragmentation (4.5h), brain fog, misplaced prayer beads.',
    triage: 'YELLOW',
    confidenceScore: 0.92,
    actor: 'AI_ORCHESTRATOR',
    consentTier: 'PRIVATE',
    requiresHumanReview: false
  },
  {
    id: 'loop-01',
    timestamp: '55 mins ago',
    stage: 'OBSERVE',
    title: 'Morning Voice Check-in Recorded',
    description: 'Captured 42-second Arabic spoken check-in from senior companion device.',
    triage: 'GREEN',
    confidenceScore: 1.0,
    actor: 'SENIOR',
    consentTier: 'PRIVATE',
    requiresHumanReview: false
  }
];

export const INITIAL_CONSENT_SETTINGS: ConsentSetting[] = [
  {
    tier: 'PRIVATE',
    label: 'Tier 1: Private (Senior Only)',
    description: 'Raw voice audio, unsummarized personal thoughts, and private reflections stay encrypted on-device. No external sharing.',
    isEnabled: true,
    accessibleBy: ['Hajjah Fatima (Senior)'],
    dataElementsIncluded: ['Full voice recordings', 'Personal diary reflections', 'Unfiltered conversational chat'],
    lastModified: '2026-08-01'
  },
  {
    tier: 'FAMILY_SUPPORT',
    label: 'Tier 2: Family Support Circle',
    description: 'Share wellness highlights, daily check-in completion status, mood trends, and safety check-ins with designated family caregivers.',
    isEnabled: true,
    accessibleBy: ['Maryam Al-Hashemi (Daughter)', 'Tariq Al-Hashemi (Son)'],
    dataElementsIncluded: ['Daily check-in status', 'Sleep duration', 'Hydration reminders', 'Mood summary', 'Yellow/Orange alerts'],
    lastModified: '2026-08-01'
  },
  {
    tier: 'CLINICAL_SHARING',
    label: 'Tier 3: Clinical & Physician Sharing',
    description: 'Generate structured Doctor Briefs, medication ACB burden audits, and longitudinal trends directly accessible to verified healthcare providers.',
    isEnabled: true,
    accessibleBy: ['Dr. Sarah Al-Khatib (Geriatrician)', 'King Faisal Specialist Hospital EHR'],
    dataElementsIncluded: ['Doctor Brief 2.0', 'Longitudinal baseline deltas', 'Medication reconciliation list', 'Cumulative ACB score', 'Verbatim symptom quotes'],
    lastModified: '2026-08-01'
  },
  {
    tier: 'EMERGENCY_SHARING',
    label: 'Tier 4: Emergency First Responders',
    description: 'Immediate uninhibited broadcast of GPS coordinates, vital medical conditions, medication list, and emergency contacts to Saudi Red Crescent / Paramedics upon Red Triage trigger or "I\'m Lost" activation.',
    isEnabled: true,
    accessibleBy: ['Saudi Red Crescent (997)', 'Haram Emergency Security', 'Tawafa Group Leader', 'Primary Family Contact'],
    dataElementsIncluded: ['Live GPS coordinates', 'Blood type & chronic conditions', 'Current medication list', 'Allergies', 'Emergency contact phone numbers'],
    lastModified: '2026-08-01'
  }
];

export const MOCK_CONSENT_MATRIX: ConsentMatrix = {
  tier1Private: { enabled: true, lastUpdated: '2026-08-01' },
  tier2Family: { enabled: true, lastUpdated: '2026-08-01' },
  tier3Clinical: { enabled: true, lastUpdated: '2026-08-01' },
  tier4Emergency: { enabled: true, lastUpdated: '2026-08-01' },
};

// Aliases for compatibility
export const MOCK_SENIOR_PROFILE = INITIAL_SENIOR_PROFILE;
export const MOCK_MEDICATIONS = INITIAL_MEDICATIONS;
export const MOCK_LONGITUDINAL_DATA = INITIAL_LONGITUDINAL_DATA;
export const MOCK_CHECKINS = INITIAL_CHECKINS;
export const MOCK_CARE_CIRCLE = INITIAL_CARE_CIRCLE;
export const MOCK_DOCTOR_BRIEF = INITIAL_DOCTOR_BRIEF;
export const MOCK_RUFQA_STATE = INITIAL_RUFQA_STATE;
export const MOCK_CARE_LOOP_EVENTS = INITIAL_CARE_LOOP_EVENTS;
export const MOCK_CONSENT_SETTINGS = INITIAL_CONSENT_SETTINGS;


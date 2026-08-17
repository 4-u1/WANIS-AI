export type TriageLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export type ConsentTier = 'PRIVATE' | 'FAMILY_SUPPORT' | 'CLINICAL_SHARING' | 'EMERGENCY_SHARING';

export type CareLoopStage = 
  | 'OBSERVE' 
  | 'UNDERSTAND' 
  | 'ASSESS' 
  | 'RECOMMEND' 
  | 'ACT' 
  | 'SHARE' 
  | 'FOLLOW_UP' 
  | 'LEARN';

export type PersonaMode = 'senior' | 'family' | 'clinician' | 'rufqa' | 'orchestrator' | 'investor';

export type SupportedLanguage = 'en' | 'ar' | 'fr';

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  acbScore: 0 | 1 | 2 | 3;
  drugClass: string;
  indication: string;
  clinicalExplanation: string;
  saferAlternatives: string[];
  lastTaken?: string;
  isTakenToday: boolean;
}

export interface LongitudinalMetrics {
  date: string;
  moodScore: number; // 1-10
  sleepQuality: number; // 1-10
  sleepHours: number;
  fatigueScore: number; // 1-10 (10 = exhausted)
  memoryConcernCount: number;
  socialEngagementScore: number; // 1-10
  functionalScore: number; // ADL score 1-10
  acbCumulative: number;
  triageLevel: TriageLevel;
}

export interface CheckInRecord {
  id: string;
  timestamp: string;
  transcript: string;
  audioDurationSeconds?: number;
  sentiment: 'positive' | 'subdued' | 'concerning' | 'distressed';
  moodScore: number;
  sleepHours: number;
  sleepQuality: number;
  fatigueScore: number;
  memoryMentioned: boolean;
  socialContact: boolean;
  triageLevel: TriageLevel;
  agentResponse: string;
  keyObservations: string[];
  consentTierUsed: ConsentTier;
}

export interface SeniorProfile {
  id: string;
  fullName: string;
  preferredName: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  languages: SupportedLanguage[];
  primaryLanguage: SupportedLanguage;
  photoUrl: string;
  baselineSummary: string;
  currentTriage: TriageLevel;
  lastCheckInTime: string;
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
    isPrimary: boolean;
    notifyOnTriage: TriageLevel[];
  }[];
  primaryPhysician: {
    name: string;
    specialty: string;
    clinic: string;
    phone: string;
    ehrId: string;
  };
}

export interface CareCircleMember {
  id: string;
  name: string;
  relation: string;
  role: 'PRIMARY_CAREGIVER' | 'FAMILY_MEMBER' | 'VISITING_NURSE' | 'CLINICIAN';
  avatar: string;
  phone: string;
  consentTierGranted: ConsentTier;
  notificationsEnabled: boolean;
  lastActive: string;
}

export interface DoctorBriefData {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  generatedDate: string;
  reportingPeriod: string;
  summaryExecutive: string;
  baselineDelta: {
    moodVariance: string;
    sleepQualityDelta: string;
    memoryLapseIncidents: number;
    socialConnectedness: string;
    functionalIndependence: string;
  };
  acbSummary: {
    totalScore: number;
    riskCategory: 'Low Burden (0)' | 'Moderate Burden (1-2)' | 'High Risk Cognitive Burden (3+)';
    contributingDrugs: {
      name: string;
      acb: number;
      category: string;
      impact: string;
    }[];
  };
  patientVerbatimQuotes: string[];
  clinicianDiscussionPrompts: string[];
  suggestedAreasForReview: string[];
  safetyFlags: string[];
  dataProvenance: {
    source: string;
    dataPointsAnalyzed: number;
    confidenceRating: string;
    hash: string;
    auditStatus: string;
  };
}

export interface RufqaPilgrimState {
  pilgrimName: string;
  passportCountry: string;
  campaignNumber: string;
  tawafaGroupLeader: {
    name: string;
    phone: string;
    campNumberMina: string;
  };
  currentLocationName: string;
  gpsCoordinates: { lat: number; lng: number };
  hotelDetails: {
    name: string;
    landmark: string;
    roomNumber: string;
    phone: string;
  };
  meetingPointHaram: {
    gateNumber: string;
    gateName: string;
    pillarId: string;
  };
  criticalMedicalBadges: string[];
  isLostModeActive: boolean;
  lastBeaconBroadcast?: string;
  emergencyLanguageCards: {
    language: string;
    title: string;
    text: string;
    phonetic?: string;
  }[];
}

export interface CareLoopEvent {
  id: string;
  timestamp: string;
  stage: CareLoopStage;
  title: string;
  description: string;
  triage: TriageLevel;
  confidenceScore: number;
  actor: 'AI_ORCHESTRATOR' | 'SENIOR' | 'CAREGIVER' | 'CLINICIAN';
  consentTier: ConsentTier;
  requiresHumanReview: boolean;
  humanOverrideAction?: string;
  isOverridden?: boolean;
}

export interface ConsentSetting {
  tier: ConsentTier;
  label: string;
  description: string;
  isEnabled: boolean;
  accessibleBy: string[];
  dataElementsIncluded: string[];
  lastModified: string;
}

export interface ConsentMatrix {
  tier1Private: {
    enabled: boolean;
    lastUpdated?: string;
  };
  tier2Family: {
    enabled: boolean;
    lastUpdated?: string;
  };
  tier3Clinical: {
    enabled: boolean;
    lastUpdated?: string;
  };
  tier4Emergency: {
    enabled: boolean;
    lastUpdated?: string;
  };
}

export interface InvestorDeliverable {
  id: number;
  title: string;
  subtitle: string;
  category: 'FOUNDATION' | 'CLINICAL_ARCHITECTURE' | 'BUSINESS_GTM' | 'ROADMAP_EXECUTION';
  badge?: string;
  content: string;
  keyTakeaways: string[];
  metricsOrData?: { label: string; value: string; detail?: string }[];
  diagramData?: any;
}

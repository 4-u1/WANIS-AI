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
  isSkippedToday?: boolean;
  skippedReason?: string;
  imageUrl?: string;
  notes?: string;
  syncedBy?: string;
  syncSourceDevice?: string;
  confirmedByCaregiver?: string;
}

export interface MedicationIntakeRecord {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  genericName?: string;
  takenAt: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'bedtime';
  acbScore: number;
  indication: string;
  status: 'TAKEN_ON_TIME' | 'TAKEN_DELAYED' | 'SELF_REPORTED' | 'CONFIRMED_BY_CAREGIVER' | 'SKIPPED';
  loggedVia: 'VOICE_CHECKIN' | 'IN_APP_TOAST' | 'MANUAL_MODAL' | 'SYSTEM_SCHEDULE' | 'BULK_EDIT';
  imageUrl?: string;
  notes?: string;
  isSkipped?: boolean;
  skippedReason?: string;
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

export interface CareCircleTriageNotification {
  id: string;
  timestamp: string;
  createdAt?: number;
  previousTriage: TriageLevel;
  newTriage: TriageLevel;
  seniorName: string;
  reason: string;
  notifiedMembers: {
    name: string;
    role: string;
    phone: string;
    channel: 'SMS' | 'PUSH' | 'AUTOMATED_CALL';
    status: 'DELIVERED' | 'SENT';
  }[];
  keyObservations: string[];
  checkinId?: string;
  transcriptSnippet?: string;
  isRead: boolean;
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
  liveTelemetry?: RufqaLiveTelemetry;
  safetyZones?: RufqaSafetyZone[];
  proximityAlerts?: RufqaProximityAlert[];
  stepActivity?: RufqaStepActivityData;
}

export type GaitStabilityLevel = 'EXCELLENT' | 'NORMAL' | 'MILD_FATIGUE' | 'HIGH_ASYMMETRY';

export interface RitualCircuitStepProgress {
  circuitsDone: number;
  totalCircuits: number;
  steps: number;
  targetSteps: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING';
  lastCircuitCompletedTime?: string;
}

export interface RufqaStepSensorStream {
  sensorModel: string;
  samplingRateHz: number;
  accelX: number; // in G/mg units
  accelY: number;
  accelZ: number;
  strideLengthCm: number;
  confidenceScore: number;
  pedometerStatus: 'STREAMING' | 'PAUSED' | 'CALIBRATING';
  lastSyncTimestamp: string;
}

export interface RufqaHourlyStepDistribution {
  hour: string;
  labelAr: string;
  labelEn: string;
  steps: number;
  ritualStage?: string;
  ritualStageAr?: string;
}

export interface RufqaStepActivityData {
  dailyStepGoal: number;
  currentSteps: number;
  distanceKm: number;
  activeMinutes: number;
  caloriesBurnedKcal: number;
  currentCadenceSpm: number; // steps per minute
  gaitStability: GaitStabilityLevel;
  hydrationAlertIntervalSteps: number;
  stepsSinceLastHydration: number;
  ritualBreakdown: {
    tawaf: RitualCircuitStepProgress;
    sai: RitualCircuitStepProgress;
    jamaratWalk: {
      steps: number;
      targetSteps: number;
      distanceMeters: number;
      status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING';
    };
    dailyTransit: {
      steps: number;
      distanceMeters: number;
      status: 'IN_PROGRESS' | 'COMPLETED';
    };
  };
  hourlyDistribution: RufqaHourlyStepDistribution[];
  sensorStream: RufqaStepSensorStream;
}

export type SafetyZoneType = 'SAFE_GREEN' | 'CAUTION_YELLOW' | 'DANGER_RED' | 'MEETING_POINT';

export interface RufqaSafetyZone {
  id: string;
  name: string;
  nameAr: string;
  type: SafetyZoneType;
  radiusMeters: number;
  centerCoordinates: { lat: number; lng: number };
  description: string;
  descriptionAr: string;
  isInside: boolean;
  color: string;
  iconName: string;
}

export interface RufqaProximityAlert {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  targetCaregivers: string[];
  distanceFromSafeZoneMeters: number;
  suggestedAction: string;
  suggestedActionAr: string;
  isAcknowledged: boolean;
}

export interface RufqaLiveTelemetry {
  currentLat: number;
  currentLng: number;
  accuracyRadiusMeters: number;
  altitudeMeters: number;
  speedKmh: number;
  headingDegrees: number;
  lastUpdated: string;
  activeRitualStage: 'TAWAF' | 'SAI' | 'MINA_REST' | 'ARAFAT_DUA' | 'MUZDALIFAH' | 'HOTEL_REST';
  batteryPercent: number;
  signalStrength: 'EXCELLENT' | 'GOOD' | 'CONGESTED_MESH' | 'OFFLINE_RECONNECTING';
  distanceToMeetingPointMeters: number;
  distanceToLeaderMeters: number;
  distanceToHotelMeters: number;
  currentZoneId: string;
  activeProximityStatus: 'WITHIN_SAFE_PERIMETER' | 'APPROACHING_BOUNDARY' | 'OUTSIDE_SAFETY_ZONE';
  breadcrumbTrail?: { lat: number; lng: number; timestamp: string; label?: string }[];
}

export type RitualIntensityLevel = 'LOW_REST' | 'MODERATE_PACED' | 'HIGH_EXERTION' | 'EXTREME_CAUTION';

export interface RitualHealthTip {
  id: string;
  ritualStage: 'TAWAF' | 'SAI' | 'MINA_REST' | 'ARAFAT_DUA' | 'MUZDALIFAH' | 'JAMARAT' | 'HOTEL_REST';
  title: string;
  titleAr: string;
  locationName: string;
  locationNameAr: string;
  intensity: RitualIntensityLevel;
  ambientTempC: number;
  hydrationTargetMlPerHour: number;
  hydrationGuidelines: string[];
  hydrationGuidelinesAr: string[];
  restIntervalMinutes: number;
  restGuidelines: string[];
  restGuidelinesAr: string[];
  clinicalPrecaution: string;
  clinicalPrecautionAr: string;
  seniorConcession: string;
  seniorConcessionAr: string;
  audioVoiceGuidance: string;
  audioVoiceGuidanceAr: string;
  emergencySignToWatch: string;
  emergencySignToWatchAr: string;
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

export interface TourStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  targetSelector: string;
  title: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  seniorSimpleText?: Record<SupportedLanguage, string>;
  targetMode: PersonaMode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  badge?: Record<SupportedLanguage, string>;
  speechAudioText?: Record<SupportedLanguage, string>;
  actionPrompt?: Record<SupportedLanguage, string>;
  showMeHowWorkflow?: string;
}

export interface ContextualHelpItem {
  id: string;
  topic: string;
  title: Record<SupportedLanguage, string>;
  shortAnswer: Record<SupportedLanguage, string>;
  detailedExplanation: Record<SupportedLanguage, string>;
  clinicalNote?: Record<SupportedLanguage, string>;
  relatedFeature?: PersonaMode;
}

export interface FeatureGuideItem {
  id: string;
  iconName: string;
  title: Record<SupportedLanguage, string>;
  tagline: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  targetMode: PersonaMode;
  badge?: string;
  highlights: Record<SupportedLanguage, string[]>;
}

export interface FaqItem {
  id: string;
  category: 'general' | 'seniors' | 'caregivers' | 'clinicians' | 'privacy';
  question: Record<SupportedLanguage, string>;
  answer: Record<SupportedLanguage, string>;
}

export type EmergencyCardStatus = 'ACTIVE' | 'REVIEW_NEEDED' | 'NOT_CONFIGURED';

export type EmergencyPrivacyVisibility = 'EMERGENCY_AND_PUBLIC' | 'EMERGENCY_ONLY' | 'CLINICIAN_ONLY' | 'PRIVATE';

export interface EmergencyAllergy {
  id: string;
  allergen: string;
  severity: 'FATAL_ANAPHYLAXIS' | 'SEVERE' | 'MODERATE';
  reaction: string;
}

export interface EmergencyMedicalAlert {
  id: string;
  condition: string;
  instructions: string;
  isHighRisk: boolean;
}

export interface EmergencyShareToken {
  tokenId: string;
  label: string;
  duration: '1_HOUR' | '24_HOURS' | 'UNTIL_REVOKED';
  createdAt: string;
  expiresAt: string;
  dataIncluded: string[];
  isRevoked: boolean;
  accessCount: number;
  lastAccessed?: string;
}

export interface EmergencyAccessLog {
  id: string;
  timestamp: string;
  accessorType: 'EMERGENCY_RESPONDER_QR' | 'CAREGIVER' | 'RUFQA_LEADER' | 'PUBLIC_PASS';
  deviceInfo: string;
  locationCity?: string;
  dataAccessedSummary: string;
  ipMasked: string;
}

export interface EmergencyPrivacyMatrix {
  bloodType: EmergencyPrivacyVisibility;
  allergies: EmergencyPrivacyVisibility;
  medicalAlerts: EmergencyPrivacyVisibility;
  medicationSummary: EmergencyPrivacyVisibility;
  doctorInfo: EmergencyPrivacyVisibility;
  insuranceInfo: EmergencyPrivacyVisibility;
  cognitiveCommunication: EmergencyPrivacyVisibility;
  mobilityNeeds: EmergencyPrivacyVisibility;
  religiousCultural: EmergencyPrivacyVisibility;
  rufqaPilgrimage: EmergencyPrivacyVisibility;
  locationSharing: 'ENABLED' | 'ON_DEMAND_ONLY' | 'DISABLED';
}

export interface EmergencyCardData {
  id: string;
  status: EmergencyCardStatus;
  lastUpdated: string;
  lastReviewedDate: string;
  reviewIntervalDays: number;
  fullName: string;
  preferredName: string;
  photoUrl: string;
  dateOfBirth: string;
  bloodType: string;
  nationalIdOrPassport: string;
  preferredLanguage: SupportedLanguage;
  supportedEmergencyLanguages: SupportedLanguage[];
  criticalAllergies: EmergencyAllergy[];
  criticalMedicalAlerts: EmergencyMedicalAlert[];
  primaryEmergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    whatsapp?: string;
    isPrimary: boolean;
  };
  secondaryEmergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    whatsapp?: string;
    isPrimary: boolean;
  };
  physicianContact: {
    name: string;
    specialty: string;
    clinic: string;
    phone: string;
  };
  cognitiveCommunicationNotes: string;
  mobilityRequirements: string;
  religiousCulturalNotes?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    isConfigured: boolean;
  };
  rufqaPilgrimage?: {
    isEnabled: boolean;
    campaignNumber: string;
    groupLeaderName: string;
    groupLeaderPhone: string;
    hotelName: string;
    hotelRoom: string;
    campNumberMina: string;
    meetingPointHaram: string;
  };
  privacyMatrix: EmergencyPrivacyMatrix;
  secureToken: string;
  shareTokens: EmergencyShareToken[];
  accessAuditLogs: EmergencyAccessLog[];
}

export interface CareCircleDeviceSync {
  memberId: string;
  memberName: string;
  memberRole: string;
  relation: string;
  avatar: string;
  deviceModel: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'watch';
  os: string;
  syncStatus: 'SYNCED' | 'SYNCING' | 'PENDING' | 'OFFLINE';
  lastSyncTime: string;
  lastActionSummary: string;
  batteryLevel?: number;
  networkType?: string;
  isOnline: boolean;
  latencyMs: number;
}

export interface MedicationSyncAuditLog {
  id: string;
  timestamp: string;
  medicationId: string;
  medicationName: string;
  action: 'DOSE_CONFIRMED' | 'DOSE_SKIPPED' | 'REMINDER_SENT' | 'SCHEDULE_SYNCED' | 'BULK_UPDATE';
  performedBy: string;
  deviceId: string;
  deviceType: string;
  syncLatencyMs: number;
  encryptionProtocol: string;
}

export interface ApiValidationErrorDetail {
  field: string;
  message: string;
  code?: string;
}

export interface ApiStandardErrorResponse {
  success: false;
  error: string;
  message: string;
  code: string;
  details?: ApiValidationErrorDetail[];
  retryAfterSeconds?: number;
  timestamp: string;
}

export interface ApiStandardSuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
}




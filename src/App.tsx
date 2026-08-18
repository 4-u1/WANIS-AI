import React, { useState, useMemo, useEffect } from 'react';
import { 
  PersonaMode, 
  SupportedLanguage, 
  SeniorProfile, 
  Medication, 
  CheckInRecord, 
  CareLoopEvent, 
  RufqaPilgrimState, 
  ConsentMatrix, 
  DoctorBriefData, 
  TriageLevel,
  ContextualHelpItem,
  EmergencyCardData
} from './types';
import { 
  MOCK_SENIOR_PROFILE, 
  MOCK_MEDICATIONS, 
  MOCK_CHECKINS, 
  MOCK_CARE_CIRCLE, 
  MOCK_LONGITUDINAL_DATA, 
  MOCK_CARE_LOOP_EVENTS, 
  MOCK_RUFQA_STATE, 
  MOCK_CONSENT_MATRIX, 
  MOCK_DOCTOR_BRIEF 
} from './data/mockData';
import { INITIAL_EMERGENCY_CARD_DATA } from './data/emergencyCardData';
import { CONTEXTUAL_HELP_ITEMS } from './data/walkthroughData';
import { Navbar } from './components/Navbar';
import { SeniorView } from './components/SeniorMode/SeniorView';
import { SeniorCheckinModal } from './components/SeniorMode/SeniorCheckinModal';
import { FamilyView } from './components/FamilyMode/FamilyView';
import { ClinicianView } from './components/ClinicianMode/ClinicianView';
import { DoctorBriefModal } from './components/ClinicianMode/DoctorBriefModal';
import { RufqaView } from './components/RufqaMode/RufqaView';
import { OrchestratorView } from './components/OrchestratorMode/OrchestratorView';
import { InvestorView } from './components/InvestorMode/InvestorView';
import { ConsentModal } from './components/ConsentModal';
import { EmergencyModal } from './components/EmergencyModal';
import { EmergencyCardModal } from './components/EmergencyCard/EmergencyCardModal';
import { GuidedTourOverlay } from './components/Walkthrough/GuidedTourOverlay';
import { HowToUseModal } from './components/Walkthrough/HowToUseModal';
import { ContextualHelpModal } from './components/Walkthrough/ContextualHelpModal';
import { FirstTimeWelcomeModal } from './components/Walkthrough/FirstTimeWelcomeModal';
import { WaneesProductIntroductionModal } from './components/Walkthrough/WaneesProductIntroductionModal';
import { MedicationToastNotification, ActiveMedicationReminder } from './components/Notifications/MedicationToastNotification';
import { MedicationReminderCenterModal } from './components/Notifications/MedicationReminderCenterModal';
import { 
  notificationAudio, 
  speakMedicationReminder, 
  sendBrowserPushNotification 
} from './services/notificationService';

export default function App() {
  // Navigation & Persona State
  const [currentMode, setCurrentMode] = useState<PersonaMode>('senior');
  const [language, setLanguage] = useState<SupportedLanguage>('ar');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  // Application Data States
  const [senior, setSenior] = useState<SeniorProfile>(MOCK_SENIOR_PROFILE);
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  const [checkins, setCheckins] = useState<CheckInRecord[]>(MOCK_CHECKINS);
  const [careLoopEvents, setCareLoopEvents] = useState<CareLoopEvent[]>(MOCK_CARE_LOOP_EVENTS);
  const [rufqaState, setRufqaState] = useState<RufqaPilgrimState>(MOCK_RUFQA_STATE);
  const [consentMatrix, setConsentMatrix] = useState<ConsentMatrix>(MOCK_CONSENT_MATRIX);
  const [doctorBrief, setDoctorBrief] = useState<DoctorBriefData>(MOCK_DOCTOR_BRIEF);
  const [emergencyCardData, setEmergencyCardData] = useState<EmergencyCardData>(INITIAL_EMERGENCY_CARD_DATA);

  // In-App Medication Reminders & Toast Queue State
  const [activeReminders, setActiveReminders] = useState<ActiveMedicationReminder[]>([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);

  // Modals
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isDoctorBriefModalOpen, setIsDoctorBriefModalOpen] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isEmergencyCardModalOpen, setIsEmergencyCardModalOpen] = useState(false);

  // Walkthrough & Onboarding States
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState<boolean>(false);
  const [selectedHelpItem, setSelectedHelpItem] = useState<ContextualHelpItem | null>(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(false);
  const [isProductIntroOpen, setIsProductIntroOpen] = useState<boolean>(false);

  // Pending medications count
  const pendingMedications = useMemo(() => {
    return medications.filter(m => !m.isTakenToday);
  }, [medications]);

  // Check first time visit for welcome greeting modal
  useEffect(() => {
    const isDismissed = localStorage.getItem('wanis_welcome_dismissed');
    const isCompleted = localStorage.getItem('wanis_tour_completed');
    if (!isDismissed && !isCompleted) {
      const timer = setTimeout(() => {
        setIsProductIntroOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Automatic gentle reminder simulation for untaken scheduled medications
  useEffect(() => {
    const untakenMeds = medications.filter(m => !m.isTakenToday);
    if (untakenMeds.length > 0) {
      const timer = setTimeout(() => {
        const targetMed = untakenMeds.find(m => m.acbScore > 0) || untakenMeds[0];
        if (targetMed) {
          handleTriggerReminderToast(targetMed);
        }
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpenContextualHelp = (topicKey: string) => {
    const item = CONTEXTUAL_HELP_ITEMS[topicKey] || Object.values(CONTEXTUAL_HELP_ITEMS).find(i => i.id === topicKey || i.topic === topicKey);
    if (item) {
      setSelectedHelpItem(item);
    }
  };

  const handleStartShowMeHow = (workflow: string) => {
    if (workflow === 'doctor-brief') {
      setCurrentMode('clinician');
      setTimeout(() => {
        setIsDoctorBriefModalOpen(true);
      }, 200);
    } else if (workflow === 'rufqa') {
      setCurrentMode('rufqa');
    }
  };

  // Trigger In-App & Push Medication Reminder
  const handleTriggerReminderToast = (medication: Medication) => {
    setActiveReminders(prev => {
      if (prev.some(r => r.medication.id === medication.id)) return prev;
      const newReminder: ActiveMedicationReminder = {
        id: `reminder-${medication.id}-${Date.now()}`,
        medication,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUrgent: medication.acbScore >= 2
      };
      return [newReminder, ...prev];
    });

    // Play chime & speak prompt
    notificationAudio.playReminderChime();
    if (voiceEnabled) {
      speakMedicationReminder(medication, language);
    }

    // Browser push notification
    sendBrowserPushNotification(medication, language, () => {
      handleToggleMedicationTaken(medication.id);
    });

    // Append to Continuous 8-Stage Care Loop Audit Log
    const reminderEvent: CareLoopEvent = {
      id: `evt-med-reminder-${Date.now()}`,
      stage: 'RECOMMEND',
      title: 'Smart Medication Adherence Prompt Dispatched',
      description: `In-App Toast and Push alert dispatched for scheduled dose: ${medication.name} (${medication.dosage}).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      triage: medication.acbScore >= 2 ? 'YELLOW' : 'GREEN',
      confidenceScore: 0.99,
      actor: 'AI_ORCHESTRATOR',
      consentTier: 'PRIVATE',
      requiresHumanReview: false
    };
    setCareLoopEvents(prev => [reminderEvent, ...prev]);
  };

  const handleDismissReminder = (reminderId: string) => {
    setActiveReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  const handleSnoozeReminder = (reminderId: string, medId: string) => {
    setActiveReminders(prev => prev.filter(r => r.id !== reminderId));
    setTimeout(() => {
      setMedications(currentMeds => {
        const freshMed = currentMeds.find(m => m.id === medId);
        if (freshMed && !freshMed.isTakenToday) {
          handleTriggerReminderToast(freshMed);
        }
        return currentMeds;
      });
    }, 15000);
  };

  // Computed ACB Total Score
  const totalAcbScore = useMemo(() => {
    return medications.reduce((sum, med) => sum + (med.acbScore || 0), 0);
  }, [medications]);

  // Current Global Triage Level
  const currentTriageLevel: TriageLevel = useMemo(() => {
    if (rufqaState.isLostModeActive) return 'RED';
    if (totalAcbScore >= 3 || checkins[0]?.triageLevel === 'YELLOW') return 'YELLOW';
    return checkins[0]?.triageLevel || 'GREEN';
  }, [rufqaState.isLostModeActive, totalAcbScore, checkins]);

  // Handle New Voice Check-in Record
  const handleCheckinComplete = (record: CheckInRecord) => {
    setCheckins([record, ...checkins]);
    setSenior(prev => ({
      ...prev,
      lastCheckInTime: 'Today, Just now',
      currentTriage: record.triageLevel
    }));

    // Append to continuous care loop
    const newEvents: CareLoopEvent[] = [
      {
        id: `evt-${Date.now()}-1`,
        stage: 'OBSERVE',
        title: 'Voice Check-in Acoustic Intake',
        description: `Captured ${record.transcript.length} chars of spoken transcript with baseline acoustic parsing.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        triage: record.triageLevel,
        confidenceScore: 0.98,
        actor: 'SENIOR',
        consentTier: 'PRIVATE',
        requiresHumanReview: false
      },
      {
        id: `evt-${Date.now()}-2`,
        stage: 'ASSESS',
        title: 'Deterministic Cognitive & Sentiment Score',
        description: `Extracted Mood: ${record.moodScore}/10, Sleep: ${record.sleepHours}h, Triage: ${record.triageLevel}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        triage: record.triageLevel,
        confidenceScore: 0.95,
        actor: 'AI_ORCHESTRATOR',
        consentTier: 'PRIVATE',
        requiresHumanReview: false
      },
      {
        id: `evt-${Date.now()}-3`,
        stage: 'SHARE',
        title: 'Family Digest Dispatched',
        description: 'Auto-updated Maryam (Daughter) via Tier 2 Family Consent channel.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        triage: record.triageLevel,
        confidenceScore: 1.0,
        actor: 'AI_ORCHESTRATOR',
        consentTier: 'FAMILY_SUPPORT',
        requiresHumanReview: false
      }
    ];

    setCareLoopEvents(prev => [...newEvents, ...prev]);
  };

  // Toggle Medication Taken
  const handleToggleMedicationTaken = (id: string) => {
    let justTaken = false;
    let targetMedName = '';

    setMedications(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.isTakenToday;
        justTaken = nextState;
        targetMedName = m.name;
        return {
          ...m,
          isTakenToday: nextState,
          lastTaken: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
        };
      }
      return m;
    }));

    // Clear active toasts for this medication
    setActiveReminders(prev => prev.filter(r => r.medication.id !== id));

    if (justTaken) {
      notificationAudio.playSuccessChime();
      const adherenceEvent: CareLoopEvent = {
        id: `evt-med-taken-${Date.now()}`,
        stage: 'ACT',
        title: 'Medication Adherence Confirmed',
        description: `Senior marked ${targetMedName} as taken today. Adherence state updated.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        triage: 'GREEN',
        confidenceScore: 1.0,
        actor: 'SENIOR',
        consentTier: 'FAMILY_SUPPORT',
        requiresHumanReview: false
      };
      setCareLoopEvents(prev => [adherenceEvent, ...prev]);
    }
  };

  // Trigger Simulated 8-Stage Cycle
  const handleTriggerSimulatedLoop = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const stages: CareLoopEvent[] = [
      { id: `sim-${Date.now()}-1`, stage: 'OBSERVE', title: 'Multimodal Sensor & Ambient Vitals Intake', description: 'Evaluated step cadence (4,200 steps) and resting heart rate variability.', timestamp: time, triage: 'GREEN', confidenceScore: 0.97, actor: 'SENIOR', consentTier: 'PRIVATE', requiresHumanReview: false },
      { id: `sim-${Date.now()}-2`, stage: 'UNDERSTAND', title: 'Hejazi Dialect Lexical Parsing', description: 'Interpreted emotional tone and spiritual peace markers.', timestamp: time, triage: 'GREEN', confidenceScore: 0.99, actor: 'AI_ORCHESTRATOR', consentTier: 'PRIVATE', requiresHumanReview: false },
      { id: `sim-${Date.now()}-3`, stage: 'ASSESS', title: 'ACB 2.0 Calculation Invariant Run', description: `Calculated total central anticholinergic burden: ${totalAcbScore}.`, timestamp: time, triage: 'YELLOW', confidenceScore: 1.0, actor: 'AI_ORCHESTRATOR', consentTier: 'PRIVATE', requiresHumanReview: false },
      { id: `sim-${Date.now()}-4`, stage: 'RECOMMEND', title: 'Hydration & Post-Prayer Rest Cue', description: 'Recommended 250ml water intake prior to afternoon rest.', timestamp: time, triage: 'GREEN', confidenceScore: 0.94, actor: 'AI_ORCHESTRATOR', consentTier: 'FAMILY_SUPPORT', requiresHumanReview: false },
      { id: `sim-${Date.now()}-5`, stage: 'ACT', title: 'Empathetic Voice Guidance Triggered', description: 'Delivered warm audio prompt to Hajjah Fatima.', timestamp: time, triage: 'GREEN', confidenceScore: 0.99, actor: 'AI_ORCHESTRATOR', consentTier: 'PRIVATE', requiresHumanReview: false },
      { id: `sim-${Date.now()}-6`, stage: 'SHARE', title: 'Care Circle Digest Synchronized', description: 'Synced with Maryam and Tariq via encrypted channel.', timestamp: time, triage: 'YELLOW', confidenceScore: 1.0, actor: 'AI_ORCHESTRATOR', consentTier: 'FAMILY_SUPPORT', requiresHumanReview: false },
      { id: `sim-${Date.now()}-7`, stage: 'FOLLOW_UP', title: 'Scheduled Evening Wellness Check', description: 'Automated prompt scheduled for 08:30 PM post-Isha.', timestamp: time, triage: 'GREEN', confidenceScore: 0.98, actor: 'AI_ORCHESTRATOR', consentTier: 'FAMILY_SUPPORT', requiresHumanReview: false },
      { id: `sim-${Date.now()}-8`, stage: 'LEARN', title: 'Longitudinal Baseline Adaptation', description: 'Recalibrated personal baseline sleep duration without diagnostic overreach.', timestamp: time, triage: 'GREEN', confidenceScore: 0.96, actor: 'AI_ORCHESTRATOR', consentTier: 'PRIVATE', requiresHumanReview: false }
    ];

    setCareLoopEvents(prev => [...stages, ...prev]);
    alert('Simulated full 8-stage care loop executed and recorded in the audit log!');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Main Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        language={language}
        onSelectLanguage={setLanguage}
        triageLevel={currentTriageLevel}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        onOpenConsentModal={() => setIsConsentModalOpen(true)}
        onTriggerEmergency={() => setIsEmergencyModalOpen(true)}
        onOpenHowToUse={() => setIsHowToUseOpen(true)}
        onOpenEmergencyCard={() => setIsEmergencyCardModalOpen(true)}
        pendingMedicationsCount={pendingMedications.length}
        onOpenReminderCenter={() => setIsReminderModalOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content-container" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {currentMode === 'senior' && (
          <SeniorView
            senior={senior}
            latestCheckIn={checkins[0]}
            medications={medications}
            onOpenCheckinModal={() => setIsCheckinModalOpen(true)}
            onToggleMedicationTaken={handleToggleMedicationTaken}
            onNavigateToMode={setCurrentMode}
            language={language}
            voiceEnabled={voiceEnabled}
            totalAcbScore={totalAcbScore}
            onOpenContextualHelp={handleOpenContextualHelp}
            onOpenEmergencyCard={() => setIsEmergencyCardModalOpen(true)}
            onTriggerReminderToast={handleTriggerReminderToast}
            onOpenReminderModal={() => setIsReminderModalOpen(true)}
          />
        )}

        {currentMode === 'family' && (
          <FamilyView
            senior={senior}
            checkins={checkins}
            careCircle={MOCK_CARE_CIRCLE}
            longitudinalData={MOCK_LONGITUDINAL_DATA}
            careLoopEvents={careLoopEvents}
            onOpenDoctorBrief={() => setIsDoctorBriefModalOpen(true)}
            onNavigateToMode={setCurrentMode}
            language={language}
            totalAcbScore={totalAcbScore}
          />
        )}

        {currentMode === 'clinician' && (
          <ClinicianView
            senior={senior}
            medications={medications}
            doctorBrief={doctorBrief}
            longitudinalData={MOCK_LONGITUDINAL_DATA}
            onUpdateMedications={setMedications}
            language={language}
            totalAcbScore={totalAcbScore}
            onOpenContextualHelp={handleOpenContextualHelp}
            onStartDoctorBriefTour={() => {
              setIsDoctorBriefModalOpen(true);
            }}
          />
        )}

        {currentMode === 'rufqa' && (
          <RufqaView
            rufqaState={rufqaState}
            onUpdateRufqaState={setRufqaState}
            language={language}
            voiceEnabled={voiceEnabled}
            onOpenContextualHelp={handleOpenContextualHelp}
            onOpenEmergencyCard={() => setIsEmergencyCardModalOpen(true)}
          />
        )}

        {currentMode === 'orchestrator' && (
          <OrchestratorView
            careLoopEvents={careLoopEvents}
            onTriggerSimulatedLoop={handleTriggerSimulatedLoop}
            language={language}
          />
        )}

        {currentMode === 'investor' && (
          <InvestorView language={language} />
        )}

      </main>

      {/* Global Modals */}
      <SeniorCheckinModal
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        language={language}
        voiceEnabled={voiceEnabled}
        onCheckinComplete={handleCheckinComplete}
      />

      <DoctorBriefModal
        isOpen={isDoctorBriefModalOpen}
        onClose={() => setIsDoctorBriefModalOpen(false)}
        brief={doctorBrief}
        language={language}
      />

      <ConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        consentMatrix={consentMatrix}
        onUpdateConsent={setConsentMatrix}
        language={language}
      />

      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        senior={senior}
        language={language}
      />

      {/* Multilingual Digital Emergency ID & Safety Card Modal */}
      <EmergencyCardModal
        isOpen={isEmergencyCardModalOpen}
        onClose={() => setIsEmergencyCardModalOpen(false)}
        cardData={emergencyCardData}
        onUpdateCardData={setEmergencyCardData}
        language={language}
        onSelectLanguage={setLanguage}
        voiceEnabled={voiceEnabled}
        medications={medications}
      />

      {/* Medication Smart Reminder Center Modal */}
      <MedicationReminderCenterModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        medications={medications}
        onToggleMedicationTaken={handleToggleMedicationTaken}
        onTriggerReminderToast={handleTriggerReminderToast}
        language={language}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
      />

      {/* Interactive Platform Guided Tour Spotlight Overlay */}
      <GuidedTourOverlay
        isActive={isTourActive}
        onClose={() => setIsTourActive(false)}
        language={language}
        currentMode={currentMode}
        onSwitchMode={setCurrentMode}
        onOpenCheckinModal={() => setIsCheckinModalOpen(true)}
        voiceEnabledByDefault={voiceEnabled}
        onOpenProductIntroduction={() => setIsProductIntroOpen(true)}
      />

      {/* Primary How to Use & Onboarding Center Modal */}
      <HowToUseModal
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
        language={language}
        onStartTour={() => setIsTourActive(true)}
        onStartShowMeHow={handleStartShowMeHow}
        onNavigateToMode={setCurrentMode}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        onOpenContextualHelp={handleOpenContextualHelp}
        onOpenProductIntroduction={() => setIsProductIntroOpen(true)}
      />

      {/* Contextual Understanding Modal (? Popups) */}
      <ContextualHelpModal
        isOpen={!!selectedHelpItem}
        onClose={() => setSelectedHelpItem(null)}
        item={selectedHelpItem}
        language={language}
        onNavigateToFeature={setCurrentMode}
        voiceEnabled={voiceEnabled}
      />

      {/* Comprehensive Wanees Product Introduction & Philosophy Modal */}
      <WaneesProductIntroductionModal
        isOpen={isProductIntroOpen}
        onClose={() => setIsProductIntroOpen(false)}
        onStartTour={() => setIsTourActive(true)}
        language={language}
      />

      {/* First-Time Welcome Modal Greeting (Fallback) */}
      <FirstTimeWelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        onStartTour={() => setIsTourActive(true)}
        language={language}
      />

      {/* In-App Medication Toast Notification Queue */}
      <MedicationToastNotification
        activeReminders={activeReminders}
        onMarkAsTaken={handleToggleMedicationTaken}
        onDismiss={handleDismissReminder}
        onSnooze={handleSnoozeReminder}
        language={language}
        voiceEnabled={voiceEnabled}
      />

      {/* Minimalist Footnote */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>WanisAI™ Cognitive Wellbeing Ecosystem • Clinically Responsible & Culturally Intelligent</span>
          <span className="text-[11px] text-slate-400">Non-Diagnostic Geriatric Decision Support System v2.4</span>
        </div>
      </footer>

    </div>
  );
}

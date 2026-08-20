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
  EmergencyCardData,
  CareCircleTriageNotification
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
import { CareCircleTriageToast } from './components/Notifications/CareCircleTriageToast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  notificationAudio, 
  speakMedicationReminder, 
  sendBrowserPushNotification,
  sendCareCircleTriagePushNotification
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

  // Automated Care Circle Triage Shift Notifications
  const [activeTriageNotification, setActiveTriageNotification] = useState<CareCircleTriageNotification | null>(null);
  const [triageNotificationHistory, setTriageNotificationHistory] = useState<CareCircleTriageNotification[]>([
    {
      id: 'mock-triage-prev-1',
      timestamp: 'Today, 04:15 PM',
      createdAt: Date.now() - 3600000,
      previousTriage: 'GREEN',
      newTriage: 'YELLOW',
      seniorName: 'فاطمة الهاشمي',
      reason: 'Fragmented sleep (4.5h) and mild postural dizziness reported during afternoon check-in.',
      transcriptSnippet: 'نمت متقطعاً البارحة وأشعر بثقل خفيف في رأسي ودوخة بسيطة عند الوقوف.',
      notifiedMembers: [
        { name: 'Maryam (Daughter)', role: 'Primary Caregiver', phone: '+966 50 512 3456', channel: 'SMS', status: 'DELIVERED' },
        { name: 'Dr. Tariq Al-Ghamdi', role: 'Geriatrician', phone: '+966 12 654 3210', channel: 'PUSH', status: 'DELIVERED' },
        { name: 'Suhail Al-Hashemi', role: 'Family Care Support', phone: '+966 55 987 6543', channel: 'PUSH', status: 'DELIVERED' }
      ],
      keyObservations: ['Postural dizziness noted', 'Sleep duration < 5h', 'Hydration intake low'],
      isRead: false
    },
    {
      id: 'mock-triage-prev-2',
      timestamp: 'Yesterday, 08:30 PM',
      createdAt: Date.now() - 86400000,
      previousTriage: 'GREEN',
      newTriage: 'YELLOW',
      seniorName: 'فاطمة الهاشمي',
      reason: 'Late evening fatigue and delay in taking nighttime Amitriptyline dose.',
      transcriptSnippet: 'كنت متعبة هذا المساء ونسيت موعد حبة النوم لولا تنبيه ونيس.',
      notifiedMembers: [
        { name: 'Maryam (Daughter)', role: 'Primary Caregiver', phone: '+966 50 512 3456', channel: 'SMS', status: 'DELIVERED' },
        { name: 'Suhail Al-Hashemi', role: 'Family Care Support', phone: '+966 55 987 6543', channel: 'PUSH', status: 'DELIVERED' }
      ],
      keyObservations: ['Evening fatigue spike', 'Medication reminder confirmed verbally'],
      isRead: false
    },
    {
      id: 'mock-triage-prev-3',
      timestamp: '4 days ago, 11:20 AM',
      createdAt: Date.now() - 345600000,
      previousTriage: 'GREEN',
      newTriage: 'YELLOW',
      seniorName: 'فاطمة الهاشمي',
      reason: 'Mild joint discomfort and reduced morning mobility reported after household steps.',
      transcriptSnippet: 'ركبتي تؤلمني قليلاً اليوم بعد المشي في الحديقة صباحاً.',
      notifiedMembers: [
        { name: 'Maryam (Daughter)', role: 'Primary Caregiver', phone: '+966 50 512 3456', channel: 'SMS', status: 'DELIVERED' },
        { name: 'Dr. Tariq Al-Ghamdi', role: 'Geriatrician', phone: '+966 12 654 3210', channel: 'PUSH', status: 'DELIVERED' }
      ],
      keyObservations: ['Joint discomfort grade 3/10', 'Rest break recommended'],
      isRead: true
    },
    {
      id: 'mock-triage-prev-4',
      timestamp: '10 days ago, 02:40 PM',
      createdAt: Date.now() - 864000000,
      previousTriage: 'YELLOW',
      newTriage: 'RED',
      seniorName: 'فاطمة الهاشمي',
      reason: 'Sudden loss of balance near hallway carpet; safety protocol successfully engaged without injury.',
      transcriptSnippet: 'تعثرت بحافة السجادة وفقدت توازني لكن تمسكت بالجدار والحمد لله لم أسقط.',
      notifiedMembers: [
        { name: 'Maryam (Daughter)', role: 'Primary Caregiver', phone: '+966 50 512 3456', channel: 'AUTOMATED_CALL', status: 'DELIVERED' },
        { name: 'Dr. Tariq Al-Ghamdi', role: 'Geriatrician', phone: '+966 12 654 3210', channel: 'PUSH', status: 'DELIVERED' },
        { name: 'Suhail Al-Hashemi', role: 'Family Care Support', phone: '+966 55 987 6543', channel: 'SMS', status: 'DELIVERED' }
      ],
      keyObservations: ['Near-fall incident resolved', 'Carpeting secured', 'Emergency protocol verified'],
      isRead: true
    }
  ]);

  // Toggle Alert Read Status
  const handleToggleNotificationRead = (id: string) => {
    setTriageNotificationHistory(prev => prev.map(notif => {
      if (notif.id === id) {
        return { ...notif, isRead: !notif.isRead };
      }
      return notif;
    }));
  };

  // Mark All Alerts as Read
  const handleMarkAllNotificationsAsRead = () => {
    setTriageNotificationHistory(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

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

  // Trigger Automated Care Circle Triage Shift Notification
  const triggerCareCircleNotification = (
    newTriage: TriageLevel,
    previousTriage: TriageLevel,
    reasonStr?: string,
    transcriptSnippet?: string,
    checkinId?: string
  ) => {
    const isRed = newTriage === 'RED';
    const defaultReason = isRed
      ? (language === 'ar' ? 'تم رصد إشارات استغاثة أو ألم حاد يستوجب تدخلاً سريرياً عاجلاً' : 'Severe acute pain or fall signal detected requiring immediate clinical intervention.')
      : (language === 'ar' ? 'تغير ملحوظ في جودة النوم والراحة اليومية مع إرهاق خفيف' : 'Noticeable variance in sleep quality and daytime fatigue requiring family follow-up.');

    const reason = reasonStr || defaultReason;

    const notif: CareCircleTriageNotification = {
      id: `care-circle-alert-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      previousTriage,
      newTriage,
      seniorName: senior.preferredName || senior.fullName,
      reason,
      transcriptSnippet,
      notifiedMembers: [
        { name: 'Maryam (Daughter)', role: 'Primary Caregiver', phone: '+966 50 512 3456', channel: 'SMS', status: 'DELIVERED' },
        { name: 'Dr. Tariq Al-Ghamdi', role: 'Geriatrician', phone: '+966 12 654 3210', channel: 'PUSH', status: 'DELIVERED' },
        { name: 'Suhail Al-Hashemi', role: 'Family Care Support', phone: '+966 55 987 6543', channel: 'PUSH', status: 'DELIVERED' }
      ],
      keyObservations: [
        `Triage shift from ${previousTriage} to ${newTriage}`,
        reason
      ],
      checkinId,
      isRead: false
    };

    setActiveTriageNotification(notif);
    setTriageNotificationHistory(prev => [notif, ...prev]);

    // Play crisp synthesized audio cue based on triage priority
    notificationAudio.playTriageAlertChime(newTriage as any);

    // Send native browser Web Push Notification if permission granted
    sendCareCircleTriagePushNotification(
      senior.preferredName || senior.fullName,
      newTriage as any,
      reason,
      language,
      () => setCurrentMode('family')
    );
  };

  // Handle New Voice Check-in Record
  const handleCheckinComplete = (record: CheckInRecord) => {
    const previousTriage = senior.currentTriage || checkins[0]?.triageLevel || 'GREEN';

    setCheckins([record, ...checkins]);
    setSenior(prev => ({
      ...prev,
      lastCheckInTime: 'Today, Just now',
      currentTriage: record.triageLevel
    }));

    // Automated Care Circle Notification Logic:
    // Dispatches automated alert if senior's triage shifts from GREEN to YELLOW, ORANGE, or RED
    const isShiftFromGreen = previousTriage === 'GREEN' && (
      record.triageLevel === 'YELLOW' || 
      record.triageLevel === 'ORANGE' || 
      record.triageLevel === 'RED'
    );

    if (isShiftFromGreen) {
      const reason = (record.keyObservations && record.keyObservations.length > 0)
        ? record.keyObservations.join(' • ')
        : (record.sentiment === 'concerning' || record.sentiment === 'distressed'
            ? (language === 'ar' ? 'تم رصد تقلبات في النوم ونبرة إرهاق أثناء فحص الاطمئنان الصوتي' : 'Fragmented sleep and notable fatigue detected during voice check-in.')
            : (language === 'ar' ? 'تغير ملحوظ عن خط الأساس الطبيعي للاطمئنان' : 'Meaningful variance from normal baseline detected.'));

      triggerCareCircleNotification(
        record.triageLevel,
        previousTriage,
        reason,
        record.transcript ? (record.transcript.length > 85 ? record.transcript.substring(0, 85) + '...' : record.transcript) : undefined,
        record.id
      );
    }

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

    // If shift from GREEN occurred, add an explicit Care Circle broadcast event to the care loop
    if (isShiftFromGreen) {
      newEvents.push({
        id: `evt-${Date.now()}-carecircle-broadcast`,
        stage: 'ACT',
        title: record.triageLevel === 'RED' ? '🚨 Care Circle Emergency Escalation' : '⚠️ Care Circle Triage Shift Broadcast',
        description: `Automated SMS and Push broadcast sent to Maryam (Daughter) and Dr. Tariq due to triage shift from ${previousTriage} to ${record.triageLevel}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        triage: record.triageLevel,
        confidenceScore: 0.99,
        actor: 'AI_ORCHESTRATOR',
        consentTier: 'FAMILY_SUPPORT',
        requiresHumanReview: record.triageLevel === 'RED'
      });
    }

    setCareLoopEvents(prev => [...newEvents, ...prev]);
  };

  // Quick Simulation Handler for Testing Triage Shift Notifications
  const handleSimulateTriageShift = (targetTriage: 'YELLOW' | 'RED') => {
    const isRed = targetTriage === 'RED';
    const sampleTranscript = isRed
      ? (language === 'ar' ? 'سقطت في الممر وشعرت بألم حاد في مفصلي.' : 'I fell near the hallway and felt sharp pain in my joint.')
      : (language === 'ar' ? 'نمت متقطعاً البارحة وأشعر بثقل خفيف في رأسي ودوخة عند النهوض.' : 'I had broken sleep last night and felt mild dizziness upon standing.');

    const simulatedCheckin: CheckInRecord = {
      id: `chk-sim-${Date.now()}`,
      timestamp: new Date().toISOString(),
      transcript: sampleTranscript,
      sentiment: isRed ? 'distressed' : 'concerning',
      moodScore: isRed ? 3.0 : 5.0,
      sleepHours: isRed ? 3.0 : 4.5,
      sleepQuality: isRed ? 2.5 : 4.0,
      fatigueScore: isRed ? 8.5 : 6.5,
      memoryMentioned: !isRed,
      socialContact: true,
      triageLevel: targetTriage,
      agentResponse: language === 'ar' ? 'أنا معكِ يا والدتي الحبيبة، تم إشعار مريم وفريق الرعاية للاطمئنان عليكِ.' : 'I am right here with you. Maryam and your care team have been alerted.',
      keyObservations: isRed
        ? ['Acute mobility / pain event flagged', 'Immediate clinical escalation protocol triggered']
        : ['Sub-baseline sleep quality (4.5h)', 'Mild postural instability signal observed'],
      consentTierUsed: 'FAMILY_SUPPORT'
    };

    handleCheckinComplete(simulatedCheckin);
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
          isSkippedToday: false,
          skippedReason: undefined,
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

  // Bulk Update Multiple Medications (Taken, Skipped, or Reset)
  const handleBulkUpdateMedications = (
    updates: { id: string; action: 'TAKE' | 'SKIP' | 'RESET'; note?: string; reason?: string }[]
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const affectedIds = new Set(updates.map(u => u.id));

    setMedications(prev => prev.map(m => {
      const update = updates.find(u => u.id === m.id);
      if (!update) return m;

      if (update.action === 'TAKE') {
        return {
          ...m,
          isTakenToday: true,
          isSkippedToday: false,
          skippedReason: undefined,
          lastTaken: timeStr,
          notes: update.note || m.notes
        };
      } else if (update.action === 'SKIP') {
        return {
          ...m,
          isTakenToday: false,
          isSkippedToday: true,
          skippedReason: update.reason || 'Missed dosing block',
          lastTaken: `Skipped (${timeStr})`,
          notes: update.note || m.notes || 'Dose skipped by caregiver'
        };
      } else if (update.action === 'RESET') {
        return {
          ...m,
          isTakenToday: false,
          isSkippedToday: false,
          skippedReason: undefined,
          lastTaken: undefined
        };
      }
      return m;
    }));

    // Clear active toasts for all updated medications
    setActiveReminders(prev => prev.filter(r => !affectedIds.has(r.medication.id)));

    // Play chime feedback
    const hasTakeAction = updates.some(u => u.action === 'TAKE');
    if (hasTakeAction) {
      notificationAudio.playSuccessChime();
    } else {
      notificationAudio.playReminderChime();
    }

    const bulkEvent: CareLoopEvent = {
      id: `evt-bulk-med-${Date.now()}`,
      stage: 'ACT',
      title: 'Bulk Medication History Updated',
      description: `Caregiver updated ${updates.length} medication(s) simultaneously (Bulk Edit).`,
      timestamp: timeStr,
      triage: 'GREEN',
      confidenceScore: 0.99,
      actor: 'CAREGIVER',
      consentTier: 'FAMILY_SUPPORT',
      requiresHumanReview: false
    };
    setCareLoopEvents(prev => [bulkEvent, ...prev]);
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
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
        onStartTour={() => setIsTourActive(true)}
        onOpenProductIntroduction={() => setIsProductIntroOpen(true)}
        onOpenVoiceGuide={() => handleOpenContextualHelp('voice-checkin')}
      />

      {/* Main Content Area */}
      <main id="main-content-container" className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-24 md:pb-10">
        
        {currentMode === 'senior' && (
          <SeniorView
            senior={senior}
            latestCheckIn={checkins[0]}
            medications={medications}
            longitudinalData={MOCK_LONGITUDINAL_DATA}
            careCircle={MOCK_CARE_CIRCLE}
            onOpenCheckinModal={() => setIsCheckinModalOpen(true)}
            onSaveCheckIn={handleCheckinComplete}
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
            medications={medications}
            triageNotifications={triageNotificationHistory}
            onOpenDoctorBrief={() => setIsDoctorBriefModalOpen(true)}
            onNavigateToMode={setCurrentMode}
            language={language}
            totalAcbScore={totalAcbScore}
            onToggleMedicationTaken={handleToggleMedicationTaken}
            onTriggerMedicationReminder={handleTriggerReminderToast}
            onSimulateTriageShift={handleSimulateTriageShift}
            onToggleNotificationRead={handleToggleNotificationRead}
            onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          />
        )}

        {currentMode === 'clinician' && (
          <ClinicianView
            senior={senior}
            medications={medications}
            doctorBrief={doctorBrief}
            longitudinalData={MOCK_LONGITUDINAL_DATA}
            triageHistory={triageNotificationHistory}
            checkins={checkins}
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
        onBulkUpdateMedications={handleBulkUpdateMedications}
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
        senior={senior}
        medications={medications}
        latestCheckIn={checkins[0]}
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

      {/* Automated Care Circle Triage Shift Alert Toast */}
      <CareCircleTriageToast
        notification={activeTriageNotification}
        onDismiss={() => setActiveTriageNotification(null)}
        onNavigateToFamilyPortal={() => setCurrentMode('family')}
        language={language}
      />

      {/* Mobile Bottom Navigation Dock (Phone Screens) */}
      <MobileBottomNav
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        language={language}
        triageLevel={currentTriageLevel}
        pendingMedicationsCount={pendingMedications.length}
        onOpenReminderCenter={() => setIsReminderModalOpen(true)}
        onTriggerEmergency={() => setIsEmergencyModalOpen(true)}
      />

      {/* Minimalist Footnote */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>WanisAI™ Cognitive Wellbeing Ecosystem • Clinically Responsible & Culturally Intelligent</span>
          <span className="text-[11px] text-slate-400">Non-Diagnostic Geriatric Decision Support System v2.4</span>
        </div>
      </footer>

    </div>
  );
}

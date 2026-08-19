import { CareCircleDeviceSync, MedicationSyncAuditLog, CareCircleMember } from '../types';

export const INITIAL_CARECIRCLE_DEVICES: CareCircleDeviceSync[] = [
  {
    memberId: 'circle-01',
    memberName: 'Maryam Al-Hashemi',
    memberRole: 'PRIMARY_CAREGIVER',
    relation: 'Daughter (مريم - الابنة)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    deviceModel: 'iPhone 15 Pro Max',
    deviceType: 'mobile',
    os: 'iOS 17.5.1',
    syncStatus: 'SYNCED',
    lastSyncTime: 'Just now (Live)',
    lastActionSummary: 'Verified Lisinopril 10mg morning dose',
    batteryLevel: 94,
    networkType: '5G Mobily (Ultra Fast)',
    isOnline: true,
    latencyMs: 14
  },
  {
    memberId: 'circle-02',
    memberName: 'Tariq Al-Hashemi',
    memberRole: 'FAMILY_MEMBER',
    relation: 'Son (طارق - الابن)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    deviceModel: 'iPad Pro 11" M4 (Cellular)',
    deviceType: 'tablet',
    os: 'iPadOS 17.5',
    syncStatus: 'SYNCED',
    lastSyncTime: '3 mins ago',
    lastActionSummary: 'Reviewed daily check-in & schedule',
    batteryLevel: 82,
    networkType: 'STC Fiber Home WiFi',
    isOnline: true,
    latencyMs: 18
  },
  {
    memberId: 'circle-03',
    memberName: 'Dr. Sarah Al-Khatib',
    memberRole: 'CLINICIAN',
    relation: 'Geriatrician (د. سارة الخطيب)',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
    deviceModel: 'KFSH Clinical Station Mac',
    deviceType: 'desktop',
    os: 'macOS Sonoma 14.5',
    syncStatus: 'SYNCED',
    lastSyncTime: 'Today, 08:30 AM',
    lastActionSummary: 'Longitudinal ACB risk report telemetry synced',
    batteryLevel: 100,
    networkType: 'Hospital Secure LAN (Encrypted)',
    isOnline: true,
    latencyMs: 8
  },
  {
    memberId: 'senior-host',
    memberName: 'Hajjah Fatima (This Device)',
    memberRole: 'PRIMARY_CAREGIVER',
    relation: 'Mother / Senior Host (الوالدة)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    deviceModel: 'Samsung Galaxy Tab S9 Ultra',
    deviceType: 'tablet',
    os: 'Android 14 (One UI 6.1)',
    syncStatus: 'SYNCED',
    lastSyncTime: 'Real-time WebSocket Live',
    lastActionSummary: 'Voice Check-in & Intake Host Node',
    batteryLevel: 88,
    networkType: 'Home 5G Mesh WiFi',
    isOnline: true,
    latencyMs: 6
  }
];

export const INITIAL_MEDICATION_SYNC_LOGS: MedicationSyncAuditLog[] = [
  {
    id: 'sync-log-01',
    timestamp: 'Today, 08:45 AM',
    medicationId: 'med-05',
    medicationName: 'Lisinopril 10mg',
    action: 'DOSE_CONFIRMED',
    performedBy: 'Maryam Al-Hashemi (iPhone 15 Pro)',
    deviceId: 'dev-maryam-ios-9482',
    deviceType: 'Mobile App',
    syncLatencyMs: 16,
    encryptionProtocol: 'TLS 1.3 • AES-256 E2EE'
  },
  {
    id: 'sync-log-02',
    timestamp: 'Today, 08:45 AM',
    medicationId: 'med-03',
    medicationName: 'Metformin 500mg',
    action: 'DOSE_CONFIRMED',
    performedBy: 'Hajjah Fatima (Voice Check-in)',
    deviceId: 'dev-senior-tablet-001',
    deviceType: 'Senior Tablet',
    syncLatencyMs: 12,
    encryptionProtocol: 'TLS 1.3 • AES-256 E2EE'
  },
  {
    id: 'sync-log-03',
    timestamp: 'Yesterday, 10:15 PM',
    medicationId: 'med-01',
    medicationName: 'Amitriptyline 25mg',
    action: 'DOSE_CONFIRMED',
    performedBy: 'Maryam Al-Hashemi (Caregiver Confirmation)',
    deviceId: 'dev-maryam-ios-9482',
    deviceType: 'Mobile App',
    syncLatencyMs: 22,
    encryptionProtocol: 'TLS 1.3 • AES-256 E2EE'
  },
  {
    id: 'sync-log-04',
    timestamp: 'Yesterday, 09:00 PM',
    medicationId: 'med-04',
    medicationName: 'Atorvastatin 20mg',
    action: 'DOSE_CONFIRMED',
    performedBy: 'Hajjah Fatima (Senior Direct Check)',
    deviceId: 'dev-senior-tablet-001',
    deviceType: 'Senior Tablet',
    syncLatencyMs: 14,
    encryptionProtocol: 'TLS 1.3 • AES-256 E2EE'
  },
  {
    id: 'sync-log-05',
    timestamp: 'Yesterday, 02:00 PM',
    medicationId: 'med-02',
    medicationName: 'Chlorpheniramine 4mg',
    action: 'REMINDER_SENT',
    performedBy: 'Wanees Autonomous Cloud Scheduler',
    deviceId: 'cloud-orchestrator-node-01',
    deviceType: 'Cloud Relay',
    syncLatencyMs: 9,
    encryptionProtocol: 'TLS 1.3 • AES-256 E2EE'
  }
];

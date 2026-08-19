import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudCheck, 
  RefreshCw, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Clock, 
  Activity, 
  Sparkles, 
  ChevronRight, 
  X, 
  Zap, 
  Radio, 
  Lock, 
  ArrowUpRight, 
  BatteryMedium, 
  Send,
  AlertCircle,
  Pill,
  Info
} from 'lucide-react';
import { 
  CareCircleDeviceSync, 
  MedicationSyncAuditLog, 
  CareCircleMember, 
  Medication, 
  SupportedLanguage 
} from '../../types';
import { INITIAL_CARECIRCLE_DEVICES, INITIAL_MEDICATION_SYNC_LOGS } from '../../data/careCircleSyncData';
import { notificationAudio } from '../../services/notificationService';

interface MedicationCloudSyncIndicatorProps {
  medications: Medication[];
  careCircle?: CareCircleMember[];
  language: SupportedLanguage;
  onToggleMedicationTaken?: (id: string) => void;
  onBulkUpdateMedications?: (updates: { id: string; action: 'TAKE' | 'SKIP' | 'RESET'; note?: string; reason?: string }[]) => void;
  className?: string;
  variant?: 'compact' | 'detailed' | 'header-bar';
}

export const MedicationCloudSyncIndicator: React.FC<MedicationCloudSyncIndicatorProps> = ({
  medications = [],
  careCircle = [],
  language,
  onToggleMedicationTaken,
  onBulkUpdateMedications,
  className = '',
  variant = 'compact'
}) => {
  const isRtl = language === 'ar';

  const [devices, setDevices] = useState<CareCircleDeviceSync[]>(INITIAL_CARECIRCLE_DEVICES);
  const [syncLogs, setSyncLogs] = useState<MedicationSyncAuditLog[]>(INITIAL_MEDICATION_SYNC_LOGS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncSecondsAgo, setLastSyncSecondsAgo] = useState<number>(4);
  const [isHubModalOpen, setIsHubModalOpen] = useState<boolean>(false);
  const [justSyncedBanner, setJustSyncedBanner] = useState<boolean>(false);
  const [pingedMemberId, setPingedMemberId] = useState<string | null>(null);
  const [simulatedActionMessage, setSimulatedActionMessage] = useState<string | null>(null);

  // Ticking timer for sync freshness
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSyncSecondsAgo(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Force Cloud Sync Handshake
  const handleTriggerManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    notificationAudio.playReminderChime();

    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncSecondsAgo(0);
      setJustSyncedBanner(true);
      notificationAudio.playSuccessChime();

      // Update devices last sync
      setDevices(prev => prev.map(d => ({
        ...d,
        syncStatus: 'SYNCED',
        lastSyncTime: language === 'ar' ? 'الآن (مباشر)' : 'Just now (Live)',
        latencyMs: Math.floor(Math.random() * 12) + 8
      })));

      // Add audit log
      const newLog: MedicationSyncAuditLog = {
        id: `sync-manual-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        medicationId: 'all',
        medicationName: language === 'ar' ? 'مزامنة شاملة لكافة الأدوية' : 'Full Medication Schedule Sync',
        action: 'SCHEDULE_SYNCED',
        performedBy: language === 'ar' ? 'المستخدم (طلب يدوي)' : 'Senior Host (Manual Trigger)',
        deviceId: 'dev-senior-tablet-001',
        deviceType: 'Senior Tablet',
        syncLatencyMs: 14,
        encryptionProtocol: 'TLS 1.3 • AES-256 E2EE'
      };
      setSyncLogs(prev => [newLog, ...prev]);

      setTimeout(() => setJustSyncedBanner(false), 3500);
    }, 750);
  };

  // Ping a specific device
  const handlePingDevice = (memberId: string) => {
    setPingedMemberId(memberId);
    notificationAudio.playReminderChime();

    setTimeout(() => {
      setPingedMemberId(null);
      setDevices(prev => prev.map(d => {
        if (d.memberId === memberId) {
          return {
            ...d,
            lastSyncTime: language === 'ar' ? 'الآن (استجابة فورية)' : 'Just now (ACK)',
            latencyMs: Math.floor(Math.random() * 8) + 6
          };
        }
        return d;
      }));
    }, 600);
  };

  // Simulate Caregiver (Maryam) confirming a dose from iPhone
  const handleSimulateMaryamConfirmDose = (med: Medication) => {
    if (!onToggleMedicationTaken) return;
    setIsSyncing(true);

    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncSecondsAgo(0);

      // Toggle the med
      onToggleMedicationTaken(med.id);

      const msg = language === 'ar' 
        ? `📱 قامت مريم (الابنة) بتأكيد تناول جرعة "${med.name}" عبر هاتفها (iPhone 15 Pro). تم تحديث الشاشة فوراً.`
        : `📱 Maryam (Daughter) confirmed "${med.name}" dose via her iPhone 15 Pro. Synced to your screen in real-time.`;
      
      setSimulatedActionMessage(msg);
      notificationAudio.playSuccessChime();

      // Log event
      const newLog: MedicationSyncAuditLog = {
        id: `sync-sim-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        medicationId: med.id,
        medicationName: `${med.name} ${med.dosage}`,
        action: 'DOSE_CONFIRMED',
        performedBy: 'Maryam Al-Hashemi (iPhone 15 Pro)',
        deviceId: 'dev-maryam-ios-9482',
        deviceType: 'Mobile App',
        syncLatencyMs: 15,
        encryptionProtocol: 'TLS 1.3 • AES-256 E2EE'
      };
      setSyncLogs(prev => [newLog, ...prev]);

      // Update Maryam device status
      setDevices(prev => prev.map(d => {
        if (d.memberId === 'circle-01') {
          return {
            ...d,
            lastSyncTime: language === 'ar' ? 'الآن (مباشر)' : 'Just now (Live)',
            lastActionSummary: `Confirmed ${med.name} dose`
          };
        }
        return d;
      }));

      setTimeout(() => setSimulatedActionMessage(null), 5000);
    }, 650);
  };

  const untakenMeds = medications.filter(m => !m.isTakenToday);
  const sampleUntaken = untakenMeds[0] || medications[0];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="w-3.5 h-3.5" />;
      case 'tablet': return <Tablet className="w-3.5 h-3.5" />;
      case 'desktop': return <Monitor className="w-3.5 h-3.5" />;
      default: return <Smartphone className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      {/* Indicator Widget Container */}
      <div 
        id="carecircle-cloud-sync-indicator"
        className={`w-full rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
      >
        {/* Left Side: Cloud status + Pulse + Device Avatars */}
        <div className="flex items-center gap-3 min-w-0">
          
          {/* Animated Cloud Icon Node */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              {isSyncing ? (
                <RefreshCw className="w-5 h-5 animate-spin text-teal-500" />
              ) : (
                <Cloud className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              )}
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </span>
          </div>

          {/* Sync Status Text & Active Devices Meta */}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{language === 'ar' ? 'المزامنة السحابية الفورية' : 'CareCircle™ Cloud Sync'}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-800">
                  {isSyncing 
                    ? (language === 'ar' ? 'جاري المزامنة...' : 'Syncing...') 
                    : (language === 'ar' ? 'متصل ومباشر' : 'LIVE 100%')}
                </span>
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-300 font-semibold">
                <Users className="w-3 h-3" />
                {language === 'ar' ? `${devices.length} أجهزة عائلية متصلة` : `${devices.length} Family Devices Connected`}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-2.5 h-2.5" />
                {language === 'ar' 
                  ? (lastSyncSecondsAgo < 5 ? 'تمت المزامنة للتو' : `منذ ${lastSyncSecondsAgo} ثانية`) 
                  : (lastSyncSecondsAgo < 5 ? 'Synced just now' : `Synced ${lastSyncSecondsAgo}s ago`)}
              </span>
            </p>
          </div>
        </div>

        {/* Right Side: CareCircle Member Device Stack & Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          
          {/* Avatar Facepile with Device Badges */}
          <div className="flex items-center -space-x-2 rtl:space-x-reverse" title="Connected family members">
            {devices.map((device) => (
              <div 
                key={device.memberId} 
                className="relative group cursor-pointer"
                onClick={() => setIsHubModalOpen(true)}
              >
                <img 
                  src={device.avatar} 
                  alt={device.memberName} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-900 ring-1 ring-teal-500/30 group-hover:scale-110 transition-transform" 
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[8px] border border-white dark:border-slate-800">
                  {getDeviceIcon(device.deviceType)}
                </span>

                {/* Micro Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg whitespace-nowrap z-30 shadow-lg pointer-events-none">
                  <span className="font-bold">{device.memberName}</span>
                  <span className="text-slate-400">{device.deviceModel} • {device.lastSyncTime}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Manual Sync Button */}
          <button
            type="button"
            id="btn-trigger-manual-cloud-sync"
            onClick={handleTriggerManualSync}
            disabled={isSyncing}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center"
            title={language === 'ar' ? 'إجراء مزامنة فورية مع السحابة' : 'Force Cloud Sync'}
          >
            <RefreshCw className={`w-4 h-4 text-teal-600 dark:text-teal-400 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>

          {/* Open Detailed Sync Hub Button */}
          <button
            type="button"
            id="btn-open-sync-hub-details"
            onClick={() => setIsHubModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{language === 'ar' ? 'سجل الأجهزة' : 'Sync Hub'}</span>
          </button>

        </div>
      </div>

      {/* Instant Notification Banner when live action occurs */}
      {simulatedActionMessage && (
        <div className="p-3.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-between shadow-lg shadow-indigo-600/20 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 animate-bounce shrink-0" />
            <span>{simulatedActionMessage}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSimulatedActionMessage(null)}
            className="p-1 rounded-lg hover:bg-white/20"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Just Synced Banner */}
      {justSyncedBanner && (
        <div className="p-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'تمت مزامنة جميع الأدوية بنجاح عبر أجهزة العائلة (معدل استجابة 14ms).' : 'All medications successfully synchronized across family devices (14ms latency).'}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">E2EE OK</span>
        </div>
      )}

      {/* DETAILED CARE CIRCLE CLOUD SYNC MODAL / HUB */}
      {isHubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-scaleUp"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white flex items-center justify-between border-b border-teal-800/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                  <CloudCheck className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {language === 'ar' ? 'مركز المزامنة السحابية المباشرة' : 'CareCircle™ Multi-Device Sync Hub'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black">
                      ACTIVE REAL-TIME
                    </span>
                  </div>
                  <p className="text-xs text-teal-200/80 mt-0.5">
                    {language === 'ar' 
                      ? 'مزامنة فورية مشفرة بين أجهزة كبار السن، الأبناء، والعيادة الطبية'
                      : 'End-to-end encrypted real-time state relay across senior, family, and clinic devices'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsHubModalOpen(false)}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-white">
              
              {/* Security & Protocol Status Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block font-bold">{language === 'ar' ? 'التشفير' : 'Encryption'}</span>
                  <span className="text-xs font-black text-teal-600 dark:text-teal-400">AES-256 GCM</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block font-bold">{language === 'ar' ? 'المعيار الطبي' : 'Standard'}</span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">HL7 / FHIR R4</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block font-bold">{language === 'ar' ? 'زمن الاستجابة' : 'Avg Latency'}</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">14 ms</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block font-bold">{language === 'ar' ? 'سلامة البيانات' : 'Integrity'}</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">100% SHA-256</span>
                </div>
              </div>

              {/* Connected Family & Clinical Devices Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{language === 'ar' ? 'الأجهزة المتصلة في دائرة الرعاية' : 'Connected Care Circle Devices'}</span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    {devices.length} {language === 'ar' ? 'أجهزة نشطة' : 'Active Nodes'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {devices.map((dev) => {
                    const isPinged = pingedMemberId === dev.memberId;
                    return (
                      <div 
                        key={dev.memberId}
                        className={`p-4 rounded-2xl border transition-all ${
                          isPinged 
                            ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-400 shadow-md scale-98' 
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img 
                                src={dev.avatar} 
                                alt={dev.memberName} 
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                              />
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] border-2 border-white dark:border-slate-900">
                                {getDeviceIcon(dev.deviceType)}
                              </span>
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                                {dev.memberName}
                              </h5>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {dev.relation}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handlePingDevice(dev.memberId)}
                            className="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/60 border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1 transition-colors"
                          >
                            <Radio className={`w-3 h-3 ${isPinged ? 'animate-ping text-emerald-500' : ''}`} />
                            <span>{isPinged ? (language === 'ar' ? 'استجابة...' : 'Pinging...') : (language === 'ar' ? 'فحص' : 'Ping')}</span>
                          </button>
                        </div>

                        {/* Device Info & Status Row */}
                        <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                            <span className="font-mono text-[10px]">{dev.deviceModel} ({dev.os})</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{dev.latencyMs}ms</span>
                          </div>

                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px]">
                            <span>{dev.networkType}</span>
                            <span>{dev.batteryLevel ? `🔋 ${dev.batteryLevel}%` : '⚡ Powered'}</span>
                          </div>

                          <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                            <span className="truncate">{dev.lastActionSummary}</span>
                            <span className="text-teal-600 dark:text-teal-400 font-bold shrink-0 ml-1.5">{dev.lastSyncTime}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Simulation Sandbox */}
              {sampleUntaken && onToggleMedicationTaken && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <h4 className="text-xs font-black text-amber-900 dark:text-amber-200">
                        {language === 'ar' ? 'تجربة التفاعل السحابي الفوري (محاكاة الأجهزة)' : 'Live Multi-Device Simulation Sandbox'}
                      </h4>
                    </div>
                    <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                      INTERACTIVE
                    </span>
                  </div>

                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    {language === 'ar'
                      ? 'يمكنك اختبار كيفية وصول التحديثات في أجزاء من الثانية عندما يقوم أحد أفراد العائلة (مثل مريم) بتأكيد جرعة من هاتفها.'
                      : 'Test how instantaneous state synchronization propagates when a caregiver (e.g. Maryam) logs a dose from her mobile device.'}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      id="btn-simulate-maryam-confirm"
                      onClick={() => handleSimulateMaryamConfirmDose(sampleUntaken)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>
                        {language === 'ar' 
                          ? `محاكاة تأكيد مريم لجرعة (${sampleUntaken.name})` 
                          : `Simulate Maryam logging (${sampleUntaken.name})`}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Real-time Medication Sync Audit Stream */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{language === 'ar' ? 'سجل العمليات المتزامنة بين الأجهزة' : 'Recent Multi-Device Sync Stream'}</span>
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {syncLogs.map((log) => (
                    <div 
                      key={log.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 font-bold text-xs">
                          <Pill className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <span className="font-extrabold text-slate-900 dark:text-white block truncate">
                            {log.medicationName}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {log.performedBy} • <strong className="text-teal-600 dark:text-teal-400">{log.syncLatencyMs}ms</strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 block">{log.timestamp}</span>
                        <span className="text-[9px] bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded font-mono">
                          {log.encryptionProtocol}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Lock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Wanees™ Real-Time CareMesh Sync Protocol</span>
              </div>

              <button
                type="button"
                onClick={() => setIsHubModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Compass, 
  Radio, 
  Phone, 
  Users, 
  Building, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Maximize2, 
  BatteryMedium, 
  Wifi, 
  Send,
  Zap,
  Info,
  Footprints,
  Bell,
  ArrowUpRight,
  RefreshCw,
  LocateFixed
} from 'lucide-react';
import { 
  RufqaSafetyZone, 
  RufqaProximityAlert, 
  RufqaLiveTelemetry, 
  SupportedLanguage,
  RufqaPilgrimState
} from '../../types';
import { 
  INITIAL_RUFQA_SAFETY_ZONES, 
  INITIAL_RUFQA_TELEMETRY, 
  INITIAL_RUFQA_PROXIMITY_ALERTS, 
  RITUAL_SIMULATION_PRESETS,
  RitualPreset 
} from '../../data/rufqaGeolocationData';
import { notificationAudio } from '../../services/notificationService';
import { speakText } from '../../services/api';

interface RufqaGeolocationMapProps {
  rufqaState: RufqaPilgrimState;
  onUpdateRufqaState: (state: RufqaPilgrimState) => void;
  language: SupportedLanguage;
  voiceEnabled: boolean;
}

export const RufqaGeolocationMap: React.FC<RufqaGeolocationMapProps> = ({
  rufqaState,
  onUpdateRufqaState,
  language,
  voiceEnabled
}) => {
  const isRtl = language === 'ar';

  const [telemetry, setTelemetry] = useState<RufqaLiveTelemetry>(INITIAL_RUFQA_TELEMETRY);
  const [safetyZones, setSafetyZones] = useState<RufqaSafetyZone[]>(INITIAL_RUFQA_SAFETY_ZONES);
  const [proximityAlerts, setProximityAlerts] = useState<RufqaProximityAlert[]>(INITIAL_RUFQA_PROXIMITY_ALERTS);
  const [activePresetId, setActivePresetId] = useState<string>('preset-tawaf-gate79');
  const [mapMode, setMapMode] = useState<'schematic' | 'satellite' | 'heatmap'>('schematic');
  const [selectedZone, setSelectedZone] = useState<RufqaSafetyZone | null>(safetyZones[0]);
  const [isSimulatingLiveTick, setIsSimulatingLiveTick] = useState<boolean>(true);
  const [hapticPingMessage, setHapticPingMessage] = useState<string | null>(null);

  // Micro jitter simulation for live GPS realism
  useEffect(() => {
    if (!isSimulatingLiveTick) return;

    const interval = setInterval(() => {
      setTelemetry(prev => {
        const jitterLat = (Math.random() - 0.5) * 0.00002;
        const jitterLng = (Math.random() - 0.5) * 0.00002;
        return {
          ...prev,
          currentLat: +(prev.currentLat + jitterLat).toFixed(6),
          currentLng: +(prev.currentLng + jitterLng).toFixed(6),
          lastUpdated: language === 'ar' ? 'الآن (مباشر عبر GPS)' : 'Just now (Live RTK Fix)'
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingLiveTick, language]);

  // Handle Preset Switching
  const handleApplyPreset = (preset: RitualPreset) => {
    setActivePresetId(preset.id);
    notificationAudio.playReminderChime();

    const isCritical = preset.statusSeverity === 'CRITICAL';
    const isWarning = preset.statusSeverity === 'WARNING';

    // Update telemetry
    setTelemetry(prev => ({
      ...prev,
      currentLat: preset.lat,
      currentLng: preset.lng,
      activeRitualStage: preset.ritualStage,
      distanceToMeetingPointMeters: preset.distanceToMeetingPointMeters,
      distanceToLeaderMeters: preset.distanceToLeaderMeters,
      distanceToHotelMeters: preset.distanceToHotelMeters,
      currentZoneId: preset.zoneId,
      activeProximityStatus: preset.proximityStatus,
      lastUpdated: language === 'ar' ? 'تم التحديث للتو' : 'Just updated'
    }));

    // Update safety zones isInside status
    setSafetyZones(prev => prev.map(z => ({
      ...z,
      isInside: z.id === preset.zoneId || (preset.proximityStatus === 'WITHIN_SAFE_PERIMETER' && z.id === 'zone-mataf-safe')
    })));

    // Update App State
    const updatedState: RufqaPilgrimState = {
      ...rufqaState,
      currentLocationName: isRtl ? preset.locationNameAr : preset.locationName,
      gpsCoordinates: { lat: preset.lat, lng: preset.lng },
      isLostModeActive: isCritical ? true : rufqaState.isLostModeActive,
      lastBeaconBroadcast: isCritical ? new Date().toISOString() : rufqaState.lastBeaconBroadcast
    };
    onUpdateRufqaState(updatedState);

    // Create new alert if critical or warning
    if (isCritical || isWarning) {
      const newAlert: RufqaProximityAlert = {
        id: `alert-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        severity: preset.statusSeverity,
        title: preset.name,
        titleAr: preset.nameAr,
        message: preset.statusDescription,
        messageAr: preset.statusDescriptionAr,
        targetCaregivers: ['Maryam Al-Hashemi (Daughter)', 'Ustadh Ahmad (Guide)'],
        distanceFromSafeZoneMeters: preset.distanceToLeaderMeters,
        suggestedAction: isCritical ? 'Contact Tawafa leader and initiate Red Crescent protocol.' : 'Send gentle voice redirection prompt.',
        suggestedActionAr: isCritical ? 'الاتصال الفوري بمرشد الحملة وتفعيل بروتوكول الهلال الأحمر.' : 'تشغيل توجيه صوتي لطيف نحو ممر الأمان.',
        isAcknowledged: false
      };
      setProximityAlerts(prev => [newAlert, ...prev]);

      if (voiceEnabled) {
        const spoken = isRtl ? preset.statusDescriptionAr : preset.statusDescription;
        speakText(spoken, language);
      }
    } else {
      notificationAudio.playSuccessChime();
    }
  };

  // Ping senior wristband / phone
  const handleSendHapticPing = () => {
    notificationAudio.playSuccessChime();
    const msg = isRtl 
      ? '📡 تم إرسال نبضة اهتزازية وإشعار صوتي لطيف لسوار الوالدة: "أنتِ بأمان وبجوار باب الملك فهد"'
      : '📡 Haptic pulse & voice ping sent to senior wristband: "You are safe near Gate 79"';
    setHapticPingMessage(msg);
    setTimeout(() => setHapticPingMessage(null), 5000);
  };

  const getStatusBadge = () => {
    switch (telemetry.activeProximityStatus) {
      case 'WITHIN_SAFE_PERIMETER':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isRtl ? 'داخل نطاق الأمان المعتمد' : 'Inside Safe Perimeter'}</span>
          </span>
        );
      case 'APPROACHING_BOUNDARY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>{isRtl ? 'تنبيه: اقتراب من حدود المسار' : 'Warning: Approaching Boundary'}</span>
          </span>
        );
      case 'OUTSIDE_SAFETY_ZONE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black animate-bounce">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>{isRtl ? 'خطر: خارج النطاق الآمن' : 'Critical: Outside Safety Zone'}</span>
          </span>
        );
    }
  };

  return (
    <div id="rufqa-geolocation-tracking-suite" className="space-y-6">

      {/* Main Map & Live Radar Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-amber-200 dark:border-slate-800 shadow-md space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-950/80 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isRtl ? 'نظام التتبع الجغرافي ونطاقات الأمان في المشاعر' : 'Ritual Geolocation & Safety Geofence Tracking'}
                </h3>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl 
                  ? 'رادار لحظي لموقع الحاجة فاطمة مع تنبيهات القرب والابتعاد لمرشد الحملة والعائلة'
                  : 'Real-time GNSS spatial telemetry, designated safe zones, and automatic caregiver proximity radar'}
              </p>
            </div>
          </div>

          {/* Map Layer Mode Toggles */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start sm:self-center">
            <button
              type="button"
              onClick={() => setMapMode('schematic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${mapMode === 'schematic' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {isRtl ? 'المخطط الهندسي' : 'Schematic'}
            </button>
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${mapMode === 'satellite' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {isRtl ? 'الأقمار الصناعية' : 'Satellite'}
            </button>
            <button
              type="button"
              onClick={() => setMapMode('heatmap')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${mapMode === 'heatmap' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {isRtl ? 'كثافة الحشود' : 'Crowd Heat'}
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-bold block">{isRtl ? 'المسافة لنقطة اللقاء' : 'To Meeting Point'}</span>
              <strong className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate block">
                {telemetry.distanceToMeetingPointMeters} {isRtl ? 'متراً' : 'meters'}
              </strong>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-bold block">{isRtl ? 'المسافة للمرشد أحمد' : 'To Guide Ahmad'}</span>
              <strong className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate block">
                {telemetry.distanceToLeaderMeters} {isRtl ? 'متراً' : 'meters'}
              </strong>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-bold block">{isRtl ? 'المسافة للفندق (سويس أوتيل)' : 'To Swissôtel'}</span>
              <strong className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate block">
                {telemetry.distanceToHotelMeters} {isRtl ? 'متراً' : 'meters'}
              </strong>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <LocateFixed className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-bold block">{isRtl ? 'دقة الإشارة GNSS' : 'GPS Accuracy'}</span>
              <strong className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 truncate block">
                ±{telemetry.accuracyRadiusMeters}m (RTK Fix)
              </strong>
            </div>
          </div>
        </div>

        {/* HIGH-PRECISION INTERACTIVE MAP & RADAR CANVAS */}
        <div 
          id="rufqa-interactive-geofence-radar"
          className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 shadow-inner flex items-center justify-center select-none"
        >
          {/* Background Map Visual (Schematic or Satellite mode) */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${
            mapMode === 'satellite' 
              ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-stone-950 to-black' 
              : mapMode === 'heatmap'
              ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/80 via-slate-950 to-black'
              : 'bg-slate-950'
          }`}>
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>
          </div>

          {/* Radar Radial Scanning Sweeper */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 sm:w-88 h-72 sm:h-88 rounded-full border border-teal-500/20 animate-spin opacity-40 [animation-duration:12s]">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-teal-400/20 to-transparent rounded-tl-full"></div>
            </div>
            <div className="absolute w-52 h-52 rounded-full border border-teal-500/30"></div>
            <div className="absolute w-32 h-32 rounded-full border border-teal-500/40"></div>
          </div>

          {/* Holy Sites Visual Landmarks on Map */}
          
          {/* 1. Kaaba & Mataf Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="w-10 h-10 bg-slate-900 border-2 border-amber-400 rounded-lg shadow-lg shadow-amber-400/30 flex items-center justify-center text-amber-300 font-bold text-[10px]">
              🕋
            </div>
            <span className="text-[10px] font-black text-amber-300 mt-1 bg-black/80 px-2 py-0.5 rounded-full border border-amber-400/40">
              {isRtl ? 'الكعبة المشرفة / صحن المطاف' : 'Holy Kaaba / Mataf'}
            </span>
          </div>

          {/* 2. King Fahd Gate 79 (Designated Meeting Point) */}
          <div className="absolute top-[68%] left-[48%] -translate-x-1/2 flex flex-col items-center group cursor-pointer">
            <div className="relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <div className="w-7 h-7 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center text-white text-xs shadow-md">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[9px] font-bold text-teal-200 bg-slate-900/90 px-1.5 py-0.5 rounded-md mt-1 border border-teal-500/40 whitespace-nowrap">
              {isRtl ? 'باب الملك فهد 79 (نقطة التجمع)' : 'Gate 79 (Meeting Point)'}
            </span>
          </div>

          {/* 3. Swissôtel Clock Tower */}
          <div className="absolute bottom-6 right-6 flex flex-col items-center">
            <div className="w-7 h-7 rounded-xl bg-blue-600 border border-blue-400 flex items-center justify-center text-white text-xs">
              <Building className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold text-blue-200 bg-slate-900/80 px-1.5 py-0.5 rounded mt-0.5">
              {isRtl ? 'فندق سويس أوتيل' : 'Swissôtel'}
            </span>
          </div>

          {/* 4. Marwah Boundary */}
          <div className="absolute top-6 right-10 flex flex-col items-center">
            <div className="w-6 h-6 rounded-lg bg-amber-600/80 border border-amber-400 flex items-center justify-center text-white text-[10px]">
              🏃
            </div>
            <span className="text-[9px] font-bold text-amber-200 bg-slate-900/80 px-1.5 py-0.5 rounded mt-0.5">
              {isRtl ? 'مخرج المروة' : 'Marwah Exit'}
            </span>
          </div>

          {/* 5. Group Leader Ahmad Marker */}
          <div className="absolute top-[64%] left-[44%] flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-indigo-300 flex items-center justify-center text-white text-[9px] shadow-sm">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-[8px] font-extrabold text-indigo-200 bg-slate-900/90 px-1 rounded mt-0.5">
              {isRtl ? 'المرشد أحمد' : 'Guide Ahmad'}
            </span>
          </div>

          {/* SENIOR LIVE LOCATION PIN (Fatima) WITH COMPASS CONE */}
          <div 
            className="absolute transition-all duration-700 ease-out z-20"
            style={{
              top: activePresetId === 'preset-tawaf-gate79' ? '65%' :
                   activePresetId === 'preset-sai-boundary' ? '25%' :
                   activePresetId === 'preset-mina-camp42' ? '50%' :
                   activePresetId === 'preset-jamarat-stray' ? '15%' : '80%',
              left: activePresetId === 'preset-tawaf-gate79' ? '49%' :
                    activePresetId === 'preset-sai-boundary' ? '70%' :
                    activePresetId === 'preset-mina-camp42' ? '50%' :
                    activePresetId === 'preset-jamarat-stray' ? '20%' : '75%'
            }}
          >
            {/* Accuracy Bubble */}
            <div className="absolute -inset-4 bg-teal-400/20 rounded-full animate-ping pointer-events-none"></div>

            {/* Compass Cone Direction */}
            <div 
              className="absolute -top-6 -left-6 w-16 h-16 pointer-events-none opacity-60"
              style={{ transform: `rotate(${telemetry.headingDegrees}deg)` }}
            >
              <div className="w-full h-full bg-gradient-to-t from-teal-400/40 to-transparent clip-triangle"></div>
            </div>

            {/* Senior Avatar Node */}
            <div className="relative cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-amber-500 border-3 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-slate-950 font-black text-xs ring-4 ring-teal-400/40">
                <span>🧕</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>

              {/* Hover Badge */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-xl whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none">
                <strong className="text-amber-400 block">{rufqaState.pilgrimName}</strong>
                <span>{telemetry.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Dotted Breadcrumb Trail */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-70">
            <path
              d="M 220 280 Q 240 260 260 250 T 270 240"
              fill="none"
              stroke="#0d9488"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
          </svg>

          {/* Top-Right HUD Badge */}
          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-[11px] flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-mono">{telemetry.currentLat}° N, {telemetry.currentLng}° E</span>
          </div>

          {/* Bottom-Left Compass Heading */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700 text-white text-xs flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{telemetry.headingDegrees}° {isRtl ? 'جنوب' : 'South'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{telemetry.speedKmh} km/h</span>
          </div>
        </div>

        {/* Haptic / Voice Ping Toast Message */}
        {hapticPingMessage && (
          <div className="p-3.5 rounded-2xl bg-teal-600 text-white text-xs font-bold flex items-center justify-between shadow-lg shadow-teal-600/20 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 animate-bounce" />
              <span>{hapticPingMessage}</span>
            </div>
            <button onClick={() => setHapticPingMessage(null)} className="p-1 rounded hover:bg-white/20">
              ✕
            </button>
          </div>
        )}

        {/* INTERACTIVE RITUAL STAGES SIMULATION SANDBOX */}
        <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h4 className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-200">
                {isRtl ? 'محاكاة مسار المناسك وتجربة تنبيهات القرب الحية' : 'Ritual Stage Simulation & Proximity Alert Sandbox'}
              </h4>
            </div>
            <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-extrabold">
              REAL-TIME
            </span>
          </div>

          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            {isRtl 
              ? 'اختبر استجابة النظام الفورية عند انتقال الحاجة فاطمة بين مراحل الحج المختلفة، وتوليد التنبيهات الذكية عند الاقتراب من حدود المسار أو الابتعاد.'
              : 'Simulate the senior moving through various Hajj & Umrah stages to observe real-time proximity alerts and safety geofence reactions.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {RITUAL_SIMULATION_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3.5 rounded-2xl border text-left rtl:text-right transition-all flex flex-col justify-between gap-2 ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md font-bold' 
                      : 'bg-white dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black truncate">
                      {isRtl ? preset.nameAr : preset.name}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                      preset.statusSeverity === 'CRITICAL' ? 'bg-rose-600 text-white' :
                      preset.statusSeverity === 'WARNING' ? 'bg-amber-600 text-white' :
                      'bg-emerald-600 text-white'
                    }`}>
                      {preset.statusSeverity}
                    </span>
                  </div>

                  <p className={`text-[11px] leading-snug line-clamp-2 ${isActive ? 'text-slate-900 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                    {isRtl ? preset.statusDescriptionAr : preset.statusDescription}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* DESIGNATED SAFETY GEOFENCES MATRIX */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{isRtl ? 'نطاقات الأمان الجغرافية المعتمدة (Geofences)' : 'Approved Ritual Geofences & Safety Zones'}</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">{safetyZones.length} Zones Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {safetyZones.map((zone) => {
              const isZoneInside = zone.isInside;
              return (
                <div 
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isZoneInside 
                      ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-400 shadow-xs' 
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        zone.type === 'MEETING_POINT' ? 'bg-teal-500 animate-ping' :
                        zone.type === 'SAFE_GREEN' ? 'bg-emerald-500' :
                        zone.type === 'CAUTION_YELLOW' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></span>
                      <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {isRtl ? zone.nameAr : zone.name}
                      </h5>
                    </div>
                    {isZoneInside && (
                      <span className="text-[10px] bg-teal-600 text-white font-black px-1.5 py-0.5 rounded">
                        {isRtl ? 'الموقع الحالي' : 'HERE'}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {isRtl ? zone.descriptionAr : zone.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Radius: {zone.radiusMeters}m</span>
                    <span>{zone.type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PROXIMITY ALERTS STREAM & RAPID CAREGIVER ACTIONS */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>{isRtl ? 'سجل تنبيهات القرب والابتعاد للعائلة' : 'Proximity & Boundary Alerts Feed'}</span>
            </h4>
            <button
              type="button"
              onClick={handleSendHapticPing}
              className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>{isRtl ? 'إرسال نبضة تنبيه للسوار' : 'Ping Senior Wristband'}</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {proximityAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  alert.severity === 'CRITICAL' 
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800' 
                    : alert.severity === 'WARNING'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                      alert.severity === 'CRITICAL' ? 'bg-rose-600 text-white' :
                      alert.severity === 'WARNING' ? 'bg-amber-600 text-white' :
                      'bg-teal-600 text-white'
                    }`}>
                      {alert.severity}
                    </span>
                    <strong className="text-slate-900 dark:text-white font-bold truncate">
                      {isRtl ? alert.titleAr : alert.title}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {isRtl ? alert.messageAr : alert.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <a
                    href={`tel:${rufqaState.tawafaGroupLeader.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>{isRtl ? 'اتصال بالمرشد' : 'Call Guide'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

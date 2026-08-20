// Source: Google Maps Platform Code Assist
import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Circle,
  Polyline,
  ControlPosition,
  MapControl,
  useMap
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Building,
  Users,
  Compass,
  Radio,
  ExternalLink,
  LocateFixed,
  Layers,
  Sparkles,
  Phone,
  Maximize2,
  Key,
  Info
} from 'lucide-react';
import {
  RufqaSafetyZone,
  RufqaLiveTelemetry,
  SupportedLanguage,
  RufqaPilgrimState
} from '../../types';
import { RitualPreset } from '../../data/rufqaGeolocationData';

// Mandatory Attribution & Cloud Map ID
const GMP_INTERNAL_ATTRIBUTION = ['gmp_mcp_codeassist_v1_aistudio'];
const GMP_DEFAULT_MAP_ID = 'DEMO_MAP_ID';

// Emergency Hospital / Clinic POIs in Makkah for Pilgrims
const EMERGENCY_CLINIC_POIS = [
  {
    id: 'poi-ajyad-hospital',
    name: 'Ajyad Emergency Hospital (Haram Plaza)',
    nameAr: 'مستشفى أجياد للطوارئ (ساحات الحرم)',
    lat: 21.4205,
    lng: 39.8282,
    type: 'EMERGENCY_HOSPITAL',
    phone: '997',
    distance: '180m from Kaaba',
    description: '24/7 Rapid Emergency Response & Geriatric Resuscitation Unit.'
  },
  {
    id: 'poi-red-crescent-gate79',
    name: 'Saudi Red Crescent First Aid Station #14',
    nameAr: 'مركز الهلال الأحمر السعودي للإسعاف السريع (نقطة 14)',
    lat: 21.4218,
    lng: 39.8245,
    type: 'FIRST_AID',
    phone: '997',
    distance: '45m from Gate 79',
    description: 'Mobile AEDs, hydration IVs, and wheelchair dispatch.'
  },
  {
    id: 'poi-marwah-clinic',
    name: 'Marwah Emergency Health Center',
    nameAr: 'مركز طوارئ المروة الصحي',
    lat: 21.4251,
    lng: 39.8290,
    type: 'CLINIC',
    phone: '937',
    distance: 'Near Masaa Exit',
    description: 'Heat exhaustion, vitals stabilization, and senior assistance.'
  }
];

// Inner Map Camera Controller Component
interface MapCameraControllerProps {
  center: { lat: number; lng: number };
  zoom: number;
}

const MapCameraController: React.FC<MapCameraControllerProps> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo(center);
    map.setZoom(zoom);
  }, [map, center.lat, center.lng, zoom]);

  return null;
};

interface RufqaGoogleMapProps {
  telemetry: RufqaLiveTelemetry;
  safetyZones: RufqaSafetyZone[];
  activePresetId: string;
  rufqaState: RufqaPilgrimState;
  language: SupportedLanguage;
  onSelectPreset?: (presetId: string) => void;
  onSendHapticPing?: () => void;
}

export const RufqaGoogleMap: React.FC<RufqaGoogleMapProps> = ({
  telemetry,
  safetyZones,
  activePresetId,
  rufqaState,
  language,
  onSelectPreset,
  onSendHapticPing
}) => {
  const isRtl = language === 'ar';
  
  // API Key handling with fallback & Demo Key guidance
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [cameraCenter, setCameraCenter] = useState<{ lat: number; lng: number }>({
    lat: telemetry.currentLat,
    lng: telemetry.currentLng
  });
  const [cameraZoom, setCameraZoom] = useState<number>(17);
  const [mapTypeId, setMapTypeId] = useState<string>('hybrid');
  const [showClinics, setShowClinics] = useState<boolean>(true);
  const [showGeofences, setShowGeofences] = useState<boolean>(true);
  const [isLiveLocked, setIsLiveLocked] = useState<boolean>(true);

  // Sync camera when telemetry / activePreset changes if locked
  useEffect(() => {
    if (isLiveLocked) {
      setCameraCenter({ lat: telemetry.currentLat, lng: telemetry.currentLng });
    }
  }, [telemetry.currentLat, telemetry.currentLng, isLiveLocked]);

  // Recenter to senior
  const handleRecenterSenior = useCallback(() => {
    setIsLiveLocked(true);
    setCameraCenter({ lat: telemetry.currentLat, lng: telemetry.currentLng });
    setCameraZoom(18);
  }, [telemetry.currentLat, telemetry.currentLng]);

  // Recenter to Kaaba
  const handleRecenterKaaba = useCallback(() => {
    setIsLiveLocked(false);
    setCameraCenter({ lat: 21.422487, lng: 39.826206 });
    setCameraZoom(17);
  }, []);

  // Recenter to Gate 79
  const handleRecenterGate79 = useCallback(() => {
    setIsLiveLocked(false);
    setCameraCenter({ lat: 21.4208, lng: 39.8248 });
    setCameraZoom(18);
  }, []);

  // Breadcrumb Trail coordinates
  const breadcrumbCoords = telemetry.breadcrumbTrail
    ? telemetry.breadcrumbTrail.map(b => ({ lat: b.lat, lng: b.lng }))
    : [
        { lat: 21.42255, lng: 39.82635 },
        { lat: 21.42252, lng: 39.82628 },
        { lat: 21.42249, lng: 39.82622 },
        { lat: telemetry.currentLat, lng: telemetry.currentLng }
      ];

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 shadow-inner select-none flex flex-col">
      
      {/* Top Map Action Ribbon */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Badges: Live GNSS Status */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
            <span className="font-mono text-[11px]">
              {telemetry.currentLat.toFixed(5)}°N, {telemetry.currentLng.toFixed(5)}°E
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-semibold text-[11px]">±{telemetry.accuracyRadiusMeters}m (RTK)</span>
          </div>

          <div className="hidden sm:flex items-center px-3 py-1.5 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-200 text-xs font-bold shadow-lg">
            <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
            <span>{telemetry.headingDegrees}° {isRtl ? 'جنوب' : 'S'}</span>
            <span className="mx-1.5 text-amber-400/50">•</span>
            <span>{telemetry.speedKmh} km/h</span>
          </div>
        </div>

        {/* Right Controls: Quick Navigation Shortcuts & View Layers */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          
          <button
            type="button"
            onClick={handleRecenterSenior}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer ${
              isLiveLocked 
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' 
                : 'bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700'
            }`}
            title="Lock camera on Senior (Fatima)"
          >
            <LocateFixed className="w-3.5 h-3.5 text-slate-950 dark:text-slate-950" />
            <span>{isRtl ? 'موقع الوالدة' : 'Senior'}</span>
          </button>

          <button
            type="button"
            onClick={handleRecenterKaaba}
            className="px-3 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold shadow-lg flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            title="Focus Kaaba / Mataf Sanctuary"
          >
            <span>🕋</span>
            <span className="hidden sm:inline">{isRtl ? 'الكعبة' : 'Kaaba'}</span>
          </button>

          <button
            type="button"
            onClick={handleRecenterGate79}
            className="px-3 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold shadow-lg flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            title="Focus Gate 79 Rendezvous"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">{isRtl ? 'باب 79' : 'Gate 79'}</span>
          </button>

          {/* Toggle Layers (Clinics & Geofences) */}
          <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700">
            <button
              type="button"
              onClick={() => setShowClinics(!showClinics)}
              className={`p-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                showClinics ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Red Crescent & Medical Stations"
            >
              🏥
            </button>
            <button
              type="button"
              onClick={() => setShowGeofences(!showGeofences)}
              className={`p-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                showGeofences ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Safety Geofence Perimeters"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Google Maps Render Container */}
      <div className="w-full flex-1 relative">
        <APIProvider
          apiKey={apiKey}
          language={language === 'ar' ? 'ar' : 'en'}
          region="SA"
          libraries={['places', 'marker', 'geometry']}
        >
          <Map
            defaultCenter={{ lat: telemetry.currentLat, lng: telemetry.currentLng }}
            defaultZoom={17}
            mapId={GMP_DEFAULT_MAP_ID}
            internalUsageAttributionIds={GMP_INTERNAL_ATTRIBUTION}
            mapTypeId={mapTypeId}
            gestureHandling="greedy"
            disableDefaultUI={false}
            zoomControl={true}
            streetViewControl={true}
            mapTypeControl={true}
            fullscreenControl={false}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Camera Synchronizer */}
            <MapCameraController center={cameraCenter} zoom={cameraZoom} />

            {/* 1. SAFETY GEOFENCE CIRCLES ON GOOGLE MAP */}
            {showGeofences && safetyZones.map((zone) => {
              const fillColor = zone.type === 'SAFE_GREEN' ? '#10b981' :
                                zone.type === 'MEETING_POINT' ? '#0d9488' :
                                zone.type === 'CAUTION_YELLOW' ? '#f59e0b' : '#ef4444';
              return (
                <Circle
                  key={zone.id}
                  center={zone.centerCoordinates}
                  radius={zone.radiusMeters}
                  fillColor={fillColor}
                  fillOpacity={zone.isInside ? 0.28 : 0.14}
                  strokeColor={fillColor}
                  strokeOpacity={0.85}
                  strokeWeight={zone.isInside ? 2.5 : 1.5}
                />
              );
            })}

            {/* 2. ACCURACY BUBBLE AROUND SENIOR */}
            <Circle
              center={{ lat: telemetry.currentLat, lng: telemetry.currentLng }}
              radius={Math.max(telemetry.accuracyRadiusMeters, 4)}
              fillColor="#0d9488"
              fillOpacity={0.2}
              strokeColor="#14b8a6"
              strokeOpacity={0.7}
              strokeWeight={1.5}
            />

            {/* 3. BREADCRUMB HISTORICAL ROUTE POLYLINE */}
            <Polyline
              path={breadcrumbCoords}
              strokeColor="#0d9488"
              strokeOpacity={0.9}
              strokeWeight={4}
            />

            {/* 4. SENIOR (FATIMA) ADVANCED MARKER */}
            <AdvancedMarker
              position={{ lat: telemetry.currentLat, lng: telemetry.currentLng }}
              title={rufqaState.pilgrimName}
              onClick={() => setSelectedMarker({
                type: 'SENIOR',
                title: rufqaState.pilgrimName,
                titleAr: rufqaState.pilgrimName,
                subtitle: `Campaign #${rufqaState.campaignNumber}`,
                details: telemetry.lastUpdated,
                lat: telemetry.currentLat,
                lng: telemetry.currentLng,
                status: telemetry.activeProximityStatus
              })}
            >
              <div className="relative flex flex-col items-center group cursor-pointer">
                {/* Directional Heading Cone Indicator */}
                <div 
                  className="absolute -top-7 -left-7 w-20 h-20 pointer-events-none opacity-70"
                  style={{ transform: `rotate(${telemetry.headingDegrees}deg)` }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-teal-400/50 to-transparent clip-triangle"></div>
                </div>

                {/* Radar Ripple Effect */}
                <div className="absolute -inset-3 bg-amber-400/30 rounded-full animate-ping pointer-events-none"></div>

                {/* Custom Avatar Pin */}
                <div className="relative w-12 h-12 rounded-full bg-amber-500 border-3 border-white dark:border-slate-900 shadow-2xl flex items-center justify-center text-slate-950 font-black text-lg ring-4 ring-teal-400/60 transition-transform group-hover:scale-110">
                  <span>🧕</span>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></span>
                </div>

                {/* Floating Callout Label */}
                <div className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/95 text-white font-extrabold text-[10px] border border-amber-400 shadow-lg whitespace-nowrap">
                  <span className="text-amber-400">{rufqaState.pilgrimName}</span>
                </div>
              </div>
            </AdvancedMarker>

            {/* 5. KAABA & MATAF SANCTUARY MARKER */}
            <AdvancedMarker
              position={{ lat: 21.422487, lng: 39.826206 }}
              title="Holy Kaaba - Mataf Sanctuary"
              onClick={() => setSelectedMarker({
                type: 'KAABA',
                title: 'The Holy Kaaba (Al-Masjid Al-Haram)',
                titleAr: 'الكعبة المشرفة وصحن المطاف الشريف',
                subtitle: 'Sacred Sanctuary of Makkah',
                details: 'Primary circumambulation hub with dedicated senior cart pathways and medical escort rings.',
                lat: 21.422487,
                lng: 39.826206
              })}
            >
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 border-2 border-amber-400 text-amber-300 flex items-center justify-center text-base shadow-xl shadow-amber-400/20 group-hover:scale-110 transition-transform">
                  🕋
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-amber-300 text-[9px] font-black border border-amber-400/40">
                  {isRtl ? 'الكعبة المشرفة' : 'Holy Kaaba'}
                </span>
              </div>
            </AdvancedMarker>

            {/* 6. KING FAHD GATE 79 (RENDEZVOUS POINT) MARKER */}
            <AdvancedMarker
              position={{ lat: 21.4208, lng: 39.8248 }}
              title="King Fahd Gate 79 Rendezvous Point"
              onClick={() => setSelectedMarker({
                type: 'MEETING_POINT',
                title: 'King Fahd Gate #79 (Meeting Point)',
                titleAr: 'باب الملك فهد 79 — نقطة التجمع الرسمية',
                subtitle: 'Guide Ustadh Ahmad Meeting Hub',
                details: 'Equipped with shaded seating, water stations, and Tawafa escort coordinator.',
                lat: 21.4208,
                lng: 39.8248,
                phone: '+966551234567'
              })}
            >
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <div className="w-9 h-9 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-md bg-teal-950/90 text-teal-200 text-[9px] font-bold border border-teal-400/40">
                  {isRtl ? 'باب الملك فهد 79' : 'Gate 79 Hub'}
                </span>
              </div>
            </AdvancedMarker>

            {/* 7. GROUP LEADER USTADH AHMAD MARKER */}
            <AdvancedMarker
              position={{ lat: 21.4212, lng: 39.8252 }}
              title="Group Leader Ustadh Ahmad"
              onClick={() => setSelectedMarker({
                type: 'LEADER',
                title: 'Ustadh Ahmad Al-Ghamdi (Tawafa Leader)',
                titleAr: 'أ. أحمد الغامدي — مرشد ومطوف الحملة',
                subtitle: 'Licensed Ministry of Hajj Guide',
                details: 'Direct caregiver communication channel and ground assistance coordinator.',
                lat: 21.4212,
                lng: 39.8252,
                phone: rufqaState.tawafaGroupLeader.phone
              })}
            >
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-indigo-200 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-indigo-950/90 text-indigo-200 text-[8px] font-bold">
                  {isRtl ? 'المرشد أحمد' : 'Leader Ahmad'}
                </span>
              </div>
            </AdvancedMarker>

            {/* 8. SWISSÔTEL HOTEL MARKER */}
            <AdvancedMarker
              position={{ lat: 21.4190, lng: 39.8260 }}
              title="Swissôtel Makkah - Abraj Al Bait"
              onClick={() => setSelectedMarker({
                type: 'HOTEL',
                title: 'Swissôtel Makkah (Abraj Al-Bait)',
                titleAr: 'فندق سويس أوتيل مكة (أبراج البيت)',
                subtitle: 'Room 1408 • Tower 3',
                details: 'Direct indoor air-conditioned corridor connection to Haram courtyards.',
                lat: 21.4190,
                lng: 39.8260,
                phone: '+966125717777'
              })}
            >
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-8 h-8 rounded-xl bg-blue-600 border-2 border-blue-200 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Building className="w-4 h-4" />
                </div>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-blue-950/90 text-blue-200 text-[8px] font-bold">
                  {isRtl ? 'فندق سويس أوتيل' : 'Swissôtel'}
                </span>
              </div>
            </AdvancedMarker>

            {/* 9. EMERGENCY CLINICS & RED CRESCENT POIS */}
            {showClinics && EMERGENCY_CLINIC_POIS.map((poi) => (
              <AdvancedMarker
                key={poi.id}
                position={{ lat: poi.lat, lng: poi.lng }}
                title={poi.name}
                onClick={() => setSelectedMarker({
                  type: poi.type,
                  title: poi.name,
                  titleAr: poi.nameAr,
                  subtitle: poi.distance,
                  details: poi.description,
                  lat: poi.lat,
                  lng: poi.lng,
                  phone: poi.phone
                })}
              >
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="w-7 h-7 rounded-full bg-rose-600 border-2 border-white text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform text-xs font-bold">
                    <span>+</span>
                  </div>
                  <span className="mt-0.5 px-1 py-0.2 rounded bg-rose-950/90 text-rose-200 text-[8px] font-bold">
                    {poi.type === 'FIRST_AID' ? (isRtl ? 'إسعاف' : 'Aid') : (isRtl ? 'طوارئ' : 'Hospital')}
                  </span>
                </div>
              </AdvancedMarker>
            ))}

            {/* 10. INTERACTIVE INFO WINDOW ON SELECTED MARKER */}
            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2.5 max-w-[240px] text-slate-900 dark:text-slate-900 space-y-2">
                  <div className="border-b border-slate-200 pb-1.5">
                    <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">
                      {selectedMarker.type}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">
                      {isRtl ? selectedMarker.titleAr : selectedMarker.title}
                    </h4>
                    {selectedMarker.subtitle && (
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {selectedMarker.subtitle}
                      </p>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-normal">
                    {selectedMarker.details}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    {selectedMarker.phone && (
                      <a
                        href={`tel:${selectedMarker.phone}`}
                        className="flex-1 py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span>{isRtl ? 'اتصال' : 'Call'}</span>
                      </a>
                    )}
                    {selectedMarker.type === 'SENIOR' && onSendHapticPing && (
                      <button
                        type="button"
                        onClick={onSendHapticPing}
                        className="flex-1 py-1 px-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>📡</span>
                        <span>{isRtl ? 'تنبيه السوار' : 'Ping'}</span>
                      </button>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.lat},${selectedMarker.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1"
                      title="Open in Google Maps App"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-600" />
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}

          </Map>
        </APIProvider>
      </div>

      {/* Bottom Map Status & Powered by Google Maps Footer */}
      <div className="px-4 py-2 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-300">
            {isRtl ? 'خريطة المشاعر المقدسة التفاعلية — Google Maps Platform' : 'Google Maps Platform Real-time GNSS Navigation'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-slate-400 font-mono">Map ID: DEMO_MAP_ID</span>
          <span className="text-slate-500">•</span>
          <a
            href="https://cloud.google.com/maps-platform/terms?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>Google Maps Platform Terms</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

    </div>
  );
};

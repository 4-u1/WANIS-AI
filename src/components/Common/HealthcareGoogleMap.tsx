// Source: Google Maps Platform Code Assist
import React, { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Polyline,
  useMap
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Phone,
  Navigation,
  ExternalLink,
  Building,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Ambulance,
  Compass
} from 'lucide-react';
import { SupportedLanguage } from '../../types';

const GMP_INTERNAL_ATTRIBUTION = ['gmp_mcp_codeassist_v1_aistudio'];
const GMP_DEFAULT_MAP_ID = 'DEMO_MAP_ID';

export interface HealthcareFacility {
  id: string;
  name: string;
  nameAr: string;
  category: 'GERIATRIC_CENTER' | 'EMERGENCY_HOSPITAL' | 'RED_CRESCENT' | 'MEMORY_CLINIC';
  lat: number;
  lng: number;
  address: string;
  addressAr: string;
  phone: string;
  distanceKm: number;
  driveTimeMin: number;
  emergency24h: boolean;
  specialties: string[];
  specialtiesAr: string[];
}

export const SAUDI_HEALTHCARE_CENTERS: HealthcareFacility[] = [
  {
    id: 'fac-king-abdullah-makkah',
    name: 'King Abdullah Medical City (KAMC)',
    nameAr: 'مدينة الملك عبدالله الطبية بمكة المكرمة',
    category: 'EMERGENCY_HOSPITAL',
    lat: 21.3912,
    lng: 39.8538,
    address: 'Muzdalifah Rd, Makkah',
    addressAr: 'طريق مزدلفة، مكة المكرمة',
    phone: '0125549999',
    distanceKm: 4.8,
    driveTimeMin: 9,
    emergency24h: true,
    specialties: ['Comprehensive Stroke Center', 'Geriatric Acute Ward', 'Cardiac ICU'],
    specialtiesAr: ['مركز السكتات الدماغية', 'وحدة الرعاية الحادة لكبار السن', 'عناية القلب']
  },
  {
    id: 'fac-ajyad-haram',
    name: 'Ajyad Emergency Hospital (Haram Plaza)',
    nameAr: 'مستشفى أجياد للطوارئ (جوار الحرم المكي)',
    category: 'EMERGENCY_HOSPITAL',
    lat: 21.4205,
    lng: 39.8282,
    address: 'Ajyad Tunnel, South Courtyard, Makkah',
    addressAr: 'نفق أجياد، الساحات الجنوبية للحرم، مكة',
    phone: '997',
    distanceKm: 0.2,
    driveTimeMin: 2,
    emergency24h: true,
    specialties: ['Rapid Resuscitation', 'Heat Stroke Stabilization', 'Hajj Emergency'],
    specialtiesAr: ['الإنعاش السريع', 'علاج الإجهاد الحراري', 'طوارئ الحج والعمرة']
  },
  {
    id: 'fac-alnoor-specialist',
    name: 'Al Noor Specialist Hospital',
    nameAr: 'مستشفى النور التخصصي',
    category: 'GERIATRIC_CENTER',
    lat: 21.3985,
    lng: 39.8512,
    address: 'Al Hijrah Rd, Al Jamiah, Makkah',
    addressAr: 'طريق الهجرة، الجامعة، مكة المكرمة',
    phone: '0125665000',
    distanceKm: 3.5,
    driveTimeMin: 7,
    emergency24h: true,
    specialties: ['Geriatric Trauma', 'Neurology & Dementia Clinic', 'Dialysis'],
    specialtiesAr: ['إصابات كبار السن', 'عيادات الأعصاب والذاكرة', 'غسيل الكلى']
  },
  {
    id: 'fac-red-crescent-central',
    name: 'Saudi Red Crescent Makkah Command Hub',
    nameAr: 'هيئة الهلال الأحمر السعودي — العمليات المركزية بمكة',
    category: 'RED_CRESCENT',
    lat: 21.4150,
    lng: 39.8400,
    address: 'Al Shoqiyah, Makkah',
    addressAr: 'الشوقية، مكة المكرمة',
    phone: '997',
    distanceKm: 2.1,
    driveTimeMin: 5,
    emergency24h: true,
    specialties: ['Air Ambulance Dispatch', 'Paramedic Advanced Life Support', 'Senior Transport'],
    specialtiesAr: ['الإسعاف الجوي', 'العناية المتقدمة للحياة', 'نقل كبار السن المجهز']
  }
];

interface HealthcareGoogleMapProps {
  language: SupportedLanguage;
  patientLocation?: { lat: number; lng: number; name?: string };
}

export const HealthcareGoogleMap: React.FC<HealthcareGoogleMapProps> = ({
  language,
  patientLocation = { lat: 21.422487, lng: 39.826206, name: 'Current Location' }
}) => {
  const isRtl = language === 'ar';
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(SAUDI_HEALTHCARE_CENTERS[0]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 dark:bg-rose-950/60 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black shrink-0">
            🏥
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isRtl ? 'المستشفيات ومراكز الطوارئ المعتمدة على خريطة Google' : 'Google Maps Emergency Healthcare Navigator'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isRtl ? 'أقرب المستشفيات المتخصصة برعاية كبار السن وحالات الطوارئ مع التوجيه المباشر' : 'Nearest specialized senior acute care hospitals, Red Crescent stations, and 24/7 ER units'}
            </p>
          </div>
        </div>

        <a
          href="tel:997"
          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md self-start sm:self-center transition-transform active:scale-95"
        >
          <Ambulance className="w-4 h-4" />
          <span>{isRtl ? 'الهلال الأحمر (997)' : 'Red Crescent 997'}</span>
        </a>
      </div>

      {/* Map + Facility List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left/Main Map Canvas */}
        <div className="lg:col-span-8 h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative bg-slate-950">
          <APIProvider
            apiKey={apiKey}
            language={language === 'ar' ? 'ar' : 'en'}
            region="SA"
            libraries={['places', 'marker', 'geometry']}
          >
            <Map
              defaultCenter={{ lat: patientLocation.lat, lng: patientLocation.lng }}
              defaultZoom={13}
              mapId={GMP_DEFAULT_MAP_ID}
              internalUsageAttributionIds={GMP_INTERNAL_ATTRIBUTION}
              gestureHandling="greedy"
              disableDefaultUI={false}
              className="w-full h-full"
              style={{ width: '100%', height: '100%' }}
            >
              {/* Patient Location Marker */}
              <AdvancedMarker
                position={{ lat: patientLocation.lat, lng: patientLocation.lng }}
                title={patientLocation.name || 'Patient'}
              >
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-600 border-2 border-white text-white flex items-center justify-center text-xs font-bold shadow-lg ring-4 ring-teal-400/50 animate-pulse">
                    🧕
                  </div>
                  <span className="text-[9px] font-bold text-teal-200 bg-slate-900/90 px-1 rounded mt-0.5">
                    {isRtl ? 'المريض' : 'Patient'}
                  </span>
                </div>
              </AdvancedMarker>

              {/* Hospital Markers */}
              {SAUDI_HEALTHCARE_CENTERS.map((fac) => (
                <AdvancedMarker
                  key={fac.id}
                  position={{ lat: fac.lat, lng: fac.lng }}
                  title={fac.name}
                  onClick={() => setSelectedFacility(fac)}
                >
                  <div className="flex flex-col items-center cursor-pointer group">
                    <div className={`w-8 h-8 rounded-xl border-2 border-white text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                      fac.category === 'RED_CRESCENT' ? 'bg-amber-600' : 'bg-rose-600'
                    }`}>
                      <span className="text-xs font-black">🏥</span>
                    </div>
                    <span className="text-[8px] font-bold text-white bg-slate-900/90 px-1 py-0.2 rounded mt-0.5 max-w-[90px] truncate">
                      {isRtl ? fac.nameAr : fac.name}
                    </span>
                  </div>
                </AdvancedMarker>
              ))}

              {/* Info Window */}
              {selectedFacility && (
                <InfoWindow
                  position={{ lat: selectedFacility.lat, lng: selectedFacility.lng }}
                  onCloseClick={() => setSelectedFacility(null)}
                >
                  <div className="p-2 max-w-[220px] text-slate-900 space-y-1.5">
                    <strong className="text-xs font-black block">
                      {isRtl ? selectedFacility.nameAr : selectedFacility.name}
                    </strong>
                    <div className="text-[11px] text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{selectedFacility.driveTimeMin} {isRtl ? 'دقائق بالسيارة' : 'min drive'}</span>
                      <span>({selectedFacility.distanceKm} km)</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {isRtl ? selectedFacility.addressAr : selectedFacility.address}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${selectedFacility.phone}`}
                        className="flex-1 py-1 px-2 rounded-md bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center gap-1"
                      >
                        <Phone className="w-2.5 h-2.5 text-amber-400" />
                        <span>{isRtl ? 'اتصال' : 'Call'}</span>
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.lat},${selectedFacility.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1 px-2 rounded-md bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center gap-1"
                      >
                        <Navigation className="w-2.5 h-2.5" />
                        <span>{isRtl ? 'مسار' : 'Route'}</span>
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        {/* Right Facility Selection List */}
        <div className="lg:col-span-4 space-y-2 max-h-72 sm:h-80 overflow-y-auto pr-1">
          {SAUDI_HEALTHCARE_CENTERS.map((fac) => {
            const isSelected = selectedFacility?.id === fac.id;
            return (
              <div
                key={fac.id}
                onClick={() => setSelectedFacility(fac)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected 
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 shadow-xs' 
                    : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      {isRtl ? fac.nameAr : fac.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {isRtl ? fac.addressAr : fac.address}
                    </span>
                  </div>
                  <span className="text-[10px] bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold px-1.5 py-0.5 rounded shrink-0">
                    {fac.driveTimeMin}m
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>24/7 ER</span>
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>{isRtl ? 'توجيه Google' : 'Directions'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

import { RufqaSafetyZone, RufqaProximityAlert, RufqaLiveTelemetry } from '../types';

export const INITIAL_RUFQA_SAFETY_ZONES: RufqaSafetyZone[] = [
  {
    id: 'zone-haram-gate79',
    name: 'King Fahd Gate 79 & Upper Plaza Meeting Zone',
    nameAr: 'نطاق الأمان — باب الملك فهد 79 والساحات العلوية',
    type: 'MEETING_POINT',
    radiusMeters: 45,
    centerCoordinates: { lat: 21.4225, lng: 39.8262 },
    description: 'Designated rendezvous point with Tawafa guide Ustadh Ahmad and primary family hub.',
    descriptionAr: 'نقطة التجمع واللقاء الرسمية المتفق عليها مع مرشد الحملة أ. أحمد والأسرة.',
    isInside: true,
    color: '#0d9488', // teal-600
    iconName: 'MapPin'
  },
  {
    id: 'zone-mataf-safe',
    name: 'Tawaf Mataf Ground & First Floor Ring',
    nameAr: 'منطقة صحن المطاف والدور الأول (نطاق الطواف الآمن)',
    type: 'SAFE_GREEN',
    radiusMeters: 80,
    centerCoordinates: { lat: 21.4225, lng: 39.8261 },
    description: 'Designated flow path for seniors; monitored by Haram medical carts and security stations.',
    descriptionAr: 'مسار الطواف المخصص لكبار السن المجهز بعربات الإسعاف وفرق الحراسة.',
    isInside: true,
    color: '#10b981', // emerald-500
    iconName: 'ShieldCheck'
  },
  {
    id: 'zone-hotel-swissotel',
    name: 'Swissôtel Makkah & Clock Tower Residence Corridor',
    nameAr: 'نطاق فندق سويس أوتيل وأبراج الساعة (السكن المعتمد)',
    type: 'SAFE_GREEN',
    radiusMeters: 60,
    centerCoordinates: { lat: 21.4192, lng: 39.8258 },
    description: 'Air-conditioned underground and indoor direct walkway to Abraj Al-Bait.',
    descriptionAr: 'الممر المكيف المباشر المؤدي لبهو الفندق وأبراج البيت.',
    isInside: false,
    color: '#3b82f6', // blue-500
    iconName: 'Building'
  },
  {
    id: 'zone-mina-camp42',
    name: 'Mina Tent Camp #42 (Street 204)',
    nameAr: 'مخيم منى رقم 42 (شارع 204 - خيمة الحاجة فاطمة)',
    type: 'SAFE_GREEN',
    radiusMeters: 50,
    centerCoordinates: { lat: 21.4133, lng: 39.8931 },
    description: 'Camp medical tent, dining, and senior resting quarters.',
    descriptionAr: 'خيمة السكن، العيادة الميدانية، واستراحة كبار السن المجهزة.',
    isInside: false,
    color: '#10b981',
    iconName: 'Home'
  },
  {
    id: 'zone-marwah-crowd',
    name: 'Marwah Outer Congestion & Taxi Dispatch Zone',
    nameAr: 'مخرج المروة ومنطقة الزحام الخارجي (منطقة انتباه)',
    type: 'CAUTION_YELLOW',
    radiusMeters: 90,
    centerCoordinates: { lat: 21.4248, lng: 39.8279 },
    description: 'High pedestrian density during rush hours; automatic advisory triggered if entered alone.',
    descriptionAr: 'كثافة مشاة مرتفعة عند الخروج — يُنصح بالانتظار أو طلب المساعدة.',
    isInside: false,
    color: '#f59e0b', // amber-500
    iconName: 'AlertTriangle'
  },
  {
    id: 'zone-jamarat-lower',
    name: 'Jamarat Outer Perimeter & Tunnel Exit',
    nameAr: 'محيط الجمرات الخارجي ومخارج الأنفاق (خارج النطاق الآمن)',
    type: 'DANGER_RED',
    radiusMeters: 120,
    centerCoordinates: { lat: 21.4189, lng: 39.8715 },
    description: 'Outside designated camp itinerary without group leader escort. Triggers instant red alert.',
    descriptionAr: 'خارج المسار المخصص للحملة بدون مرافقة — يُطلق تنبيهاً أحمر فورياً للعائلة.',
    isInside: false,
    color: '#ef4444', // red-500
    iconName: 'ShieldAlert'
  }
];

export const INITIAL_RUFQA_TELEMETRY: RufqaLiveTelemetry = {
  currentLat: 21.42248,
  currentLng: 39.82618,
  accuracyRadiusMeters: 3.2,
  altitudeMeters: 278,
  speedKmh: 1.1, // slow gentle walk
  headingDegrees: 185, // South towards King Fahd Gate
  lastUpdated: 'Just now (1s ago via Dual-Band GPS)',
  activeRitualStage: 'TAWAF',
  batteryPercent: 89,
  signalStrength: 'EXCELLENT',
  distanceToMeetingPointMeters: 18,
  distanceToLeaderMeters: 12,
  distanceToHotelMeters: 380,
  currentZoneId: 'zone-haram-gate79',
  activeProximityStatus: 'WITHIN_SAFE_PERIMETER',
  breadcrumbTrail: [
    { lat: 21.42255, lng: 39.82635, timestamp: '12 mins ago', label: 'Entered Gate 79 Courtyard' },
    { lat: 21.42252, lng: 39.82628, timestamp: '8 mins ago', label: 'Approached Pillar C-14' },
    { lat: 21.42249, lng: 39.82622, timestamp: '4 mins ago', label: 'Met Group Guide Ahmad' },
    { lat: 21.42248, lng: 39.82618, timestamp: 'Just now', label: 'Current Live GPS Fix' }
  ]
};

export const INITIAL_RUFQA_PROXIMITY_ALERTS: RufqaProximityAlert[] = [
  {
    id: 'alert-prox-01',
    timestamp: 'Today, 08:35 AM',
    severity: 'INFO',
    title: 'Senior Reached Agreed Haram Meeting Point',
    titleAr: 'وصول الوالدة لنقطة التجمع المتفق عليها (باب الملك فهد 79)',
    message: 'Fatima is within 18m of Pillar C-14. Tawafa Guide Ahmad Al-Ghamdi confirmed visual contact.',
    messageAr: 'الحاجة فاطمة على مسافة 18 متراً من العمود C-14. أكد المرشد أ. أحمد وجود اتصال بصري مباشر.',
    targetCaregivers: ['Maryam Al-Hashemi (Daughter)', 'Tariq (Son)', 'Ahmad (Leader)'],
    distanceFromSafeZoneMeters: 0,
    suggestedAction: 'No action needed. Senior is resting with the group.',
    suggestedActionAr: 'لا يتطلب إجراء. الوالدة في منطقة الأمان بصحبة الفريق.',
    isAcknowledged: true
  },
  {
    id: 'alert-prox-02',
    timestamp: 'Yesterday, 07:15 PM',
    severity: 'WARNING',
    title: 'Approaching Boundary Threshold (Marwah Exit)',
    titleAr: 'تنبيه: اقتراب من مخرج المروة الخارجي (65 متراً من المسار)',
    message: 'Senior walked towards Marwah outer exit. Automated voice guidance helped redirect to air-conditioned corridor.',
    messageAr: 'تحركت الوالدة باتجاه مخرج المروة الخارجي. قام المساعد الصوتي بتوجيهها بهدوء نحو الممر المكيف الداخلي.',
    targetCaregivers: ['Maryam Al-Hashemi (Daughter)'],
    distanceFromSafeZoneMeters: 65,
    suggestedAction: 'Voice reminder played: "Return towards Gate 79".',
    suggestedActionAr: 'تم تشغيل توجيه صوتي لطيف لإرشادها نحو نقطة التجمع.',
    isAcknowledged: true
  }
];

export interface RitualPreset {
  id: string;
  name: string;
  nameAr: string;
  ritualStage: 'TAWAF' | 'SAI' | 'MINA_REST' | 'ARAFAT_DUA' | 'MUZDALIFAH' | 'HOTEL_REST';
  locationName: string;
  locationNameAr: string;
  lat: number;
  lng: number;
  zoneId: string;
  proximityStatus: 'WITHIN_SAFE_PERIMETER' | 'APPROACHING_BOUNDARY' | 'OUTSIDE_SAFETY_ZONE';
  distanceToMeetingPointMeters: number;
  distanceToLeaderMeters: number;
  distanceToHotelMeters: number;
  statusSeverity: 'INFO' | 'WARNING' | 'CRITICAL';
  statusDescription: string;
  statusDescriptionAr: string;
}

export const RITUAL_SIMULATION_PRESETS: RitualPreset[] = [
  {
    id: 'preset-tawaf-gate79',
    name: 'Tawaf at Grand Mosque (Safe Zone - Gate 79)',
    nameAr: 'طواف القدوم بالمسجد الحرام (نطاق الأمان — باب الملك فهد 79)',
    ritualStage: 'TAWAF',
    locationName: 'Grand Mosque Courtyard, King Fahd Gate #79',
    locationNameAr: 'ساحات المسجد الحرام، بجوار باب الملك فهد 79',
    lat: 21.42248,
    lng: 39.82618,
    zoneId: 'zone-haram-gate79',
    proximityStatus: 'WITHIN_SAFE_PERIMETER',
    distanceToMeetingPointMeters: 18,
    distanceToLeaderMeters: 12,
    distanceToHotelMeters: 380,
    statusSeverity: 'INFO',
    statusDescription: 'Fatima is safely accompanied inside the designated Haram perimeter.',
    statusDescriptionAr: 'الحاجة فاطمة بأمان تام داخل نطاق التجمع المعتمد بالحرم.'
  },
  {
    id: 'preset-sai-boundary',
    name: 'Sai Corridor (Approaching Marwah Outer Boundary)',
    nameAr: 'المسعى بين الصفا والمروة (اقتراب من حد المروة الخارجي — تنبيه أصفر)',
    ritualStage: 'SAI',
    locationName: 'Masaa 2nd Floor (Near Marwah Turn)',
    locationNameAr: 'الدور الثاني من المسعى (قرب نهاية المروة)',
    lat: 21.4246,
    lng: 39.8277,
    zoneId: 'zone-marwah-crowd',
    proximityStatus: 'APPROACHING_BOUNDARY',
    distanceToMeetingPointMeters: 92,
    distanceToLeaderMeters: 45,
    distanceToHotelMeters: 560,
    statusSeverity: 'WARNING',
    statusDescription: 'Senior has reached the edge of the safe zone. Automatic proximity guidance active.',
    statusDescriptionAr: 'اقتربت الوالدة من حدود المسار الآمن. تم تفعيل الإرشاد الصوتي الاستباقي.'
  },
  {
    id: 'preset-mina-camp42',
    name: 'Mina Tent Camp #42 (Resting in Air-Conditioned Tent)',
    nameAr: 'مشعر منى — مخيم الحملة 42 (استراحة داخل الخيمة المجهزة)',
    ritualStage: 'MINA_REST',
    locationName: 'Mina Camp #42, VIP Sector, Street 204',
    locationNameAr: 'مخيم منى 42، قطاع الوفاء، شارع 204',
    lat: 21.4133,
    lng: 39.8931,
    zoneId: 'zone-mina-camp42',
    proximityStatus: 'WITHIN_SAFE_PERIMETER',
    distanceToMeetingPointMeters: 8,
    distanceToLeaderMeters: 15,
    distanceToHotelMeters: 6200,
    statusSeverity: 'INFO',
    statusDescription: 'Resting safely inside Mina camp tent. Medical team standby available.',
    statusDescriptionAr: 'مستقرة داخل خيمة السكن بمنى مع توفر العيادة الطبية ومشروبات الترطيب.'
  },
  {
    id: 'preset-jamarat-stray',
    name: 'Strayed Outside Jamarat Perimeter (Critical Red Alert)',
    nameAr: 'ابتعاد مفاجئ خارج محيط الجمرات (تنبيه أحمر حرج — بث فوري)',
    ritualStage: 'MINA_REST',
    locationName: 'Jamarat Plaza Tunnel Exit (Outside Camp Corridor)',
    locationNameAr: 'مخرج أنفاق الجمرات الخارجي (خارج مسار الحملة المعتمد)',
    lat: 21.4189,
    lng: 39.8715,
    zoneId: 'zone-jamarat-lower',
    proximityStatus: 'OUTSIDE_SAFETY_ZONE',
    distanceToMeetingPointMeters: 340,
    distanceToLeaderMeters: 280,
    distanceToHotelMeters: 5100,
    statusSeverity: 'CRITICAL',
    statusDescription: 'CRITICAL: Senior is 280m away from leader. Instant emergency broadcast dispatched to family and Tawafa security.',
    statusDescriptionAr: 'تنبيه طارئ: ابتعاد بمقدار 280 متراً عن المرشد. تم إرسال بث فوري للمطوف والدفاع المدني وابنتها مريم.'
  },
  {
    id: 'preset-hotel-residence',
    name: 'Swissôtel Clock Tower Residence (Resting in Room)',
    nameAr: 'فندق سويس أوتيل برج الساعة (داخل الغرفة 1408)',
    ritualStage: 'HOTEL_REST',
    locationName: 'Swissôtel Makkah, Tower 3, Room 1408',
    locationNameAr: 'فندق سويس أوتيل مكة، برج 3، الغرفة 1408',
    lat: 21.4192,
    lng: 39.8258,
    zoneId: 'zone-hotel-swissotel',
    proximityStatus: 'WITHIN_SAFE_PERIMETER',
    distanceToMeetingPointMeters: 380,
    distanceToLeaderMeters: 50,
    distanceToHotelMeters: 0,
    statusSeverity: 'INFO',
    statusDescription: 'Senior is in her hotel room. Complete safety verified.',
    statusDescriptionAr: 'الوالدة داخل غرفتها بالفندق في أمان تام وراحة.'
  }
];

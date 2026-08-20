import { SupportedLanguage } from '../types';

export type HajjWeatherSite = 'MAKKAH_HARAM' | 'MINA_TENTS' | 'ARAFAT_PLAIN' | 'MUZDALIFAH' | 'MADINAH_HARAM';

export interface HajjWeatherData {
  siteId: HajjWeatherSite;
  nameEn: string;
  nameAr: string;
  locationDescriptionEn: string;
  locationDescriptionAr: string;
  tempC: number;
  feelsLikeC: number;
  uvIndex: number;
  uvRating: 'MODERATE' | 'VERY_HIGH' | 'EXTREME';
  humidityPct: number;
  windSpeedKmh: number;
  heatStrokeRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  weatherCondition: 'SUNNY' | 'HOT_SUN' | 'CLEAR_NIGHT' | 'WARM_BREEZE';
  safeRitualWindow: {
    morning: string;
    evening: string;
    avoidPeak: string;
    morningAr: string;
    eveningAr: string;
    avoidPeakAr: string;
  };
  advisoryNoteEn: string;
  advisoryNoteAr: string;
}

export type HajjHealthCategory = 
  | 'HEAT_STRESS' 
  | 'HYDRATION' 
  | 'MOBILITY_FEET' 
  | 'MEDICATION' 
  | 'SHARIAH_EASE' 
  | 'REST_ENERGY' 
  | 'CROWD_PACING';

export interface HajjDailyAdviceCard {
  id: string;
  category: HajjHealthCategory;
  categoryTitleEn: string;
  categoryTitleAr: string;
  titleEn: string;
  titleAr: string;
  tagEn: string;
  tagAr: string;
  tagColor: string; // 'amber' | 'rose' | 'emerald' | 'sky' | 'purple' | 'teal'
  iconName: string;
  relevantStage: 'TAWAF' | 'SAI' | 'MINA_REST' | 'ARAFAT_DUA' | 'MUZDALIFAH' | 'JAMARAT' | 'ALL_STAGES';
  relevantStageNameEn: string;
  relevantStageNameAr: string;
  adviceEn: string;
  adviceAr: string;
  clinicalRationaleEn: string;
  clinicalRationaleAr: string;
  shariahConcessionEn?: string;
  shariahConcessionAr?: string;
  audioGuidanceEn: string;
  audioGuidanceAr: string;
  actionableChecklist: {
    id: string;
    textEn: string;
    textAr: string;
  }[];
  emergencySignEn: string;
  emergencySignAr: string;
  progressConditionType: 'HIGH_STEPS' | 'HIGH_TEMP' | 'LOW_HYDRATION' | 'TAWAF_IN_PROGRESS' | 'REST_NEED' | 'GENERAL';
  getProgressSummary: (steps: number, hydrationMl: number, tempC: number, isRtl: boolean) => string;
}

export const HAJJ_WEATHER_SITES_DATA: Record<HajjWeatherSite, HajjWeatherData> = {
  MAKKAH_HARAM: {
    siteId: 'MAKKAH_HARAM',
    nameEn: 'Grand Mosque & Mataf (Makkah)',
    nameAr: 'المسجد الحرام وصحن المطاف (مكة المكرمة)',
    locationDescriptionEn: 'Open marble courtyards with high thermal reflection; shaded indoor mezzanines',
    locationDescriptionAr: 'الساحات الرخامية المكشوفة مع انعكاس حراري؛ والأدوار المكيفة المظللة',
    tempC: 39,
    feelsLikeC: 43,
    uvIndex: 11,
    uvRating: 'EXTREME',
    humidityPct: 34,
    windSpeedKmh: 12,
    heatStrokeRisk: 'CRITICAL',
    weatherCondition: 'HOT_SUN',
    safeRitualWindow: {
      morning: '05:00 AM - 08:30 AM (Cool Morning Breeze)',
      evening: '06:30 PM - 11:30 PM (Post-Maghrib Shaded Hours)',
      avoidPeak: '10:30 AM - 04:30 PM (Direct Overhead Sun)',
      morningAr: '٠٥:٠٠ ص - ٠٨:٣٠ ص (نسمات الفجر المعتدلة)',
      eveningAr: '٠٦:٣٠ م - ١١:٣٠ م (ساعات ما بعد المغرب والليل)',
      avoidPeakAr: '١٠:٣٠ ص - ٠٤:٣٠ م (ذروة الأشعة الشمسية المباشرة)'
    },
    advisoryNoteEn: 'Extreme UV index in open Mataf. Elderly pilgrims should utilize 2nd floor air-conditioned Tawaf tracks or electric buggies between 11 AM and 4 PM.',
    advisoryNoteAr: 'مؤشر الأشعة فوق البنفسجية حرج في صحن المطاف المكشوف. يُنصح كبار السن بالطواف في الأدوار العلوية المكيفة أو استخدام العربات في أوقات الظهيرة.'
  },
  MINA_TENTS: {
    siteId: 'MINA_TENTS',
    nameEn: 'Mina Valley & Camps (Street 204)',
    nameAr: 'وادي منى ومخيمات الإقامة (شارع 204)',
    locationDescriptionEn: 'Air-conditioned modern fireproof tent zones with paved pedestrian alleys',
    locationDescriptionAr: 'مخيمات مطورة مكيفة مع ممرات مشاة ممهدة',
    tempC: 36,
    feelsLikeC: 39,
    uvIndex: 9,
    uvRating: 'VERY_HIGH',
    humidityPct: 38,
    windSpeedKmh: 15,
    heatStrokeRisk: 'HIGH',
    weatherCondition: 'SUNNY',
    safeRitualWindow: {
      morning: '06:00 AM - 09:00 AM',
      evening: '07:00 PM - 02:00 AM',
      avoidPeak: '11:00 AM - 05:00 PM',
      morningAr: '٠٦:٠٠ ص - ٠٩:٠٠ ص',
      eveningAr: '٠٧:٠٠ م - ٠٢:٠٠ ص',
      avoidPeakAr: '١١:٠٠ ص - ٠٥:٠٠ م'
    },
    advisoryNoteEn: 'Stay inside air-conditioned tents during midday hours. Ensure AC filters and misters are functioning to avoid respiratory dry cough.',
    advisoryNoteAr: 'البقاء داخل الخيام المكيفة وقت الهجير مع ترطيب الحلق لتفادي جفاف الأغشية المخاطية الناتج عن التكييف المستمر.'
  },
  ARAFAT_PLAIN: {
    siteId: 'ARAFAT_PLAIN',
    nameEn: 'Plain of Arafat & Jabal Al-Rahmah',
    nameAr: 'صعيد عرفات الطاهر وجبل الرحمة',
    locationDescriptionEn: 'Expansive open outdoor plains with neem tree shades and water spray towers',
    locationDescriptionAr: 'مساحات مفتوحة مظللة بأشجار النيم وأبراج رذاذ الماء الملطفة للجو',
    tempC: 41,
    feelsLikeC: 45,
    uvIndex: 12,
    uvRating: 'EXTREME',
    humidityPct: 28,
    windSpeedKmh: 10,
    heatStrokeRisk: 'CRITICAL',
    weatherCondition: 'HOT_SUN',
    safeRitualWindow: {
      morning: '07:00 AM - 10:00 AM (Arrival in Tents)',
      evening: '05:30 PM - 07:00 PM (Sunset Departure Prep)',
      avoidPeak: '11:00 AM - 04:30 PM (Wuquf Sun Exposure)',
      morningAr: '٠٧:٠٠ ص - ١٠:٠٠ ص (الوصول للمخيم)',
      eveningAr: '٠٥:٣٠ م - ٠٧:٠٠ م (وقت الغروب والاستعداد للنفرة)',
      avoidPeakAr: '١١:٠٠ ص - ٠٤:٣٠ م (ساعات الوقوف تحت الشمس)'
    },
    advisoryNoteEn: 'Perform Arafat supplication inside shaded camp pavilions. Direct climb onto Jabal Al-Rahmah rocks under peak sun is strongly discouraged for seniors.',
    advisoryNoteAr: 'التضرع والدعاء داخل مخيمات عرفات المظللة؛ يُمنع تسلق صخور جبل الرحمة تحت أشعة الشمس المباشرة تجنباً لضربات الشمس والإرهاق.'
  },
  MUZDALIFAH: {
    siteId: 'MUZDALIFAH',
    nameEn: 'Muzdalifah Open Plains (Night Stay)',
    nameAr: 'مزدلفة — المبيت تحت أديم السماء',
    locationDescriptionEn: 'Open desert valley; night-time radiative cooling with light dust breezes',
    locationDescriptionAr: 'وادي صحراوي مفتوح؛ انخفاض معتدل في حرارة الليل مع هواء خفيف',
    tempC: 31,
    feelsLikeC: 33,
    uvIndex: 0,
    uvRating: 'MODERATE',
    humidityPct: 48,
    windSpeedKmh: 18,
    heatStrokeRisk: 'LOW',
    weatherCondition: 'CLEAR_NIGHT',
    safeRitualWindow: {
      morning: '04:30 AM - 06:00 AM (Fajr & Mashar Al-Haram)',
      evening: '08:00 PM - 04:00 AM (Night Supplication & Rest)',
      avoidPeak: 'No direct sun hazard at night',
      morningAr: '٠٤:٣٠ ص - ٠٦:٠٠ ص (الفجر والمشعر الحرام)',
      eveningAr: '٠٨:٠٠ م - ٠٤:٠٠ ص (المبيت والذكر والتقاط الحصى)',
      avoidPeakAr: 'لا توجد مخاطر شمسية ليلاً'
    },
    advisoryNoteEn: 'Night air cools to ~30°C. Seniors are permitted by Shariah to depart after midnight to avoid morning crowd crushes at Jamarat.',
    advisoryNoteAr: 'أجواء الليل مريحة (~30 مئوية). رخصة الدفع بعد منتصف الليل لكبار السن والنساء سنة مؤكدة لتفادي الزحام في منى.'
  },
  MADINAH_HARAM: {
    siteId: 'MADINAH_HARAM',
    nameEn: 'Prophet\'s Mosque & Piazzas (Madinah)',
    nameAr: 'المسجد النبوي الشريف والساحات (المدينة المنورة)',
    locationDescriptionEn: 'Giant mechanical sun-shading umbrellas with mist fans covering 250+ umbrellas',
    locationDescriptionAr: 'مظلات الساحات العملاقة المزودة بمراوح الرذاذ المائي',
    tempC: 37,
    feelsLikeC: 39,
    uvIndex: 10,
    uvRating: 'VERY_HIGH',
    humidityPct: 22,
    windSpeedKmh: 14,
    heatStrokeRisk: 'MODERATE',
    weatherCondition: 'WARM_BREEZE',
    safeRitualWindow: {
      morning: '05:30 AM - 09:30 AM (Under Open Umbrellas)',
      evening: '06:00 PM - Midnight (Cool Marble Piazzas)',
      avoidPeak: '11:30 AM - 04:00 PM',
      morningAr: '٠٥:٣٠ ص - ٠٩:٣٠ ص (تحت المظلات الواقية)',
      eveningAr: '٠٦:٠٠ م - منتصف الليل (رخام الساحات البارد)',
      avoidPeakAr: '١١:٣٠ ص - ٠٤:٠٠ م'
    },
    advisoryNoteEn: 'Piazzas are fully shaded by 250 giant umbrellas. Stay near mist fans to maintain skin hydration.',
    advisoryNoteAr: 'الساحات مظللة بالكامل بالمظلات العملاقة ومراوح الرذاذ؛ احرص على الجلوس بالقرب منها لترطيب البشرة.'
  }
};

export const HAJJ_DAILY_ADVICE_CARDS: HajjDailyAdviceCard[] = [
  {
    id: 'advice-heat-sun-01',
    category: 'HEAT_STRESS',
    categoryTitleEn: 'Heat Stress & Sun Mitigation',
    categoryTitleAr: 'الوقاية من الإجهاد الحراري وضربات الشمس',
    titleEn: 'Thermal Protection & Shaded Transit Protocol',
    titleAr: 'بروتوكول الحماية الحرارية والتنقل المظلل',
    tagEn: 'High Priority Advisory',
    tagAr: 'تنبيه حراري ذو أولوية',
    tagColor: 'rose',
    iconName: 'Sun',
    relevantStage: 'ALL_STAGES',
    relevantStageNameEn: 'Grand Mosque & Open Piazzas',
    relevantStageNameAr: 'الحرم المكي والساحات المكشوفة',
    adviceEn: 'With ambient temperature reaching 39°C (Feels like 43°C), direct solar radiation rapidly depletes electrolytes and causes sudden hypotension in elderly pilgrims. Use a white UV-reflective umbrella at all times in outdoor courtyards, and avoid the open ground-floor Mataf between 10:30 AM and 4:30 PM.',
    adviceAr: 'مع وصول درجة الحرارة إلى 39°C (الشعور الحقيقي 43°C)، تتسبب أشعة الشمس المباشرة في فقدان سريع للسوائل والأملاح وهبوط الضغط المفاجئ لدى كبار السن. احملي مظلة شمسية بيضاء عاكسة للأشعة في كل تنقل خارجي، وتجنبي صحن المطاف المكشوف بين الساعة 10:30 صباحاً و 4:30 عصراً.',
    clinicalRationaleEn: 'Age-related diminished thirst perception and reduced sweating efficiency increase the vulnerability of seniors to heat exhaustion within 20 minutes of unprotected direct sun exposure.',
    clinicalRationaleAr: 'ضعف آلية الإحساس بالعطش وتراجع كفاءة التعرق الطبيعي مع التقدم في السن يرفعان خطر الإجهاد الحراري خلال 20 دقيقة فقط من التعرض المباشر للشمس.',
    shariahConcessionEn: 'Shariah fully permits holding umbrellas and seeking shade during Ihram with zero penalty or fidyah.',
    shariahConcessionAr: 'الاستظلال بالمظلة الشمسية أو السقوف جائز بالإجماع للمحرم بلا فدية ولا كراهة لحفظ النفس.',
    audioGuidanceEn: 'Dear mother Fatima, current heat feels like 43 degrees in Makkah. Please use your white umbrella and rest in air-conditioned areas until the afternoon heat subsides.',
    audioGuidanceAr: 'يا والدتي فاطمة، الحرارة تشبه 43 درجة في مكة. احرصي على المظلة البيضاء وواصلي البقاء في الأماكن المكيفة حتى انكسار حرارة الظهيرة.',
    actionableChecklist: [
      {
        id: 'chk-umbrella',
        textEn: 'Carry a white UV-shield umbrella for every outdoor step',
        textAr: 'حمل مظلة شمسية بيضاء عاكسة للأشعة في كل خطوة خارج المباني'
      },
      {
        id: 'chk-shaded-track',
        textEn: 'Use 2nd floor air-conditioned Mataf ring or electric carts during midday',
        textAr: 'استخدام طواف الدور الثاني المكيف أو عربات الميزانين عند الطواف ظهراً'
      },
      {
        id: 'chk-cool-compress',
        textEn: 'Apply a damp cold towel to neck and temples every 45 minutes',
        textAr: 'وضع كمادة قماشية مبللة على مؤخرة الرقبة والجبين كل 45 دقيقة'
      }
    ],
    emergencySignEn: 'Cessation of sweating, hot dry skin, confusion, or slurred speech (requires immediate 997 Red Crescent cooling).',
    emergencySignAr: 'توقف التعرق مع سخونة واحمرار الجلد، أو التلعثم والتشوش الذهني (يستوجب تدخلاً فورياً من الهلال الأحمر 997).',
    progressConditionType: 'HIGH_TEMP',
    getProgressSummary: (steps, hydrationMl, tempC, isRtl) => {
      if (isRtl) {
        return `🌡️ حرارة اليوم (${tempC}°C) تستوجب الحذر — سجلتِ ${steps.toLocaleString()} خطوة و ${((hydrationMl)/1000).toFixed(1)}L ماء زمزم حتى الآن.`;
      }
      return `🌡️ Today's temperature (${tempC}°C) requires caution — You've logged ${steps.toLocaleString()} steps and ${((hydrationMl)/1000).toFixed(1)}L Zamzam so far.`;
    }
  },
  {
    id: 'advice-hydration-02',
    category: 'HYDRATION',
    categoryTitleEn: 'Electrolyte & Zamzam Optimization',
    categoryTitleAr: 'ترطيب الجسم والمحاليل الكهرلية',
    titleEn: 'Continuous Micro-Hydration with Blessed Zamzam',
    titleAr: 'بروتوكول الترطيب المتواصل بماء زمزم المبارك',
    tagEn: 'Hydration Target: 2.5L - 3.0L',
    tagAr: 'الهدف اليومي: 2.5 إلى 3 لتر',
    tagColor: 'sky',
    iconName: 'Droplet',
    relevantStage: 'ALL_STAGES',
    relevantStageNameEn: 'All Ritual Sites & Transit',
    relevantStageNameAr: 'كافة المشاعر المقدسة ومسارات التنقل',
    adviceEn: 'Do not wait until feeling thirsty to drink. Sip 1 cup (200-250 ml) of moderate-temperature Zamzam water every 30 to 45 minutes. Mix 1 oral rehydration electrolyte sachet into a water bottle daily to replenish essential sodium and potassium lost through perspiration.',
    adviceAr: 'لا تنتظري الشعور بالعطش لشرب الماء؛ اشربي كأساً صغيراً (200-250 مل) من ماء زمزم المعتدل كل 30 إلى 45 دقيقة. أذيبي ظرفاً من أملاح التروية الفموية (Electrolyte Sachet) في قارورة ماء يومياً لتعويض الصوديوم والبوتاسيوم المفقودين.',
    clinicalRationaleEn: 'Seniors on diuretic or antihypertensive medications face rapid plasma volume depletion, increasing fall risk and acute prerenal kidney strain.',
    clinicalRationaleAr: 'تناول أدوية الضغط أو المدرات يزيد من سرعة هبوط حجم الدم، مما قد يسبب الدوار الحركي وإجهاد الكلى المؤقت إذا قل شرب السوائل.',
    shariahConcessionEn: 'Drinking Zamzam with the intention of cure and energy is a blessed prophetic sunnah with documented high mineral value.',
    shariahConcessionAr: 'شرب ماء زمزم بنية الشفاء والقوة سنة نبوية مباركة غنية بالمعادن الطبيعية المعينة على العبادة.',
    audioGuidanceEn: 'Hajjah Fatima, remember to take small sips of Zamzam continuously. Avoid ice-cold water to protect your throat.',
    audioGuidanceAr: 'يا حاجة فاطمة، داومي على رشفات زمزم المعتدلة بانتظام وتجنبي الماء المثلج لحماية الحلق من الاحتقان.',
    actionableChecklist: [
      {
        id: 'chk-sip-interval',
        textEn: 'Drink 200ml every 40 minutes even without feeling thirsty',
        textAr: 'شرب 200 مل كل 40 دقيقة دون انتظار الإحساس بالعطش'
      },
      {
        id: 'chk-electrolyte',
        textEn: 'Add 1 electrolyte hydration sachet to morning water bottle',
        textAr: 'إضافة ظرف أملاح التروية في قارورة ماء الصباح'
      },
      {
        id: 'chk-room-temp',
        textEn: 'Select green-label "Not Cold" Zamzam barrels to avoid vocal cord strain',
        textAr: 'اختيار برادات زمزم الموسومة بـ (غير مبرد) لتفادي بحة الصوت والسعال'
      }
    ],
    emergencySignEn: 'Dark concentrated urine, sunken eyes, persistent dry mouth, or heart palpitations.',
    emergencySignAr: 'تحول لون البول للداكن، جفاف الفم المستمر، أو تسارع نبضات القلب.',
    progressConditionType: 'LOW_HYDRATION',
    getProgressSummary: (steps, hydrationMl, tempC, isRtl) => {
      const remainingMl = Math.max(0, 3000 - hydrationMl);
      if (isRtl) {
        return `💧 الترطيب المنجز: ${(hydrationMl/1000).toFixed(2)} لتر (متبقي ${(remainingMl/1000).toFixed(1)} لتر للوصول للهدف الوقائي اليومي).`;
      }
      return `💧 Logged ${(hydrationMl/1000).toFixed(2)}L so far (${(remainingMl/1000).toFixed(1)}L remaining to hit optimal 3.0L daily protection).`;
    }
  },
  {
    id: 'advice-feet-mobility-03',
    category: 'MOBILITY_FEET',
    categoryTitleEn: 'Foot Care & Orthopedic Pacing',
    categoryTitleAr: 'العناية بالقدمين والراحة المفصلية',
    titleEn: 'Diabetic Foot Protection & Gait Steadiness',
    titleAr: 'وقاية القدم السكرية والحفاظ على توازن المشي',
    tagEn: 'Step Load Management',
    tagAr: 'إدارة وتيرة المشي والمفاصل',
    tagColor: 'teal',
    iconName: 'Footprints',
    relevantStage: 'TAWAF',
    relevantStageNameEn: 'Tawaf & Sa\'i Walking Tracks',
    relevantStageNameAr: 'صحن المطاف والمسعى وممرات المشاة',
    adviceEn: 'Marble floors under heavy crowds can exert high impact on knees and heels. Wear thick, cushioned non-slip pilgrim socks or soft supportive leather footwear. Inspect your feet after every ritual for friction redness, small blisters, or minor abrasions, especially if diabetic.',
    adviceAr: 'المشي الطويل على الرخام الصلب يشكل ضغطاً على الركبتين وأسفل القدمين. احرصي على ارتداء جوارب قطنية سميكة مبطنة ومانعة للانزلاق، وافحصي باطن القدمين وبين الأصابع بعد كل منسك للتأكد من خلوهما من أي تسلخات أو احمرار.',
    clinicalRationaleEn: 'Diabetic peripheral neuropathy masks micro-trauma and pressure sores on the sole, which can rapidly progress under heat and friction if uninspected.',
    clinicalRationaleAr: 'اعتلال الأعصاب الطرفية لدى مرضى السكري يقلل الإحساس بالجروح السطحية والاحتكاك، لذا فحص القدمين الدوري ضرورة سريرية يومية.',
    shariahConcessionEn: 'Using electric wheelchairs or seated mobility carts during Tawaf and Sa\'i is fully valid and rewarded without any diminution of ajr.',
    shariahConcessionAr: 'الطواف والسعي راكباً على الكرسي المتحرك أو العربة الكهربائية رخصة شرعية تامة الأجر للمسن وذي العذر.',
    audioGuidanceEn: 'Fatima, inspect your feet after Tawaf. If you feel any joint fatigue, let your caregiver assist you to the electric cart lane.',
    audioGuidanceAr: 'يا والدتي، افحصي قدميك بعد إتمام الطواف، وإذا شعرتِ بثقل في الركبتين فاطلبي الانتقال لعربة الطواف فوراً.',
    actionableChecklist: [
      {
        id: 'chk-padded-socks',
        textEn: 'Wear cushioned anti-slip grip socks during Tawaf & Sa\'i',
        textAr: 'ارتداء جوارب سميكة مبطنة مانعة للانزلاق أثناء الطواف والسعي'
      },
      {
        id: 'chk-foot-inspection',
        textEn: 'Inspect heels and toe web spaces with caregiver after returning to hotel',
        textAr: 'فحص باطن القدمين وبين الأصابع بمساعدة المرافقة فور العودة للفندق'
      },
      {
        id: 'chk-elevate-legs',
        textEn: 'Elevate legs on two pillows for 20 minutes to reduce lower limb edema',
        textAr: 'رفع الساقين على وسادتين لمدة 20 دقيقة لتصريف احتباس السوائل وتنشيط الدورة الدموية'
      }
    ],
    emergencySignEn: 'Blister formation, cracked skin oozing clear fluid, or sharp radiating calf pain.',
    emergencySignAr: 'ظهور فقاعات مائية، تشققات جلدية مؤلمة، أو ألم حاد في بطة الساق.',
    progressConditionType: 'HIGH_STEPS',
    getProgressSummary: (steps, hydrationMl, tempC, isRtl) => {
      if (isRtl) {
        return `🦶 مشيتِ ${steps.toLocaleString()} خطوة اليوم — إنجاز مبارك! ينصح برفع القدمين وعمل تدليك لطيف لبطة الساق.`;
      }
      return `🦶 You've walked ${steps.toLocaleString()} steps today — Blessed effort! Elevate your feet and relax your calves.`;
    }
  },
  {
    id: 'advice-medication-04',
    category: 'MEDICATION',
    categoryTitleEn: 'Medication Synchronization',
    categoryTitleAr: 'مزامنة جرعات الأدوية مع المناسك',
    titleEn: 'Timing Chronic Medications & Avoiding ACB Confusion',
    titleAr: 'تنظيم أدوية الضغط والسكري وتفادي التشوش الدوائي',
    tagEn: 'ACB Safety & Timely Dosing',
    tagAr: 'سلامة الأدوية ومواعيد الجرعات',
    tagColor: 'purple',
    iconName: 'ShieldAlert',
    relevantStage: 'ALL_STAGES',
    relevantStageNameEn: 'Daily Routine & Pill Box',
    relevantStageNameAr: 'الروتين اليومي وحافظة الأدوية',
    adviceEn: 'Maintain your exact medication schedule. Carry a 24-hour reserve pill pouch with you in your small waist bag during all movements. If you take sedative or anticholinergic medications (e.g. for allergies or sleep), take them strictly before sleep and never right before major walking rituals.',
    adviceAr: 'حافظي على مواعيد الأدوية بدقة دون تقديم أو تأخير؛ احملي جرعات 24 ساعة الاحتياطية في حقيبة الخصر دائماً. الأدوية ذات التأثير المنوم أو الكوليني تؤخذ قبل النوم فقط في الفندق وتجنبي تناولها قبل الانطلاق للمناسك تفادياً للدوخة.',
    clinicalRationaleEn: 'Taking anticholinergic or sedating agents prior to ambulation drastically elevates daytime postural instability and doubles the risk of disorientation.',
    clinicalRationaleAr: 'تناول مضادات الهيستامين أو المهدئات قبل التحرك يضاعف احتمالية الدوار واختلال التوازن بنسبة تزيد عن 50%.',
    shariahConcessionEn: 'Taking life-sustaining medications with water during the day is obligatory for health preservation.',
    shariahConcessionAr: 'حفظ النفس وتناول الأدوية في مواعيدها واجب شرعي يرعاه الدين الحنيف.',
    audioGuidanceEn: 'Hajjah Fatima, always keep your small medicine box in your crossbody bag, and take your blood pressure medication with breakfast.',
    audioGuidanceAr: 'يا حاجة فاطمة، احرصي على إبقاء حافظة الأدوية في حقيبة يدك، وتناولي دواء الضغط بعد إفطار خفيف.',
    actionableChecklist: [
      {
        id: 'chk-pill-pouch',
        textEn: 'Keep 1 full day of essential pills and emergency card in waist pack',
        textAr: 'حفظ جرعات يوم كامل في حقيبة الخصر مع بطاقة الطوارئ التعريفية'
      },
      {
        id: 'chk-snack-with-meds',
        textEn: 'Eat 3 dates or a small cracker biscuit before morning medication',
        textAr: 'تناول 3 حبات تمر أو بسكويت خفيف مع دواء الصباح لحماية المعدة'
      },
      {
        id: 'chk-no-sedatives-day',
        textEn: 'Avoid first-generation antihistamines (flu pills) during morning walks',
        textAr: 'تجنب حبوب الحساسية والزكام المنومة في فترات المشي الصباحي'
      }
    ],
    emergencySignEn: 'Sudden lightheadedness when standing up, blurred vision, or severe dry mouth.',
    emergencySignAr: 'دوار مفاجئ عند الوقوف، زغللة في العينين، أو جفاف شديد باللسان.',
    progressConditionType: 'GENERAL',
    getProgressSummary: (steps, hydrationMl, tempC, isRtl) => {
      if (isRtl) {
        return `💊 تم تأكيد أخذ جرعة الصباح — الالتزام الدوائي 100% يمنحك راحة البال طوال أداء المناسك.`;
      }
      return `💊 Morning dose confirmed active — 100% adherence ensures steady vital signs throughout the day.`;
    }
  },
  {
    id: 'advice-shariah-ease-05',
    category: 'SHARIAH_EASE',
    categoryTitleEn: 'Senior Shariah Concessions',
    categoryTitleAr: 'رخص التيسير الشرعي لكبار السن',
    titleEn: 'Empowering Ease, Dignity & Full Spiritual Reward',
    titleAr: 'الأخذ برخص الشريعة السمحة دون حرج وبأجر كامل',
    tagEn: 'Divine Mercy & Concession',
    tagAr: 'رخصة شرعية وأجر تام',
    tagColor: 'emerald',
    iconName: 'Sparkles',
    relevantStage: 'JAMARAT',
    relevantStageNameEn: 'Jamarat, Tawaf & Muzdalifah',
    relevantStageNameAr: 'رمي الجمرات، الطواف، ومزدلفة',
    adviceEn: 'Islam is built on ease: "Religion is ease, and no one overburdens themselves with religion except that it overcomes them." You are religiously commended to delegate the stoning of Jamarat to your son or caregiver during crowd peak hours, utilize transport carts, and depart Muzdalifah after midnight.',
    adviceAr: 'الدين يسر: «إن الدين يسر ولن يشاد الدين أحد إلا غلبه». الشريعة الإسلامية جعلت لكبار السن رخصاً مريحة بأجر تام، كتوكيل الابن أو المرافق في رمي الجمرات في أوقات الذروة، واستخدام عربات الطواف، والدفع من مزدلفة بعد منتصف الليل.',
    clinicalRationaleEn: 'Crowd surge dynamics in constricted tunnels generate lethal compressive forces. Utilizing Shariah proxy and time-shift concessions completely eliminates senior crush hazards.',
    clinicalRationaleAr: 'التدافع في الممرات الضيقة يمثل خطراً حرجاً على كبار السن؛ الأخذ بالرخص الشرعية والتوكيل يحمي الحاج تماماً من مخاطر الزحام.',
    shariahConcessionEn: 'The Prophet (ﷺ) explicitly permitted the weak and elderly of his household to depart Muzdalifah early and delegated ritual actions when needed.',
    shariahConcessionAr: 'أذن النبي ﷺ للضعفة وكبار السن من أهله بالدفع من مزدلفة بليل، وقبل الإنابة في الرمي للمريض والعاجز.',
    audioGuidanceEn: 'Dear mother, delegating Jamarat stoning to Tariq is fully valid and rewarded. Your peace of mind and safety are beloved to Allah.',
    audioGuidanceAr: 'يا والدتي، توكيل ابنك طارق في رمي الجمرات جائز شرعاً وثوابك كامل بإذن الله، وصحتك وسلامتك أمانة غالية.',
    actionableChecklist: [
      {
        id: 'chk-delegate-stoning',
        textEn: 'Delegate Jamarat stoning to strong family member during midday heat peak',
        textAr: 'توكيل المرافق أو الابن برمي الجمرات في أوقات الزحام والحرارة'
      },
      {
        id: 'chk-electric-cart',
        textEn: 'Reserve mezzanine electric cart for Tawaf Ifadah & Sa\'i without hesitation',
        textAr: 'حجز عربة الطواف الكهربائية بالدور الميزانين دون أي حرج'
      },
      {
        id: 'chk-early-departure',
        textEn: 'Plan departure from Muzdalifah after midnight to ensure smooth bus transit',
        textAr: 'التحرك من مزدلفة بعد منتصف الليل لتيسير ركوب الحافلات بهدوء'
      }
    ],
    emergencySignEn: 'Feeling trapped in high-density crowd flow, sudden claustrophobia, or shallow breathing.',
    emergencySignAr: 'الشعور بالانحصار في موجات الزحام، الهلع أو ضيق النفس السريع.',
    progressConditionType: 'GENERAL',
    getProgressSummary: (steps, hydrationMl, tempC, isRtl) => {
      if (isRtl) {
        return `🕋 «يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ» — الأخذ بالرخصة يحفظ صحتك ويكتب لك الأجر كاملاً بإذن الله.`;
      }
      return `🕋 "Allah intends for you ease" — Embracing Shariah concessions safeguards your vitality with full reward.`;
    }
  },
  {
    id: 'advice-rest-energy-06',
    category: 'REST_ENERGY',
    categoryTitleEn: 'Digestion, Rest Intervals & Sleep',
    categoryTitleAr: 'التغذية الخفيفة والنوم واستعادة الطاقة',
    titleEn: 'Nutritional Vitality & Tent Sleep Optimization',
    titleAr: 'التغذية السهلة، القيلولة المباركة، وتجديد النشاط',
    tagEn: 'Rest & Energy Protocol',
    tagAr: 'بروتوكول الراحة والطاقة',
    tagColor: 'amber',
    iconName: 'Coffee',
    relevantStage: 'MINA_REST',
    relevantStageNameEn: 'Mina Tents & Hotel Suites',
    relevantStageNameAr: 'مخيمات منى وغرف الإقامة',
    adviceEn: 'Heavy fatty meals divert blood flow to digestion, causing severe lethargy and abdominal bloating. Opt for light frequent meals: laban (buttermilk), ripe bananas (rich in potassium for muscle recovery), warm clear broth, and seedless dates. Aim for a 45-minute afternoon nap between Dhuhr and Asr.',
    adviceAr: 'الوجبات الدسمة الثقيلة تسبب خمولاً هضمياً وانتفاخاً؛ استبدليها بوجبات خفيفة متفرقة: اللبن الزبادي، الموز الغني بالبوتاسيوم لمنع الشد العضلي، الشوربة الدافئة، والتمر. احرصي على قيلولة قصيرة لمدة 45 دقيقة بعد الظهر لتجديد النشاط.',
    clinicalRationaleEn: 'Postprandial hypotension is prevalent in seniors following heavy carbohydrate/fat meals, exacerbating fatigue during hot afternoons.',
    clinicalRationaleAr: 'هبوط الضغط بعد الوجبات الدسمة شائع عند كبار السن ويزيد الشعور بالإرهاق والنعاس أثناء ساعات النهار الحارة.',
    shariahConcessionEn: 'The afternoon Qaylulah (nap) is an authentic Prophetic tradition that aids night prayers and worship.',
    shariahConcessionAr: 'القيلولة المباركة سنة نبوية تعين على قيام الليل ومواصلة الذكر والدعاء بنشاط.',
    audioGuidanceEn: 'Hajjah Fatima, have a cup of laban and two dates, then take your peaceful afternoon rest inside the tent.',
    audioGuidanceAr: 'يا حاجة فاطمة، تناولي كأس لبن مع تمرات واستريحي في خيمتك المكيفة قبل صلاة العصر.',
    actionableChecklist: [
      {
        id: 'chk-light-meals',
        textEn: 'Eat small, frequent easily digestible portions instead of heavy buffets',
        textAr: 'تناول وجبات صغيرة خفيفة سهلة الهضم وتجنب الأطعمة الدسمة'
      },
      {
        id: 'chk-potassium-fruit',
        textEn: 'Eat 1 banana or watermelon slice daily to prevent painful calf cramps',
        textAr: 'تناول موزة أو شريحة بطيخ يومياً لإمداد العضلات بالبوتاسيوم ومنع التقلصات'
      },
      {
        id: 'chk-qaylulah-nap',
        textEn: 'Take a 30-45 min restful power nap in the air-conditioned tent',
        textAr: 'أخذ قيلولة هادئة لمدة 30-45 دقيقة في الخيمة المكيفة'
      }
    ],
    emergencySignEn: 'Severe persistent nausea, severe abdominal colic, or inability to retain fluids.',
    emergencySignAr: 'الغثيان الشديد المستمر، المغص الحاد، أو عدم القدرة على استبقاء السوائل.',
    progressConditionType: 'REST_NEED',
    getProgressSummary: (steps, hydrationMl, tempC, isRtl) => {
      if (isRtl) {
        return `🌙 أنجزتِ جهداً بدنياً كبيراً اليوم (${steps.toLocaleString()} خطوة) — القيلولة والراحة الآن ضرورة لإتمام المناسك.`;
      }
      return `🌙 You've exerted substantial effort today (${steps.toLocaleString()} steps) — A restful nap is vital for recovery.`;
    }
  },
  {
    id: 'advice-crowd-pacing-07',
    category: 'CROWD_PACING',
    categoryTitleEn: 'Crowd Navigation & Calm Breathing',
    categoryTitleAr: 'التعامل مع التزاحم والحفاظ على الهدوء',
    titleEn: 'Panic Prevention, Peripheral Movement & Group Sync',
    titleAr: 'تجنب التزاحم، المشي في الأطراف، والتنفس الهادئ',
    tagEn: 'Safe Movement Guidelines',
    tagAr: 'إرشادات الحركة الآمنة',
    tagColor: 'purple',
    iconName: 'Users',
    relevantStage: 'ALL_STAGES',
    relevantStageNameEn: 'Courtyards, Gates & Corridors',
    relevantStageNameAr: 'أبواب الحرم، الساحات، وممرات المشاة',
    adviceEn: 'When entering or leaving the Grand Mosque or Mina pathways, never push against incoming human waves. Stay to the outer right edge of walking corridors where crowd density is 60% lower. If separated, remain stationary near a known numbered gate (e.g. King Fahd Gate 79) and activate Rufqa Lost Mode.',
    adviceAr: 'عند الدخول أو الخروج من ساحات الحرم أو ممرات منى، تجنبي السير في قلب الموجات البشرية الكثيفة، والتزمي بأقصى الجانب الأيمن للممر حيث يقل التزاحم بنسبة 60%. وفي حال الانفصال عن المرافق، ابقي ثابتة عند أقرب باب مرقم (مثل باب الملك فهد 79) وافتحي وضع التائه.',
    clinicalRationaleEn: 'Sudden crowd claustrophobia can trigger acute hyperventilation, panic-induced tachycardia, and elevated cardiac afterload.',
    clinicalRationaleAr: 'التزاحم المفاجئ يسبب تسارع التنفس والهلع وارتفاع ضغط الدم اللحظي؛ التزام الأطراف والتنفس البطني العميق يعيدان الهدوء فوراً.',
    shariahConcessionEn: 'Maintaining personal safety and avoiding harming others in crowds is a cardinal Shariah principle that takes precedence over proximity.',
    shariahConcessionAr: 'اجتناب مزاحمة المسلمين وحفظ السلامة البدنية مقصد شرعي عظيم مقدم على القرب المكاني.',
    audioGuidanceEn: 'Fatima, walk calmly along the right side of the corridor. If crowds thicken, stop and rest by the nearest column.',
    audioGuidanceAr: 'يا أمي، امشي بهدوء في الجانب الأيمن من الممر، وإذا اشتد الزحام فاستندي لأقرب عمود واستريحي.',
    actionableChecklist: [
      {
        id: 'chk-outer-lanes',
        textEn: 'Walk strictly on the right peripheral edge of corridors and Tawaf tracks',
        textAr: 'المشي في الحواف اليمنى الخارجية للممرات ومسارات الطواف'
      },
      {
        id: 'chk-gate-landmark',
        textEn: 'Memorize your entrance Gate Number (Gate 79) before stepping into courtyards',
        textAr: 'حفظ رقم باب الدخول (باب 79) والاطمئنان لمكانه قبل الدخول'
      },
      {
        id: 'chk-calm-breath',
        textEn: 'Practice 4-second deep diaphragmatic breathing if feeling crowded',
        textAr: 'ممارسة التنفس العميق الهادئ (شهيق 4 ثوانٍ وزفير بطيء) عند الشعور بالازدحام'
      }
    ],
    emergencySignEn: 'Severe hyperventilation, chest tightness, or disorientation regarding your surroundings.',
    emergencySignAr: 'فرط التنفس والتسارع الشديد للنبض، ضيق الصدر، أو فقدان الإحساس بالاتجاهات.',
    progressConditionType: 'GENERAL',
    getProgressSummary: (steps, hydrationMl, tempC, isRtl) => {
      if (isRtl) {
        return `🧭 رفيقك رفقة يراقب موقعك وإشارات الأمان — أنتِ في نطاق محمي ومتابَع من قبل مرشد الحملة والأسرة.`;
      }
      return `🧭 Rufqa companion is tracking your safety zones — You are in a monitored perimeter protected by your leader.`;
    }
  }
];

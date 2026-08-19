import { RitualHealthTip } from '../types';

export const RITUAL_HEALTH_TIPS: RitualHealthTip[] = [
  {
    id: 'tip-tawaf',
    ritualStage: 'TAWAF',
    title: 'Tawaf (Circumambulation of the Kaaba)',
    titleAr: 'طواف القدوم والإفاضة (صحن المطاف والأدوار العلوية)',
    locationName: 'Grand Mosque (Mataf Courtyard & 1st Floor Ring)',
    locationNameAr: 'المسجد الحرام — صحن المطاف ومسارات الطواف المخصصة',
    intensity: 'MODERATE_PACED',
    ambientTempC: 36,
    hydrationTargetMlPerHour: 450,
    hydrationGuidelines: [
      'Drink 1 cup (200-250ml) of cool Zamzam water before entering the Mataf.',
      'Sip small quantities continuously rather than gulping large volumes at once.',
      'Avoid icy-cold water if you have sensitive throat or history of coughing during exertion.'
    ],
    hydrationGuidelinesAr: [
      'اشربي كأساً من ماء زمزم المعتدل (200-250 مل) قبل الدخول لصحن المطاف.',
      'احرصي على الرشف البطيء المستمر وتجنبي الشرب السريع بكميات كبيرة لتفادي امتلاء المعدة.',
      'يُفضل تجنب الماء شديد البرودة إذا كان لديك حساسية بالحلق أو سعال إجهادي.'
    ],
    restIntervalMinutes: 20,
    restGuidelines: [
      'Take a 5-minute seated rest after completing the 3rd circuit at the outer perimeter benches.',
      'Maintain an unhurried, steady gait; walk along the outer ring to minimize crowding pressure.',
      'If dizziness, palpitation, or knee stiffness occurs, utilize the designated electric cart mezzanine level.'
    ],
    restGuidelinesAr: [
      'استريحي لمدة 5 دقائق بعد الشوط الثالث على المقاعد الجانبية في أطراف الصحن.',
      'حافظي على خطوة هادئة ومنتظمة وامشي في المسارات الخارجية لتقليل التزاحم.',
      'في حال الشعور بدوار أو ثقل بالركبتين، يُنصح بالانتقال لمسار العربات الكهربائية بالدور الميزانين.'
    ],
    clinicalPrecaution: 'Monitor orthostatic vitals; elderly pilgrims with hypertension should not rush through transitions.',
    clinicalPrecautionAr: 'مراقبة ضغط الدم وتجنب الوقوف أو الانحناء المفاجئ؛ أخذ الأدوية في مواعيدها مع وجبة خفيفة.',
    seniorConcession: 'Using electric wheelchairs or having a caregiver push a transport chair is a fully rewarded Shariah concession.',
    seniorConcessionAr: 'استخدام العربات الكهربائية أو وجود مرافق يدفع الكرسي رخصة شرعية كاملة الأجر لكبار السن.',
    audioVoiceGuidance: 'Dear mother Fatima, pace your steps during Tawaf. Drink a cup of Zamzam every two circuits and rest your knees when needed.',
    audioVoiceGuidanceAr: 'يا والدتي فاطمة، هوني على نفسك في الطواف، واشربي جرعات ماء زمزم بعد كل شوطين، واستريحي كلما شعرتِ بتعب.',
    emergencySignToWatch: 'Cold sweat, chest tightness, or lightheadedness when turning corners.',
    emergencySignToWatchAr: 'التعرق البارد، ضيق التنفس، أو زغللة العين عند الالتفاف.'
  },
  {
    id: 'tip-sai',
    ritualStage: 'SAI',
    title: 'Sai between Safa & Marwah',
    titleAr: 'السعي بين الصفا والمروة',
    locationName: 'Masaa (Safa & Marwah Air-Conditioned Corridor)',
    locationNameAr: 'المسعى المكيف بين الصفا والمروة',
    intensity: 'HIGH_EXERTION',
    ambientTempC: 25,
    hydrationTargetMlPerHour: 400,
    hydrationGuidelines: [
      'Take a hydration stop at the Zamzam dispensers located on the Safa side and Marwah turnaround.',
      'Total walking distance is approx. 3.15 km across the 7 laps; maintain steady fluid intake.'
    ],
    hydrationGuidelinesAr: [
      'توقفي للشرب عند برادات زمزم المتوفرة عند منتهى الصفا وعند منتهى المروة في كل شوط.',
      'المسافة الإجمالية للمسعى تبلغ قرابة 3.15 كم؛ لذا حافظي على الترطيب المستمر لتجنب تشنج العضلات.'
    ],
    restIntervalMinutes: 15,
    restGuidelines: [
      'The "Green Lights" running/trotting zone is strictly optional and NOT recommended for seniors.',
      'Sit for 3-5 minutes on the marble resting ledges at the end of each lap while supplicating.',
      'Wear supportive, cushioned footwear or thick anti-slip pilgrim socks.'
    ],
    restGuidelinesAr: [
      'الهرولة بين العلمين الأخضرين خاصة بالرجال الأصحاء وليست مطلوبة من كبار السن؛ واصلي المشي الهادئ.',
      'اجلسي على المقاعد الرخامية الجانبية عند نهاية كل شوط لمدة 3-5 دقائق مع الدعاء والذكر.',
      'ارتدي أحذية طبية مريحة أو جوارب سميكة مانعة للانزلاق لحماية القدمين.'
    ],
    clinicalPrecaution: 'Diabetic foot care: inspect feet for redness or friction blisters immediately after completing Sai.',
    clinicalPrecautionAr: 'العناية بالقدم السكرية: فحص باطن القدمين للتأكد من عدم وجود احمرار أو احتكاك بعد انتهاء السعي.',
    seniorConcession: 'Resting between laps on chairs does not interrupt the continuity of Sai.',
    seniorConcessionAr: 'الاستراحة بين الأشواط على الكراسي أو شرب الماء لا يقطع تتابع السعي باتفاق الفقهاء.',
    audioVoiceGuidance: 'Walk calmly in the Masaa, Fatima. The green light zone does not require fast walking for seniors.',
    audioVoiceGuidanceAr: 'امشي بهدوء ووقار في المسعى يا أمي، فالإسراع بين العلمين ليس مطلوباً من كبار السن.',
    emergencySignToWatch: 'Severe calf muscle cramping or knee hyper-extension pain.',
    emergencySignToWatchAr: 'تقلص عضلات الساق الشديد (الشد العضلي) أو ألم المفاصل الحاد.'
  },
  {
    id: 'tip-mina',
    ritualStage: 'MINA_REST',
    title: 'Mina Tents & Day of Tarwiyah',
    titleAr: 'مخيمات منى ويوم التروية وأيام التشريق',
    locationName: 'Mina Tents (Camp #42, Street 204)',
    locationNameAr: 'مخيمات منى المطورة — مخيم الحملة 42 شارع 204',
    intensity: 'LOW_REST',
    ambientTempC: 32,
    hydrationTargetMlPerHour: 300,
    hydrationGuidelines: [
      'Aim for 2.5 to 3.0 Liters of total liquids per day inside the air-conditioned tent.',
      'Consume oral electrolyte sachets, clear broth, laban (buttermilk), and fresh melon slices.'
    ],
    hydrationGuidelinesAr: [
      'احرصي على شرب ما لا يقل عن 2.5 إلى 3 لترات من السوائل المتنوعة يومياً داخل الخيمة المكيفة.',
      'تناولي محاليل التروية الفموية، اللبن الزبادي، والشوربة الدافئة وقطع البطيخ الغنية بالبوتاسيوم.'
    ],
    restIntervalMinutes: 60,
    restGuidelines: [
      'Elevate feet on pillows during afternoon rest to reduce dependent edema in lower legs.',
      'Take an uninterrupted 45-60 minute nap after Dhuhr prayer before the evening rituals.',
      'Perform gentle ankle flexion exercises while seated to stimulate venous return.'
    ],
    restGuidelinesAr: [
      'ارفعي قدميكِ على وسادة أثناء الاستراحة لتقليل تورم الساقين الناتج عن الوقوف الطويل.',
      'احصلي على قيلولة هادئة لمدة 45-60 دقيقة بعد صلاة الظهر لاستعادة النشاط.',
      'مارسي تحريك الكاحلين وأصابع القدمين وأنتِ جالسة لتنشيط الدورة الدموية.'
    ],
    clinicalPrecaution: 'Ensure chronic morning medications (anti-hypertensive, blood thinners) are taken with breakfast.',
    clinicalPrecautionAr: 'التأكد من تناول أدوية الضغط والأدوية المزمنة في مواعيدها المحددة بعد وجبة الإفطار.',
    seniorConcession: 'Remaining in the tent during peak midday heat is recommended by health and Hajj authorities.',
    seniorConcessionAr: 'البقاء داخل الخيمة وتجنب الخروج في ساعات الظهيرة الشديدة الحرارة واجب صحي وتيسير شرعي.',
    audioVoiceGuidance: 'Rest peacefully in your Mina tent, mother. Drink water with electrolyte minerals and elevate your feet.',
    audioVoiceGuidanceAr: 'استريحي في خيمتك بمنى يا والدتي، واشربي الماء الممزوج بالأملاح المعدنية وارفعي قدميكِ قليلاً.',
    emergencySignToWatch: 'Decreased urine output, persistent dark urine, or extreme drowsiness.',
    emergencySignToWatchAr: 'قلة التبول أو تغير لونه للداكن، أو الخمول الشديد غير المعتاد.'
  },
  {
    id: 'tip-jamarat',
    ritualStage: 'JAMARAT',
    title: 'Jamarat Stoning Ritual',
    titleAr: 'رمي الجمرات (جسر الجمرات)',
    locationName: 'Jamarat Bridge Multi-Level Complex',
    locationNameAr: 'منشأة جسر الجمرات متعددة الأدوار',
    intensity: 'EXTREME_CAUTION',
    ambientTempC: 42,
    hydrationTargetMlPerHour: 600,
    hydrationGuidelines: [
      'Drink 500ml electrolyte fluid 30 minutes before leaving the camp.',
      'Carry a lightweight insulated water bottle and personal water mist spray fan.'
    ],
    hydrationGuidelinesAr: [
      'اشربي 500 مل من محلول التروية أو العصير الطبيعي قبل الخروج من المخيم بنصف ساعة.',
      'احملي قارورة ماء معزولة وبخاخ ماء شخصي مدمج بمروحة لتبريد الوجه واليدين.'
    ],
    restIntervalMinutes: 15,
    restGuidelines: [
      'Strictly avoid walking to Jamarat between 10:30 AM and 04:00 PM (peak sun hours).',
      'Use the shaded moving walkways and rest at the intermediate medical cooling hubs.',
      'Walk alongside the camp group guide in the middle lane; avoid crowd convergence edges.'
    ],
    restGuidelinesAr: [
      'يُمنع منعاً باتاً خروج كبار السن لرمي الجمرات في أوقات ذروة الشمس بين 10:30 صباحاً و 4:00 عصراً.',
      'استخدمي المسارات المظللة والمماشي المتحركة وتوقفي عند نقاط التبريد الطبية المنتشرة.',
      'امشي بالقرب من مرشد الحملة وفي المسار الأوسط بعيداً عن أطراف الاندفاع.'
    ],
    clinicalPrecaution: 'Extreme heatstroke vulnerability: watch skin temperature and disorientation.',
    clinicalPrecautionAr: 'خطورة الإصابة بالإجهاد الحراري أو ضربات الشمس: مراقبة حرارة الجلد ودرجة الوعي بدقة.',
    seniorConcession: 'Authorizing a proxy (التوكيل في الرمي) is an authentic Sunnah concession for seniors and unwell pilgrims.',
    seniorConcessionAr: 'توكيل المرشد أو أحد أفراد الأسرة برمي الجمرات نيابة عنكِ رخصة نبوية شريفة وتيسير مؤكد.',
    audioVoiceGuidance: 'Please do not exert yourself under the sun for Jamarat, Fatima. You may delegate the throwing to your guide.',
    audioVoiceGuidanceAr: 'لا تجهدي نفسكِ تحت حرارة الشمس يا أمي، فرخصة التوكيل في رمي الجمرات ثابتة وتامة الأجر بإذن الله.',
    emergencySignToWatch: 'Hot dry skin without sweating, confusion, staggering gait, or nausea.',
    emergencySignToWatchAr: 'سخونة الجلد مع انقطاع التعرق، الدوخة، الترنح في المشي، أو الغثيان المفاجئ.'
  },
  {
    id: 'tip-arafat',
    ritualStage: 'ARAFAT_DUA',
    title: 'Day of Arafat (Wuquf & Dua)',
    titleAr: 'يوم عرفة (الوقوف والدعاء)',
    locationName: 'Arafat Plain & Namirah Area',
    locationNameAr: 'صعيد عرفات ومحيط مسجد نمرة',
    intensity: 'MODERATE_PACED',
    ambientTempC: 40,
    hydrationTargetMlPerHour: 500,
    hydrationGuidelines: [
      'Continuously sip water, coconut water, or Zamzam every 30 minutes throughout the Day of Arafat.',
      'Eat hydrating snacks such as cucumbers, oranges, and dates.'
    ],
    hydrationGuidelinesAr: [
      'رشفات ماء مستمرة كل 30 دقيقة طوال يوم عرفة، مع ماء زمزم والتمر والعصائر الطبيعية.',
      'تناول الفواكه والخضروات الغنية بالماء كالخيار والبرتقال والبطيخ.'
    ],
    restIntervalMinutes: 45,
    restGuidelines: [
      'Remain inside the air-conditioned tent for supplication and prayer; do not hike up Jabal Al-Rahmah in direct sun.',
      'Use a folding cushioned chair for prayer if standing causes knee or back fatigue.'
    ],
    restGuidelinesAr: [
      'البقاء داخل الخيمة المكيفة للتفرغ للذكر والدعاء؛ وتجنب صعود جبل الرحمة تحت أشعة الشمس المباشرة.',
      'استخدام كرسي صلاة مبطن عند الشعور بتعب في الظهر أو المفاصل أثناء الوقوف للدعاء.'
    ],
    clinicalPrecaution: 'High emotional and physical demands: protect against heat exhaustion and skipped meals.',
    clinicalPrecautionAr: 'حماية الجسم من الإجهاد الحراري مع الحرص على تناول وجبة الغداء الخفيفة بانتظام.',
    seniorConcession: 'Supplication inside the tent anywhere within the boundaries of Arafat fulfills the ritual perfectly.',
    seniorConcessionAr: 'الدعاء داخل الخيمة في أي جزء من صعيد عرفات مجزئ ووافٍ بالركن العظيم بالكامل.',
    audioVoiceGuidance: 'May Allah accept your prayers in Arafat, mother. Stay in the cool tent and drink plenty of water.',
    audioVoiceGuidanceAr: 'تقبل الله طاعتك ودعاءك بعرفة يا والدتي، الزمي الظل والراحة داخل الخيمة واكثري من الشرب.',
    emergencySignToWatch: 'Throbbing headache, rapid shallow pulse, or sudden weakness.',
    emergencySignToWatchAr: 'الصداع النابض، تسارع النبض مع ضعفه، أو الهبوط المفاجئ في القوى.'
  },
  {
    id: 'tip-hotel',
    ritualStage: 'HOTEL_REST',
    title: 'Hotel Residence Recovery',
    titleAr: 'استراحة الفندق والتعافي',
    locationName: 'Swissôtel Residence (Room 1408)',
    locationNameAr: 'فندق سويس أوتيل — الغرفة 1408 (فترة التعافي والاستراحة)',
    intensity: 'LOW_REST',
    ambientTempC: 22,
    hydrationTargetMlPerHour: 250,
    hydrationGuidelines: [
      'Replenish daily baseline fluids: 2.0 Liters total before bedtime.',
      'Enjoy warm soothing herbal teas (chamomile or mint) to relax muscles.'
    ],
    hydrationGuidelinesAr: [
      'استكمال الحصة اليومية من السوائل: لتران كاملان من الماء والسوائل قبل النوم.',
      'شرب شاي الأعشاب الدافئ مثل البابونج أو النعناع لإرخاء العضلات وتهدئة الأعصاب.'
    ],
    restIntervalMinutes: 90,
    restGuidelines: [
      'Take a warm shower to relieve muscle tension followed by gentle moisturizer on feet.',
      'Aim for 7-8 hours of deep restorative sleep in the quiet hotel room.'
    ],
    restGuidelinesAr: [
      'أخذ حمام دافئ لإراحة العضلات المتعبة وتدليك القدمين بكريم مرطب ومريح.',
      'الحرص على النوم الهادئ لمدة 7-8 ساعات لاستعادة الحيوية والنشاط لليوم التالي.'
    ],
    clinicalPrecaution: 'Evening medication check: confirm evening blood pressure and ACB-free sleep comfort routine.',
    clinicalPrecautionAr: 'مراجعة أدوية المساء والتأكد من أخذ جرعات الضغط والعلاج بانتظام مع كوب ماء كافٍ.',
    seniorConcession: 'Resting in the hotel room between obligatory rituals is essential to preserve health and stamina.',
    seniorConcessionAr: 'الراحة التامة بالفندق بين المناسك ضرورة صحية شرعية لحفظ القوة وإتمام النسك بسلام.',
    audioVoiceGuidance: 'You are safe and resting in your room, mother. Sleep well and drink your evening water.',
    audioVoiceGuidanceAr: 'أنتِ في أمان وراحة بغرفتك يا أمي، نوم هنيء وراحة مباركة بعد يوم حافل بالطاعات.',
    emergencySignToWatch: 'Severe nocturnal cramps or fever.',
    emergencySignToWatchAr: 'الشد العضلي الليلي الشديد أو ارتفاع درجة الحرارة.'
  }
];

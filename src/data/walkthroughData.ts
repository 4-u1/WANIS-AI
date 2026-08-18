import { TourStep, ContextualHelpItem, FeatureGuideItem, FaqItem } from '../types';

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'step-dashboard',
    stepNumber: 1,
    totalSteps: 7,
    targetSelector: '#senior-view-container, #main-header',
    targetMode: 'senior',
    badge: {
      en: 'Overview & Home',
      ar: 'لوحة المتابعة الرئيسية',
      fr: 'Tableau de bord'
    },
    title: {
      en: 'Your Wellbeing Dashboard',
      ar: 'لوحة العافية والاطمئنان اليومي',
      fr: 'Votre tableau de bord bien-être'
    },
    description: {
      en: 'This is your starting point. Here you can see your wellbeing status, recent changes, empathetic recommendations, and important actions at a glance.',
      ar: 'هذه نقطة انطلاقك اليومية. من هنا يمكنك الاطمئنان على صحتك، ومتابعة آخر التغيرات والتوصيات المريحة، والوصول لأهم المهام بلمسة واحدة.',
      fr: 'Ceci est votre point de départ. Vous y trouverez l\'état de votre bien-être, vos évolutions récentes et vos recommandations adaptées.'
    },
    seniorSimpleText: {
      en: 'This is your home screen. Tap here whenever you want to see how you are doing today.',
      ar: 'هذه شاشتك الرئيسية. اضغط هنا في أي وقت للاطمئنان على يومك وصحتك.',
      fr: 'Ceci est votre écran d\'accueil. Consultez-le pour savoir comment se passe votre journée.'
    },
    speechAudioText: {
      en: 'Welcome to Wanees. This is your Wellbeing Dashboard where you can check how you are doing every day.',
      ar: 'أهلاً بك في ونيس. هذه شاشتك الرئيسية للاطمئنان على صحتك ويومك بكل سهولة.',
      fr: 'Bienvenue sur Wanees. Voici votre tableau de bord quotidien pour veiller sur votre bien-être.'
    }
  },
  {
    id: 'step-checkin',
    stepNumber: 2,
    totalSteps: 7,
    targetSelector: '#start-voice-checkin-hero-btn',
    targetMode: 'senior',
    badge: {
      en: 'Voice First Intake',
      ar: 'الاطمئنان الصوتي الذكي',
      fr: 'Check-in vocal'
    },
    title: {
      en: 'Voice-First Weekly & Daily Check-in',
      ar: 'جلسة الاطمئنان الصوتي السلسة',
      fr: 'Enregistrement vocal régulier'
    },
    description: {
      en: 'Tell Wanees how you are feeling using natural voice or text. Wanees understands regional dialects and identifies meaningful changes in sleep, mood, and fatigue without tedious medical forms.',
      ar: 'تحدث مع ونيس بلهجتك الطبيعية وصوتك المريح. يستمع إليك ونيس باهتمام ويفهم مشاعرك ونمط نومك دون الحاجة لتعبئة استمارات معقدة.',
      fr: 'Exprimez votre ressenti à Wanees avec votre voix naturelle. Wanees comprend vos habitudes sans formulaires médicaux fastidieux.'
    },
    seniorSimpleText: {
      en: 'Tap the yellow microphone button and speak freely. Wanees is listening with love and care.',
      ar: 'اضغط على زر الميكروفون وتحدث بكل راحة. ونيس يستمع إليك باهتمام ويسجل ما تحتاجه.',
      fr: 'Appuyez sur le micro jaune et parlez librement. Wanees vous écoute avec bienveillance.'
    },
    speechAudioText: {
      en: 'You can tap the microphone to talk with Wanees naturally without filling out complex forms.',
      ar: 'يمكنك الضغط على زر الميكروفون للتحدث مع ونيس بصوتك الطبيعي في أي وقت.',
      fr: 'Appuyez sur le micro pour parler naturellement à Wanees sans formulaires complexes.'
    }
  },
  {
    id: 'step-wellbeing',
    stepNumber: 3,
    totalSteps: 7,
    targetSelector: '#family-longitudinal-summary-card, #family-portal-container',
    targetMode: 'family',
    badge: {
      en: 'Longitudinal Intelligence',
      ar: 'التحليل الطولي الذكي',
      fr: 'Intelligence longitudinale'
    },
    title: {
      en: 'Understand Your Patterns Over Time',
      ar: 'فهم وتتبع الأنماط الصحية عبر الزمن',
      fr: 'Comprenez vos tendances dans le temps'
    },
    description: {
      en: 'Wanees analyzes check-ins over time to identify subtle shifts in mood, memory concerns, sleep quality, and social connectedness against your personal baseline—providing supportive insights without replacing a medical diagnosis.',
      ar: 'يقارن ونيس يومياتك مع خط الأساس الشخصي الخاص بك لرصد أي تغيرات في النوم والمزاج والتواصل، ليقدم مؤشرات داعمة مع الحفاظ التام على أسبقية رأي الطبيب.',
      fr: 'Wanees analyse vos données au fil du temps pour détecter les évolutions de sommeil et d\'humeur par rapport à votre profil personnel.'
    },
    seniorSimpleText: {
      en: 'Here you and your family can see how your sleep, energy, and happiness stay on track over weeks.',
      ar: 'هنا يمكنك وعائلتك رؤية كيف يسير نومك ونشاطك وتواصلك على مدار الأيام والأسابيع.',
      fr: 'Ici, vous et vos proches suivez la qualité de votre repos et de vos journées.'
    },
    speechAudioText: {
      en: 'Wanees looks at patterns in sleep, mood, and social connection over time to provide supportive insights.',
      ar: 'يساعدك ونيس على فهم نمط نومك ومزاجك عبر الأيام لمساندتك أنت وأسرتك بكل طمأنينة.',
      fr: 'Wanees observe vos tendances de sommeil et d\'énergie pour vous accompagner au quotidien.'
    }
  },
  {
    id: 'step-medications',
    stepNumber: 4,
    totalSteps: 7,
    targetSelector: '#clinician-acb-calculator, #senior-tab-meds',
    targetMode: 'clinician',
    badge: {
      en: 'Medication Cognitive Risk',
      ar: 'عبء الأدوية المعرفي (ACB)',
      fr: 'Charge cognitive anticholinergique'
    },
    title: {
      en: 'Medication Cognitive Burden (ACB 2.0)',
      ar: 'مؤشر العبء المعرفي للأدوية (ACB)',
      fr: 'Analyse du fardeau cognitif médicamenteux'
    },
    description: {
      en: 'Wanees organizes your prescriptions and automatically calculates cumulative Anticholinergic Cognitive Burden (ACB) scores to help you and your clinician discuss medication-related cognitive risks and safer alternatives.',
      ar: 'ينظم ونيس قائمة أدويتك ويحسب تلقائياً العبء المعرفي المضاد للكولين (ACB) لمساعدة طبيبك على تقييم تأثير الأدوية على التركيز والنشاط واقتراح بدائل آمنة.',
      fr: 'Wanees structure vos ordonnances et calcule l\'indice ACB pour aider votre médecin à optimiser votre traitement.'
    },
    seniorSimpleText: {
      en: 'Keep track of your daily pills and see which medicines need discussion with your doctor. Never stop medicine on your own.',
      ar: 'تابع مواعيد أدويتك اليومية وتعرف على ما يستحق مناقشته مع طبيبك. لا توقف أي دواء بمفردك أبداً.',
      fr: 'Suivez vos médicaments quotidiens et préparez vos questions pour le médecin. Ne modifiez jamais votre traitement seul.'
    },
    speechAudioText: {
      en: 'Wanees organizes your medication list and calculates cognitive burden to assist your physician. Never change medications without a doctor.',
      ar: 'ينظم ونيس قائمة أدويتك ويقيس تأثيرها لمساعدة طبيبك. تذكر دائماً استشارة طبيبك قبل أي تغيير.',
      fr: 'Wanees analyse l\'impact cognitif de vos médicaments pour éclairer votre médecin.'
    }
  },
  {
    id: 'step-doctor-brief',
    stepNumber: 5,
    totalSteps: 7,
    targetSelector: '#btn-view-doctor-brief, #clinician-brief-preview',
    targetMode: 'clinician',
    badge: {
      en: 'Clinical Decision Support',
      ar: 'الملخص السريري للطبيب',
      fr: 'Synthèse clinique pour médecin'
    },
    title: {
      en: 'Prepare for Your Doctor Visit (Doctor Brief 2.0)',
      ar: 'ملخص الطبيب الموجز والجاهز للمراجعة',
      fr: 'Préparez votre consultation médicale'
    },
    description: {
      en: 'Transform weeks of longitudinal wellbeing signals and medication data into an executive clinical summary that a physician can digest in under 2 minutes, complete with discussion prompts and safety flags.',
      ar: 'يحوّل ونيس بيانات أسابيع من الاطمئنان اليومي والأدوية إلى تقرير سريري موجز ومركّز يفهمه الطبيب في أقل من دقيقتين، مع اقتراحات للنقاش الطبي البنّاء.',
      fr: 'Transformez vos données de bien-être en une synthèse clinique de moins de 2 minutes pour votre consultation.'
    },
    seniorSimpleText: {
      en: 'Click here to generate a clear summary you can show your doctor during your next appointment.',
      ar: 'اضغط هنا لإنشاء تقرير واضح وموجز يمكنك إظهاره لطبيبك في موعدك القادم.',
      fr: 'Générez un résumé clair à partager avec votre médecin lors de votre prochaine visite.'
    },
    speechAudioText: {
      en: 'Doctor Brief transforms your wellbeing data into a 2-minute clinical summary for your next doctor appointment.',
      ar: 'يقوم ملخص الطبيب بتحويل بياناتك إلى تقرير سريع يفهمه طبيبك في دقيقتين لتسهيل الحوار معه.',
      fr: 'La synthèse clinique prépare votre consultation en résumant l\'essentiel en deux minutes.'
    }
  },
  {
    id: 'step-care-circle',
    stepNumber: 6,
    totalSteps: 7,
    targetSelector: '#family-care-circle-list, #consent-settings-btn',
    targetMode: 'family',
    badge: {
      en: '4-Tier Consent & Privacy',
      ar: 'دائرة العائلة ومصفوفة الخصوصية',
      fr: 'Cercle de soins & Confidentialité'
    },
    title: {
      en: 'Stay Connected with Trusted Care Circle',
      ar: 'التواصل الآمن مع دائرة العائلة والاهتمام',
      fr: 'Restez connecté avec vos proches'
    },
    description: {
      en: 'With your explicit permission, share selected wellbeing updates with trusted family members and caregivers. You remain in complete control via our 4-Tier Consent matrix (Private, Family, Clinical, Emergency).',
      ar: 'شارك ما تختاره من تحديثات مع أبنائك وعائلتك بكل راحة. تظل أنت المتحكم الكامل بما يُشارك من خلال مستويات الخصوصية الأربعة المعتمدة.',
      fr: 'Partagez vos nouvelles avec vos proches en toute confiance grâce au modèle de consentement à 4 niveaux.'
    },
    seniorSimpleText: {
      en: 'Your family can see you are safe and happy. You decide what to share and what stays private.',
      ar: 'يمكن لعائلتك الاطمئنان عليك متى ما رغبت، ولك مطلق الحرية في اختيار ما ترغب بمشاركته.',
      fr: 'Vos proches savent que vous allez bien. Vous choisissez exactement ce que vous partagez.'
    },
    speechAudioText: {
      en: 'You can stay connected with family while keeping full control over your privacy at all times.',
      ar: 'ابقَ على تواصل مستمر مع عائلتك مع الاحتفاظ بالتحكم الكامل في خصوصيتك وسرية بياناتك.',
      fr: 'Gardez le lien avec votre famille tout en conservant le contrôle total de vos données.'
    }
  },
  {
    id: 'step-rufqa',
    stepNumber: 7,
    totalSteps: 7,
    targetSelector: '#rufqa-beacon-container, #goto-rufqa-hero-btn',
    targetMode: 'rufqa',
    badge: {
      en: 'Pilgrimage Safety Companion',
      ar: 'رفقة: أمان الحج والعمرة',
      fr: 'Rufqa : Compagnon pèlerinage'
    },
    title: {
      en: 'Rufqa — Your Hajj & Umrah Safety Companion',
      ar: 'رفقة: رفيقك الآمن في رحاب الحرمين الشريفين',
      fr: 'Rufqa — Votre compagnon de Hajj & Omra'
    },
    description: {
      en: 'Rufqa provides dedicated multilingual safety for pilgrims: instant "I\'m Lost" beacon, live location sync with your Tawafa group leader, multi-dialect emergency cards, and low-connectivity offline resilience.',
      ar: 'رفقة صُمم خصيصاً لسلامة الحاج والمعتمر: زر "أنا تائه" بنقرة واحدة، وتحديد الموقع للمطوف والعائلة، وبطاقات طوارئ بعدة لغات تعمل حتى عند ضعف الإنترنت.',
      fr: 'Rufqa accompagne les pèlerins avec le bouton d\'urgence "Je suis perdu", la localisation avec le guide et des fiches multilingues.'
    },
    seniorSimpleText: {
      en: 'If you ever lose your group during Hajj or Umrah, tap "I\'m Lost" to instantly alert your family and guide.',
      ar: 'إذا فقدت مجموعتك في الحرم أو المشاعر المقدسة، اضغط زر "أنا تائه" لطلب المساعدة فوراً.',
      fr: 'En cas d\'éloignement pendant le pèlerinage, appuyez sur "Je suis perdu" pour alerter votre guide.'
    },
    speechAudioText: {
      en: 'Rufqa keeps pilgrims safe during Hajj and Umrah with one-tap emergency location sharing and group leader support.',
      ar: 'رفقة يرافقك في رحاب الحرمين بزر طوارئ فوري لتحديد موقعك وتوجيهك إلى فندقك ومجموعتك بأمان.',
      fr: 'Rufqa sécurise votre pèlerinage grâce à l\'assistance immédiate et la géolocalisation partagée.'
    }
  }
];

export const CONTEXTUAL_HELP_ITEMS: Record<string, ContextualHelpItem> = {
  acb: {
    id: 'help-acb',
    topic: 'acb',
    title: {
      en: 'What is Anticholinergic Cognitive Burden (ACB)?',
      ar: 'ما هو العبء المعرفي المضاد للكولين (ACB)؟',
      fr: 'Qu\'est-ce que la charge cognitive anticholinergique (ACB) ?'
    },
    shortAnswer: {
      en: 'ACB is a clinical scale measuring how certain medications block acetylcholine in the brain, which can cause drowsiness, memory fog, confusion, or increased fall risk in seniors.',
      ar: 'مقياس سريري يقيس مدى تأثير بعض الأدوية على الناقل العصبي (الأسيتيل كولين) في الدماغ، والذي قد يسبب تشوشاً مؤقتاً في الذاكرة، أو نعاساً زائداً، أو زيادة احتمالية السقوط لدى كبار السن.',
      fr: 'L\'indice ACB mesure l\'impact de certains médicaments sur le cerveau, pouvant causer confusion, somnolence ou risque de chute chez les seniors.'
    },
    detailedExplanation: {
      en: 'Many common prescriptions—like first-generation antihistamines, bladder relaxants, and certain sleep aids or antidepressants—carry mild to strong anticholinergic properties. When multiple such medications are taken together, their cumulative score (ACB ≥ 3) is clinically correlated with increased cognitive decline. Wanees helps your doctor review safer alternative medications with zero ACB burden.',
      ar: 'تحتوي أدوية شائعة (مثل مضادات الحساسية المنومة، وبعض أدوية المسالك البولية والمفاصل والاكتئاب) على خصائص تحجب الإشارات العصبية. عند تناول أكثر من دواء منها، يتراكم العبء (ACB ≥ 3) مما قد يسبب ثقلاً ذهنياً. يساعد ونيس طبيبك على اكتشاف البدائل الأكثر أماناً.',
      fr: 'Plusieurs médicaments courants peuvent s\'additionner et créer une charge cognitive élevée. Wanees permet à votre médecin de repérer ces molécules et d\'envisager des alternatives adaptées.'
    },
    clinicalNote: {
      en: 'Clinical Rule: Never stop or adjust prescription dosages without your physician\'s guidance.',
      ar: 'تنبيه سريري: لا توقف أو تعدل جرعات الأدوية دون استشارة الطبيب المعالج.',
      fr: 'Règle clinique : Ne modifiez jamais votre traitement sans avis médical.'
    },
    relatedFeature: 'clinician'
  },
  doctorBrief: {
    id: 'help-doctor-brief',
    topic: 'doctorBrief',
    title: {
      en: 'What is a Doctor Brief 2.0?',
      ar: 'ما هو الملخص السريري (Doctor Brief 2.0)؟',
      fr: 'Qu\'est-ce que la synthèse Doctor Brief 2.0 ?'
    },
    shortAnswer: {
      en: 'A concise, 2-minute clinical summary that synthesizes weeks of your daily check-ins, sleep trends, medication risks, and patient-reported concerns into an executive format for your doctor.',
      ar: 'ملخص سريري مركز يمكن لطبيبك قراءته وفهمه في أقل من دقيقتين. يجمع التقرير يومياتك، ونمط نومك، وتحليل أدويتك، وأبرز ما ذكرته بصوتك لتسهيل زيارتك الطبية.',
      fr: 'Une synthèse clinique conçue pour être lue en 2 minutes par votre médecin, regroupant sommeil, observations et fardeau médicamenteux.'
    },
    detailedExplanation: {
      en: 'During short clinic appointments (often 10–15 minutes), it is difficult to remember every day\'s fatigue or sleep dip. Doctor Brief bridges the gap between daily living and clinical consultation with verified data provenance, discussion prompts, and safety highlights.',
      ar: 'في مواعيد العيادة السريعة، قد يصعب تذكر تفاصيل كل يوم. يقوم ملخص ونيس بربط حياتك اليومية بالاستشارة الطبية عبر عرض الرسوم البيانية للنوم والمزاج والأدوية مع أسئلة مقترحة للنقاش.',
      fr: 'Ce document fait le lien entre vos ressentis quotidiens et votre consultation, en soulignant les points clés à aborder avec votre praticien.'
    },
    relatedFeature: 'clinician'
  },
  rufqaLocation: {
    id: 'help-rufqa-location',
    topic: 'rufqaLocation',
    title: {
      en: 'How does Rufqa Emergency Location Sharing work?',
      ar: 'كيف يعمل تحديد ومشاركة الموقع في رفقة؟',
      fr: 'Comment fonctionne le partage de position Rufqa ?'
    },
    shortAnswer: {
      en: 'When you tap "I\'m Lost", Rufqa immediately captures your GPS coordinates, links them to nearby Haram gates and hotel landmarks, and securely transmits them to your Tawafa group leader and family.',
      ar: 'عند الضغط على زر "أنا تائه"، يقوم رفقة فوراً بتحديد إحداثياتك بدقة وربطها بأقرب أبواب الحرم أو أبراج الفنادق، وإرسال تنبيه فوري وموقع مباشر لمطوف الحملة ولعائلتك.',
      fr: 'En appuyant sur "Je suis perdu", vos coordonnées GPS précises et les repères proches sont immédiatement partagés avec votre guide et vos proches.'
    },
    detailedExplanation: {
      en: 'Rufqa includes offline resilience: even if cellular connectivity is congested, emergency badges in 6 languages (Arabic, English, French, Urdu, Indonesian, Turkish) display on your screen with your camp ID and leader phone number so local security officers can guide you safely.',
      ar: 'يتميز رفقة بإمكانية العمل دون إنترنت كامل؛ حيث تظهر بطاقة رقمية واضحة بـ 6 لغات على شاشة هاتفك تحمل رقم خيمتك وحملتك ورقم المطوف لإبرازها لأي رجل أمن أو مسعف في المشاعر المقدسة.',
      fr: 'Rufqa fonctionne également hors-ligne avec des cartes d\'urgence en plusieurs langues prêtes à être présentées aux agents de sécurité.'
    },
    relatedFeature: 'rufqa'
  },
  checkinAnalysis: {
    id: 'help-checkin-analysis',
    topic: 'checkinAnalysis',
    title: {
      en: 'How does Wanees analyze my voice check-in?',
      ar: 'كيف يحلل ونيس جلسة الاطمئنان الصوتي؟',
      fr: 'Comment Wanees analyse-t-il mon enregistrement ?'
    },
    shortAnswer: {
      en: 'Wanees uses compassionate, culturally aware clinical AI to listen to your words, dialectal tone, and reported energy, looking for meaningful patterns over time without diagnosing disease.',
      ar: 'يستخدم ونيس ذكاءً اصطناعياً سريرياً متعاطفاً يفهم اللهجات العربية ونبرة الحديث، ويستخلص مؤشرات النوم والنشاط والمشاعر لمتابعة استقرارك الصحي دون إصدار تشخيص طبي.',
      fr: 'Wanees utilise une IA médicale bienveillante qui comprend votre langage et détecte vos variations de forme sans poser de diagnostic médical.'
    },
    detailedExplanation: {
      en: 'Your transcript is evaluated for sentiment, fatigue indicators, memory mentions, and sleep hours. Everything is governed by your 4-Tier privacy settings, meaning private thoughts stay completely private unless you authorize sharing.',
      ar: 'تُقاس مؤشرات التعب، وعدد ساعات النوم، والشعور بالراحة. تظل تسجيلاتك محكومة بمصفوفة الخصوصية التامة ولا تُشارك مع أي طرف إلا بموافقتك الصريحة.',
      fr: 'Vos propos sont transcrits et évalués selon vos paramètres stricts de confidentialité.'
    },
    relatedFeature: 'senior'
  },
  emergencyCard: {
    id: 'help-emergency-card',
    topic: 'emergencyCard',
    title: {
      en: 'What is the Wanees Digital Emergency Card?',
      ar: 'ما هي بطاقة الطوارئ والهوية الصحية الذكية في ونيس؟',
      fr: 'Qu\'est-ce que la Carte d\'Urgence Numérique Wanees ?'
    },
    shortAnswer: {
      en: 'A secure, digital safety card stored in Wanees that displays your blood type, critical allergies, medical alerts, emergency contacts, and a tokenized responder QR code in Arabic, English, and French.',
      ar: 'بطاقة هوية صحية وأمان رقمية مشفرة داخل تطبيق ونيس، تعرض فصيلة الدم، والحساسية الحرجة، والتنبيهات الطبية، وجهات اتصال الطوارئ، ورمز QR آمن للمسعفين بالعربية والإنجليزية والفرنسية.',
      fr: 'Une carte d\'identité médicale sécurisée affichant groupe sanguin, allergies critiques, alertes et QR code secouriste en 3 langues.'
    },
    detailedExplanation: {
      en: 'Inspired by digital wallet cards, the Emergency Card offers a front/back 3D flip view, one-tap direct calls to emergency responders (997/911) and family caregivers, time-limited secure share passes (1 hour, 24 hours, or until revoked), and an immutable access audit trail. No sensitive clinical charts or financial data are ever encoded directly into the QR code.',
      ar: 'مستوحاة من بطاقات المحفظة الرقمية مع إمكانية قلب البطاقة ثلاثية الأبعاد، وأزرار اتصال سريعة بفرق الإسعاف (997) والعائلة، وروابط مشاركة مؤقتة وآمنة، مع سجل تدقيق مشفر لكل عملية مسح دون تعريض أي بيانات مالية أو حساسة للخطر.',
      fr: 'La carte permet un basculement 3D recto/verso, des appels d\'urgence en 1 clic (997/911), des passes de partage temporaires et un journal d\'audit complet.'
    },
    clinicalNote: {
      en: 'Safety Notice: Always keep your emergency contacts and allergies up to date. Review the card at least once every 30 days.',
      ar: 'تنبيه سلامة: احرص على مراجعة وتحديث أرقام الطوارئ والحساسية كل 30 يوماً على الأقل لضمان الجاهزية.',
      fr: 'Consigne de sécurité : Vérifiez vos informations d\'urgence tous les 30 jours.'
    },
    relatedFeature: 'senior'
  }
};

export const FEATURE_GUIDE_ITEMS: FeatureGuideItem[] = [
  {
    id: 'feat-senior-wellbeing',
    iconName: 'HeartHandshake',
    title: {
      en: 'Daily Wellbeing & Senior Mode',
      ar: 'الاطمئنان اليومي ووضع كبار السن',
      fr: 'Bien-être quotidien & Mode Senior'
    },
    tagline: {
      en: 'Voice-first companion with large touch targets and dignity.',
      ar: 'رفيق صوتي دافئ بأزرار كبيرة وتصميم مريح يحترم استقلالية الوالدين.',
      fr: 'Compagnon vocal avec grands boutons et ergonomie adaptée.'
    },
    description: {
      en: 'Empowering older adults with simple daily check-ins, medication logs with checkboxes, spoken audio guidance, and warm conversational support.',
      ar: 'تمكين كبار السن من الاطمئنان اليومي الصوتي، ومتابعة تناول الأدوية، والاستماع لتوجيهات صوتية واضحة ومريحة.',
      fr: 'Aide les seniors à enregistrer leur journée, suivre leurs prises de médicaments et écouter des rappels vocaux.'
    },
    targetMode: 'senior',
    badge: 'Senior Core',
    highlights: {
      en: ['One-tap voice check-in', 'High-contrast accessible buttons', 'Daily medication reminders', 'Conversational AI companion'],
      ar: ['اطمئنان صوتي بلمسة واحدة', 'أزرار واضحة عالية التباين', 'متابعة تناول الأدوية اليومية', 'محادثة صوتية دافئة وداعمة'],
      fr: ['Check-in vocal immédiat', 'Boutons haute lisibilité', 'Suivi des prises de médicaments', 'Compagnon vocal attentionné']
    }
  },
  {
    id: 'feat-family-circle',
    iconName: 'Users',
    title: {
      en: 'Family Care Circle & Longitudinal Trends',
      ar: 'دائرة العائلة والمتابعة الطولية',
      fr: 'Cercle familial & Tendances'
    },
    tagline: {
      en: 'Real-time peace of mind for long-distance caregivers.',
      ar: 'راحة بال مستمرة لأفراد العائلة والمشرفين على الرعاية.',
      fr: 'Sérénité en temps réel pour les familles et aidants.'
    },
    description: {
      en: 'Connect family members to receive gentle daily digests, review 14-day sleep and social engagement charts, and leave loving caregiver notes.',
      ar: 'ربط أفراد العائلة لمتابعة ملخصات الاطمئنان اليومي، ورسوم بيانية للنوم والتفاعل الاجتماعي، وإضافة ملاحظات رعاية مشتركة.',
      fr: 'Partagez des résumés quotidiens, des courbes d\'énergie et des notes d\'attention entre proches.'
    },
    targetMode: 'family',
    badge: 'Care Circle',
    highlights: {
      en: ['Natural language trend digests', '14-day sleep & social graphs', 'Caregiver shared notes log', 'Tier 2 family consent channel'],
      ar: ['ملخص باللغة الطبيعية للنوم والتواصل', 'رسوم بيانية لـ 14 يوماً من العافية', 'سجل ملاحظات ورسائل الرعاية', 'قناة عائلية مشفرة بالخصوصية'],
      fr: ['Synthèse rédigée du sommeil', 'Graphiques sur 14 jours', 'Notes de soins partagées', 'Confidentialité familiale']
    }
  },
  {
    id: 'feat-clinician-acb',
    iconName: 'Stethoscope',
    title: {
      en: 'Medication Cognitive Burden & Doctor Brief',
      ar: 'ذكاء الأدوية (ACB) وملخص الطبيب',
      fr: 'Charge cognitive & Synthèse médicale'
    },
    tagline: {
      en: 'Geriatric clinical decision support and 2-minute Doctor Briefs.',
      ar: 'دعم اتخاذ القرار الطبي لكبار السن وملخصات سريرية سريعة.',
      fr: 'Aide à la décision gériatrique et synthèse en 2 minutes.'
    },
    description: {
      en: 'Calculate Anticholinergic Cognitive Burden (ACB 2.0), test simulated drug interactions, and export PDF-ready clinical Doctor Briefs.',
      ar: 'حساب العبء المعرفي للأدوية المضادة للكولين، واختبار تأثير الأدوية الجديدة، وتصدير ملخص الطبيب للزيارات الميدانية.',
      fr: 'Calcul de l\'indice ACB 2.0, simulation d\'ordonnances et export de synthèses médicales pour consultation.'
    },
    targetMode: 'clinician',
    badge: 'Clinical CDS',
    highlights: {
      en: ['Automated ACB 2.0 scoring', 'Safer drug alternatives library', 'Executive 2-minute Doctor Brief', 'Clinical discussion prompts'],
      ar: ['حساب فوري لعبء ACB 2.0', 'اقتراح بدائل دوائية آمنة معتمدة', 'تقرير سريري مركز في دقيقتين', 'محاور جاهزة للنقاش مع الطبيب'],
      fr: ['Score ACB automatisé', 'Suggestions de molécules alternatives', 'Synthèse consultation en 2 min', 'Points de discussion cliniques']
    }
  },
  {
    id: 'feat-rufqa-pilgrim',
    iconName: 'Compass',
    title: {
      en: 'Rufqa — Hajj & Umrah Pilgrimage Companion',
      ar: 'رفقة: أمان الحج والعمرة التفاعلي',
      fr: 'Rufqa — Sécurité du Pèlerinage'
    },
    tagline: {
      en: 'Dedicated multilingual emergency and lost-pilgrim beacon.',
      ar: 'نظام أمان متكامل وتحديد موقع فوري لضيوف الرحمن في مكة والمدينة.',
      fr: 'Balise de secours et guidage multilingue pour La Mecque et Médine.'
    },
    description: {
      en: 'Specialized pilgrimage companion with one-tap "I\'m Lost" emergency alert, hotel and camp waypoints, Tawafa guide contact, and multi-language cards.',
      ar: 'رفيق متخصص لضيوف الرحمن بزر استغاثة "أنا تائه"، وتوجيه نحو الفندق والمخيم، وتواصل مباشر مع المطوف وبطاقات بـ 6 لغات.',
      fr: 'Compagnon pour les pèlerins avec alerte "Je suis perdu", repères d\'hôtels et fiches médicales multilingues.'
    },
    targetMode: 'rufqa',
    badge: 'Hajj & Umrah',
    highlights: {
      en: ['One-tap "I\'m Lost" broadcast', 'Tawafa group leader direct link', '6-language emergency badges', 'Offline landmark guidance'],
      ar: ['تنبيه "أنا تائه" بنقرة واحدة', 'اتصال مباشر بمطوف الحملة', 'بطاقات رقمية بـ 6 لغات للمشاعر', 'إرشاد نحو الفندق بدون إنترنت'],
      fr: ['Bouton SOS "Je suis perdu"', 'Lien direct avec le guide', 'Fiches de secours en 6 langues', 'Repères d\'hôtels hors-ligne']
    }
  },
  {
    id: 'feat-orchestrator-loop',
    iconName: 'Cpu',
    title: {
      en: 'Agentic Care Loop Orchestrator',
      ar: 'محرك حلقة الرعاية المغلقة (8 مراحل)',
      fr: 'Orchestrateur de soins en boucle'
    },
    tagline: {
      en: 'Observe → Understand → Assess → Recommend → Act → Share → Follow Up → Learn',
      ar: 'ملاحظة ← فهم ← تقييم ← توصية ← تنفيذ ← مشاركة ← متابعة ← تعلّم',
      fr: 'Observer → Comprendre → Évaluer → Recommander → Agir → Partager → Suivre → Apprendre'
    },
    description: {
      en: 'Inspect the live autonomous state machine driving transparent clinical invariants, audit logs, and safety triage rules.',
      ar: 'استعراض محرك الرعاية المستمرة الذاتي والاطلاع على سجلات التدقيق وقواعد الأمان السريري الشفافة.',
      fr: 'Visualisez l\'automate intelligent qui coordonne les données, les alertes et les actions de soin.'
    },
    targetMode: 'orchestrator',
    badge: 'State Machine',
    highlights: {
      en: ['8-stage closed care loop', 'Deterministic clinical boundaries', 'Immutable audit event log', 'Human-in-the-loop overrides'],
      ar: ['حلقة رعاية كاملة من 8 مراحل', 'قواعد سريرية حتمية وغير تشخيصية', 'سجل تدقيق كامل للعمليات', 'إمكانية التدخل البشري الدائم'],
      fr: ['Boucle de soin en 8 étapes', 'Règles cliniques transparentes', 'Journal d\'audit certifié', 'Supervision humaine continue']
    }
  },
  {
    id: 'feat-investor-hub',
    iconName: 'Briefcase',
    title: {
      en: 'Investor Intelligence Hub (22 Deliverables)',
      ar: 'مركز المستثمر والشراكات الاستراتيجية',
      fr: 'Espace Investisseurs & Partenaires'
    },
    tagline: {
      en: 'Comprehensive business model, clinical roadmap, and SaaS simulator.',
      ar: 'نموذج العمل التجاري، وخارطة الطريق السريرية، ومحاكي الإيرادات التفاعلي.',
      fr: 'Modèle économique, roadmap clinique et simulateur de revenus.'
    },
    description: {
      en: 'Explore all 22 institutional deliverables covering GTM strategy, unit economics, regulatory filings (FDA SaMD & EU AI Act), and risk matrices.',
      ar: 'تصفح كافة المخرجات الاستراتيجية الـ 22 التي تغطي خطط التوسع، واقتصاديات الوحدات، والامتثال التنظيمي، وإدارة المخاطر.',
      fr: 'Consultez les 22 livrables stratégiques, réglementaires et financiers de la plateforme.'
    },
    targetMode: 'investor',
    badge: '22 Deliverables',
    highlights: {
      en: ['22 executive deliverables', 'Interactive B2B2C ARR modeler', 'Regulatory compliance mapping', 'Clinical safety evidence base'],
      ar: ['22 مخرجاً استراتيجياً متكاملاً', 'محاكي إيرادات تفاعلي B2B2C', 'خارطة الامتثال التنظيمي الصحي', 'قاعدة الأدلة السريرية المعتمدة'],
      fr: ['22 livrables institutionnels', 'Simulateur économique interactif', 'Conformité réglementaire santé', 'Preuves d\'impact clinique']
    }
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: {
      en: 'Does Wanees replace my doctor or primary care physician?',
      ar: 'هل يحل ونيس محل الطبيب أو الاستشارة الطبية المباشرة؟',
      fr: 'Wanees remplace-t-il mon médecin traitant ?'
    },
    answer: {
      en: 'No, absolutely not. Wanees is a supportive non-diagnostic companion and clinical decision-support ecosystem. It gathers daily wellbeing observations and organizes medication risks to help you and your physician have more informed, productive conversations.',
      ar: 'كلا، إطلاقاً. ونيس رفيق داعم ونظام مساندة غير تشخيصي. مهمته جمع الملاحظات اليومية وتنظيم مؤشرات الأدوية لمساعدتك أنت وطبيبك في إجراء حوارات طبية أكثر دقة وفاعلية.',
      fr: 'Non, absolument pas. Wanees est un compagnon de soutien non diagnostique destiné à enrichir la consultation avec votre médecin.'
    }
  },
  {
    id: 'faq-2',
    category: 'privacy',
    question: {
      en: 'How is my personal and health data protected?',
      ar: 'كيف تتم حماية بياناتي الصحية وخصوصيتي الشخصية؟',
      fr: 'Comment mes données personnelles et de santé sont-elles protégées ?'
    },
    answer: {
      en: 'Wanees implements zero-trust end-to-end encryption and a 4-Tier Consent matrix (Private, Family Support, Clinical Sharing, Emergency). Raw check-in audio and personal reflections remain strictly in your private tier unless you explicitly authorize sharing.',
      ar: 'يعتمد ونيس تشفيراً آمناً ومصفوفة خصوصية من 4 مستويات (خاص، دعم العائلة، مشاركة سريرية، طوارئ). تظل تسجيلاتك الصوتية وخواطرك في نطاقك الخاص فقط ولا يُشارك أي تقرير إلا بإذنك الصريح.',
      fr: 'Wanees applique un chiffrement de bout en bout et un modèle de consentement à 4 niveaux qui vous garantit le contrôle total de vos données.'
    }
  },
  {
    id: 'faq-3',
    category: 'seniors',
    question: {
      en: 'Is Wanees easy to use for seniors who dislike complicated technology?',
      ar: 'هل ونيس سهل الاستخدام لكبار السن غير المعتادين على التطبيقات المعقدة؟',
      fr: 'Wanees est-il facile à utiliser pour les personnes âgées ?'
    },
    answer: {
      en: 'Yes! Wanees is designed senior-first with large high-contrast touch buttons, clear Arabic and multilingual fonts, voice-first speaking mode, and an optional Simple Mode that removes all visual clutter.',
      ar: 'نعم بكل تأكيد! صُمم ونيس خصيصاً لكبار السن بأزرار لمس كبيرة وواضحة، وخطوط عربية مقروءة، ودعم صوتي للتحدث والاستماع، مع وضع مبسط خالٍ من أي تعقيد.',
      fr: 'Oui ! Wanees propose de grands boutons tactiles, des polices contrastées, une commande vocale et un mode ultra-simple sans encombrement.'
    }
  },
  {
    id: 'faq-4',
    category: 'caregivers',
    question: {
      en: 'How does the Care Circle help family members living in another city or country?',
      ar: 'كيف تفيد دائرة العائلة الأبناء المقيمين في مدن أو دول أخرى؟',
      fr: 'Comment le Cercle de soins aide-t-il les familles éloignées ?'
    },
    answer: {
      en: 'Family members receive regular reassuring digests, see trends in sleep and social energy, get notified if meaningful changes occur, and can leave loving notes directly on the senior\'s screen.',
      ar: 'يتلقى أفراد العائلة ملخصات طمأنة منتظمة، ويرون رسوماً بيانية للنوم والتواصل، ويصلهم تنبيه لطيف عند حدوث أي تغير ملحوظ، مع إمكانية إرسال رسائل حب ودعم للشاشة مباشرة.',
      fr: 'Les proches reçoivent des synthèses régulières, suivent les courbes de repos et peuvent laisser des messages d\'attention.'
    }
  },
  {
    id: 'faq-5',
    category: 'general',
    question: {
      en: 'How does Rufqa assist during Hajj and Umrah pilgrimage?',
      ar: 'كيف يساعد رفيق الحج والعمرة (رفقة) في أوقات الزحام؟',
      fr: 'Comment Rufqa aide-t-il pendant les pèlerinages du Hajj et de l\'Omra ?'
    },
    answer: {
      en: 'Rufqa includes an immediate "I\'m Lost" beacon that shares your live GPS and nearest Haram landmarks with your campaign leader and family, alongside multilingual digital emergency cards that work even during low cellular connectivity.',
      ar: 'يوفر رفقة زر استغاثة فوري "أنا تائه" يشارك موقعك الدقيق وأقرب معالم الحرم مع مطوف الحملة وأسرتك، بالإضافة لبطاقات رقمية بـ 6 لغات تعمل حتى عند انقطاع الإنترنت.',
      fr: 'Rufqa intègre une balise d\'urgence pour partager votre localisation avec votre guide et des fiches d\'identité en plusieurs langues.'
    }
  }
];

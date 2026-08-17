import { InvestorDeliverable } from '../types';

export const INVESTOR_DELIVERABLES: InvestorDeliverable[] = [
  {
    id: 1,
    category: 'FOUNDATION',
    title: '1. One-Sentence Value Proposition',
    subtitle: 'Core Mission Statement & Strategic Identity',
    badge: 'Core Identity',
    content: 'WanisAI is a clinically responsible, culturally intelligent senior cognitive health intelligence platform that transforms longitudinal daily check-ins and medication risk data into proactive care orchestration, 2-minute Doctor Briefs, and dignified family connection—without replacing human care.',
    keyTakeaways: [
      'Focuses on proactive baseline deviation detection rather than diagnostic overreach.',
      'Bridges the gap between seniors, families, and clinicians using automated ACB medication analysis and Doctor Brief 2.0.',
      'Includes specialized cultural modules such as "Rufqa" for Hajj & Umrah pilgrimage safety.'
    ],
    metricsOrData: [
      { label: 'Target Demographic', value: '65+ Aging Population & Pilgrims' },
      { label: 'Core Paradigm', value: 'Observe → Understand → Assess → Recommend → Act → Share → Follow Up → Learn' },
      { label: 'Clinical Moat', value: 'Anticholinergic Cognitive Burden (ACB) Risk Engine' }
    ]
  },
  {
    id: 2,
    category: 'FOUNDATION',
    title: '2. Executive Summary',
    subtitle: 'Strategic Overview of Market Opportunity & Solution',
    badge: 'Executive Brief',
    content: 'The global population aged 65+ will double to 1.6 billion by 2050. Cognitive decline, medication-induced delirium (specifically from high Anticholinergic Cognitive Burden), social isolation, and emergency vulnerability during religious mass gatherings (e.g. 2.5M+ Hajj pilgrims) create an annual healthcare burden exceeding $1.3 Trillion. Existing solutions are fragmented into isolated panic buttons, unvalidated chatbot toys, or complex EHRs. WanisAI unifies voice-first companionship, continuous longitudinal cognitive baseline monitoring, clinically audited medication burden calculations, and instant emergency liaison into one multi-stakeholder ecosystem.',
    keyTakeaways: [
      'Unifies 5 functional layers: Cognitive Wellbeing, Medication Risk, Care Orchestrator, Family Circle, and Rufqa Companion.',
      'Designed to reduce preventable hospitalizations, ER visits from adverse drug interactions, and caregiver burnout.',
      'Supported by a scalable B2B2C business model spanning families, health plans, senior living operators, and pilgrimage ministries.'
    ],
    metricsOrData: [
      { label: 'Global TAM', value: '$18.4 Billion by 2028' },
      { label: 'Hospitalization Reduction', value: 'Est. 24% lower ER readmissions' },
      { label: 'Clinician Time Saved', value: '< 2-min review vs 15-min chart digging' }
    ]
  },
  {
    id: 3,
    category: 'FOUNDATION',
    title: '3. Problem Statement',
    subtitle: 'Critical Pain Points in Senior Cognitive Care & Caregiving',
    badge: 'Market Need',
    content: 'Senior care suffers from four catastrophic systemic failures: 1) Late Detection: Subtle cognitive shifts and sleep degradation go unnoticed for months until an acute crisis occurs; 2) Silent Medication Toxicity: Over 40% of seniors take high anticholinergic medications that induce preventable brain fog and 50% higher fall rates; 3) Caregiver Isolation & Blindspots: Families lack visibility into daily wellbeing without feeling intrusive; 4) Clinical Time Scarcity: Physicians have only 12 minutes per appointment and lack synthesized longitudinal home data.',
    keyTakeaways: [
      'Polypharmacy & high ACB score (≥3) are leading reversible causes of pseudo-dementia and falls.',
      'Seniors resist patronizing surveillance tools but embrace warm, companionable voice interactions.',
      'Pilgrims in holy cities face extreme disorientation risk with inadequate multilingual emergency liaisons.'
    ],
    metricsOrData: [
      { label: 'ACB Prevalence in 65+', value: '44.8% of older adults' },
      { label: 'Caregiver Burnout Rate', value: '62% report chronic fatigue' },
      { label: 'Avg Doctor Consultation', value: '11.8 minutes' }
    ]
  },
  {
    id: 4,
    category: 'FOUNDATION',
    title: '4. Target Personas',
    subtitle: 'User Archetypes Across the Care Ecosystem',
    badge: 'User Personas',
    content: 'WanisAI serves four tightly interconnected stakeholders: 1) "Hajjah Fatima" (76, Senior): Seeks dignity, gentle remembrance, voice-first Arabic/English interaction, and safety during Umrah/Hajj; 2) "Maryam" (48, Primary Caregiver Daughter): Busy working professional seeking peace of mind, daily health digests, and early warning alerts; 3) "Dr. Sarah" (Geriatrician/PCP): Needs an executive 2-minute Doctor Brief 2.0 with objective ACB calculations and verbatim patient statements; 4) "Ustadh Ahmad" (Tawafa Pilgrimage Guide): Requires instantaneous location beacons and medical cards for lost senior pilgrims in Mecca/Mina.',
    keyTakeaways: [
      'Senior UX prioritizes large touch targets (≥48px), warm voice synthesis, high contrast, and emotional dignity.',
      'Caregiver UX focuses on actionable peace of mind without alert fatigue.',
      'Clinician UX strictly adheres to 2-minute scanning limits with clinical provenance.'
    ]
  },
  {
    id: 5,
    category: 'CLINICAL_ARCHITECTURE',
    title: '5. Product Architecture (5 Layers)',
    subtitle: 'End-to-End System Design & Data Pipelines',
    badge: 'System Architecture',
    content: 'WanisAI is engineered as a robust 5-tier architecture: 1) Layer 1: Cognitive Wellbeing Engine (Longitudinal multi-signal processing of sleep, mood, fatigue, speech latency, and ADL functioning); 2) Layer 2: Medication Cognitive Risk Engine (Traceable ACB calculator based on Boustani / CRISTAL clinical scales); 3) Layer 3: Agentic Care Orchestrator (Autonomous 8-stage care loop with safety bounds & audit logs); 4) Layer 4: Human Connection & 4-Tier Consent Matrix (Configurable senior-controlled data sharing); 5) Layer 5: Rufqa Pilgrimage Companion (Multilingual emergency beacon, localized navigation, and Tawafa integration).',
    keyTakeaways: [
      'Layered modular architecture allows independent scaling of clinical, companion, and pilgrimage modules.',
      'Strict separation between raw sensory signals and encrypted consent-filtered outputs.',
      'Full API compatibility with HL7 FHIR and EHR portals.'
    ]
  },
  {
    id: 6,
    category: 'CLINICAL_ARCHITECTURE',
    title: '6. Core User Journeys',
    subtitle: 'Seamless Day-in-the-Life Interaction Flows',
    badge: 'User Flows',
    content: '1) Morning Senior Check-in: Senior presses one large button, speaks naturally in Arabic ("Peace be upon you, I slept poorly and feel foggy"), WanisAI analyzes sentiment and sleep fragmentation, updates baseline, offers warm spiritual/hydration reassurance, and alerts daughter Maryam. 2) Caregiver Loop: Maryam receives a gentle WhatsApp/app push with 3-bullet wellness summary. 3) Clinical Appointment: Maryam taps "Generate Doctor Brief 2.0", producing an executive SBAR summary highlighting the Amitriptyline + Chlorpheniramine ACB score of 4; Dr. Sarah reviews it in 90 seconds and switches to Cetirizine. 4) Lost Pilgrim in Mecca: Senior taps "I\'m Lost", Rufqa displays large emergency card in Arabic/English/Urdu with leader contact and transmits GPS coordinates.',
    keyTakeaways: [
      'Frictionless entry point via voice or one-tap touch.',
      'Automated translation of senior subjective feelings into objective clinical metrics.',
      'Closed-loop verification ensuring no action is left unresolved.'
    ]
  },
  {
    id: 7,
    category: 'CLINICAL_ARCHITECTURE',
    title: '7. Agentic Workflows & Continuous Care Loop',
    subtitle: 'The 8-Stage Dynamic Intelligence Engine',
    badge: 'Agentic Loop',
    content: 'WanisAI operates on a continuous, closed-loop state machine: OBSERVE (voice check-in, ambient vitals) → UNDERSTAND (NLP sentiment, fatigue, speech rate extraction) → ASSESS (longitudinal deviation vs personal baseline + ACB drug scoring) → RECOMMEND (proactive hydration, doctor consultation prompt) → ACT (draft Doctor Brief, prepare reminder) → SHARE (filtered through 4-tier consent matrix) → FOLLOW UP (scheduled re-check at 1:30 PM) → LEARN (calibrate personal baseline sensitivities).',
    keyTakeaways: [
      'Every autonomous action has predefined boundary constraints and a mandatory human override button.',
      'State transitions are logged into an immutable audit trail with confidence ratings.',
      'Zero diagnostic claims; strictly flags deviations requiring clinical attention.'
    ]
  },
  {
    id: 8,
    category: 'CLINICAL_ARCHITECTURE',
    title: '8. Clinical Safety Framework & Triage Matrix',
    subtitle: '4-Color Clinical Escalation Protocol',
    badge: 'Clinical Safety',
    content: '1) GREEN (Normal Monitoring): Baseline within standard variance; routine companion engagement and weekly summaries. 2) YELLOW (Meaningful Change): 2+ consecutive nights of fragmented sleep or subdued mood; initiates clarifying follow-up check-ins and caregiver digest. 3) ORANGE (Clinical Review Advised): Cumulative ACB ≥ 3, sudden memory lapse clustering, or dizziness; triggers Doctor Brief 2.0 draft and clinical appointment recommendation. 4) RED (Emergency Escalation): Acute distress, chest discomfort, fall detected, or acute disorientation; activates instant SMS/voice dispatch to primary emergency contacts and 997 Red Crescent / 911.',
    keyTakeaways: [
      'Probabilistic AI outputs are explicitly badged with data confidence ratings (e.g. 96.4%).',
      'Clinical disclaimers are permanently displayed on all medication and diagnostic summaries.',
      'Prevents emergency alert fatigue by using multi-signal corroboration before RED tier activation.'
    ]
  },
  {
    id: 9,
    category: 'CLINICAL_ARCHITECTURE',
    title: '9. Privacy, Security & 4-Tier Consent Architecture',
    subtitle: 'Zero-Trust Senior Data Governance & Encryption',
    badge: 'Security & Privacy',
    content: 'WanisAI implements a four-tier granular consent model: Tier 1 (PRIVATE - Encrypted on-device raw voice & personal reflections); Tier 2 (FAMILY SUPPORT - Wellness digests, sleep hours, check-in completion); Tier 3 (CLINICAL SHARING - Doctor Briefs, ACB scores, EHR integration); Tier 4 (EMERGENCY SHARING - Unrestricted broadcast of live GPS, medications, blood type to first responders upon RED trigger). Designed to comply with Saudi PDPL, HIPAA, and GDPR.',
    keyTakeaways: [
      'AES-256 encryption in transit and at rest with role-based cryptographic keys.',
      'Seniors can revoke any caregiver or clinician permission instantly via voice or settings.',
      'Strict data minimization: Raw audio is discarded or anonymized after feature vector extraction.'
    ]
  },
  {
    id: 10,
    category: 'BUSINESS_GTM',
    title: '10. Competitive Landscape',
    subtitle: 'Evaluation Against Direct & Indirect Competitors',
    badge: 'Market Matrix',
    content: 'Traditional senior solutions fall into three inadequate categories: 1) Hardware Medical Alert Buttons (Life Alert, Bay Alarm) — Reactive only, zero cognitive intelligence, high stigma; 2) General AI Companions (ElliQ, Replika) — Lack clinical depth, no ACB medication risk engine, no Doctor Briefs; 3) Clinical EHR Portals (Epic MyChart) — Inaccessible to seniors, no daily companion loop, zero pilgrimage safety. WanisAI is the only unified platform bridging companion warmth, clinical medication safety, and cultural pilgrimage protection.',
    keyTakeaways: [
      'Competitors either lack clinical depth or lack senior voice usability.',
      'First-mover advantage in culturally intelligent Arabic/Islamic pilgrimage healthcare ecosystems.',
      'High switching costs created by longitudinal baseline intelligence.'
    ]
  },
  {
    id: 11,
    category: 'BUSINESS_GTM',
    title: '11. Differentiation Strategy & Moat',
    subtitle: 'Our Four Pillars of Sustainable Competitive Advantage',
    badge: 'Strategic Moat',
    content: '1) Longitudinal Personal-Baseline Algorithm: Proprietary anomaly detection tailored to geriatric cognitive pacing; 2) Traceable ACB Medication Risk Engine: Validated against geriatric pharmacopeia with deprescribing prompt generation; 3) 2-Minute Doctor Brief 2.0: Proven clinical adoption through physician-friendly SBAR formats; 4) Cultural & Pilgrimage Intelligence (Rufqa): Exclusive positioning for 2.5M annual Hajj pilgrims and 15M Umrah visitors with Tawafa workflow integration.',
    keyTakeaways: [
      'Proprietary longitudinal data flywheel improves baseline sensitivity over time.',
      'Doctor Briefs build strong clinician referral loops and B2B clinical trust.',
      'Rufqa creates instant viral distribution via Hajj ministry and tour operator partnerships.'
    ]
  },
  {
    id: 12,
    category: 'BUSINESS_GTM',
    title: '12. Business Model & Unit Economics',
    subtitle: 'B2B2C Multi-Tiered Revenue Generation',
    badge: 'Revenue Model',
    content: '1) B2C / Family Subscription: $14.99/mo (or 49 SAR/mo) for Senior Companion + Family Caregiver Portal; 2) Rufqa Pilgrimage Season Pass: $29 (or 99 SAR) per Hajj/Umrah journey bundled with tour packages; 3) B2B Clinical & Senior Living SaaS: $45/patient/month for memory care facilities and geriatric clinics with EHR integration; 4) B2B Health Insurance / Medicare Advantage: $4.50 PMPM value-based contracts targeting 20% reduction in preventable fall and delirium admissions.',
    keyTakeaways: [
      'Blended Customer Acquisition Cost (CAC): $38 via B2B channels.',
      'Customer Lifetime Value (LTV): $480+ (32 months average senior care circle retention).',
      'LTV:CAC Ratio of 12.6x on institutional B2B deployments.'
    ]
  },
  {
    id: 13,
    category: 'BUSINESS_GTM',
    title: '13. Go-To-Market (GTM) Strategy',
    subtitle: 'Phased Market Penetration & Channel Expansion',
    badge: 'GTM Strategy',
    content: 'Phase 1 (KSA & GCC Launch): Partner with top Hajj/Umrah Tawafa companies and private geriatric clinics in Riyadh and Jeddah. Phase 2 (Family Circle Virality): Leverage family sharing invitations where 1 senior onboarding brings 2.4 caregiver accounts. Phase 3 (Health System Integration): Partner with specialized hospitals (KFSH&RC, National Guard Health Affairs) and regional insurance providers. Phase 4 (Global Scale): Expand into UK NHS geriatric pilots and US Medicare Advantage dual-eligible populations.',
    keyTakeaways: [
      'Trojan horse GTM via Rufqa pilgrimage safety creates immediate brand trust with 500k+ families annually.',
      'Physician-led viral loop: Clinicians receiving Doctor Briefs recommend WanisAI to other geriatric patients.',
      'Community ambassadorship programs with senior community centers and mosques.'
    ]
  },
  {
    id: 14,
    category: 'BUSINESS_GTM',
    title: '14. Partnership Strategy',
    subtitle: 'Strategic Alliances Across Healthcare, Telecom & Pilgrimage',
    badge: 'Partnerships',
    content: '1) Pilgrimage Operators & Ministry of Hajj: Direct API integration with Tawafa logistics and Nusuk app; 2) Telecom Operators (STC, Mobily, Zain): Pre-installed companion plans and subsidized senior SIM data packages; 3) Geriatric Hospital Networks: Clinical validation studies with King Faisal Specialist Hospital; 4) Pharmacy Chains (Nahdi, Al-Dawaa): In-pharmacy ACB score check kiosks and deprescribing alerts.',
    keyTakeaways: [
      'Reduces B2C acquisition friction via trusted institutional distribution.',
      'Enables rapid hardware-agnostic rollout across existing smartphones and smart tablets.'
    ]
  },
  {
    id: 15,
    category: 'ROADMAP_EXECUTION',
    title: '15. MVP Priorities & Current Release Status',
    subtitle: 'Core Deliverables Validated in v2.4 Platform',
    badge: 'MVP Scope',
    content: 'All 8 MVP core components are fully implemented in this production build: 1) Longitudinal Multi-Signal Cognitive Engine; 2) Anticholinergic Cognitive Burden (ACB 2.0) Risk Engine; 3) Doctor Brief 2.0 Executive Clinical Summary; 4) Agentic 8-Stage Care Loop Orchestrator; 5) Voice-First Senior Interface (Arabic, English, French); 6) Rufqa Hajj/Umrah Pilgrimage Safety Suite; 7) 4-Tier Consent Matrix; 8) Emergency Triage Escalation Protocol.',
    keyTakeaways: [
      'Zero mock stubs: Full-stack Express + Vite with server-side Gemini AI integration.',
      'Accessible, high-contrast, WCAG AA compliant interface with authentic cultural voice attunement.'
    ]
  },
  {
    id: 16,
    category: 'ROADMAP_EXECUTION',
    title: '16. 12-Month Product Roadmap',
    subtitle: 'Strategic Milestones from Q1 2026 to Q4 2026',
    badge: '12-Mo Roadmap',
    content: 'Q1 2026: Commercial pilot with 2,500 families in Riyadh/Jeddah; Rufqa deployment for Ramadan Umrah season. Q2 2026: Hajj 2026 full-scale rollout with 5 major Tawafa campaigns; FHIR/EHR bidirectional sync with major hospital networks. Q3 2026: Wearable sensor telemetry integration (Apple Watch / Galaxy Watch passive fall & sleep sync). Q4 2026: UK & North American pilot launch with NHS Geriatric Trust and US Medicare Advantage partner.',
    keyTakeaways: [
      'Milestone-driven execution targeting 50,000 active seniors by Year 1.',
      'Continuous clinical validation with peer-reviewed publication on ACB score reductions.'
    ]
  },
  {
    id: 17,
    category: 'ROADMAP_EXECUTION',
    title: '17. Key Performance Indicators (KPIs)',
    subtitle: 'Clinical, Engagement & Commercial Success Metrics',
    badge: 'Core KPIs',
    content: '1) Clinical KPIs: > 30% reduction in high-ACB medications over 6 months; 22% decrease in preventable emergency visits; 94% physician satisfaction with Doctor Briefs. 2) Engagement KPIs: > 82% weekly check-in completion rate; 3.2 family interactions per senior per week; < 1.2% false-positive emergency alerts. 3) Commercial KPIs: Monthly Recurring Revenue (MRR) growth > 18% MoM; B2C 90-day retention > 88%; Net Promoter Score (NPS) +74 among seniors.',
    keyTakeaways: [
      'Balanced scorecard combining clinical efficacy, user happiness, and financial health.',
      'Strict tracking of false-alarm rates to maintain physician and emergency responder trust.'
    ]
  },
  {
    id: 18,
    category: 'ROADMAP_EXECUTION',
    title: '18. Risk Register & Mitigation Strategy',
    subtitle: 'Proactive Management of Clinical, Technical & Legal Risks',
    badge: 'Risk Matrix',
    content: '1) Clinical Misinterpretation Risk: Mitigated by explicit probabilistic disclaimers, no diagnostic claims, and mandatory clinician confirmation before medication discussions. 2) False Alarm / Alert Fatigue: Mitigated by multi-factor sensor validation (e.g. sleep + speech latency + family confirmation before YELLOW escalation). 3) Connectivity Drop in Holy Sites: Mitigated by local offline emergency cards and SMS mesh beacon fallback in Rufqa. 4) Regulatory Classification Shift: Mitigated by designing as Clinical Decision Support (CDS) exempt from Class III SaMD.',
    keyTakeaways: [
      'Rigorous governance model with clinical board oversight.',
      'Automated kill switches and manual overrides at every stage of the agentic loop.'
    ]
  },
  {
    id: 19,
    category: 'ROADMAP_EXECUTION',
    title: '19. Regulatory Considerations (Saudi SFDA, HIPAA, EU AI Act)',
    subtitle: 'Compliance Blueprint Across Target Jurisdictions',
    badge: 'Regulatory',
    content: 'WanisAI is architected as an Non-Diagnostic Clinical Decision Support (CDS) and Wellness Platform. Under US FDA CDS guidance and Saudi SFDA Medical Software Guidelines, the software provides explainable recommendations where healthcare providers can independently review the basis (traceable ACB scales, verbatim quotes). Complies with Saudi PDPL (Personal Data Protection Law), HIPAA Security Rule (BAA agreements, audit logs), and EU AI Act Class IIa transparency mandates.',
    keyTakeaways: [
      'Explainable AI architecture: Never outputs black-box recommendations without clinical provenance.',
      'Data residency compliance: Saudi citizen data stored within in-kingdom sovereign cloud infrastructure.'
    ]
  },
  {
    id: 20,
    category: 'FOUNDATION',
    title: '20. Investor Pitch Narrative',
    subtitle: 'The 3-Act Investment Thesis',
    badge: 'Pitch Narrative',
    content: 'Act I (The Crisis): 1.6 billion aging humans face a silent epidemic of loneliness, cognitive decline, and preventable medication fog, while 2.5 million senior pilgrims face extreme vulnerability in holy cities. Act II (The Breakthrough): WanisAI provides a continuous, voice-first companion that monitors longitudinal health baselines, calculates medication risk in real-time, and equips doctors with 2-minute actionable briefs. Act III (The Moat & Scale): Backed by strong B2B2C economics, deep cultural moat, and an $18.4B TAM, WanisAI is defining the future of dignified aging and intelligent senior care.',
    keyTakeaways: [
      'Compelling mission with immense financial upside and global social impact.',
      'Experienced multidisciplinary team spanning geriatrics, AI, cybersecurity, and pilgrimage logistics.'
    ]
  },
  {
    id: 21,
    category: 'FOUNDATION',
    title: '21. 3-Minute Demo Storyline',
    subtitle: 'Live Product Walkthrough Script for Stakeholders',
    badge: 'Live Demo Script',
    content: 'Minute 1 (Senior Voice Check-in): Watch 76-year-old Hajjah Fatima speak naturally into WanisAI in Arabic. See the agent extract mood, sleep fragmentation, and mild memory delay with zero typing required. Minute 2 (The Intelligence Engine): Observe the Orchestrator detect an elevated ACB score of 4 due to a new nighttime allergy pill, updating the care loop from OBSERVE to ASSESS and generating a 2-minute Doctor Brief 2.0. Minute 3 (Care Coordination & Rufqa): Switch to the Caregiver Portal to view Maryam\'s peace-of-mind digest, then activate Rufqa\'s "I\'m Lost" mode in Mecca to demonstrate instant multilingual emergency beacon broadcast.',
    keyTakeaways: [
      'Demonstrates real-time multi-stakeholder continuity in 180 seconds.',
      'Highlights the human-centered philosophy: "WanisAI makes human care more informed, connected, and compassionate."'
    ]
  },
  {
    id: 22,
    category: 'FOUNDATION',
    title: '22. Future Expansion Opportunities',
    subtitle: 'Long-Term Horizon & Strategic Adjacencies',
    badge: 'Future Horizons',
    content: '1) Passive Ambient Biomarkers: Integrate ambient microphone room sensors for nocturnal cough, agitation, and speech rhythm analysis without requiring active check-ins; 2) Virtual Geriatric Telehealth Clinic: In-app 1-tap booking with board-certified geriatricians who receive the Doctor Brief 2.0 directly; 3) Smart Home & Fall Radar: Integration with millimeter-wave radar for privacy-preserving bathroom fall detection; 4) Global Pilgrimage Ecosystem: Expand Rufqa to Vatican pilgrimages, Kumano Kodo, and Hindu pilgrimage trails.',
    keyTakeaways: [
      'Expands from software app to comprehensive ambient smart-aging infrastructure.',
      'Unlocks lucrative telehealth and value-based care risk-sharing revenues.'
    ]
  }
];

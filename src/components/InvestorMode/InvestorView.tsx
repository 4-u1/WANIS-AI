import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  DollarSign, 
  Compass, 
  FileText, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  ChevronRight, 
  ExternalLink,
  Zap,
  Globe,
  Award,
  Play,
  Calculator,
  Eye,
  Radio,
  Pill,
  Thermometer,
  Truck,
  Users,
  ChevronLeft,
  Flame,
  Volume2,
  Building2,
  Brain,
  Lock,
  Sparkles
} from 'lucide-react';
import { INVESTOR_DELIVERABLES } from '../../data/investorDeliverables';
import { SupportedLanguage } from '../../types';
import { WaneesLogo } from '../WaneesLogo';

interface InvestorViewProps {
  language: SupportedLanguage;
}

export const InvestorView: React.FC<InvestorViewProps> = ({ language }) => {
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState<'pitch-deck' | 'deliverables' | 'unit-economics'>('pitch-deck');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Interactive Unit Economics Calculator State
  const [b2cSubscribers, setB2cSubscribers] = useState(15000);
  const [b2bClinicianSeats, setB2bClinicianSeats] = useState(450);
  const [hajjPilgrimLicenses, setHajjPilgrimLicenses] = useState(50000);

  // Economic formulas
  const b2cMonthlyRevenue = b2cSubscribers * 24; // $24/mo average
  const b2bMonthlyRevenue = b2bClinicianSeats * 180; // $180/provider/mo
  const pilgrimAnnualRevenue = hajjPilgrimLicenses * 15; // $15 one-time per pilgrim season
  const totalARR = (b2cMonthlyRevenue * 12) + (b2bMonthlyRevenue * 12) + pilgrimAnnualRevenue;
  const grossMarginPercent = 82.4;
  const estimatedGrossProfit = Math.round(totalARR * (grossMarginPercent / 100));

  // The 12 Canonical Pitch Deck Slides
  const SLIDES = [
    {
      id: 1,
      tag: 'Slide 01 — Executive Title',
      title: 'WANIS: The Intelligent Care Layer for Senior Cognitive Health',
      arTitle: 'ونيس: الطبقة الذكية لرعاية الصحة المعرفية لكبار السن',
      header: 'Operational Intelligence & Cognitive Care',
      attribution: 'هندسة الأوامر والاستخدام المسؤول للذكاء الاصطناعي — تحت إشراف ورعاية الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA) · Yazeed Hamad Al Harthi · Kingdom of Saudi Arabia',
      content: 'A comprehensive operational and clinical AI care layer designed to bridge the cognitive monitoring gap for elderly Saudi citizens, chronic disease patients, and 2M+ annual Hajj & Umrah pilgrims.',
      badges: ['AI Cognitive Care', 'Clinical Intelligence', 'Cultural Companion', 'SDAIA Supervised'],
      metrics: [
        { label: 'Author', value: 'Yazeed Hamad Al Harthi' },
        { label: 'Sponsorship', value: 'SDAIA AI Leadership' },
        { label: 'Scope', value: 'Kingdom of Saudi Arabia & Global Ummah' }
      ]
    },
    {
      id: 2,
      tag: 'Slide 02 — The Patient',
      title: 'Serving the Senior Saudi Patient — A Living, Complex Care Ecosystem',
      arTitle: 'خدمة المريض السعودي المسن — منظومة رعاية حية ومعقدة',
      header: 'The Patient Ecosystem',
      attribution: 'WANIS AI 02 — 12',
      content: 'An ageing population navigating chronic conditions, polypharmacy risks, cultural and spiritual obligations, and language barriers — requiring continuous, coordinated, intelligent care.',
      badges: ['Healthcare ⚕', 'Pilgrimage 🕌', 'Medications 💊', 'Cognition 🧠', 'Environment 🌡', 'Family Care 👨‍👩‍👧'],
      metrics: [
        { label: '30%', value: 'of Saudi seniors have polypharmacy risks' },
        { label: '2M+', value: 'pilgrims annually require medical oversight' },
        { label: 'ACB Burden', value: 'largely untracked in real-time until crisis' }
      ]
    },
    {
      id: 3,
      tag: 'Slide 03 — The Challenge',
      title: 'Managing Senior Cognitive Care Is an Operational Puzzle',
      arTitle: 'إدارة الرعاية المعرفية لكبار السن معضلة تشغيلية وسريرية',
      header: 'Four Core Operational & Clinical Failure Modes',
      attribution: 'WANIS AI 03 — 12',
      content: 'Traditional senior healthcare suffers from 4 disjointed gaps that fail to prevent compounding cognitive degradation and emergency hospitalizations.',
      items: [
        { title: '💊 Medication Complexity & ACB Risk', desc: 'Polypharmacy in elderly patients creates compounding anticholinergic cognitive burden rarely tracked proactively.' },
        { title: '🕐 Delayed Risk Detection', desc: 'Manual observation means care teams only discover cognitive or medication incidents after harm occurs.' },
        { title: '🕌 Hajj & Umrah Safety Gaps', desc: 'Pilgrimage environments introduce heat stress, crowd risk, and language barriers with no real-time telemetry.' },
        { title: '🌡 Heat Stress & Microclimate', desc: 'Rising temperatures at pilgrimage settings demand a system that senses conditions and responds automatically.' }
      ]
    },
    {
      id: 4,
      tag: 'Slide 04 — The Big Idea',
      title: 'Turning Complex Care into an Observable Digital Ecosystem',
      arTitle: 'تحويل بيئة الرعاية المعقدة إلى منظومة رقمية قابلة للملاحظة والاستجابة',
      header: 'Traditional Care vs. Intelligent Destination Ops',
      attribution: 'WANIS AI 04 — 12',
      content: 'WANIS-AI transforms fragmented, reactive healthcare into continuous telemetry, predictive AI alerts, and human-in-the-loop care orchestration.',
      comparisons: [
        { side: 'TRADITIONAL CARE', points: ['Manual patrols & paper charts', 'Reactive response after an incident occurs', 'Fragmented, siloed care systems', 'No unified view of the patient'] },
        { side: 'INTELLIGENT DESTINATION OPS', points: ['Continuous telemetry & AI reasoning', 'Predictive alerts before incidents form', 'One command layer, eight integrated care systems', 'Human approves — WANIS never acts alone'] }
      ]
    },
    {
      id: 5,
      tag: 'Slide 05 — WANIS At a Glance',
      title: 'One Platform, Five Intelligence Layers',
      arTitle: 'منصة واحدة بخمس طبقات استخبارية ورعاية متكاملة',
      header: 'From Field Telemetry to Field Response',
      attribution: 'WANIS AI 05 — 12',
      content: 'Field telemetry becomes grounded AI reasoning, validated by clinical rules, approved by a human caregiver, and expressed through the care dashboard and field response systems.',
      layers: [
        { num: '01', title: 'Data & Telemetry', desc: 'Synthetic voice sensors, CCTV grid & zone readings feed platform continuously.' },
        { num: '02', title: 'AI Reasoning', desc: 'Gemini 2.5 calls backend tools to analyze real patient state — never invents a number.' },
        { num: '03', title: 'Human-in-the-Loop', desc: 'Every recommendation is validated by clinical rules, then approved or modified by caregiver.' },
        { num: '04', title: 'Digital Twin', desc: 'Zones, routes, and ACB risk are rendered live on dynamic patient care model.' },
        { num: '05', title: 'Operational Systems', desc: 'Audio dispatch, fleet control, and evacuation routing carry the decision into the field.' }
      ]
    },
    {
      id: 6,
      tag: 'Slide 06 — AI Intelligence Core',
      title: 'Google Gemini 2.5 Pro & Flash — The Reasoning Layer',
      arTitle: 'جوجل جيميناي 2.5 — محرك الاستدلال والتفكير المعرفي',
      header: 'AI Recommends · Rules Validate · Humans Decide',
      attribution: 'WANIS AI 06 — 12',
      content: 'Reads live patient telemetry through 5 backend-controlled tools, proposes candidate care interventions, passes deterministic clinical rule validators, with guaranteed safe fallbacks.',
      workflow: [
        { step: '📡 Telemetry', detail: 'Real patient sensor readings & voice latency logs' },
        { step: '🧠 Gemini 2.5 Function Calling', detail: '5 declared tools, backend-executed without hallucinations' },
        { step: '🛡 Clinical Rule Validator', detail: 'Deterministic Python rules — not LLM generation' },
        { step: '👨‍⚕️ Caregiver Approval', detail: 'Approve · Reject · Modify before any action executes' }
      ]
    },
    {
      id: 7,
      tag: 'Slide 07 — Eight Systems, One Care Core',
      title: 'Eight Systems, One Unified Care Core',
      arTitle: 'ثمانية أنظمة ذكية في قلب قيادي موحد',
      header: 'One Destination, Multiple Intelligent Systems',
      attribution: 'WANIS AI 07 — 12',
      content: 'WANIS Core acts as the centralized nervous system coordinating 8 specialized modules across clinical intelligence, ambient monitoring, and crisis operations.',
      systems: [
        '1. ACB Intelligence Engine',
        '2. Doctor Brief 2.0',
        '3. VIP & Rufqa Companion',
        '4. Voice Dispatch',
        '5. Microclimate Sensor (WBGT)',
        '6. Emergency Evacuation Engine',
        '7. Smart Fleet Dispatch',
        '8. Executive Briefing Exporter'
      ]
    },
    {
      id: 8,
      tag: 'Slide 08 — Smart Clinical Safety',
      title: 'Detect → Understand → Decide → Respond',
      arTitle: 'الكشف → الفهم → القرار → الاستجابة الميدانية',
      header: 'End-to-End Operational Lifecycle',
      attribution: 'WANIS AI 08 — 12',
      content: 'AI CCTV and Drone Thermal Recon spot early signals; Gemini and the risk engine interpret them; clinical rule validation ranks safe options; Voice Dispatch and Emergency Evacuation carry the response.',
      flow: [
        { num: '01', icon: Eye, name: 'DETECT', desc: 'AI CCTV & Thermal Recon spot density and heat signatures early.' },
        { num: '02', icon: Brain, name: 'UNDERSTAND', desc: 'Risk engine and Gemini reasoning interpret what telemetry means.' },
        { num: '03', icon: ShieldCheck, name: 'DECIDE', desc: 'Clinical rule validation ranks safe, ready-to-approve interventions.' },
        { num: '04', icon: Zap, name: 'RESPOND', desc: 'Voice Dispatch & Emergency Evacuation guide seniors and crews.' }
      ]
    },
    {
      id: 9,
      tag: 'Slide 09 — Smart Environment & ACB',
      title: 'Reading the ACB Burden Before It Becomes a Risk',
      arTitle: 'قياس العبء الكوليني المعرفي (ACB) استباقياً قبل تشكل الخطر',
      header: 'Anticholinergic Cognitive Burden & Environmental Fusion',
      attribution: 'WANIS AI 09 — 12',
      content: 'Combines medication profiles into an ACB score, triggering a care review automatically once ACB enters the caution band (Score 14.2 High Risk, WBGT 37°C Ambient Heat).',
      gaugeStats: [
        { label: 'ACB SCORE', value: '14.2', status: 'HIGH RISK', color: 'text-rose-500' },
        { label: 'TEMPERATURE', value: '37°C', status: 'CAUTION', color: 'text-amber-500' },
        { label: 'MEDICATIONS', value: '9 ACTIVE', status: 'POLYPHARMACY', color: 'text-indigo-400' },
        { label: 'CARE RESPONSE', value: 'ALERT', status: 'PENDING REVIEW', color: 'text-emerald-400' }
      ]
    },
    {
      id: 10,
      tag: 'Slide 10 — The Command Center',
      title: 'What the Care Coordinator Sees — Live Al-Noor Operations',
      arTitle: 'ما يراه منسق الرعاية: غرفة عمليات النور الميدانية الحية',
      header: 'Live Multi-Patient Triage & Alert Command Layer',
      attribution: 'WANIS AI 10 — 12',
      content: 'Real-time triage dashboard monitoring 24 patients, 3 active alerts, 7 ACB predictions, and 100% network telemetry with prioritized interventions for Patients A through E.',
      commandStats: [
        { label: 'TOTAL PATIENTS', value: '24', sub: 'Active monitoring' },
        { label: 'ACTIVE ALERTS', value: '3', sub: '2 patients flagged' },
        { label: 'ACB PREDICTIONS', value: '7', sub: 'Open risk alerts' },
        { label: 'NETWORK TELEMETRY', value: '100%', sub: 'All zones reporting' }
      ]
    },
    {
      id: 11,
      tag: 'Slide 11 — From Data to Decision',
      title: 'Sense → Understand → Predict → Decide → Act → Monitor',
      arTitle: 'من البيانات إلى القرار: دورة الرعاية المغلقة ذات المراحل الست',
      header: 'The Continuous Six-Stage Closed Care Loop',
      attribution: 'WANIS AI 11 — 12',
      content: 'The same 6-stage loop runs behind every WANIS-AI capability — telemetry becomes a validated, human-approved care action, and the outcome feeds straight back into the next cycle.',
      loopStages: [
        { step: '01 SENSE', text: 'Zone telemetry & voice acoustics tick in continuously.' },
        { step: '02 UNDERSTAND', text: 'Risk scoring reads ACB, heat & behavioral trends.' },
        { step: '03 PREDICT', text: 'Prediction opens when a patient trends critical.' },
        { step: '04 DECIDE', text: 'Gemini proposes options; clinical rules validate.' },
        { step: '05 ACT', text: 'Caregiver approves, rejects or modifies in real time.' },
        { step: '06 MONITOR', text: 'Immutable audit trail records the full care outcome.' }
      ]
    },
    {
      id: 12,
      tag: 'Slide 12 — Vision & Identity',
      title: 'WANIS-AI: Intelligence for the Generation That Built Tomorrow',
      arTitle: 'ونيس: ذكاء اصطناعي للجيل الذي بنى الغد',
      header: 'A Sovereign Saudi Innovation for Global Senior Wellbeing',
      attribution: 'Yazeed Hamad Al Harthi · Under Supervision & Sponsorship of SDAIA (Saudi Data & AI Authority)',
      content: '"Intelligence for the generation that built tomorrow." Bridging compassionate cultural values with state-of-the-art agentic AI and clinical safety guarantees.',
      links: [
        { label: 'GitHub Repository', url: 'https://github.com/WanisAI/WanisPlatform' },
        { label: 'Live Platform URL', url: 'https://wanisai-senior-cognitive-intelligence-467968797278.europe-west2.run.app' },
        { label: 'SDAIA Supervised Architecture', url: 'https://sdaia.gov.sa' }
      ]
    }
  ];

  const currentSlide = SLIDES[currentSlideIndex];

  const categories = [
    { id: 'all', label: 'All 22 Deliverables' },
    { id: 'deck', label: '1. Executive & Market' },
    { id: 'clinical', label: '2. Clinical & AI Engine' },
    { id: 'commercial', label: '3. Unit Economics & Pricing' },
    { id: 'scale', label: '4. Rufqa & Global Scale' }
  ];

  const filteredDeliverables = INVESTOR_DELIVERABLES.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.content.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'deck') return matchesSearch && d.id <= 5;
    if (activeCategory === 'clinical') return matchesSearch && d.id >= 6 && d.id <= 10;
    if (activeCategory === 'commercial') return matchesSearch && d.id >= 11 && d.id <= 15;
    if (activeCategory === 'scale') return matchesSearch && d.id >= 16;
    return matchesSearch;
  });

  const currentDeliverable = INVESTOR_DELIVERABLES.find(d => d.id === selectedDeliverableId) || INVESTOR_DELIVERABLES[0];

  return (
    <div id="investor-hub-container" className="space-y-6 animate-fadeIn">
      
      {/* Executive Hero Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
              SDAIA Supervised & Sponsored
            </span>
            <span className="text-xs text-slate-400">Yazeed Hamad Al Harthi · Kingdom of Saudi Arabia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            WanisAI Strategic, Clinical & Pitch Deck Hub
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            100% Comprehensive Representation of the 12-Slide Pitch Deck, 8 Integrated Systems, and 22 Institutional Deliverables for Senior Cognitive Health & Hajj/Umrah Safety.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block font-semibold">Blended TAM</span>
            <span className="text-xl font-black text-emerald-400">$34.8B</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block font-semibold">Gross Margin</span>
            <span className="text-xl font-black text-teal-400">82.4%</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          id="btn-tab-pitch-deck"
          onClick={() => setActiveTab('pitch-deck')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pitch-deck'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{language === 'ar' ? 'عرض الشرائح الرسمي (12 Slides Deck)' : '1. Official 12-Slide Pitch Deck'}</span>
        </button>

        <button
          id="btn-tab-deliverables"
          onClick={() => setActiveTab('deliverables')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'deliverables'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'ar' ? 'المكتبة الاستراتيجية (22 Deliverables)' : '2. 22 Strategic Deliverables'}</span>
        </button>

        <button
          id="btn-tab-unit-economics"
          onClick={() => setActiveTab('unit-economics')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'unit-economics'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{language === 'ar' ? 'حاسبة اقتصاديات الوحدة والـ ARR' : '3. Unit Economics & ARR Model'}</span>
        </button>
      </div>

      {/* TAB 1: OFFICIAL 12-SLIDE PITCH DECK PRESENTATION VIEWER */}
      {activeTab === 'pitch-deck' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Slide Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Slide {currentSlide.id} of 12
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {currentSlide.tag}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentSlideIndex(prev => Math.min(SLIDES.length - 1, prev + 1))}
                disabled={currentSlideIndex === SLIDES.length - 1}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Slide Display Canvas */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Slide Header & Attribution */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">
                    {currentSlide.header}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {language === 'ar' && currentSlide.arTitle ? currentSlide.arTitle : currentSlide.title}
                </h2>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400 block">
                  {currentSlide.attribution}
                </span>
              </div>
            </div>

            {/* Slide Body Content */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-4xl">
              {currentSlide.content}
            </p>

            {/* Conditional Slide Feature Renderers */}
            {currentSlide.badges && (
              <div className="flex flex-wrap gap-2 pt-2">
                {currentSlide.badges.map((b, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-teal-300">
                    {b}
                  </span>
                ))}
              </div>
            )}

            {currentSlide.metrics && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {currentSlide.metrics.map((m, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <span className="text-xs text-slate-400 block font-semibold">{m.label}</span>
                    <span className="text-lg font-black text-white block mt-1">{m.value}</span>
                  </div>
                ))}
              </div>
            )}

            {currentSlide.items && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {currentSlide.items.map((it, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <h4 className="text-sm font-bold text-amber-300">{it.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{it.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {currentSlide.comparisons && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {currentSlide.comparisons.map((c, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-black text-teal-400 tracking-wider">{c.side}</h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {c.points.map((p, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-slate-500">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {currentSlide.layers && (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                {currentSlide.layers.map((l, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-xs font-mono font-bold text-teal-400">{l.num}</span>
                    <h4 className="text-xs font-bold text-white">{l.title}</h4>
                    <p className="text-[11px] text-slate-400">{l.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {currentSlide.workflow && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                {currentSlide.workflow.map((w, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <h4 className="text-xs font-bold text-emerald-400">{w.step}</h4>
                    <p className="text-xs text-slate-400">{w.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {currentSlide.systems && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {currentSlide.systems.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-indigo-300">
                    {s}
                  </div>
                ))}
              </div>
            )}

            {currentSlide.flow && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                {currentSlide.flow.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-teal-400 font-bold">{f.num}</span>
                        <Icon className="w-4 h-4 text-teal-400" />
                      </div>
                      <h4 className="text-xs font-bold text-white">{f.name}</h4>
                      <p className="text-[11px] text-slate-400">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {currentSlide.gaugeStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {currentSlide.gaugeStats.map((g, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">{g.label}</span>
                    <span className={`text-2xl font-black block font-mono ${g.color}`}>{g.value}</span>
                    <span className="text-[10px] font-bold text-slate-400 block">{g.status}</span>
                  </div>
                ))}
              </div>
            )}

            {currentSlide.commandStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {currentSlide.commandStats.map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">{c.label}</span>
                    <span className="text-2xl font-black text-teal-400 block font-mono">{c.value}</span>
                    <span className="text-[10px] text-slate-400 block">{c.sub}</span>
                  </div>
                ))}
              </div>
            )}

            {currentSlide.loopStages && (
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
                {currentSlide.loopStages.map((l, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-teal-400 block">{l.step}</span>
                    <p className="text-[10px] text-slate-400">{l.text}</p>
                  </div>
                ))}
              </div>
            )}

            {currentSlide.links && (
              <div className="flex flex-wrap gap-3 pt-4">
                {currentSlide.links.map((lk, i) => (
                  <a
                    key={i}
                    href={lk.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>{lk.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            )}

          </div>

          {/* Slide Thumbnail Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                  currentSlideIndex === idx
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-102'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-400'
                }`}
              >
                <div className="flex items-center justify-between w-full text-[10px] font-bold">
                  <span>Slide {slide.id}</span>
                  <span className={`w-2 h-2 rounded-full ${currentSlideIndex === idx ? 'bg-white' : 'bg-teal-500'}`} />
                </div>
                <span className="text-xs font-bold line-clamp-2 mt-1">
                  {slide.title}
                </span>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: 22 DELIVERABLES MASTER-DETAIL BROWSER */}
      {activeTab === 'deliverables' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Category Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeCategory === c.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search deliverables (e.g. ACB, TAM, Pricing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Master Detail Browser */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 4-Columns: Deliverables List */}
            <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {filteredDeliverables.map((item) => {
                const isSelected = item.id === selectedDeliverableId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDeliverableId(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${isSelected ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-teal-300'}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          #{item.id}
                        </span>
                        <h4 className="text-xs font-bold line-clamp-1">{item.title}</h4>
                      </div>
                      <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {item.subtitle}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right 8-Columns: Detailed Deliverable Viewer */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      Deliverable #{currentDeliverable.id} of 22
                    </span>
                    {currentDeliverable.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold border border-teal-500/20">
                        {currentDeliverable.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {currentDeliverable.title}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    const text = `${currentDeliverable.title}\n${currentDeliverable.subtitle}\n\n${currentDeliverable.content}\n\nKey Takeaways:\n${(currentDeliverable.keyTakeaways || []).map(t => '• ' + t).join('\n')}`;
                    navigator.clipboard.writeText(text);
                    alert('Deliverable text copied to clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors shrink-0 cursor-pointer"
                >
                  Copy Text
                </button>
              </div>

              {/* Subtitle Tagline */}
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs sm:text-sm font-medium text-teal-950 dark:text-teal-200">
                {currentDeliverable.subtitle}
              </div>

              {/* Core Content */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {currentDeliverable.content}
              </div>

              {/* Key Takeaways */}
              {currentDeliverable.keyTakeaways && currentDeliverable.keyTakeaways.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Key Strategic & Clinical Takeaways</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {currentDeliverable.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics Or Key Data */}
              {currentDeliverable.metricsOrData && currentDeliverable.metricsOrData.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {currentDeliverable.metricsOrData.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">{m.label}</span>
                      <span className="text-sm font-black text-teal-600 dark:text-teal-400 block pt-0.5">{m.value}</span>
                      {m.detail && <span className="text-[10px] text-slate-400 block pt-0.5">{m.detail}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Verification Badge */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Validated by SDAIA AI Ethics & Clinical Safety Standards</span>
                <span className="font-mono">Audit ID: WAI-2026-DELIV-{currentDeliverable.id}</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 3: UNIT ECONOMICS & ARR SIMULATOR */}
      {activeTab === 'unit-economics' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white border border-slate-700 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Interactive B2B2C Unit Economics & ARR Model</h3>
                  <p className="text-xs text-slate-400">Simulate revenue across D2C families, Health System provider seats, and Hajj/Umrah B2B packages.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Simulated ARR</span>
                  <span className="text-2xl font-black text-emerald-400">${(totalARR / 1000000).toFixed(2)}M</span>
                </div>
                <div className="border-l border-slate-700 pl-4">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Gross Profit</span>
                  <span className="text-2xl font-black text-teal-300">${(estimatedGrossProfit / 1000000).toFixed(2)}M</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              
              {/* Slider 1: B2C Family Subscribers */}
              <div className="space-y-2 p-5 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">B2C Active Families ($24/mo):</span>
                  <strong className="text-emerald-400 font-bold">{b2cSubscribers.toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={b2cSubscribers}
                  onChange={(e) => setB2cSubscribers(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block text-right">ARR: ${((b2cMonthlyRevenue * 12) / 1000000).toFixed(2)}M</span>
              </div>

              {/* Slider 2: B2B Clinician Seats */}
              <div className="space-y-2 p-5 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Provider Licenses ($180/seat):</span>
                  <strong className="text-teal-400 font-bold">{b2bClinicianSeats.toLocaleString()} seats</strong>
                </div>
                <input
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={b2bClinicianSeats}
                  onChange={(e) => setB2bClinicianSeats(parseInt(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block text-right">ARR: ${((b2bMonthlyRevenue * 12) / 1000000).toFixed(2)}M</span>
              </div>

              {/* Slider 3: Rufqa Pilgrimage Packages */}
              <div className="space-y-2 p-5 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Rufqa Pilgrim Passes ($15/ea):</span>
                  <strong className="text-amber-400 font-bold">{hajjPilgrimLicenses.toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={250000}
                  step={5000}
                  value={hajjPilgrimLicenses}
                  onChange={(e) => setHajjPilgrimLicenses(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block text-right">Annual: ${(pilgrimAnnualRevenue / 1000000).toFixed(2)}M</span>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

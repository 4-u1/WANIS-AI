import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Sliders, 
  Play, 
  Eye, 
  Brain, 
  ClipboardCheck, 
  Lightbulb, 
  Zap, 
  Share2, 
  RefreshCw, 
  GraduationCap,
  Layers,
  Lock,
  Radio,
  Thermometer,
  Pill,
  Users,
  Compass,
  FileText,
  Truck,
  Flame,
  Volume2,
  Activity,
  AlertTriangle,
  Send,
  Building2,
  Sparkles
} from 'lucide-react';
import { CareLoopEvent, CareLoopStage, SupportedLanguage } from '../../types';

interface OrchestratorViewProps {
  careLoopEvents: CareLoopEvent[];
  onTriggerSimulatedLoop: () => void;
  language: SupportedLanguage;
}

export const OrchestratorView: React.FC<OrchestratorViewProps> = ({
  careLoopEvents,
  onTriggerSimulatedLoop,
  language
}) => {
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState<'command-center' | 'systems-core' | 'loop-audit'>('command-center');
  const [selectedStage, setSelectedStage] = useState<CareLoopStage>('OBSERVE');

  // Command Center Live Patient Priority State (Matches Slide 10)
  const [patients, setPatients] = useState([
    {
      id: 'patient-a',
      name: 'Patient A — Room 4',
      arName: 'المريضة (أ) — غرفة 4',
      details: 'ACB 18 · poly-pharmacy review due',
      arDetails: 'عبء كوليني 18 · مراجعة تعدد الأدوية مطلوبة',
      severity: 'AMBER',
      bgBadge: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40',
      action: 'Medication Review'
    },
    {
      id: 'patient-b',
      name: 'Patient B — Room 7',
      arName: 'المريض (ب) — غرفة 7',
      details: 'Cognitive decline trend · mild risk',
      arDetails: 'مؤشر تراجع معرفي تدريجي · خطورة خفيفة',
      severity: 'GREEN',
      bgBadge: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
      action: 'Stable'
    },
    {
      id: 'patient-c',
      name: 'Patient C — Hajj Zone (Mina)',
      arName: 'المريض (ج) — منطقة المشاعر (منى)',
      details: 'Heat stress · WBGT 31°C · high risk',
      arDetails: 'إجهاد حراري · مؤشر WBGT 31°C · خطورة حرجة',
      severity: 'RED',
      bgBadge: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40 animate-pulse',
      action: 'Cooling Dispatch'
    },
    {
      id: 'patient-d',
      name: 'Patient D — Room 12',
      arName: 'المريضة (د) — غرفة 12',
      details: 'Doctor Brief pending · 3 flags open',
      arDetails: 'ملخص الطبيب بانتظار الاعتماد · 3 تنبيهات',
      severity: 'AMBER',
      bgBadge: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40',
      action: 'Approve Brief'
    },
    {
      id: 'patient-e',
      name: 'Patient E — Room 3',
      arName: 'المريض (هـ) — غرفة 3',
      details: 'Stable · all systems normal',
      arDetails: 'مستقر · جميع المؤشرات الحيوية طبيعية',
      severity: 'GREEN',
      bgBadge: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
      action: 'Routine Monitoring'
    }
  ]);

  // Slide 7: The 8 Core Systems
  const EIGHT_SYSTEMS = [
    {
      id: 'acb-engine',
      title: 'ACB Intelligence Engine',
      arTitle: 'محرك العبء الكوليني المعرفي',
      icon: Pill,
      badge: 'Clinical Core',
      desc: 'Real-time scoring of anticholinergic burden across polypharmacy profiles, automatically triggering deprescribing reviews.',
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
    },
    {
      id: 'doctor-brief',
      title: 'Doctor Brief 2.0',
      arTitle: 'ملخص الطبيب الذكي 2.0',
      icon: FileText,
      badge: 'Clinical Briefing',
      desc: 'Automated 1-page clinical synthesis transforming 30-day compliance, longitudinal sleep, and cognitive patterns for clinicians.',
      color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800'
    },
    {
      id: 'rufqa-companion',
      title: 'VIP & Rufqa Companion',
      arTitle: 'رفقة: مرافق الحج والمعتمر الذكي',
      icon: Compass,
      badge: 'Pilgrimage Ops',
      desc: 'Context-aware pilgrimage guidance with Tawaf counters, crowd proximity warnings, heat alerts, and spiritual companionship.',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
    },
    {
      id: 'voice-dispatch',
      title: 'Voice Dispatch',
      arTitle: 'نظام التوجيه الصوتي الميداني',
      icon: Volume2,
      badge: 'Audio Ops',
      desc: 'Empathetic Saudi-dialect voice prompts and broadcast audio dispatch providing immediate guidance during disorientation.',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
    },
    {
      id: 'wbgt-sensor',
      title: 'Microclimate Sensor (WBGT)',
      arTitle: 'مستشعر المناخ الدقيق (WBGT)',
      icon: Thermometer,
      badge: 'Environmental IoT',
      desc: 'Continuous Wet-Bulb Globe Temperature & ambient heat monitoring preventing senior heat stress before physiological onset.',
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
    },
    {
      id: 'evacuation-engine',
      title: 'Emergency Evacuation Engine',
      arTitle: 'محرك الإخلاء والاستجابة الطارئة',
      icon: AlertTriangle,
      badge: 'Crisis Engine',
      desc: 'Dynamic crowd egress routing and automated dispatch links with 997 Red Crescent / 911 emergency services.',
      color: 'text-red-500 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800'
    },
    {
      id: 'fleet-dispatch',
      title: 'Smart Fleet Dispatch',
      arTitle: 'التوجيه الذكي للمركبات والفرق',
      icon: Truck,
      badge: 'Logistics',
      desc: 'Intelligent routing of medical golf carts, caregiver patrols, and paramedic teams to geo-located senior positions.',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
    },
    {
      id: 'executive-exporter',
      title: 'Executive Briefing Exporter',
      arTitle: 'مصدّر التقارير التنفيذية والمؤسسية',
      icon: Building2,
      badge: 'Governance',
      desc: 'Standardized institutional data exports compliant with SDAIA AI ethics guidelines and Ministry of Health protocols.',
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800'
    }
  ];

  const STAGES: Array<{ id: CareLoopStage; icon: any; label: string; desc: string }> = [
    { id: 'OBSERVE', icon: Eye, label: '1. Sense / Observe', desc: 'Continuous multi-modal intake (voice acoustics, vocabulary latency, telemetry, WBGT sensor).' },
    { id: 'UNDERSTAND', icon: Brain, label: '2. Understand', desc: 'Contextual semantic & dialect comprehension (Gulf/Hejazi/Najdi), sentiment and confusion parsing.' },
    { id: 'ASSESS', icon: ClipboardCheck, label: '3. Predict & Assess', desc: 'Deterministic clinical risk scoring (ACB 2.0 calculator, delirium risk metrics, 4-tier triage).' },
    { id: 'RECOMMEND', icon: Lightbulb, label: '4. Decide & Recommend', desc: 'Action synthesis: Gemini proposes 2-3 safe interventions validated by deterministic rules.' },
    { id: 'ACT', icon: Zap, label: '5. Act / Dispatch', desc: 'Human-approved care intervention: voice guidance delivery, cooling dispatch, or emergency escalation.' },
    { id: 'SHARE', icon: Share2, label: '6. Monitor & Audit', desc: 'Consent-governed dissemination to family circle digest, Doctor Brief 2.0, and immutable audit trail.' },
    { id: 'FOLLOW_UP', icon: RefreshCw, label: '7. Follow Up', desc: 'Automated morning-after check, symptom resolution verification, and medication tolerance tracking.' },
    { id: 'LEARN', icon: GraduationCap, label: '8. Learn & Adapt', desc: 'Longitudinal baseline adaptation and personalization refinement without diagnostic overreach.' }
  ];

  return (
    <div id="orchestrator-console-container" className="space-y-6 animate-fadeIn">
      
      {/* Executive Command Center Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/40 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              WANIS Care Ops Live · Al-Noor Command Center
            </span>
            <span className="text-xs text-slate-400">SDAIA Supervised</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'ar' ? 'مركز القيادة الذكي والتنسيق السريري الميداني' : 'Operational Intelligence & Care Coordinator Command Center'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {language === 'ar'
              ? 'الطبقة الذكية المتكاملة لرعاية كبار السن: الذكاء الاصطناعي يقترح · القواعد السريرية تدقق · الكادر البشري يعتمد.'
              : 'The Intelligent Care Layer for Senior Cognitive Health: AI Recommends · Rules Validate · Humans Decide.'}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            id="simulate-care-loop-btn"
            onClick={onTriggerSimulatedLoop}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>{language === 'ar' ? 'محاكاة دورة الرعاية الكاملة' : 'Simulate Care Cycle'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          id="btn-tab-command-center"
          onClick={() => setActiveTab('command-center')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'command-center'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{language === 'ar' ? 'غرفة العمليات الحية (Command Center)' : '1. Live Command Center'}</span>
        </button>

        <button
          id="btn-tab-systems-core"
          onClick={() => setActiveTab('systems-core')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'systems-core'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{language === 'ar' ? 'الأنظمة الثمانية المتكاملة (8 Systems)' : '2. Eight Systems Core'}</span>
        </button>

        <button
          id="btn-tab-loop-audit"
          onClick={() => setActiveTab('loop-audit')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'loop-audit'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'ar' ? 'سجل العمليات والتدقيق (Loop & Audit)' : '3. 8-Stage State Machine & Audit'}</span>
        </button>
      </div>

      {/* TAB 1: WHAT THE CARE COORDINATOR SEES (SLIDE 10 LIVE COMMAND CENTER) */}
      {activeTab === 'command-center' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top 4 KPI Metrics Bar (Slide 10) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* KPI 1: Total Patients */}
            <div id="kpi-total-patients" className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>{language === 'ar' ? 'إجمالي المرضى' : 'TOTAL PATIENTS'}</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                24
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {language === 'ar' ? 'مراقبة حية نشطة مستمرة' : 'Active monitoring across all rooms & zones'}
              </p>
            </div>

            {/* KPI 2: Active Alerts */}
            <div id="kpi-active-alerts" className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>{language === 'ar' ? 'التنبيهات النشطة' : 'ACTIVE ALERTS'}</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
                3
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'حالتان تتطلبان مراجعة فورية' : '2 patients currently flagged for action'}
              </p>
            </div>

            {/* KPI 3: ACB Predictions */}
            <div id="kpi-acb-predictions" className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>{language === 'ar' ? 'توقعات العبء الكوليني' : 'ACB PREDICTIONS'}</span>
                <Pill className="w-4 h-4 text-teal-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 font-mono">
                7
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'تنبيهات استباقية قبل تفاقم العبء' : 'Open risk alerts flagged by ACB engine'}
              </p>
            </div>

            {/* KPI 4: Network Telemetry */}
            <div id="kpi-network-telemetry" className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>{language === 'ar' ? 'جاهزية المستشعرات' : 'NETWORK TELEMETRY'}</span>
                <Radio className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                100%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'جميع المناطق والمستشعرات متصلة' : 'All zones & WBGT microclimate reporting'}
              </p>
            </div>

          </div>

          {/* Slide 10: Patient Care Priority & Live Alert & Care Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column: Patient Care Priority */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? 'أولوية رعاية المرضى (Patient Care Priority)' : 'Patient Care Priority Matrix'}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-semibold">Al-Noor Unit</span>
              </div>

              <div className="space-y-3">
                {patients.map((p) => (
                  <div 
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-indigo-400/50 transition-all"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {language === 'ar' ? p.arName : p.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {language === 'ar' ? p.arDetails : p.details}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider border ${p.bgBadge}`}>
                      {p.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Live Alert & Care Panel */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? 'لوحة التنبيهات وإجراءات الرعاية الفورية' : 'Live Alert & Care Action Panel'}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Ready to Dispatch
                </span>
              </div>

              <div className="space-y-3 text-xs">
                
                {/* Alert 1: Patient C Heat Stress */}
                <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-2">
                  <div className="flex items-center justify-between font-bold text-rose-900 dark:text-rose-200">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-600" />
                      Patient C — Heat stress critical (Mina Zone)
                    </span>
                    <span className="text-[10px] font-mono text-rose-600 font-bold">WBGT 31°C</span>
                  </div>
                  <p className="text-[11px] text-rose-800 dark:text-rose-300">
                    Thermal sensors triggered caution band. Immediate cooling response & hydration dispatch recommended.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700">
                      Approve Cooling Golf Cart
                    </button>
                    <button className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                      Send Rufqa Voice Alert
                    </button>
                  </div>
                </div>

                {/* Alert 2: Patient A ACB Score Elevated */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-2">
                  <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                    <span className="flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-amber-600" />
                      Patient A — ACB score elevated (Score 18)
                    </span>
                    <span className="text-[10px] font-mono text-amber-600 font-bold">High Risk</span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    Cumulative score from amitriptyline + oxybutynin combination. Deprescribing consultation draft prepared.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700">
                      Forward to Clinician
                    </button>
                  </div>
                </div>

                {/* Alert 3: Rufqa Companion Hajj Mode Active */}
                <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/60 space-y-2">
                  <div className="flex items-center justify-between font-bold text-teal-900 dark:text-teal-200">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-teal-600" />
                      Rufqa Companion — Hajj Mode Armed
                    </span>
                    <span className="text-[10px] font-mono text-teal-600 font-bold">Patient C Active</span>
                  </div>
                  <p className="text-[11px] text-teal-800 dark:text-teal-300">
                    Pilgrimage monitoring armed with safe zone perimeter and Tawaf lap tracker.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Slide 8 & 9: Detect -> Understand -> Decide -> Respond & ACB Gauge */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
                  Smart Clinical Safety Architecture (Slide 8 & 9)
                </span>
                <h3 className="text-xl font-extrabold mt-1">
                  Detect → Understand → Decide → Respond
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                  AI Recommends · Rules Validate · Humans Decide
                </span>
              </div>
            </div>

            {/* 4-Step Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400 font-bold">01. DETECT</span>
                  <Eye className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Multi-Modal Telemetry</h4>
                <p className="text-xs text-slate-400">
                  Voice acoustics, CCTV grid, WBGT microclimate, and medication logs feed the platform continuously.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-teal-400 font-bold">02. UNDERSTAND</span>
                  <Brain className="w-4 h-4 text-teal-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Risk Engine & Gemini</h4>
                <p className="text-xs text-slate-400">
                  Gemini 2.5 Pro & Flash interpret real patient context and calculate compounding ACB burden.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold">03. DECIDE</span>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Clinical Hard-Rule Gate</h4>
                <p className="text-xs text-slate-400">
                  Deterministic Python clinical rule validator screens proposals before surfacing to caregiver.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold">04. RESPOND</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Field Response & Dispatch</h4>
                <p className="text-xs text-slate-400">
                  Voice Dispatch, Smart Fleet, and Emergency Evacuation carry the approved decision to the patient.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: EIGHT SYSTEMS CORE (SLIDE 7) */}
      {activeTab === 'systems-core' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                  {language === 'ar' ? 'الأنظمة الثمانية المتكاملة في منصة ونيس (Eight Systems, One Care Core)' : 'Eight Systems, One Care Core'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Slide 07 Canonical Architecture: Unified operational layers under a single deterministic command core.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20">
                WANIS Core Orchestration
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {EIGHT_SYSTEMS.map((sys) => {
                const Icon = sys.icon;
                return (
                  <div
                    key={sys.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-indigo-400 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl border ${sys.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {sys.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {language === 'ar' ? sys.arTitle : sys.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {sys.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      <span>Live Operational</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 8-STAGE STATE MACHINE & AUDIT STREAM */}
      {activeTab === 'loop-audit' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* 8-Stage Interactive Process Pipeline Ribbon */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Autonomous Care State Machine Pipeline (Sense → Understand → Predict → Decide → Act → Monitor)
              </h3>
              <span className="text-xs text-slate-400 font-semibold">Click a stage to inspect telemetry</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {STAGES.map((stage) => {
                const Icon = stage.icon;
                const isSelected = selectedStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 ${
                      isSelected 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102' 
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                    <div>
                      <span className="text-xs font-bold block">{stage.label}</span>
                      <span className={`text-[10px] line-clamp-2 mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {stage.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Event Stream & Stage Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2-Columns: Live Orchestration Event Stream */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Live Immutable Audit Log & State Transitions
                </h3>
                <span className="text-xs font-mono text-slate-400">{careLoopEvents.length} Events Logged</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {careLoopEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-[10px]">
                          {evt.stage}
                        </span>
                        <strong className="text-xs font-bold text-slate-900 dark:text-white">{evt.title}</strong>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {evt.description}
                    </p>

                    {evt.confidenceScore && (
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span>Deterministic Model Confidence: <strong>{Math.round(evt.confidenceScore * 100)}%</strong></span>
                        {evt.requiresHumanReview && (
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Flagged for Clinician/Family review
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Deterministic Guardrails & Safety Controls */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Active Safety Invariants */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-teal-600" />
                  Deterministic Safety Invariants
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300 space-y-1">
                    <span className="font-bold block">1. Non-Diagnostic Guarantee</span>
                    <p className="text-emerald-800/90 dark:text-emerald-400 text-[11px]">
                      Agent outputs are strictly supportive, observational, and framed for clinician discussion. No autonomous disease diagnosis.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 text-teal-900 dark:text-teal-300 space-y-1">
                    <span className="font-bold block">2. ACB 2.0 Hard Gate</span>
                    <p className="text-teal-800/90 dark:text-teal-400 text-[11px]">
                      Cumulative score ≥ 3 automatically triggers a Doctor Brief recommendation and alerts caregiver circle.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-300 space-y-1">
                    <span className="font-bold block">3. Red Triage Emergency Escalation</span>
                    <p className="text-indigo-800/90 dark:text-indigo-400 text-[11px]">
                      Severe confusion or chest pain immediately opens 997 Red Crescent / 911 dispatch overlay and notifies emergency contact.
                    </p>
                  </div>
                </div>
              </div>

              {/* Model Specification Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs text-slate-500">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">AI Backend Architecture</span>
                <p>Model: <strong>Gemini 2.5 Flash & Pro</strong> via Google GenAI SDK (Server-Side)</p>
                <p>Acoustic Latency: <strong>&lt; 350ms</strong></p>
                <p>Consent Enforcement: <strong>4-Tier Granular Access Matrix</strong></p>
                <p>Supervision: <strong>SDAIA AI Ethics Compliant</strong></p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

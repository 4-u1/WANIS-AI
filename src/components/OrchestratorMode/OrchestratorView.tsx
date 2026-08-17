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
  Lock
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
  const [selectedStage, setSelectedStage] = useState<CareLoopStage>('OBSERVE');

  const STAGES: Array<{ id: CareLoopStage; icon: any; label: string; desc: string }> = [
    { id: 'OBSERVE', icon: Eye, label: '1. Observe', desc: 'Continuous multi-modal intake (voice acoustics, vocabulary latency, medication confirmations).' },
    { id: 'UNDERSTAND', icon: Brain, label: '2. Understand', desc: 'Contextual semantic & sentiment parsing, dialect comprehension (Gulf/Hejazi/Levantine/Egyptian).' },
    { id: 'ASSESS', icon: ClipboardCheck, label: '3. Assess', desc: 'Deterministic clinical risk scoring (ACB 2.0 calculator, delirium risk metrics, 4-tier triage).' },
    { id: 'RECOMMEND', icon: Lightbulb, label: '4. Recommend', desc: 'Action synthesis: Deprescribing discussion prompts, caregiver peace-of-mind alerts, bedtime routine cues.' },
    { id: 'ACT', icon: Zap, label: '5. Act', desc: 'Empathetic voice guidance delivery, medication adherence confirmation, emergency escalation dispatch.' },
    { id: 'SHARE', icon: Share2, label: '6. Share', desc: 'Consent-governed dissemination to family circle digest & Doctor Brief 2.0 export.' },
    { id: 'FOLLOW_UP', icon: RefreshCw, label: '7. Follow Up', desc: 'Automated morning-after check, symptom resolution verification, medication tolerance check.' },
    { id: 'LEARN', icon: GraduationCap, label: '8. Learn', desc: 'Longitudinal baseline adaptation, personalization refinement without diagnostic overreach.' }
  ];

  return (
    <div id="orchestrator-console-container" className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold">
                Agentic Care Orchestrator & State Machine
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                8-Stage Closed Loop
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Autonomous cognitive care lifecycle with deterministic safety boundaries and human oversight.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="simulate-care-loop-btn"
            onClick={onTriggerSimulatedLoop}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95"
          >
            <Play className="w-4 h-4" />
            <span>Simulate Full 8-Stage Cycle</span>
          </button>
        </div>
      </div>

      {/* 8-Stage Interactive Process Pipeline Ribbon */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Autonomous Care State Machine Pipeline
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
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
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
            <p>Model: <strong>Gemini 2.5 Flash</strong> via Google GenAI SDK (Server-Side)</p>
            <p>Acoustic Latency: <strong>&lt; 350ms</strong></p>
            <p>Consent Enforcement: <strong>4-Tier Granular Access Matrix</strong></p>
          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Stethoscope, 
  FileText, 
  Pill, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Printer, 
  ArrowRight,
  TrendingDown,
  Info,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  SeniorProfile, 
  Medication, 
  DoctorBriefData, 
  LongitudinalMetrics, 
  SupportedLanguage 
} from '../../types';
import { DICTIONARY } from '../../data/i18n';
import { DoctorBriefModal } from './DoctorBriefModal';

interface ClinicianViewProps {
  senior: SeniorProfile;
  medications: Medication[];
  doctorBrief: DoctorBriefData;
  longitudinalData: LongitudinalMetrics[];
  onUpdateMedications: (meds: Medication[]) => void;
  language: SupportedLanguage;
  totalAcbScore: number;
}

export const ClinicianView: React.FC<ClinicianViewProps> = ({
  senior,
  medications,
  doctorBrief,
  longitudinalData,
  onUpdateMedications,
  language,
  totalAcbScore
}) => {
  const t = DICTIONARY[language];
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [activeClinicianTab, setActiveClinicianTab] = useState<'brief' | 'acb' | 'soap'>('brief');

  // Interactive Drug Simulation
  const [simulatedDrugName, setSimulatedDrugName] = useState('');
  const [simulatedScore, setSimulatedScore] = useState<0 | 1 | 2 | 3>(0);

  const handleAddSimulatedMed = () => {
    if (!simulatedDrugName.trim()) return;
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: simulatedDrugName.trim(),
      genericName: simulatedDrugName.trim(),
      dosage: 'Standard dose',
      frequency: 'Once daily',
      acbScore: simulatedScore,
      drugClass: 'Trial Simulation Drug',
      indication: 'Investigational Addition',
      clinicalExplanation: simulatedScore > 0 ? `Adds ${simulatedScore} point(s) to central anticholinergic burden.` : 'Zero anticholinergic burden.',
      saferAlternatives: [],
      isTakenToday: true
    };
    onUpdateMedications([...medications, newMed]);
    setSimulatedDrugName('');
    setSimulatedScore(0);
  };

  const handleRemoveMed = (id: string) => {
    onUpdateMedications(medications.filter(m => m.id !== id));
  };

  return (
    <div id="clinician-portal-container" className="space-y-6 animate-fadeIn">
      
      {/* Top Clinician Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Clinical Intelligence & Doctor Brief 2.0
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Geriatric CDS Mode
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Patient: <strong>{senior.fullName}</strong> (Age {senior.age}) • Primary Physician: {senior.primaryPhysician.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="open-full-doctor-brief-btn"
            onClick={() => setIsBriefModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center gap-2 transition-transform active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Launch Full Doctor Brief 2.0</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-lg">
        <button
          onClick={() => setActiveClinicianTab('brief')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeClinicianTab === 'brief' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
        >
          2-Min Clinical Summary
        </button>
        <button
          onClick={() => setActiveClinicianTab('acb')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeClinicianTab === 'acb' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
        >
          ACB 2.0 Risk Engine ({totalAcbScore})
        </button>
        <button
          onClick={() => setActiveClinicianTab('soap')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeClinicianTab === 'soap' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
        >
          SOAP & EHR Export
        </button>
      </div>

      {/* TAB 1: 2-MINUTE CLINICAL SUMMARY */}
      {activeClinicianTab === 'brief' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Executive Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  SBAR Clinical Impression (Last 14 Days)
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Generated {doctorBrief.generatedDate}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                {doctorBrief.summaryExecutive}
              </div>

              {/* Actionable Prompts for Doctor Visit */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recommended Clinician Discussion Points
                </span>
                <div className="space-y-2">
                  {doctorBrief.clinicianDiscussionPrompts.map((prompt, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Verbatim Patient Quotes Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Patient Subjective Statements (Verbatim)
              </h3>
              <div className="space-y-2">
                {doctorBrief.patientVerbatimQuotes.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs italic text-slate-700 dark:text-slate-300">
                    {q}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Quick ACB Gauge & Safety Flags */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* ACB Gauge Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Cumulative ACB Score
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${totalAcbScore >= 3 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300' : 'bg-emerald-100 text-emerald-800'}`}>
                  Score: {totalAcbScore}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                  {totalAcbScore >= 3 ? 'HIGH COGNITIVE BURDEN (Score ≥ 3)' : 'MODERATE BURDEN'}
                </span>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  Clinically associated with 50% higher delirium risk and increased fall incidence. Muscarinic M1/M3 blockade reduces acetylcholine neurotransmission.
                </p>
              </div>

              <button
                onClick={() => setActiveClinicianTab('acb')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold transition-colors"
              >
                Inspect Drug-by-Drug Breakdown →
              </button>
            </div>

            {/* Safety Flags */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Critical Safety Flags
              </h3>
              <ul className="space-y-2 text-xs">
                {doctorBrief.safetyFlags.map((flag, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-300">
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: FULL ACB 2.0 RISK ENGINE & DEPRESCRIBING SIMULATOR */}
      {activeClinicianTab === 'acb' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Anticholinergic Cognitive Burden (ACB) Scale & Drug Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Validated against Boustani et al. & CRISTAL pharmacopeia. Cumulative score ≥ 3 requires clinical deprescribing evaluation.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300">
                <span className="text-xs font-bold">Total Patient Burden:</span>
                <span className="text-lg font-black">{totalAcbScore}</span>
              </div>
            </div>

            {/* Current Medications Table */}
            <div className="space-y-3">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className={`p-4 rounded-2xl border transition-all ${med.acbScore >= 3 ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900' : med.acbScore > 0 ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{med.name} ({med.dosage})</h4>
                        <span className="text-xs text-slate-500">{med.drugClass}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{med.clinicalExplanation}</p>

                      {med.saferAlternatives.length > 0 && (
                        <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase text-teal-700 dark:text-teal-400">Safer Alternatives:</span>
                          {med.saferAlternatives.map((alt, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-semibold border border-teal-200 dark:border-teal-800">
                              {alt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black ${med.acbScore >= 3 ? 'bg-rose-500 text-white' : med.acbScore > 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                        ACB +{med.acbScore}
                      </span>
                      <button
                        onClick={() => handleRemoveMed(med.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove from trial list"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trial Simulator Form */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-teal-600" />
                Simulate Adding / Testing a Medication
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g. Hydroxyzine, Oxybutynin, Cetirizine..."
                  value={simulatedDrugName}
                  onChange={(e) => setSimulatedDrugName(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <select
                  value={simulatedScore}
                  onChange={(e) => setSimulatedScore(parseInt(e.target.value) as any)}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                >
                  <option value={0}>Score 0 (No Anticholinergic Effect)</option>
                  <option value={1}>Score 1 (Mild ACB Effect)</option>
                  <option value={2}>Score 2 (Moderate ACB Effect)</option>
                  <option value={3}>Score 3 (Severe Central ACB Effect)</option>
                </select>
                <button
                  onClick={handleAddSimulatedMed}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shrink-0"
                >
                  Add to Simulation
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: SOAP NOTE & EHR EXPORT */}
      {activeClinicianTab === 'soap' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Generated Geriatric SOAP Note (EHR Ready)
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`SUBJECTIVE: 76yo female reports fragmented sleep (4.5h) and morning dizziness...\nOBJECTIVE: Baseline delta -18%, Cumulative ACB=4...\nASSESSMENT: High anticholinergic burden exacerbating cognitive latency...\nPLAN: Taper Amitriptyline, trial Cetirizine ACB=0...`);
                alert('SOAP Note copied to clipboard for EHR insertion!');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold"
            >
              Copy SOAP Note
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-3 leading-relaxed">
            <div>
              <strong className="text-teal-600 block">S (SUBJECTIVE):</strong>
              76 y/o female patient reports 4-day history of interrupted sleep (avg 4.5h/night) with post-awakening brain fog and transient orthostatic dizziness when rising from prayer mat. Notes misplacing prayer beads on 2 occasions.
            </div>
            <div>
              <strong className="text-teal-600 block">O (OBJECTIVE):</strong>
              WanisAI 14-day continuous loop data: Sleep quality index declined 22%. Mood variance -14%. Cumulative Anticholinergic Cognitive Burden score = 4 (Amitriptyline 25mg nightly [Score 3] + Chlorpheniramine 4mg PRN [Score 1]).
            </div>
            <div>
              <strong className="text-teal-600 block">A (ASSESSMENT):</strong>
              Medication-induced cognitive burden and orthostatic vulnerability secondary to high anticholinergic polypharmacy. Mild baseline memory latency exacerbated by muscarinic antagonism.
            </div>
            <div>
              <strong className="text-teal-600 block">P (PLAN):</strong>
              1) Deprescribe/substitute Amitriptyline with low-dose non-anticholinergic sleep hygiene. 2) Discontinue Chlorpheniramine in favor of Cetirizine (ACB=0). 3) Orthostatic vitals check. 4) Follow-up in 14 days via WanisAI Doctor Brief 2.0.
            </div>
          </div>
        </div>
      )}

      {/* Modal View */}
      <DoctorBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        brief={doctorBrief}
        language={language}
      />

    </div>
  );
};

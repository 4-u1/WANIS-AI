import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Users, 
  Stethoscope, 
  ShieldAlert, 
  X, 
  Check, 
  Download, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { ConsentMatrix, SupportedLanguage } from '../types';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  consentMatrix: ConsentMatrix;
  onUpdateConsent: (updated: ConsentMatrix) => void;
  language: SupportedLanguage;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onClose,
  consentMatrix,
  onUpdateConsent,
  language
}) => {
  const [matrix, setMatrix] = useState<ConsentMatrix>(consentMatrix);

  if (!isOpen) return null;

  const handleToggle = (tier: keyof ConsentMatrix) => {
    const updated = {
      ...matrix,
      [tier]: {
        ...matrix[tier],
        enabled: !matrix[tier].enabled,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
    setMatrix(updated);
    onUpdateConsent(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="consent-matrix-modal"
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn"
      >
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">4-Tier Privacy & Consent Governance</h2>
              <p className="text-xs text-slate-400">
                You maintain sovereign ownership of all voice recordings, clinical data, and alerts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Tiers */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Tier 1: Private */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tier 1: Private (Self-Only)</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Raw audio recordings, personal reflections, and unedited spoken check-in voice streams. Never shared without explicit prompt.
              </p>
              <span className="text-[10px] text-slate-400 block pt-1">Status: Always Encrypted Locally</span>
            </div>
            <div className="pt-1">
              <span className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
                Immutable
              </span>
            </div>
          </div>

          {/* Tier 2: Family Support */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tier 2: Family Circle Support</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Daily peace-of-mind digest, check-in completion confirmation, and general mood/sleep wellness scores to Maryam & Tariq.
              </p>
              <span className="text-[10px] text-slate-400 block pt-1">Authorized recipients: Maryam Al-Hashemi, Tariq Al-Hashemi</span>
            </div>
            <button
              onClick={() => handleToggle('tier2Family')}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${matrix.tier2Family.enabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${matrix.tier2Family.enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Tier 3: Clinical Sharing */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tier 3: Clinical Decision Support (Doctor Brief 2.0)</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Aggregated 14-day baseline deltas, medication cognitive burden (ACB) breakdown, and clinician discussion prompts to Dr. Sarah Chen.
              </p>
              <span className="text-[10px] text-slate-400 block pt-1">Recipient: Dr. Sarah Chen (King Faisal Specialist Hospital)</span>
            </div>
            <button
              onClick={() => handleToggle('tier3Clinical')}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${matrix.tier3Clinical.enabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${matrix.tier3Clinical.enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Tier 4: Emergency Sharing */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tier 4: Acute Emergency Dispatch (997 / SOS)</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Live GPS beacon broadcast, critical medical allergy badges, and emergency contact notification during acute crises or lost pilgrim mode.
              </p>
              <span className="text-[10px] text-rose-600 font-bold block pt-1">Always armed for life safety</span>
            </div>
            <button
              onClick={() => handleToggle('tier4Emergency')}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${matrix.tier4Emergency.enabled ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${matrix.tier4Emergency.enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              alert('Exporting your cryptographic consent token & audit record...');
            }}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-teal-600 flex items-center gap-1.5 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Consent Certificate</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
          >
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
};

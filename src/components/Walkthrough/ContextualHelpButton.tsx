import React from 'react';
import { HelpCircle } from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface ContextualHelpButtonProps {
  topicKey: string;
  label?: string;
  language: SupportedLanguage;
  onClick: (topicKey: string) => void;
  className?: string;
  variant?: 'badge' | 'button' | 'icon-only';
}

export const ContextualHelpButton: React.FC<ContextualHelpButtonProps> = ({
  topicKey,
  label,
  language,
  onClick,
  className = '',
  variant = 'badge'
}) => {
  const isRtl = language === 'ar';

  if (variant === 'icon-only') {
    return (
      <button
        type="button"
        id={`help-btn-${topicKey}`}
        onClick={() => onClick(topicKey)}
        aria-label={label || 'Help information'}
        className={`p-1.5 rounded-full text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-500 ${className}`}
        title={label || 'Click for plain-language explanation'}
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        id={`help-btn-${topicKey}`}
        onClick={() => onClick(topicKey)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs ${className}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>{label}</span>
      </button>
    );
  }

  // Default 'badge'
  return (
    <button
      type="button"
      id={`help-btn-${topicKey}`}
      onClick={() => onClick(topicKey)}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/60 text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-500 ${className}`}
      title="Click for plain-language guidance"
    >
      <HelpCircle className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
};

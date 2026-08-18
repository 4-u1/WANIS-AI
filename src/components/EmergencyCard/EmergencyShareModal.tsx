import React, { useState } from 'react';
import { 
  Share2, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  QrCode, 
  X, 
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { EmergencyCardData, EmergencyShareToken, SupportedLanguage } from '../../types';
import { EMERGENCY_TRANSLATIONS } from '../../data/emergencyCardData';

interface EmergencyShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: EmergencyCardData;
  onGenerateShareToken: (duration: '1_HOUR' | '24_HOURS' | 'UNTIL_REVOKED', label: string) => void;
  onRevokeShareToken: (tokenId: string) => void;
  language: SupportedLanguage;
}

export const EmergencyShareModal: React.FC<EmergencyShareModalProps> = ({
  isOpen,
  onClose,
  cardData,
  onGenerateShareToken,
  onRevokeShareToken,
  language
}) => {
  const [selectedDuration, setSelectedDuration] = useState<'1_HOUR' | '24_HOURS' | 'UNTIL_REVOKED'>('24_HOURS');
  const [customLabel, setCustomLabel] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'active'>('create');

  if (!isOpen) return null;

  const t = EMERGENCY_TRANSLATIONS[language] || EMERGENCY_TRANSLATIONS.en;
  const isRtl = language === 'ar';

  const sharedFieldsCount = 5;
  const sharedFields = [
    language === 'ar' ? 'فصيلة الدم (O+)' : 'Blood Type (O+)',
    language === 'ar' ? 'الحساسية الحرجة (البنسلين)' : 'Critical Allergy (Penicillin)',
    language === 'ar' ? 'التنبيهات الطبية الحيوية' : 'Vital Medical Alerts',
    language === 'ar' ? 'جهات الاتصال للطوارئ (مريم)' : 'Emergency Contacts (Maryam)',
    language === 'ar' ? 'اللغة المفضلة وملاحظات التواصل' : 'Preferred Language & Guidance'
  ];

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    const label = customLabel.trim() || (language === 'ar' ? 'رابط مشاركة طارئ جديد' : 'New Emergency Pass');
    onGenerateShareToken(selectedDuration, label);
    setCustomLabel('');
    setActiveTab('active');
  };

  const handleCopyLink = (token: string) => {
    const url = `https://emergency.wanees.ai/p/${token}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      
      <div 
        id="emergency-share-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100"
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-700 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                {t.shareCard}
              </h2>
              <p className="text-teal-100 text-xs font-medium">
                {language === 'ar' ? 'مشاركة آمنة ومحددة بوقت مع إمكانية الإلغاء الفوري' : 'Time-limited, privacy-safe sharing with instant revocation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 transition-all ${
              activeTab === 'create' 
                ? 'border-teal-600 text-teal-600 dark:text-teal-400' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {language === 'ar' ? 'إنشاء رابط مشاركة جديد' : 'Generate New Pass'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'active' 
                ? 'border-teal-600 text-teal-600 dark:text-teal-400' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{language === 'ar' ? 'الروابط النشطة' : 'Active Passes'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px]">
              {cardData.shareTokens.filter(t => !t.isRevoked).length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[70vh] space-y-5">
          
          {activeTab === 'create' ? (
            <form onSubmit={handleCreateToken} className="space-y-4">
              
              {/* Duration Selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-wide text-slate-700 dark:text-slate-300 block mb-2">
                  {language === 'ar' ? 'اختر مدة صلاحية المشاركة:' : 'Choose sharing duration:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '1_HOUR', label: language === 'ar' ? 'ساعة واحدة' : '1 Hour', icon: Clock },
                    { id: '24_HOURS', label: language === 'ar' ? '24 ساعة' : '24 Hours', icon: Clock },
                    { id: 'UNTIL_REVOKED', label: language === 'ar' ? 'حتى الإلغاء' : 'Until Revoked', icon: ShieldCheck }
                  ].map((dur) => {
                    const Icon = dur.icon;
                    return (
                      <button
                        key={dur.id}
                        type="button"
                        onClick={() => setSelectedDuration(dur.id as any)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                          selectedDuration === dur.id
                            ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 font-extrabold shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span className="text-xs">{dur.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Label / Intended Recipient */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'ar' ? 'وصف أو اسم المستلم (اختياري):' : 'Recipient Label (e.g. Hotel Front Desk, Tawafa Leader):'}
                </label>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: فندق الساعة مكة أو مشرف الفوج' : 'e.g. Hotel Concierge, Pilgrimage Guide'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Explicit Data Sharing Transparency Disclosure */}
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="font-extrabold text-xs text-teal-900 dark:text-teal-200">
                    {language === 'ar' ? `أنت تشارك (${sharedFieldsCount}) عناصر طارئة فقط:` : `You are sharing (${sharedFieldsCount}) essential emergency items:`}
                  </span>
                </div>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 pl-4 rtl:pr-4 list-disc">
                  {sharedFields.map((field, idx) => (
                    <li key={idx} className="leading-tight">{field}</li>
                  ))}
                </ul>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                  {language === 'ar' ? 'لن يتم الكشف عن كلمة المرور أو السجل المالي أو الحساب الكامل.' : 'No passwords, full clinical charts, or financial details are ever exposed.'}
                </p>
              </div>

              {/* Generate CTA Button */}
              <button
                type="submit"
                id="btn-confirm-generate-share-pass"
                className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-700/25 transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{language === 'ar' ? 'تأكيد وإنشاء رابط المشاركة' : 'Confirm & Generate Pass'}</span>
              </button>

            </form>
          ) : (
            <div className="space-y-3">
              {cardData.shareTokens.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  {language === 'ar' ? 'لا توجد روابط مشاركة نشطة حالياً.' : 'No active share links at this time.'}
                </div>
              ) : (
                cardData.shareTokens.map((token) => (
                  <div
                    key={token.tokenId}
                    className={`p-4 rounded-2xl border transition-all ${
                      token.isRevoked
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {token.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            token.isRevoked 
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {token.isRevoked ? (language === 'ar' ? 'ملغي' : 'Revoked') : (language === 'ar' ? 'نشط' : 'Active')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Expires: {token.expiresAt} • Scans: <strong>{token.accessCount}</strong>
                        </p>
                      </div>

                      {!token.isRevoked && (
                        <button
                          type="button"
                          onClick={() => onRevokeShareToken(token.tokenId)}
                          className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 flex items-center gap-1 transition-colors"
                          title="Revoke access immediately"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'إلغاء الصلاحية' : 'Revoke'}</span>
                        </button>
                      )}
                    </div>

                    {!token.isRevoked && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-400 truncate">
                          wanees.ai/p/{token.tokenId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(token.tokenId)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 text-teal-800 dark:text-teal-300 text-xs font-bold transition-colors"
                        >
                          {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ الرابط' : 'Copy Link')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

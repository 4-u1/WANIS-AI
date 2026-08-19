import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CreditCard, 
  Share2, 
  Lock, 
  Edit3, 
  X, 
  Globe, 
  CheckCircle2, 
  QrCode, 
  Eye, 
  RotateCw, 
  Volume2,
  HelpCircle,
  FileText,
  Heart,
  Sparkles,
  Compass,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { EmergencyCardData, SupportedLanguage, Medication } from '../../types';
import { DigitalWalletCard } from './DigitalWalletCard';
import { EmergencyFastView } from './EmergencyFastView';
import { EmergencyResponderWebView } from './EmergencyResponderWebView';
import { EmergencyShareModal } from './EmergencyShareModal';
import { EmergencyCardWizard } from './EmergencyCardWizard';
import { EmergencyAuditDrawer } from './EmergencyAuditDrawer';
import { EmergencyCardPrintModal } from './EmergencyCardPrintModal';
import { EMERGENCY_TRANSLATIONS } from '../../data/emergencyCardData';
import { speakText } from '../../services/api';

interface EmergencyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: EmergencyCardData;
  onUpdateCardData: (updated: EmergencyCardData) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  voiceEnabled: boolean;
  medications?: Medication[];
  initialTab?: 'card' | 'emergency-view';
}

type MainTab = 'card' | 'emergency-view' | 'share' | 'audit';

export const EmergencyCardModal: React.FC<EmergencyCardModalProps> = ({
  isOpen,
  onClose,
  cardData,
  onUpdateCardData,
  language,
  onSelectLanguage,
  voiceEnabled,
  medications = [],
  initialTab = 'card'
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>(initialTab);
  const [isPilgrimageMode, setIsPilgrimageMode] = useState<boolean>(cardData.rufqaPilgrimage?.isEnabled ?? false);
  const [isPublicWebViewOpen, setIsPublicWebViewOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isAuditOpen, setIsAuditOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [seniorFontLarge, setSeniorFontLarge] = useState<boolean>(false);
  const [reviewedBanner, setReviewedBanner] = useState<boolean>(false);

  if (!isOpen) return null;

  const t = EMERGENCY_TRANSLATIONS[language] || EMERGENCY_TRANSLATIONS.en;
  const isRtl = language === 'ar';

  const handleReviewCard = () => {
    const updated: EmergencyCardData = {
      ...cardData,
      status: 'ACTIVE',
      lastReviewedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      accessAuditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Just now',
          accessorType: 'CAREGIVER',
          deviceInfo: 'Wanees Interactive Review',
          locationCity: 'Riyadh / Makkah',
          dataAccessedSummary: 'Emergency Card 30-Day Freshness Verification Confirmed',
          ipMasked: 'Current Session'
        },
        ...cardData.accessAuditLogs
      ]
    };
    onUpdateCardData(updated);
    setReviewedBanner(true);
    setTimeout(() => setReviewedBanner(false), 4000);
    if (voiceEnabled) {
      speakText(language === 'ar' ? 'تم تأكيد مراجعة وصحة بيانات بطاقة الطوارئ بنجاح.' : 'Emergency card information reviewed and verified successfully.', language);
    }
  };

  const handleGenerateShareToken = (duration: '1_HOUR' | '24_HOURS' | 'UNTIL_REVOKED', label: string) => {
    const newToken = {
      tokenId: `tok-${Math.random().toString(36).substring(2, 9)}`,
      label,
      duration,
      createdAt: 'Just now',
      expiresAt: duration === '1_HOUR' ? 'In 1 hour' : duration === '24_HOURS' ? 'In 24 hours' : 'Permanent until revoked',
      dataIncluded: ['Blood Type', 'Critical Allergies', 'Primary Contact', 'Medical Alerts', 'Preferred Language'],
      isRevoked: false,
      accessCount: 0
    };

    onUpdateCardData({
      ...cardData,
      shareTokens: [newToken, ...cardData.shareTokens]
    });
  };

  const handleRevokeShareToken = (tokenId: string) => {
    onUpdateCardData({
      ...cardData,
      shareTokens: cardData.shareTokens.map(t => t.tokenId === tokenId ? { ...t, isRevoked: true } : t)
    });
  };

  const handleLogPublicScan = (accessor: string) => {
    const newLog = {
      id: `scan-${Date.now()}`,
      timestamp: 'Just now',
      accessorType: accessor as any,
      deviceInfo: 'Mobile Web Browser / Public Scan',
      locationCity: 'Makkah Al-Mukarramah',
      dataAccessedSummary: 'Public Responder Web Profile Accessed via Tokenized Link',
      ipMasked: '185.192.**.** (Geo-Verified)'
    };
    onUpdateCardData({
      ...cardData,
      accessAuditLogs: [newLog, ...cardData.accessAuditLogs]
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      
      <div 
        id="wanis-emergency-card-main-modal"
        className={`bg-slate-50 dark:bg-slate-900 border-2 border-teal-500/40 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-slate-900 dark:text-slate-100 ${seniorFontLarge ? 'text-base' : 'text-sm'}`}
      >
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 border-b border-teal-800/40 text-white flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shadow-md">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight uppercase text-white">
                  {t.cardTitle}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  DIGITAL ID
                </span>
              </div>
              <p className="text-[11px] text-teal-200/80 font-medium">
                {t.cardSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Senior Font Size Mode Aa+ */}
            <button
              type="button"
              onClick={() => setSeniorFontLarge(!seniorFontLarge)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                seniorFontLarge ? 'bg-amber-400 text-amber-950 font-black' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Senior high-contrast larger text mode"
            >
              Aa+
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-white/10 rounded-xl p-0.5">
              {(['ar', 'en', 'fr'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onSelectLanguage(lang)}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    language === lang ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'عربي' : lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            
            <button
              type="button"
              id="tab-btn-digital-card"
              onClick={() => setActiveTab('card')}
              className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'card'
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{language === 'ar' ? 'البطاقة الذكية (Flip Card)' : 'Digital Wallet Card'}</span>
            </button>

            <button
              type="button"
              id="tab-btn-fast-emergency"
              onClick={() => setActiveTab('emergency-view')}
              className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'emergency-view'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-rose-600'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>{t.emergencyView}</span>
            </button>

            <button
              type="button"
              id="tab-btn-share-passes"
              onClick={() => setIsShareModalOpen(true)}
              className="pb-2.5 px-3 font-bold text-xs sm:text-sm text-slate-500 hover:text-teal-600 flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.shareCard}</span>
            </button>

            <button
              type="button"
              id="tab-btn-print-card"
              onClick={() => setIsPrintModalOpen(true)}
              className="pb-2.5 px-3 font-bold text-xs sm:text-sm text-slate-500 hover:text-teal-600 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{language === 'ar' ? 'طباعة / تصدير PDF' : 'Print / PDF'}</span>
            </button>

            <button
              type="button"
              id="tab-btn-audit-logs"
              onClick={() => setIsAuditOpen(true)}
              className="pb-2.5 px-3 font-bold text-xs sm:text-sm text-slate-500 hover:text-teal-600 flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              <span>{t.auditLogs}</span>
            </button>

          </div>

          <div className="flex items-center gap-2 shrink-0 pb-2">
            <button
              type="button"
              id="btn-quick-print-top"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Print Emergency Sheet"
            >
              <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{language === 'ar' ? 'طباعة البطاقة' : 'Print PDF'}</span>
            </button>

            <button
              type="button"
              id="btn-edit-emergency-profile"
              onClick={() => setIsWizardOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{t.editCard}</span>
            </button>
          </div>
        </div>

        {/* 30-Day Freshness Confirmed Alert Banner */}
        {reviewedBanner && (
          <div className="bg-emerald-500 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'تم التحقق من بيانات البطاقة وتحديث دورة الـ 30 يوماً بنجاح.' : 'Emergency card verified and 30-day review cycle refreshed successfully.'}</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">VERIFIED</span>
          </div>
        )}

        {/* Modal Main Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {activeTab === 'card' ? (
            <DigitalWalletCard
              cardData={cardData}
              language={language}
              medications={medications}
              isPilgrimageMode={isPilgrimageMode}
              onTogglePilgrimageMode={() => setIsPilgrimageMode(!isPilgrimageMode)}
              onOpenFastEmergencyView={() => setActiveTab('emergency-view')}
              onOpenPublicWebView={() => setIsPublicWebViewOpen(true)}
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
              onReviewCard={handleReviewCard}
              voiceEnabled={voiceEnabled}
            />
          ) : (
            <EmergencyFastView
              cardData={cardData}
              language={language}
              onSelectLanguage={onSelectLanguage}
              onClose={() => setActiveTab('card')}
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
              voiceEnabled={voiceEnabled}
            />
          )}

        </div>

        {/* Bottom Safety Assurance Footnote */}
        <div className="p-3 bg-white dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-6">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            <span>End-to-End Encrypted Health Identity • ISO/IEC 27001 & FHIR Compatible</span>
          </div>
          <span>Wanees™ Safety Layer</span>
        </div>

      </div>

      {/* Embedded Sub-Modals */}
      <EmergencyResponderWebView
        isOpen={isPublicWebViewOpen}
        onClose={() => setIsPublicWebViewOpen(false)}
        cardData={cardData}
        initialLanguage={language}
        onLogAccess={handleLogPublicScan}
      />

      <EmergencyShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        cardData={cardData}
        onGenerateShareToken={handleGenerateShareToken}
        onRevokeShareToken={handleRevokeShareToken}
        language={language}
      />

      <EmergencyCardWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        initialData={cardData}
        onSaveCard={onUpdateCardData}
        language={language}
      />

      <EmergencyAuditDrawer
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        logs={cardData.accessAuditLogs}
        language={language}
      />

      <EmergencyCardPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        cardData={cardData}
        medications={medications}
        initialLanguage={language}
      />

    </div>
  );
};

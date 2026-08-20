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
  Printer,
  Camera,
  User,
  ShieldCheck
} from 'lucide-react';
import { EmergencyCardData, SupportedLanguage, Medication } from '../../types';
import { DigitalWalletCard } from './DigitalWalletCard';
import { EmergencyFastView } from './EmergencyFastView';
import { EmergencyResponderWebView } from './EmergencyResponderWebView';
import { EmergencyShareModal } from './EmergencyShareModal';
import { EmergencyCardWizard } from './EmergencyCardWizard';
import { EmergencyAuditDrawer } from './EmergencyAuditDrawer';
import { EmergencyCardPrintModal } from './EmergencyCardPrintModal';
import { CameraCaptureModal } from './CameraCaptureModal';
import { DynamicMedicalQRCodeView } from './DynamicMedicalQRCodeView';
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
  initialTab?: 'card' | 'emergency-view' | 'dynamic-qr';
}

type MainTab = 'card' | 'emergency-view' | 'dynamic-qr' | 'share' | 'audit';

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
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [seniorFontLarge, setSeniorFontLarge] = useState<boolean>(false);
  const [reviewedBanner, setReviewedBanner] = useState<boolean>(false);

  if (!isOpen) return null;

  const t = EMERGENCY_TRANSLATIONS[language] || EMERGENCY_TRANSLATIONS.en;
  const isRtl = language === 'ar';

  const handleSaveCapturedPhoto = (newPhotoUrl: string) => {
    const updated: EmergencyCardData = {
      ...cardData,
      photoUrl: newPhotoUrl,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      accessAuditLogs: [
        {
          id: `log-photo-${Date.now()}`,
          timestamp: 'Just now',
          accessorType: 'CAREGIVER',
          deviceInfo: 'Wanees Biometric Camera Capture Flow',
          locationCity: 'Riyadh / Makkah',
          dataAccessedSummary: 'Senior Emergency Profile Photo Captured and Updated via Medical ID Flow',
          ipMasked: 'Current Session (Verified)'
        },
        ...cardData.accessAuditLogs
      ]
    };
    onUpdateCardData(updated);
    if (voiceEnabled) {
      speakText(language === 'ar' ? 'تم تحديث صورة البطاقة الصحية بنجاح.' : 'Senior emergency ID photo updated successfully.', language);
    }
  };

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

        {/* Top Profile Photo Image Placeholder Container & Update Photo Trigger */}
        <div 
          id="senior-profile-photo-container"
          className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-100 via-teal-50/50 to-slate-100 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 border-b border-slate-200 dark:border-teal-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
        >
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            
            {/* Senior Image Container with Placeholder Fallback & Direct Click */}
            <div 
              id="senior-photo-placeholder-box"
              onClick={() => setIsCameraModalOpen(true)}
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ring-2 ring-teal-500/50 bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden shadow-md group cursor-pointer react-btn-tap active:scale-95 transition-transform"
              title={language === 'ar' ? 'انقر لتحديث أو التقاط صورة جديدة' : 'Click to capture or update senior photo'}
            >
              {cardData.photoUrl ? (
                <img 
                  src={cardData.photoUrl} 
                  alt={cardData.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=400';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-teal-900 to-slate-800 flex items-center justify-center text-teal-300">
                  <User className="w-8 h-8 opacity-70" />
                </div>
              )}
              
              {/* Verified Identity Badge */}
              <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-500 border border-slate-900 flex items-center justify-center text-[8px] font-bold text-white shadow-xs">
                ✓
              </span>

              {/* Hover Camera Overlay Trigger */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold">
                <Camera className="w-4 h-4 text-teal-300 mb-0.5 animate-bounce" />
                <span>{language === 'ar' ? 'تحديث' : 'Update'}</span>
              </div>
            </div>

            {/* Senior Name & ID Metadata */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {cardData.fullName}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                  {cardData.bloodType}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-500" />
                  <span>{language === 'ar' ? 'معرّف بيومتري معتمد' : 'Biometric ID Verified'}</span>
                </span>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate mt-0.5">
                {cardData.preferredName} • <span className="font-mono text-teal-700 dark:text-teal-400 font-semibold">{cardData.nationalIdOrPassport}</span>
              </p>
            </div>
          </div>

          {/* 'Update Photo' Trigger Button & Quick Dynamic QR */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              id="btn-quick-dynamic-qr-top"
              onClick={() => setActiveTab('dynamic-qr')}
              className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-amber-300 dark:text-amber-400 font-extrabold text-xs flex items-center gap-1.5 border border-amber-500/40 shadow-sm transition-all react-btn-tap cursor-pointer active:scale-95"
              title={language === 'ar' ? 'عرض ومسح رمز QR الطبي التفاعلي' : 'Scan or view dynamic medical QR code'}
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'رمز QR الطبي' : 'Medical QR'}</span>
            </button>

            <button
              type="button"
              id="btn-update-senior-photo"
              onClick={() => setIsCameraModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-teal-700/20 transition-all react-btn-tap cursor-pointer active:scale-95 border border-teal-400/30"
            >
              <Camera className="w-4 h-4 text-amber-300" />
              <span>{language === 'ar' ? 'تحديث الصورة' : 'Update Photo'}</span>
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
              id="tab-btn-dynamic-qr"
              onClick={() => setActiveTab('dynamic-qr')}
              className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'dynamic-qr'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-amber-600 dark:hover:text-amber-300'
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-500" />
              <span>{language === 'ar' ? 'رمز QR الطبي الذكي' : 'Dynamic Medical QR'}</span>
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
          
          {activeTab === 'card' && (
            <DigitalWalletCard
              cardData={cardData}
              language={language}
              medications={medications}
              isPilgrimageMode={isPilgrimageMode}
              onTogglePilgrimageMode={() => setIsPilgrimageMode(!isPilgrimageMode)}
              onOpenFastEmergencyView={() => setActiveTab('emergency-view')}
              onOpenDynamicQR={() => setActiveTab('dynamic-qr')}
              onOpenPublicWebView={() => setIsPublicWebViewOpen(true)}
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
              onReviewCard={handleReviewCard}
              voiceEnabled={voiceEnabled}
            />
          )}

          {activeTab === 'dynamic-qr' && (
            <DynamicMedicalQRCodeView
              cardData={cardData}
              language={language}
              medications={medications}
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
              voiceEnabled={voiceEnabled}
            />
          )}

          {activeTab === 'emergency-view' && (
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

      {/* Senior Photo Biometric Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        currentPhotoUrl={cardData.photoUrl}
        seniorName={cardData.fullName}
        language={language}
        onSavePhoto={handleSaveCapturedPhoto}
      />

    </div>
  );
};

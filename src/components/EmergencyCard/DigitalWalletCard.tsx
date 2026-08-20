import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  RotateCw, 
  QrCode, 
  Heart, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Building, 
  MapPin, 
  Compass, 
  UserCheck, 
  MessageSquare, 
  Globe,
  Clock,
  Calendar,
  Lock,
  Stethoscope,
  Info,
  ChevronRight,
  HelpCircle,
  Volume2,
  Printer
} from 'lucide-react';
import { EmergencyCardData, SupportedLanguage, Medication } from '../../types';
import { EMERGENCY_TRANSLATIONS } from '../../data/emergencyCardData';
import { speakText } from '../../services/api';
import { WaneesLogo } from '../WaneesLogo';

interface DigitalWalletCardProps {
  cardData: EmergencyCardData;
  language: SupportedLanguage;
  medications?: Medication[];
  isPilgrimageMode: boolean;
  onTogglePilgrimageMode: () => void;
  onOpenFastEmergencyView: () => void;
  onOpenPublicWebView: () => void;
  onOpenDynamicQR?: () => void;
  onOpenPrintModal?: () => void;
  onReviewCard: () => void;
  voiceEnabled: boolean;
}

export const DigitalWalletCard: React.FC<DigitalWalletCardProps> = ({
  cardData,
  language,
  medications = [],
  isPilgrimageMode,
  onTogglePilgrimageMode,
  onOpenFastEmergencyView,
  onOpenPublicWebView,
  onOpenDynamicQR,
  onOpenPrintModal,
  onReviewCard,
  voiceEnabled
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const t = EMERGENCY_TRANSLATIONS[language] || EMERGENCY_TRANSLATIONS.en;
  const isRtl = language === 'ar';

  const handleSpeakSummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!voiceEnabled) return;
    const speech = language === 'ar'
      ? `بطاقة الطوارئ للحاجة ${cardData.fullName}. فصيلة الدم ${cardData.bloodType}. تنبيه حساسية البنسلين. جهة الاتصال الأساسية مريم على الرقم ${cardData.primaryEmergencyContact.phone}.`
      : `Emergency Card for ${cardData.fullName}. Blood type ${cardData.bloodType}. Allergic to Penicillin. Primary contact is ${cardData.primaryEmergencyContact.name}.`;
    speakText(speech, language);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 select-none">
      
      {/* Top Mode Bar & Controls */}
      <div className="w-full max-w-md flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{cardData.status === 'ACTIVE' ? t.activeStatus : t.reviewNeededStatus}</span>
          </span>
          {voiceEnabled && (
            <button
              type="button"
              onClick={handleSpeakSummary}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Voice readout of emergency card"
            >
              <Volume2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            </button>
          )}
        </div>

        {/* Pilgrimage / Normal Mode Switch */}
        <button
          type="button"
          onClick={onTogglePilgrimageMode}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            isPilgrimageMode 
              ? 'bg-amber-500 text-amber-950 shadow-md shadow-amber-500/20' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
          title="Toggle Rufqa Hajj/Umrah Pilgrimage Mode"
        >
          <Compass className={`w-3.5 h-3.5 ${isPilgrimageMode ? 'text-amber-950' : 'text-amber-500'}`} />
          <span>{isPilgrimageMode ? (language === 'ar' ? 'وضع الحج فعال' : 'Pilgrimage Active') : (language === 'ar' ? 'تفعيل وضع الحج' : 'Pilgrimage Mode')}</span>
        </button>
      </div>

      {/* 3D Perspective Card Container */}
      <div 
        className="w-full max-w-md cursor-pointer transition-all duration-300 transform group"
        style={{ perspective: '1200px' }}
      >
        <div 
          className="relative w-full rounded-3xl transition-transform duration-700 ease-out shadow-2xl"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '440px'
          }}
        >
          
          {/* ========================================================= */}
          {/* FRONT OF CARD (Digital Identity & Immediate Emergencies) */}
          {/* ========================================================= */}
          <div 
            className="w-full h-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between text-white relative overflow-hidden border border-white/20 dark:border-slate-700/50"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: isPilgrimageMode 
                ? 'linear-gradient(135deg, #064e3b 0%, #065f46 45%, #b45309 100%)'
                : 'linear-gradient(135deg, #0f172a 0%, #0d3a3d 40%, #065f46 100%)'
            }}
          >
            {/* Background Texture & Holographic Wave */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>

            {/* Top Bar: Wanees Seal & Digital Card Type */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-md">
                  <WaneesLogo variant="icon" size="sm" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm tracking-wide text-white uppercase font-sans">WANEES</span>
                    <span className="text-xs font-bold text-amber-300 font-arabic">ونـيـس</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">EMERGENCY ID</span>
                  </div>
                  <p className="text-[10px] text-teal-200/90 font-bold uppercase tracking-wider">
                    {isPilgrimageMode ? 'Pilgrim Safety Pass • Rufqa' : 'AI Care & Safety Ecosystem'}
                  </p>
                </div>
              </div>

              {/* Holographic Chip / Seal */}
              <div className="flex flex-col items-end">
                <div className="w-9 h-7 rounded-lg bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 p-0.5 shadow-sm opacity-90">
                  <div className="w-full h-full rounded-[6px] border border-amber-700/30 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                  </div>
                </div>
                <span className="text-[9px] text-teal-200/70 font-mono mt-1">SA-EMG-ID</span>
              </div>
            </div>

            {/* Middle Section: User Persona, Photo, National ID & Blood Type */}
            <div className="relative z-10 my-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  <img 
                    src={cardData.photoUrl} 
                    alt={cardData.fullName}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base sm:text-lg text-white truncate leading-tight">
                    {cardData.fullName}
                  </h3>
                  <p className="text-xs text-amber-200 font-semibold mt-0.5">
                    {cardData.preferredName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-black/25 backdrop-blur text-[10px] font-medium text-teal-100">
                      🇸🇦 🇬🇧 🇫🇷 {cardData.preferredLanguage.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/25 text-[10px] font-mono text-teal-200">
                      {cardData.nationalIdOrPassport}
                    </span>
                  </div>
                </div>
              </div>

              {/* Blood Type Hero Pill */}
              <div className="shrink-0 flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-rose-500/25 border border-rose-400/40 backdrop-blur-md min-w-[65px]">
                <span className="text-[9px] uppercase font-bold text-rose-200 tracking-wider">Blood</span>
                <span className="text-xl sm:text-2xl font-black text-white leading-none mt-0.5">{cardData.bloodType}</span>
                <span className="text-[9px] font-bold text-rose-300">Rh Pos</span>
              </div>
            </div>

            {/* Critical Medical Indicators (Immediate Rescue Badges) */}
            <div className="relative z-10 space-y-2 my-1">
              
              {/* Allergy Banner */}
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 backdrop-blur flex items-start gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-rose-200 text-[11px] uppercase tracking-wide">
                      {language === 'ar' ? 'حساسية حرجة' : 'CRITICAL ALLERGY'}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500 text-white font-black">
                      ANAPHYLAXIS
                    </span>
                  </div>
                  <p className="text-white font-bold text-xs truncate">
                    {cardData.criticalAllergies[0]?.allergen || 'Penicillin (Severe)'}
                  </p>
                </div>
              </div>

              {/* Pilgrimage / Medical Alert Quick Bar */}
              {isPilgrimageMode && cardData.rufqaPilgrimage?.isEnabled ? (
                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 backdrop-blur flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <Compass className="w-4 h-4 text-amber-300 shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] text-amber-200 block">Tawafa Group & Hotel</span>
                      <span className="font-bold text-white text-xs truncate block">{cardData.rufqaPilgrimage.hotelName}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-amber-400 text-amber-950 font-black text-[10px] shrink-0">
                    {cardData.rufqaPilgrimage.hotelRoom}
                  </span>
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur flex items-center justify-between text-xs px-3">
                  <span className="text-teal-200 font-semibold text-[11px]">
                    Alert: {cardData.criticalMedicalAlerts[0]?.condition}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">
                    Updated {cardData.lastUpdated}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Row: Primary Contact & QR Scan Trigger */}
            <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between gap-3">
              
              {/* Primary Contact Direct Dial */}
              <div className="min-w-0 flex-1">
                <span className="text-[9px] text-teal-200/80 font-bold uppercase tracking-wider block">
                  {t.emergencyContact}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-extrabold text-white text-xs sm:text-sm truncate">
                    {cardData.primaryEmergencyContact.name} ({cardData.primaryEmergencyContact.relationship.split(' ')[0]})
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <a
                    href={`tel:${cardData.primaryEmergencyContact.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition-transform active:scale-95 shadow-sm"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{t.callNow}</span>
                  </a>
                  {cardData.primaryEmergencyContact.whatsapp && (
                    <a
                      href={`https://wa.me/${cardData.primaryEmergencyContact.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                      <span>{t.whatsapp}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Secure QR Code Scanner Box */}
              <button
                type="button"
                id="btn-card-face-qr-code"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenDynamicQR) {
                    onOpenDynamicQR();
                  } else {
                    onOpenPublicWebView();
                  }
                }}
                className="shrink-0 p-2 rounded-2xl bg-white text-slate-900 shadow-md flex flex-col items-center hover:scale-105 transition-transform group/qr cursor-pointer"
                title={language === 'ar' ? 'عرض ومسح رمز QR الطبي التفاعلي' : 'Scan or view dynamic medical QR code'}
              >
                <QrCode className="w-9 h-9 text-slate-900" />
                <span className="text-[8px] font-black text-slate-700 mt-0.5 tracking-tighter">EMG QR</span>
              </button>

            </div>

            {/* Flip hint chip */}
            <div className="relative z-10 text-center mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-[10px] font-bold transition-colors"
              >
                <RotateCw className="w-3 h-3" />
                <span>{t.flipToDetails}</span>
              </button>
            </div>

          </div>

          {/* ========================================================= */}
          {/* BACK OF CARD (Comprehensive Authorized Clinical Details) */}
          {/* ========================================================= */}
          <div 
            className="w-full h-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between text-slate-900 dark:text-white bg-slate-900 border-2 border-teal-500/40 relative overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(145deg, #090d16 0%, #0d1e24 60%, #081a17 100%)'
            }}
          >
            {/* Top Back Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-black text-white tracking-wide uppercase">
                  {t.backSide}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-900/60 hover:bg-teal-800/80 text-teal-200 text-xs font-bold transition-colors"
              >
                <RotateCw className="w-3 h-3" />
                <span>{t.flipToFront}</span>
              </button>
            </div>

            {/* Scrollable Detailed Medical Information */}
            <div className="my-3 space-y-3 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin text-xs">
              
              {/* DOB & Basic Identity */}
              <div className="grid grid-cols-2 gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.dob}</span>
                  <span className="font-bold text-white text-xs">{cardData.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.preferredLang}</span>
                  <span className="font-bold text-teal-300 text-xs">{cardData.preferredLanguage === 'ar' ? 'العربية (Arabic)' : 'English'}</span>
                </div>
              </div>

              {/* Medical Alerts Breakdown */}
              <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block">
                  {t.medicalAlerts}
                </span>
                {cardData.criticalMedicalAlerts.map((alert) => (
                  <div key={alert.id} className="text-slate-200 text-[11px] leading-relaxed">
                    <span className="font-extrabold text-white">• {alert.condition}:</span> {alert.instructions}
                  </div>
                ))}
              </div>

              {/* Cognitive & Communication Guidance */}
              <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 space-y-1">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wide block">
                  {t.cognitiveNotes}
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {cardData.cognitiveCommunicationNotes}
                </p>
              </div>

              {/* Mobility & Physical Needs */}
              <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide block">
                  {t.mobilityNeeds}
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {cardData.mobilityRequirements}
                </p>
              </div>

              {/* Physician & Clinic Info */}
              <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">{t.physicianClinic}</span>
                  <span className="font-bold text-white text-xs block">{cardData.physicianContact.name}</span>
                  <span className="text-[10px] text-slate-400 block">{cardData.physicianContact.clinic}</span>
                </div>
                <a
                  href={`tel:${cardData.physicianContact.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-teal-600/30 text-teal-300 hover:bg-teal-600/50 transition-colors"
                  title="Call Physician"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Insurance info if configured */}
              {cardData.insuranceInfo?.isConfigured && (
                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 block">{t.insurancePolicy}</span>
                  <span className="font-bold text-white text-xs">{cardData.insuranceInfo.provider}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Policy: {cardData.insuranceInfo.policyNumber}</span>
                </div>
              )}

              {/* Religious / Cultural Notes */}
              {cardData.religiousCulturalNotes && (
                <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 block">{t.religiousNotes}</span>
                  <p className="text-slate-300 text-[10px]">{cardData.religiousCulturalNotes}</p>
                </div>
              )}

            </div>

            {/* Bottom Verification & Freshness Row */}
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{t.lastUpdated}: <strong className="text-slate-200">{cardData.lastUpdated}</strong></span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReviewCard();
                }}
                className="text-teal-400 hover:underline font-bold"
              >
                {t.reviewCardBtn}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Quick Launch Action Bar Below Card */}
      <div className="w-full max-w-md flex flex-col gap-2 pt-1">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            id="btn-open-fast-emergency-view"
            onClick={onOpenFastEmergencyView}
            className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 transition-transform active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>{t.emergencyView}</span>
          </button>

          <button
            type="button"
            id="btn-preview-dynamic-qr"
            onClick={onOpenDynamicQR || onOpenPublicWebView}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-slate-950" />
            <span>{language === 'ar' ? 'رمز QR الطبي' : 'Medical QR'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            id="btn-preview-public-web-view"
            onClick={onOpenPublicWebView}
            className="py-2 px-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{t.previewPublicWeb}</span>
          </button>

          {onOpenPrintModal ? (
            <button
              type="button"
              id="btn-open-print-preview-bottom"
              onClick={onOpenPrintModal}
              className="py-2 px-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{language === 'ar' ? 'طباعة PDF' : 'Print PDF'}</span>
            </button>
          ) : null}
        </div>
      </div>

    </div>
  );
};

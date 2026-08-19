import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Compass, 
  Globe, 
  Volume2, 
  AlertTriangle, 
  Heart, 
  UserCheck, 
  X, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Share2,
  HelpCircle,
  Stethoscope,
  Printer
} from 'lucide-react';
import { EmergencyCardData, SupportedLanguage } from '../../types';
import { EMERGENCY_TRANSLATIONS } from '../../data/emergencyCardData';
import { speakText } from '../../services/api';

interface EmergencyFastViewProps {
  cardData: EmergencyCardData;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onClose: () => void;
  onOpenPrintModal?: () => void;
  voiceEnabled: boolean;
}

export const EmergencyFastView: React.FC<EmergencyFastViewProps> = ({
  cardData,
  language,
  onSelectLanguage,
  onClose,
  onOpenPrintModal,
  voiceEnabled
}) => {
  const t = EMERGENCY_TRANSLATIONS[language] || EMERGENCY_TRANSLATIONS.en;
  const isRtl = language === 'ar';

  const [locationShared, setLocationShared] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [lostBeaconActive, setLostBeaconActive] = useState(false);

  const gpsCoords = '21.4225° N, 39.8262° E (Swissôtel Clock Tower / King Fahd Gate #79)';

  const handleShareLocation = () => {
    setLocationShared(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Emergency Location for ${cardData.fullName}: ${gpsCoords}`);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 3000);
    }
    if (voiceEnabled) {
      const msg = language === 'ar'
        ? 'تم تحديد ومشاركة إحداثيات موقعك الجغرافي بنجاح مع العائلة والمرشد.'
        : 'GPS location coordinates shared successfully with family and guide.';
      speakText(msg, language);
    }
  };

  const handleToggleLostBeacon = () => {
    setLostBeaconActive(!lostBeaconActive);
    if (voiceEnabled) {
      const msg = !lostBeaconActive
        ? (language === 'ar' ? 'تم تشغيل نداء الاستغاثة وبث الموقع لمرشد الحملة.' : 'Lost beacon activated. Broadcast sent to group leader.')
        : (language === 'ar' ? 'تم إيقاف نداء الاستغاثة.' : 'Lost beacon deactivated.');
      speakText(msg, language);
    }
  };

  const handleSpeakCritical = () => {
    if (!voiceEnabled) return;
    const speech = language === 'ar'
      ? `شاشة الطوارئ العاجلة. المريض: ${cardData.fullName}. فصيلة الدم: ${cardData.bloodType}. تنبيه حساسية البنسلين. رقم الاتصال العاجل: ${cardData.primaryEmergencyContact.phone}.`
      : `Emergency Quick View. Patient: ${cardData.fullName}. Blood Type: ${cardData.bloodType}. Allergic to Penicillin. Emergency Phone: ${cardData.primaryEmergencyContact.phone}.`;
    speakText(speech, language);
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 animate-fadeIn ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* High Contrast Emergency Header Banner */}
      <div className="bg-rose-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-rose-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse shrink-0">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                  {t.emergencyView}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-white text-[10px] font-bold">
                  HIGH PRIORITY
                </span>
              </div>
              <p className="text-rose-100 text-xs sm:text-sm font-medium mt-0.5">
                {language === 'ar' ? 'عرض فوري للمسعفين وجهات الطوارئ مع ترجمة فورية' : 'Instant high-contrast responder view with live translation'}
              </p>
            </div>
          </div>

          {/* Instant Responder Language Switcher */}
          <div className="flex items-center gap-1.5 bg-rose-950/50 p-1.5 rounded-2xl border border-rose-400/40 shrink-0">
            <Globe className="w-3.5 h-3.5 text-rose-200 ml-1" />
            {(['ar', 'en', 'fr'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onSelectLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  language === lang 
                    ? 'bg-white text-rose-950 shadow-md font-bold' 
                    : 'text-rose-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {lang === 'ar' ? 'العربية' : lang === 'en' ? 'English' : 'Français'}
              </button>
            ))}
            {voiceEnabled && (
              <button
                type="button"
                onClick={handleSpeakCritical}
                className="p-1.5 rounded-xl bg-white/20 text-white hover:bg-white/30"
                title="Voice announcement"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Critical Medical Cards Grid (Massive High-Contrast) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* 1. Blood Type */}
        <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-rose-800 dark:text-rose-300">
              {t.bloodType}
            </span>
            <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="my-2">
            <span className="text-4xl font-black text-rose-900 dark:text-rose-100">{cardData.bloodType}</span>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-300 block">Rh Positive (Universal Safe Plasma)</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">ID: {cardData.nationalIdOrPassport}</span>
        </div>

        {/* 2. Critical Allergies */}
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
              {t.criticalAllergies}
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
          </div>
          <div className="my-2 space-y-1">
            <span className="text-base font-black text-amber-950 dark:text-amber-100 block">
              ⚠️ {cardData.criticalAllergies[0]?.allergen}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white inline-block">
              FATAL ANAPHYLAXIS
            </span>
          </div>
          <span className="text-[10px] text-amber-800 dark:text-amber-300">NO Beta-Lactam Antibiotics</span>
        </div>

        {/* 3. Medical Alerts */}
        <div className="p-4 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-teal-900 dark:text-teal-300">
              {t.medicalAlerts}
            </span>
            <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="my-2 space-y-1">
            <span className="text-sm font-black text-teal-950 dark:text-teal-100 block">
              • {cardData.criticalMedicalAlerts[0]?.condition}
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 block">
              {cardData.criticalMedicalAlerts[0]?.instructions}
            </span>
          </div>
          <span className="text-[10px] text-teal-700 dark:text-teal-300">Controlled with Metformin</span>
        </div>

        {/* 4. Communication & Dialect */}
        <div className="p-4 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-300 dark:border-indigo-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
              {t.cognitiveNotes}
            </span>
            <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="my-2 space-y-1">
            <span className="text-xs font-extrabold text-indigo-950 dark:text-indigo-100 block">
              {language === 'ar' ? 'العربية (لهجة حجازية) • سمع أذن يمنى' : 'Arabic (Hejazi) • Hearing Aid Right Ear'}
            </span>
            <span className="text-[11px] text-slate-600 dark:text-slate-300 block">
              {language === 'ar' ? 'تحدث بهدوء واحترام وتجنب التوتر' : 'Speak calmly at eye level; allow 15s to respond.'}
            </span>
          </div>
          <span className="text-[10px] text-indigo-700 dark:text-indigo-300">Prefers Female Responder</span>
        </div>

      </div>

      {/* Distinction: Official Emergency Services (997/911) vs Family Contact */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-600" />
            <span>{language === 'ar' ? 'الإسعاف والاتصال الطارئ' : 'Emergency Services & Contacts'}</span>
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'ar' ? 'أزرار اتصال فورية بنقرة واحدة' : 'One-tap direct dial buttons'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          
          {/* Section A: Emergency Medical Services (EMS) */}
          <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>{language === 'ar' ? 'خدمات الإسعاف والطوارئ الرسمية' : 'Official Emergency Services (EMS)'}</span>
              </span>
              <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold">KSA 997 / 911</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:997"
                id="btn-call-red-crescent-997"
                className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-center flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 transition-transform active:scale-95 text-xs sm:text-sm"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>{t.callEms}</span>
              </a>

              <a
                href="tel:911"
                id="btn-call-unified-911"
                className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-center flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 text-xs sm:text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>{t.callUnified}</span>
              </a>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {t.warningNotEms}
            </p>
          </div>

          {/* Section B: Primary Family Emergency Contact */}
          <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.emergencyContact}</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Family Caregiver</span>
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm block">
                  {cardData.primaryEmergencyContact.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {cardData.primaryEmergencyContact.relationship} • {cardData.primaryEmergencyContact.phone}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${cardData.primaryEmergencyContact.phone}`}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-transform active:scale-95 shadow-sm"
                  title="Call Maryam"
                >
                  <Phone className="w-4 h-4" />
                </a>
                {cardData.primaryEmergencyContact.whatsapp && (
                  <a
                    href={`https://wa.me/${cardData.primaryEmergencyContact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`URGENT: Emergency notification regarding ${cardData.fullName}. Current location: ${gpsCoords}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-transform active:scale-95 shadow-sm"
                    title="WhatsApp Maryam"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span>Secondary: {cardData.secondaryEmergencyContact?.name} ({cardData.secondaryEmergencyContact?.relationship})</span>
              <a href={`tel:${cardData.secondaryEmergencyContact?.phone}`} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Call ({cardData.secondaryEmergencyContact?.phone})
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* One-Tap Emergency Tools: Location Sharing, Lost Beacon & Pre-filled SOS SMS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Share GPS Location */}
        <button
          type="button"
          onClick={handleShareLocation}
          className={`p-4 rounded-3xl border text-left transition-all flex flex-col justify-between ${
            locationShared 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200' 
              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{t.shareGps}</span>
            </span>
            {locationShared ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 my-2">
            {gpsCoords}
          </p>
          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
            {copiedCoords ? (language === 'ar' ? 'تم نسخ الإحداثيات للمشاركة!' : 'Coordinates copied!') : (language === 'ar' ? 'انقر للنسخ والبث' : 'Click to Copy & Broadcast')}
          </span>
        </button>

        {/* Rufqa "I'm Lost" Beacon */}
        <button
          type="button"
          onClick={handleToggleLostBeacon}
          className={`p-4 rounded-3xl border text-left transition-all flex flex-col justify-between ${
            lostBeaconActive 
              ? 'bg-amber-500 text-amber-950 border-amber-600 shadow-lg shadow-amber-500/30' 
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 hover:bg-amber-100'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <Compass className={`w-4 h-4 ${lostBeaconActive ? 'animate-spin' : ''}`} />
              <span>{t.imLost}</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${lostBeaconActive ? 'bg-amber-950 text-amber-200' : 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200'}`}>
              {lostBeaconActive ? 'BEACON ON' : 'READY'}
            </span>
          </div>
          <p className="text-[11px] my-2 leading-relaxed opacity-90">
            {language === 'ar' ? 'إرسال تنبيه فوري لرئيس فوج الطوافة والأسرة ومسؤولي الحرم.' : 'Dispatches active distress alert to Tawafa leader and Haram security.'}
          </p>
          <span className="text-[10px] font-extrabold">
            {lostBeaconActive ? (language === 'ar' ? 'جاري البث المستمر...' : 'Broadcasting Beacon...') : (language === 'ar' ? 'تشغيل نداء الحرم' : 'Activate Haram Beacon')}
          </span>
        </button>

        {/* Print / Save Emergency Sheet PDF */}
        {onOpenPrintModal && (
          <button
            type="button"
            onClick={onOpenPrintModal}
            className="p-4 rounded-3xl bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-teal-400" />
                <span>{language === 'ar' ? 'طباعة تقرير الطوارئ' : 'Print PDF Sheet'}</span>
              </span>
              <span className="text-[9px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-bold">
                A4 / PDF
              </span>
            </div>
            <p className="text-[11px] text-slate-300 my-2 leading-relaxed">
              {language === 'ar' ? 'توليد وطباعة وثيقة رسمية مبسطة وعالية التباين للمستشفى والمسعفين.' : 'Generate simplified high-contrast printable document for ER team.'}
            </p>
            <span className="text-[10px] font-bold text-teal-400">
              {language === 'ar' ? 'فتح معاينة الطباعة' : 'Open Print Preview'}
            </span>
          </button>
        )}

        {/* Send Emergency SMS Message Template */}
        <a
          href={`sms:${cardData.primaryEmergencyContact.phone}?body=${encodeURIComponent(`URGENT SOS from Wanees: Fatima Al-Hashemi requires assistance at Swissôtel Makkah Clock Tower (Gate 79). Blood: O+, Allergy: Penicillin. GPS: ${gpsCoords}`)}`}
          className="p-4 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{t.sendEmergencyMsg}</span>
            </span>
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 my-2">
            {language === 'ar' ? 'رسالة نصية مسبقة الصياغة تتضمن الموقع والبيانات الحيوية.' : 'Pre-formatted SMS containing vital medical ID & GPS.'}
          </p>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
            {language === 'ar' ? 'فتح تطبيق الرسائل' : 'Open SMS App'}
          </span>
        </a>

      </div>

    </div>
  );
};
